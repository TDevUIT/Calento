"use client";

import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app.config";
import { Link as LinkIcon, RefreshCw, Shield, Zap, Calendar, CheckCircle } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Two-Way Sync",
    description: "Changes sync instantly between Google Calendar and Calento in both directions."
  },
  {
    icon: Shield,
    title: "Secure OAuth",
    description: "Connect safely using Google's official OAuth authentication. We never store your password."
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "See changes immediately across all your devices and platforms."
  },
  {
    icon: Calendar,
    title: "Multiple Calendars",
    description: "Sync all your Google calendars including shared and team calendars."
  },
  {
    icon: CheckCircle,
    title: "Event Management",
    description: "Create, edit, and delete events seamlessly across both platforms."
  },
  {
    icon: LinkIcon,
    title: "Easy Setup",
    description: "Connect your Google Calendar in seconds with just a few clicks."
  }
];

const steps = [
  {
    number: "1",
    title: "Click Connect",
    description: "Start by clicking the Connect Google Calendar button in your settings."
  },
  {
    number: "2",
    title: "Authorize Access",
    description: "Sign in with your Google account and grant calendar permissions."
  },
  {
    number: "3",
    title: "Start Syncing",
    description: "Your calendars sync automatically. Make changes anywhere, see them everywhere."
  }
];

export default function GoogleCalendarIntegrationPage() {
  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span>Google Calendar Integration</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          Seamless Google Calendar Integration
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          Connect your Google Calendar to {APP_CONFIG.name} and enjoy seamless two-way sync. Manage all your events in one place with real-time updates.
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
            Integration Features
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
              How to Connect
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Get started in just three simple steps
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {steps.map((step, index) => (
              <div key={index} className="bg-white dark:bg-[#121212] rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-lg font-bold text-blue-600 dark:text-blue-400">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </MainContent>
  );
}
