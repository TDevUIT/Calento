"use client";

import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { APP_CONFIG } from "@/config/app.config";

interface TeamMember {
  name: string;
  role: string;
  description: string;
}

const values = [
  {
    icon: "🎯",
    title: "Mission-Driven", 
    description: "Making time management effortless and productive for everyone."
  },
  {
    icon: "🤖",
    title: "AI-Powered",
    description: "Smart scheduling solutions powered by artificial intelligence."
  },
  {
    icon: "🔒",
    title: "Privacy First",
    description: "Your data stays yours. Security and privacy are our priorities."
  }
];

const team: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    description: "Former Google engineer passionate about productivity and AI."
  },
  {
    name: "Sarah Kim",
    role: "CTO",
    description: "Full-stack developer with expertise in calendar integrations."
  },
  {
    name: "Mike Johnson",
    role: "Head of Design",
    description: "UX designer focused on creating intuitive user experiences."
  }
];

export default function AboutPage() {
  return (
    <MainContent className="bg-gradient-to-b from-[#f6f6f6] via-white/30 to-white dark:from-[#121212] dark:via-[#3d3d3d]/30 dark:to-[#121212] transition-colors duration-300">
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            About {APP_CONFIG.name}
          </span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Smart Calendar Management
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {APP_CONFIG.name} combines AI intelligence with intuitive design to help you manage your calendar more effectively and save time for what matters most.
        </p>
      </section>

      <section className="bg-white dark:bg-[#121212] py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-12">
            What We Stand For
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <Card key={index} className="border-0 bg-slate-50 dark:bg-slate-800 p-6 text-center">
                <CardContent className="pt-0">
                  <div className="mb-4 text-4xl">{value.icon}</div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
            Our Mission
          </h2>
          <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
            <p>
              We believe people spend too much time managing calendars instead of focusing on meaningful work. 
              {APP_CONFIG.name} changes that.
            </p>
            <p>
              Our AI-powered platform adapts to your workflow, automatically handling scheduling conflicts, 
              suggesting optimal meeting times, and giving you back hours in your day.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f6f6] dark:bg-[#3d3d3d] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              The people building the future of calendar management
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid gap-8 md:grid-cols-3"
          >
            {team.map((member: TeamMember, index: number) => (
              <Card key={index} className="border-0 bg-white dark:bg-[#121212] text-center shadow-sm">
                <CardContent className="pt-8">
                  <Avatar className="mx-auto mb-4 h-20 w-20">
                    <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-2xl font-semibold">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  </Avatar>
                  <CardTitle className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
                    {member.name}
                  </CardTitle>
                  <div className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                    {member.role}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/20 dark:via-blue-900/20 dark:to-blue-800/20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Ready to Transform Your Calendar?
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Join thousands of professionals who have already made the switch to smarter scheduling.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="rounded-lg theme-btn-primary px-6 py-3 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors">
                Get Started Free
              </button>
              <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainContent>
  );
}
