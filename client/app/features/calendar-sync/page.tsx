"use client";

import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app.config";
import { Calendar, RefreshCw, Lock, Zap, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Multi-Calendar Support",
    description: "Connect unlimited calendars from Google, Outlook, and other providers in one unified view."
  },
  {
    icon: RefreshCw,
    title: "Real-Time Sync",
    description: "Changes sync instantly across all your devices and calendar platforms."
  },
  {
    icon: Lock,
    title: "Secure Connection",
    description: "Bank-level encryption ensures your calendar data stays private and secure."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience instant updates with our optimized sync engine."
  },
  {
    icon: Globe,
    title: "Cross-Platform",
    description: "Access your synced calendars from web, mobile, and desktop applications."
  },
  {
    icon: Shield,
    title: "Conflict Detection",
    description: "Automatically detect and resolve scheduling conflicts across calendars."
  }
];

const benefits = [
  "View all your calendars in one place",
  "Never miss a meeting across different platforms",
  "Reduce scheduling conflicts automatically",
  "Save hours of manual calendar management",
  "Work seamlessly across devices"
];

export default function CalendarSyncPage() {
  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            <Calendar className="h-4 w-4" />
            Calendar Sync
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          All Your Calendars, Perfectly Synced
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          Connect all your calendars from Google, Outlook, and more. {APP_CONFIG.name} keeps everything in sync so you never miss a beat.
        </motion.p>
      </section>

      <section className="bg-white dark:bg-[#121212] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-12 text-center"
          >
            Powerful Sync Features
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-slate-50 dark:bg-slate-800 p-6">
                <CardContent className="pt-0">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Why Sync With {APP_CONFIG.name}?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Stop juggling multiple calendar apps and get back to what matters
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white dark:bg-[#121212] rounded-2xl p-8 shadow-sm"
          >
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg text-slate-700 dark:text-slate-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </MainContent>
  );
}
