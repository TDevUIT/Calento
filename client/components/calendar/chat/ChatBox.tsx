'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  Sparkles,
  Calendar,
  Clock,
  Settings,
  CheckCircle2,
  X,
  Loader2,
  Plus,
  History,
  PanelLeftClose,
} from 'lucide-react';
import { useAIChat } from '@/hook/ai/use-ai-chat';
import { useConversation, useConversations, useDeleteConversation } from '@/hook/ai/use-conversations';
import { useConversationState } from '@/hook/ai/use-conversation-state';
import { ConversationList } from './ConversationList';
import { AIMessage, FunctionCall, ActionPerformed } from '@/interface/ai.interface';
import { ThinkingProcess } from './ThinkingProcess';
import { MessageContent } from './MessageContent';
import { ActionConfirmationDialog } from './ActionConfirmationDialog';
import { TimeSlotsList } from './TimeSlotsList';
import { EventsList } from './EventsList';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';
import { THINKING_ANIMATION } from '@/constants/timing.constants';

interface ChatBoxProps {
  onClose?: () => void;
  conversationId?: string;
  onConversationCreated?: (conversationId: string) => void;
  hideHeader?: boolean;
}

interface ChatMessage extends AIMessage {
  functionCalls?: FunctionCall[];
  actions?: ActionPerformed[];
}

interface ThinkingStep {
  id: string;
  status: 'pending' | 'active' | 'completed';
  label: string;
  icon?: string;
}

interface PendingActionType {
  id: string;
  type: string;
  title: string;
  description: string;
  parameters: Record<string, string | number | boolean>;
}

