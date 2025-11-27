"use client";

import { motion } from "framer-motion";

export const StatsOverview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 mx-auto max-w-7xl px-6 md:px-8"
        >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">40K+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Organizations</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">2M+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Users worldwide</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">500M+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Meetings scheduled</div>
                </div>
                <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">99.9%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Uptime</div>
                </div>
            </div>
        </motion.div>
    );
};
