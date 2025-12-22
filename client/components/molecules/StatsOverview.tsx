"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Building2, Users, CalendarCheck2, ShieldCheck } from "lucide-react";

export const StatsOverview = () => {
    const shouldReduceMotion = useReducedMotion();

    const items = [
        { value: "40K+", label: "Organizations", Icon: Building2 },
        { value: "2M+", label: "Users worldwide", Icon: Users },
        { value: "500M+", label: "Meetings scheduled", Icon: CalendarCheck2 },
        { value: "99.9%", label: "Uptime", Icon: ShieldCheck },
    ] as const;

    return (
        <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 mx-auto max-w-7xl px-6 md:px-8"
        >
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/40">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map(({ value, label, Icon }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 rounded-xl border border-transparent bg-white/70 p-4 transition-colors duration-300 hover:border-blue-500/30 dark:bg-slate-950/30"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
                                <Icon aria-hidden="true" className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white" aria-label={`${value} ${label}`}>
                                    {value}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
