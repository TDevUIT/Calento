"use client";

import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Card, CardContent } from "@/components/ui/card";
import { APP_CONFIG } from "@/config/app.config";
import { Sparkles, Bot, Zap, CalendarCheck, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Your personal scheduling assistant that learns your preferences and handles meeting coordination."
  },
  {
    icon: Zap,
    title: "Instant Scheduling",
    description: "AI finds the perfect meeting time in seconds, considering everyone's availability."
  },
  {
    icon: CalendarCheck,
    title: "Smart Conflicts",
    description: "Automatically detect and resolve scheduling conflicts before they happen."
  },
  {
    icon: Users,
    title: "Team Coordination",
    description: "Schedule group meetings effortlessly by finding optimal times for all participants."
  },
  {
    icon: MessageSquare,
    title: "Natural Language",
    description: "Just tell the AI what you need in plain English and it handles the rest."
  },
  {
    icon: Sparkles,
    title: "Learning System",
    description: "Gets smarter over time by learning from your scheduling patterns and preferences."
  }
];

const benefits = [
  "Schedule meetings 10x faster than manual coordination",
  "Eliminate back-and-forth email chains",
  "Find optimal times that work for everyone",
  "Respect focus time and personal preferences",
  "Handle timezone complexity automatically"
];

export default function AISchedulingPage() {
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
            <Sparkles className="h-4 w-4" />
            AI Scheduling
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
        >
          Let AI Handle Your Scheduling
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300"
        >
          Stop wasting time on scheduling. {APP_CONFIG.name} uses advanced AI to automatically find the perfect meeting times and coordinate with your team.
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
            AI-Powered Scheduling Features
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
              Why Choose AI Scheduling?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Experience the future of meeting coordination
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

      <section className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/20 dark:via-blue-900/20 dark:to-blue-800/20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready for Smarter Scheduling?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Let AI handle your scheduling and get back hours in your week.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="rounded-lg theme-btn-primary px-8 py-3 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainContent>
  );
}
