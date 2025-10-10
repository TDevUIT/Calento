'use client'

import React from 'react';
import { Calendar, Clock, Users, Send, Folder, ChevronsLeftRight, Zap, ChevronRight, Settings } from 'lucide-react';
import { FaCoins } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import CalendarPreview from '@/components/organisms/Calendar/CalendarPreview';
import {
  SIDEBAR_NAV_ITEMS,
  WORKSPACE_CONFIG,
  CREDITS_CONFIG,
  SIDEBAR_ACTIONS,
  AI_CHAT_CONFIG,
  SAMPLE_CONVERSATION,
  QUICK_ACTIONS,
  QUICK_ACTIONS_LABEL,
  MEETING_CTA,
  MATCH_SCORE_LABEL,
  formatCredits
} from '@/constants/dashboard-preview.constants';

const DashboardPreview = () => {


  return (
    <Card className="w-full h-full overflow-hidden p-0 gap-0 rounded-none border-t-0 border-l-0 border-r-0">
      <div className="flex flex-col md:flex-row h-full">
        <div className="hidden md:flex md:w-48 lg:w-60 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="p-3 md:p-4 space-y-2 md:space-y-3">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Avatar className="h-7 w-7 md:h-8 md:w-8">
                <Image src="/icon-192x192.png" alt="AI Avatar" height={32} width={32} />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">Calento</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400">{WORKSPACE_CONFIG.userStatus}</span>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full justify-between h-8 md:h-9 text-[10px] md:text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                <span>{WORKSPACE_CONFIG.name}</span>
              </div>
              <ChevronsLeftRight className="h-3 w-3 rotate-90" />
            </Button>
          </div>

          <nav className="flex-1 px-2 md:px-3 space-y-0.5">
            {SIDEBAR_NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Button
                  key={i}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                    item.active 
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 shadow-sm" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2 md:mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] h-5 px-1.5 shadow-sm animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="p-2 md:p-3 space-y-1.5 md:space-y-2">
            
            <div className='px-3 flex items-center justify-between bg-white border py-2 rounded-lg'>
                <div className="flex items-center gap-2">
                    <FaCoins className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px] font-medium text-slate-900 dark:text-white">{formatCredits(CREDITS_CONFIG.available)} {CREDITS_CONFIG.label}</span>
                </div>

                <span className='text-[10px] font-medium text-slate-900 dark:text-white underline cursor-pointer'>{CREDITS_CONFIG.upgradeText}</span>
            </div>
             

            {SIDEBAR_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <Button 
                  key={i}
                  variant="ghost" 
                  className={cn(
                    "w-full h-9 px-3 text-sm font-normal hover:bg-slate-100 dark:hover:bg-slate-800",
                    'badge' in action ? "justify-between" : "justify-start"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </div>
                  {'badge' in action && (
                    <Badge className="bg-slate-700 text-white text-[10px] px-1.5 py-0 dark:bg-slate-600">
                      {action.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row bg-white dark:bg-slate-950">
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
              <CalendarPreview />
            </div>

            <div className="hidden lg:flex lg:w-72 xl:w-80 flex-col bg-slate-50 dark:bg-slate-900/30">
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 border border-white dark:border-slate-900" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{AI_CHAT_CONFIG.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden p-3 space-y-2.5 bg-slate-50/30 dark:bg-slate-950/30">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl rounded-tr-md bg-blue-600 dark:bg-blue-700 px-3 py-2 shadow-sm">
                      <p className="text-[11px] leading-relaxed text-white">{SAMPLE_CONVERSATION.userMessage.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] text-blue-100/80">{SAMPLE_CONVERSATION.userMessage.timestamp}</span>
                        <div className="h-1 w-1 rounded-full bg-blue-300" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="rounded-lg bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 px-2.5 py-2 mb-2 shadow-sm">
                        <div className="flex items-start gap-1.5">
                          <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1.5">
                              <p className="text-[9px] font-bold text-slate-900 dark:text-white">{SAMPLE_CONVERSATION.aiAnalysis.title}</p>
                              <span className="text-[8px] text-slate-500 dark:text-slate-400">{SAMPLE_CONVERSATION.aiAnalysis.duration}</span>
                            </div>
                            
                            <div className="space-y-1">
                              {SAMPLE_CONVERSATION.aiAnalysis.steps.map((step, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <div className={cn(
                                    "h-1 w-1 rounded-full mt-1 flex-shrink-0",
                                    step.type === 'success' ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                                  )} />
                                  <p className={cn(
                                    "text-[9px]",
                                    step.type === 'success' ? "text-slate-700 dark:text-slate-300" : "",
                                    step.type === 'skipped' ? "text-slate-400 dark:text-slate-500 line-through" : "",
                                    step.type === 'highlight' ? "text-slate-900 dark:text-white font-medium" : ""
                                  )}>
                                    {step.text}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                              <span className="text-[8px] text-slate-500 dark:text-slate-400">{MATCH_SCORE_LABEL}</span>
                              <div className="flex items-center gap-1">
                                <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{width: `${SAMPLE_CONVERSATION.aiAnalysis.matchScore}%`}} />
                                </div>
                                <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">{SAMPLE_CONVERSATION.aiAnalysis.matchScore}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl rounded-tl-md bg-white dark:bg-slate-800 px-3 py-2 shadow-sm border border-slate-200 dark:border-slate-700">
                        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 mb-2">
                          {SAMPLE_CONVERSATION.aiResponse.content}
                        </p>
                        
                        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900 border border-blue-200 dark:border-blue-900 p-2 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                              <Calendar className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white mb-1">
                                {SAMPLE_CONVERSATION.suggestedMeeting.title}
                              </h4>
                              <div className="space-y-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-3 w-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                  <span>{SAMPLE_CONVERSATION.suggestedMeeting.date} • {SAMPLE_CONVERSATION.suggestedMeeting.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Users className="h-3 w-3 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                  <span>{SAMPLE_CONVERSATION.suggestedMeeting.attendees} members • {SAMPLE_CONVERSATION.suggestedMeeting.availability}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="w-full h-6 text-[10px] font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm hover:shadow-md transition-all">
                            {MEETING_CTA}
                          </Button>
                        </div>

                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="text-[9px] text-slate-400 dark:text-slate-500">{SAMPLE_CONVERSATION.aiResponse.timestamp}</span>
                          <div className="h-1 w-1 rounded-full bg-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                    <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">{QUICK_ACTIONS_LABEL}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[10px] rounded-lg border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-800 transition-all hover:scale-105 active:scale-95"
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {action.label}
                          </Button>
                        );
                      })}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="p-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={AI_CHAT_CONFIG.placeholder}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-2.5 pr-8 py-1.5 text-[11px] placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 transition-all"
                          disabled
                        />
                        <Zap className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300 dark:text-slate-600" />
                      </div>
                      <Button size="icon" className="h-7 w-7 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-sm">
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="px-2 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Zap className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-[8px] font-medium text-slate-700 dark:text-slate-300">{AI_CHAT_CONFIG.model.name}</span>
                      </div>
                      <span className="text-[8px] text-slate-400 dark:text-slate-500">•</span>
                      <span className="text-[8px] text-slate-500 dark:text-slate-400">{AI_CHAT_CONFIG.model.description}</span>
                    </div>
                    <button className="text-[8px] text-blue-600 dark:text-blue-400 hover:underline">
                      {AI_CHAT_CONFIG.model.changeText}
                    </button>
                  </div>
                </div>
              </div>
            </div>

           
          </div>
          
        </div>
      </div>
    </Card>
  );
};

export default DashboardPreview;
