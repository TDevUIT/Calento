'use client';
import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aiService } from '@/service';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Plus,
  ArrowUp,
  ArrowBigRight,
} from 'lucide-react';
import { useAIChat } from '@/hook/ai/use-ai-chat';
import { useConversation, useConversations, useDeleteConversation } from '@/hook/ai/use-conversations';
import { useConversationState } from '@/hook/ai/use-conversation-state';
import { AIMessage, FunctionCall, ActionPerformed, StreamMessage } from '@/interface';
import { MessageContent } from './MessageContent';
import { ActionConfirmationDialog } from './ActionConfirmationDialog';
import { TimeSlotsList } from './TimeSlotsList';
import { EventsList } from './EventsList';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';
import { useControllerStore } from '@/store/controller.store';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';
import { getBrowserTimezone } from '@/utils';

interface ChatBoxProps {
  onClose?: () => void;
  conversationId?: string;
  onConversationCreated?: (conversationId: string) => void;
  hideHeader?: boolean;
  variant?: 'panel' | 'popup';
}

interface ChatMessage extends AIMessage {
  functionCalls?: FunctionCall[];
  actions?: ActionPerformed[];
  isStreaming?: boolean;
}


interface PendingActionType {
  id: string;
  type: string;
  title: string;
  description: string;
  parameters: Record<string, string | number | boolean>;
}

