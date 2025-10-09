'use client'
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar1, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { 
    SIDEBAR_ITEMS, 
    CALENDAR_EVENTS, 
    DAYS_OF_WEEK,
    DASHBOARD_STYLES 
} from '@/constants/dashboard.constants';

const MiniDashboard = () => {
    // Note: currentTime and activeView are kept for future interactivity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentTime, setCurrentTime] = useState(new Date());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeView, setActiveView] = useState('calendar');
    
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const currentDate = useMemo(() => new Date(), []);
    const currentMonth = useMemo(() => 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), 
        [currentDate]
    );
    
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days: (number | null)[] = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    }, [currentDate]);

    return (
        <div className={DASHBOARD_STYLES.container}>
            <div className={DASHBOARD_STYLES.sidebar.container}>
                <div className={DASHBOARD_STYLES.sidebar.logo}>
                    <Logo size="xs" className="justify-center" />
                </div>

                <nav className={DASHBOARD_STYLES.sidebar.nav}>
                    <ul className={DASHBOARD_STYLES.sidebar.navList}>
                        {SIDEBAR_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveView(item.id)}
                                        className={`${DASHBOARD_STYLES.sidebar.navItem.base} ${
                                            item.active
                                                ? DASHBOARD_STYLES.sidebar.navItem.active
                                                : DASHBOARD_STYLES.sidebar.navItem.inactive
                                        }`}
                                        aria-label={`Switch to ${item.name} view`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Icon className="w-3 h-3" aria-hidden="true" />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className={DASHBOARD_STYLES.sidebar.badge}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className={DASHBOARD_STYLES.sidebar.footer}>
                    <button className={DASHBOARD_STYLES.sidebar.newEventButton}>
                        <Plus className="w-3 h-3" aria-hidden="true" />
                        <span>New Event</span>
                    </button>
                </div>
            </div>

            <div className={DASHBOARD_STYLES.main.container}>
                <main className={DASHBOARD_STYLES.main.content}>
                    <div className={DASHBOARD_STYLES.main.header}>
                        <div className="flex items-center space-x-3">
                            <div className={DASHBOARD_STYLES.main.headerIcon}>
                                <Calendar1 className="w-5 h-5 text-blue-600" aria-hidden="true" />
                            </div>
                            <div>
                                <h1 className={DASHBOARD_STYLES.main.headerTitle}>Calendar</h1>
                                <p className={DASHBOARD_STYLES.main.headerSubtitle}>Manage your schedule</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className={DASHBOARD_STYLES.calendar.container}>
                            <div className={DASHBOARD_STYLES.calendar.navigation}>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            className={DASHBOARD_STYLES.calendar.navButton}
                                            aria-label="Previous month"
                                        >
                                            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                        <span className={DASHBOARD_STYLES.calendar.monthTitle}>
                                            {currentMonth}
                                        </span>
                                        <button 
                                            className={DASHBOARD_STYLES.calendar.navButton}
                                            aria-label="Next month"
                                        >
                                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <button className={DASHBOARD_STYLES.calendar.todayButton}>
                                        Today
                                    </button>
                                </div>
                            </div>
                            <div className={DASHBOARD_STYLES.calendar.grid}>
                                <div className={DASHBOARD_STYLES.calendar.daysHeader}>
                                    {DAYS_OF_WEEK.map((day, index) => (
                                        <div 
                                            key={day} 
                                            className={`${DASHBOARD_STYLES.calendar.dayHeader} ${
                                                index !== 6 ? 'border-r border-slate-200' : ''
                                            }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                <div className={DASHBOARD_STYLES.calendar.daysGrid}>
                                    {calendarDays.map((day, index) => {
                                        const isLastColumn = (index + 1) % 7 === 0;
                                        const isToday = day === currentDate.getDate();
                                        
                                        return (
                                            <div 
                                                key={index} 
                                                className={`${DASHBOARD_STYLES.calendar.dayCell.base} ${
                                                    !isLastColumn ? 'border-r border-slate-200' : ''
                                                }`}
                                            >
                                                {day ? (
                                                    <div className={`${DASHBOARD_STYLES.calendar.dayCell.content} ${
                                                        isToday 
                                                            ? DASHBOARD_STYLES.calendar.dayCell.today
                                                            : DASHBOARD_STYLES.calendar.dayCell.normal
                                                    }`}>
                                                        <div className="p-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className={`text-xs font-medium ${
                                                                    isToday 
                                                                        ? 'text-blue-600 font-semibold' 
                                                                        : 'text-slate-700'
                                                                }`}>
                                                                    {day}
                                                                </span>
                                                            </div>
                                                            
                                                            {CALENDAR_EVENTS[day] && (
                                                                <div className="mt-1.5 space-y-0.5">
                                                                    {CALENDAR_EVENTS[day].slice(0, 2).map((event, eventIndex) => (
                                                                        <div 
                                                                            key={eventIndex} 
                                                                            className={`${DASHBOARD_STYLES.calendar.event.base} ${event.color}`}
                                                                            title={`${event.title} at ${event.time}`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <span className={DASHBOARD_STYLES.calendar.event.time}>
                                                                                    {event.time.split(' ')[0]}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {CALENDAR_EVENTS[day].length > 2 && (
                                                                        <div className={DASHBOARD_STYLES.calendar.event.moreIndicator}>
                                                                            +{CALENDAR_EVENTS[day].length - 2} more
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={DASHBOARD_STYLES.calendar.dayCell.empty}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MiniDashboard;