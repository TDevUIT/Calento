'use client'
import React from "react";
import CalendarPreview from "@/components/organisms/Calendar/CalendarPreview";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calendar, Clock, RefreshCw, Video, BarChart3, Settings, Users, HelpCircle, Folder, ChevronsLeftRight } from 'lucide-react';
import { FaCoins } from 'react-icons/fa6';

const MiniDashboard = () => {
    const sidebarItems = [
        { icon: Calendar, label: 'Calendar', active: true, badge: 8 },
        { icon: Clock, label: 'Schedule', active: false },
        { icon: RefreshCw, label: 'Calendar Sync', active: false },
        { icon: Video, label: 'Meetings', active: false },
        { icon: BarChart3, label: 'Analytics', active: false }
    ];

    return (
        <div className="w-full h-full bg-white rounded-l-xl flex overflow-hidden mt-10 shadow-lg border border-slate-100">
            <div className="w-60 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <Image src="/icon-192x192.png" alt="AI Avatar" height={32} width={32} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-semibold">
                                AI
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Calento</span>
                            <div className="flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] text-slate-500 dark:text-slate-400">Online</span>
                            </div>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="w-full justify-between h-9 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4" />
                            <span>My Workspace</span>
                        </div>
                        <ChevronsLeftRight className="h-3 w-3 rotate-90" />
                    </Button>
                </div>

                <nav className="flex-1 px-3 space-y-0.5">
                    {sidebarItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={i}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start h-9 px-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                                    item.active 
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 shadow-sm" 
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                <Icon className="h-4 w-4 mr-3" />
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
                    <div className="p-3 space-y-2">
                        <div className='px-3 flex items-center justify-between bg-white border py-2 rounded-lg'>
                            <div className="flex items-center gap-2">
                                <FaCoins className="h-4 w-4 text-blue-600" />
                                <span className="text-[10px] font-medium text-slate-900 dark:text-white">1,304 Credits left</span>
                            </div>
                            <span className='text-[10px] font-medium text-slate-900 dark:text-white underline cursor-pointer'>Upgrade</span>
                        </div>

                        <Button variant="ghost" className="w-full justify-between h-9 px-3 text-sm font-normal hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </div>
                        </Button>

                        <Button variant="ghost" className="w-full justify-between h-9 px-3 text-sm font-normal hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Affiliate</span>
                            </div>
                            <Badge className="bg-slate-700 text-white text-[10px] px-1.5 py-0 dark:bg-slate-600">
                                30%
                            </Badge>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-slate-100 dark:hover:bg-slate-800">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4" />
                                <span>Help</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Calendar Only - No AI Chat */}
            <CalendarPreview />
        </div>
    );
};

export default MiniDashboard;
