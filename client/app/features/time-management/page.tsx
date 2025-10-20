"use client";

import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app.config";
import { Clock, BarChart3, Target, Brain, TrendingUp, Calendar } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Time Analytics",
    description: "Get detailed insights into how you spend your time with intelligent tracking and reporting."
  },
  {
    icon: Target,
    title: "Focus Time Blocks",
    description: "Automatically schedule dedicated focus time for deep work and important tasks."
  },
  {
    icon: Brain,
    title: "Smart Suggestions",
    description: "AI analyzes your patterns and suggests optimal times for different types of work."
  },
  {
    icon: TrendingUp,
    title: "Productivity Metrics",
    description: "Track your productivity trends and identify opportunities for improvement."
  },
  {
    icon: Calendar,
    title: "Time Blocking",
    description: "Organize your day with visual time blocks for better schedule management."
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Understand where your time goes with automatic time tracking and categorization."
  }
];

const benefits = [
  "Visualize how you spend every hour",
  "Identify time-wasting activities automatically",
  "Optimize your schedule based on energy levels",
  "Balance work and personal commitments",
  "Achieve more with intelligent time allocation"
];

export default function TimeManagementPage() {
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
            <Clock className="h-4 w-4" />
            Time Management
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          Master Your Time, Maximize Your Impact
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          Take control of your schedule with intelligent time management tools. {APP_CONFIG.name} helps you understand, optimize, and make the most of every minute.
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
            Intelligent Time Management Features
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
              Transform How You Manage Time
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Stop letting time slip away and start making every moment count
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