export function ChatBox({
  conversationId: externalConversationId,
  onConversationCreated,
  hideHeader = false,
  variant = 'panel',
}: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const queryClient = useQueryClient();

  const { activeConversationId, setConversation, clearConversation } = useConversationState();
  const displayConversationId = externalConversationId || activeConversationId;

  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(displayConversationId);
  const [pendingAction, setPendingAction] = useState<PendingActionType | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = useAIChat();
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleChatbox = useControllerStore((state) => state.toggleChatbox);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!displayConversationId) {
      setMessages([]);
    }
  }, [displayConversationId]);

  useEffect(() => {
    if (conversationData?.data?.messages) {
      const loadedMessages: ChatMessage[] = conversationData.data.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      setMessages(loadedMessages);
    }
  }, [conversationData]);

  const isLoading = isLoadingConversation && externalConversationId;


  // Add explicit type for status map
  const getReadableStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'initializing': 'Starting...',
      'analyzing_calendar': 'Check your calendar...',
      'searching_memory': 'Searching memory...',
      'thinking': 'Thinking...',
      'connected': 'Connection established...',
    };
    return statusMap[status] || 'Processing...';
  };

  const [processingStatus, setProcessingStatus] = useState<string>('');

  const handleSend = async () => {
    if (!input.trim() || isProcessing || chatMutation.isPending) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setProcessingStatus('initializing');

    const now = new Date();

    const initialAssistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      isStreaming: true,
      actions: [],
    };
    setMessages((prev: ChatMessage[]) => [...prev, initialAssistantMessage]);

    try {
      await aiService.chatStream(
        {
          message: userMessage.content,
          conversation_id: displayConversationId,
          context: {
            current_date: now.toISOString(),
            current_date_formatted: now.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            timezone: getBrowserTimezone(),
          },
        },
        (event: StreamMessage) => {
          if (event.type === 'done' && event.conversation_id) {
            setConversation(event.conversation_id);
            if (onConversationCreated) {
              onConversationCreated(event.conversation_id);
            }
          }

          if (event.type === 'status') {
            setProcessingStatus(event.content);
          }

          if (event.type === 'action_result' && event.action?.type === 'createEvent' && event.action?.result?.id) {
            queryClient.removeQueries({
              queryKey: EVENT_QUERY_KEYS.all,
            });
            queryClient.invalidateQueries({
              queryKey: EVENT_QUERY_KEYS.all,
              refetchType: 'active',
            });
          }

          setMessages((prev: ChatMessage[]) => {
            const newMessages = [...prev];
            const lastMsgIndex = newMessages.length - 1;
            const lastMsg = newMessages[lastMsgIndex];

            if (lastMsg.role === 'assistant') {
              if (event.type === 'text') {
                newMessages[lastMsgIndex] = {
                  ...lastMsg,
                  content: lastMsg.content + event.content,
                };
              } else if (event.type === 'action_start') {
              } else if (event.type === 'action_result') {
                const currentActions = lastMsg.actions || [];
                newMessages[lastMsgIndex] = {
                  ...lastMsg,
                  actions: [...currentActions, event.action],
                };
              }
            }
            return newMessages;
          });
        },
        () => {
          setIsProcessing(false);
          setProcessingStatus('');
          setMessages((prev: ChatMessage[]) => {
            const newMessages = [...prev];
            const lastMsgIndex = newMessages.length - 1;
            if (newMessages[lastMsgIndex].role === 'assistant') {
              newMessages[lastMsgIndex] = {
                ...newMessages[lastMsgIndex],
                isStreaming: false,
              };
            }
            return newMessages;
          });
        },
        (error) => {
          setIsProcessing(false);
          setProcessingStatus('');
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: `❌ Sorry, I encountered an error: ${error?.message || 'Unknown error'}`,
          };
          setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
        }
      );
    } catch (err) {
      setIsProcessing(false);
      setProcessingStatus('');
      const error = err as Error;
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error?.message || 'Unknown error'}`,
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    try {
      toast.success('Meeting scheduled successfully!');
      setShowConfirmDialog(false);
      setPendingAction(null);

      const confirmMessage: ChatMessage = {
        role: 'assistant',
        content: 'Meeting has been scheduled and invites sent to all participants.',
      };
      setMessages((prev: ChatMessage[]) => [...prev, confirmMessage]);
    } catch {
      toast.error('Failed to confirm action');
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
    toast.info('Action cancelled');
  };

  const handleNewConversation = () => {
    setMessages([]);
    clearConversation();
    setInput('');
    toast.success('Started new conversation');
  };

  // const handleSelectConversation = (id: string) => {
  //   setConversation(id);
  //   if (onConversationCreated) {
  //     onConversationCreated(id);
  //   }
  // };

  // const handleDeleteConversation = (id: string) => {
  //   if (displayConversationId === id) {
  //     clearConversation();
  //     setMessages([]);
  //   }
  //   deleteConversation.mutate(id);
  // };

  return (
    <div
      className={`flex flex-col bg-background ${hideHeader ? '' : ''
        } ${variant === 'popup' ? 'h-full' : 'h-full overflow-hidden'}`}
    >
      <ActionConfirmationDialog
        open={showConfirmDialog}
        action={pendingAction}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0 bg-background z-10 border-b border-border">
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex flex-col">
              <h2 className="text-lg font-medium text-foreground">Calento Assistant Beta</h2>
            </div>
            <div>
              <button type="button" onClick={toggleChatbox} aria-label="Collapse chatbox">
                <ArrowBigRight />
              </button>
            </div>
          </div>
          {/* <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={handleNewConversation}
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">New</span>
              </Button>
            )}
            {onClose && (
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div> */}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* {showHistory && (
          <div className="w-full flex-shrink-0 border-r bg-gray-50">
            <ConversationList
              conversations={conversations}
              activeConversationId={displayConversationId}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        )} */}

        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className={`flex-1 px-4 py-4 space-y-5 ${messages.length === 0 && !isLoading ? 'overflow-hidden' : 'overflow-y-auto scrollbar-thin'
              }`}
          >
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-muted rounded-xl h-12 w-3/4"></div>
                    </div>
                    <div className="flex justify-start">
                      <div className="space-y-2 w-4/5">
                        <div className="bg-muted rounded-xl h-16 w-full"></div>
                        <div className="bg-muted rounded-xl h-8 w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <EmptyState onSuggestionClick={(text) => setInput(text)} />
            ) : (
              messages.map((message, index) => (
                <div key={index} className="animate-in fade-in duration-200">
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-foreground text-background rounded-2xl px-4 py-2.5 max-w-[85%]">
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {message.content && (
                        <div className="flex items-start gap-3 max-w-[85%]">
                          <div className="flex-1 min-w-0 bg-muted/30 rounded-2xl px-4 py-3 border border-border">
                            <MessageContent content={message.content} />
                            {message.isStreaming && (
                              <span className="inline-block w-1.5 h-4 bg-foreground/60 ml-1 animate-pulse" />
                            )}
                          </div>
                        </div>
                      )}

                      {message.actions && message.actions.length > 0 && (
                        <div className="space-y-2 max-w-full">
                          {message.actions.map((action, idx) => (
                            <div key={idx}>
                              {action.type === 'checkAvailability' && action.result?.free_slots && (
                                <TimeSlotsList
                                  slots={action.result.free_slots}
                                  onBook={(slot) => {
                                    toast.success(`Slot booked: ${new Date(slot.start).toLocaleTimeString()} - ${new Date(slot.end).toLocaleTimeString()}`);
                                  }}
                                />
                              )}

                              {action.type === 'searchEvents' && action.result?.events && (
                                <EventsList
                                  events={action.result.events}
                                  total={action.result.total}
                                  dateRange={action.result.date_range}
                                  message={action.result.message}
                                />
                              )}

                              {action.type === 'createEvent' && action.result && (
                                <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-3">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                                    <h4 className="text-sm font-medium text-foreground">Event Created</h4>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                      <h5 className="text-[15px] font-medium text-foreground mb-1">
                                        {action.result.title}
                                      </h5>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          {new Date(action.result.start_time).toLocaleString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {action.type === 'createTask' && action.result && (
                                <div className="bg-muted/30 border border-border rounded-2xl overflow-hidden">
                                  <div className="px-4 py-3 border-b border-border">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-foreground" />
                                      <h4 className="text-sm font-medium text-foreground">Task Created</h4>
                                    </div>
                                  </div>
                                  <div className="p-4 space-y-3">
                                    <div>
                                      <h5 className="text-[15px] font-medium text-foreground mb-1">{action.result.title}</h5>
                                      {action.result.description && (
                                        <p className="text-sm text-muted-foreground">{action.result.description}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-6 pt-3 border-t border-border">
                                      {action.result.due_date && (
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Due</p>
                                            <p className="text-sm font-medium text-foreground">
                                              {new Date(action.result.due_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {action.result.estimated_duration && (
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                            <p className="text-sm font-medium text-foreground">{action.result.estimated_duration} min</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {isProcessing && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content && (
              <div className="flex items-start gap-3 max-w-[85%] animate-in fade-in duration-200">
                <div className="flex-1 bg-muted/30 rounded-2xl px-4 py-3 border border-border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">{getReadableStatus(processingStatus)}</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="bg-background border-t border-border flex-shrink-0">
            <div className="flex items-center h-14">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-14 w-12 rounded-none border-r border-border"
                onClick={() => {
                  handleNewConversation();
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                aria-label="Actions"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !(chatMutation.isPending || isProcessing) && handleSend()}
                placeholder="Ask about your schedule..."
                className="flex-1 h-14 rounded-none border-0 px-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={chatMutation.isPending || isProcessing}
              />

              {/* <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-14 w-12 rounded-none border-l border-border"
                  onClick={() => { }}
                  aria-label="Voice"
                >
                  <Mic className="h-4 w-4 text-gray-700" />
                </Button> */}

              <Button
                type="button"
                size="icon"
                className="h-14 w-12 rounded-none border-l border-border bg-[#1c5cf4] hover:bg-[#1341d0]"
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending || isProcessing}
                aria-label="Send"
              >
                {(chatMutation.isPending || isProcessing) ? (
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