export function ChatBox({ onClose, conversationId: externalConversationId, onConversationCreated, hideHeader = false }: ChatBoxProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const { activeConversationId, setConversation, clearConversation } = useConversationState();
  const displayConversationId = externalConversationId || activeConversationId;
  
  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(displayConversationId);
  const { data: conversationsData } = useConversations();
  const deleteConversation = useDeleteConversation();
  
  const conversations = conversationsData?.data || [];
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingActionType | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useAIChat();
  const [isProcessing, setIsProcessing] = useState(false);

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
  

  const handleSend = async () => {
    if (!input.trim() || isProcessing || chatMutation.isPending) return;

    const userMessage: AIMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    const steps: ThinkingStep[] = [
      { id: '1', status: 'active', label: 'Understanding your request...', icon: 'search' },
      { id: '2', status: 'pending', label: 'Analyzing calendar context...', icon: 'calendar' },
      { id: '3', status: 'pending', label: 'Processing with AI...', icon: 'zap' },
    ];
    setThinkingSteps(steps);
    
    setTimeout(() => {
      setThinkingSteps(prev => {
        if (prev.length === 0) return prev;
        return prev.map((s, i) => 
          i === 0 ? { ...s, status: 'completed' as const } :
          i === 1 ? { ...s, status: 'active' as const } : s
        );
      });
    }, THINKING_ANIMATION.STEP_DELAY);
    
    setTimeout(() => {
      setThinkingSteps(prev => {
        if (prev.length === 0) return prev;
        return prev.map((s, i) => 
          i <= 1 ? { ...s, status: 'completed' as const } :
          i === 2 ? { ...s, status: 'active' as const } : s
        );
      });
    }, THINKING_ANIMATION.STEP_DELAY + THINKING_ANIMATION.STEP_TRANSITION + 400);

    const cleanHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content || '',
    }));

    const now = new Date();
    
    try {
      const response = await chatMutation.mutateAsync({
        message: input.trim(),
        conversation_id: displayConversationId,
        history: cleanHistory,
        context: {
          current_date: now.toISOString(),
          current_date_formatted: now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });
      
      if (response.data.conversation_id && !displayConversationId) {
        setConversation(response.data.conversation_id);
        onConversationCreated?.(response.data.conversation_id);
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        functionCalls: response.data.function_calls,
        actions: response.data.actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      
      setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'completed' as const })));
      
      setTimeout(() => {
        setThinkingSteps([]);
      }, THINKING_ANIMATION.COMPLETE_DELAY);
      
      setIsProcessing(false);
    } catch (err) {
      setThinkingSteps([]);
      setIsProcessing(false);
      const error = err as Error;
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error?.message || 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
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
        content: 'âœ… Meeting has been scheduled and invites sent to all participants.',
      };
      setMessages((prev) => [...prev, confirmMessage]);
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

  const handleSelectConversation = (id: string) => {
    setConversation(id);
    if (onConversationCreated) {
      onConversationCreated(id);
    }
  };

  const handleDeleteConversation = (id: string) => {
    if (displayConversationId === id) {
      clearConversation();
      setMessages([]);
    }
    deleteConversation.mutate(id);
  };

  return (
    <div className={`flex flex-col bg-white ${hideHeader ? '' : 'border-l shadow-xl'} h-full overflow-hidden`}>
      <ActionConfirmationDialog
        open={showConfirmDialog}
        action={pendingAction}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      
      {!hideHeader && (
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gray-700" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-gray-900">Calento Assistant</h2>
              {displayConversationId && (
                <p className="text-xs text-gray-500">Conversation active</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1.5"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? <PanelLeftClose className="h-4 w-4" /> : <History className="h-4 w-4" />}
              <span className="text-xs">{showHistory ? 'Hide' : 'History'}</span>
            </Button>
            {messages.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1.5"
                onClick={handleNewConversation}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs">New</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4 text-gray-500" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {showHistory && (
          <div className="w-72 flex-shrink-0 border-r bg-gray-50">
            <ConversationList
              conversations={conversations}
              activeConversationId={displayConversationId}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex justify-end">
                  <div className="bg-gray-200 rounded-lg h-12 w-3/4"></div>
                </div>
                <div className="flex justify-start">
                  <div className="space-y-2 w-4/5">
                    <div className="bg-gray-200 rounded-lg h-16 w-full"></div>
                    <div className="bg-gray-200 rounded-lg h-8 w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <EmptyState onSuggestionClick={(text) => setInput(text)} />
        ) : (
          messages.map((message, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2.5 max-w-[75%]">
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {message.content && (
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <MessageContent content={message.content} />
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
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                              <div className="flex items-center gap-2 text-blue-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <h4 className="text-sm font-semibold">Event Created</h4>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-sm font-semibold text-gray-900 mb-1">
                                    {action.result.title}
                                  </h5>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="h-3.5 w-3.5" />
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
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900">Task Created</h4>
                                    <p className="text-xs text-gray-600">Added to your task list</p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-900 mb-1">{action.result.title}</h5>
                                  {action.result.description && (
                                    <p className="text-sm text-gray-600">{action.result.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                  {action.result.due_date && (
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Due Date</p>
                                        <p className="text-sm font-medium text-gray-900">
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
                                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500">Duration</p>
                                        <p className="text-sm font-medium text-gray-900">{action.result.estimated_duration} min</p>
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
        
        {thinkingSteps.length > 0 && (
          <div className="flex items-start gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-3">Thinking...</p>
              <ThinkingProcess steps={thinkingSteps} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
            <p className="text-xs text-gray-500 mb-3">Try asking me to:</p>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setInput('Find time for a team meeting')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
              >
                <Clock className="h-4 w-4" />
                <span>Find time for a team meeting</span>
              </button>
              <button 
                onClick={() => setInput('Check my availability')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
              >
                <Calendar className="h-4 w-4" />
                <span>Check my availability</span>
              </button>
              <button 
                onClick={() => setInput('Create a task')}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Create a task</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !(chatMutation.isPending || isProcessing) && handleSend()}
                  placeholder="Ask about your schedule..."
                  className="pr-24 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={chatMutation.isPending || isProcessing}
                />
                <div className="absolute right-12 top-1/2 -translate-y-1/2">
                  <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-50 text-gray-500 border border-gray-200 rounded">
                    Ctrl+L
                  </kbd>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending || isProcessing}
                >
                  {(chatMutation.isPending || isProcessing) ? (
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Powered by Gemini</span>
              </div>
              <div className="h-3 w-px bg-gray-300" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Calendar Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
