"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FEATURES } from "@/config/app.config";
import Marquee from "react-fast-marquee";
import DashboardPreview from "./DashboardPreview";

export const HeroSection = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-6 md:px-8 lg:py-12">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
            <svg className="h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>AI-Powered • Used by 10,000+ professionals</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white"
        >
          {FEATURES.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-400"
        >
          {FEATURES.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/auth/signup"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg theme-btn-primary px-8 text-base font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
          >
            {FEATURES.hero.cta.primary}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#demo-video"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.98] sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 dark:focus:ring-offset-slate-900"
          >
            {FEATURES.hero.cta.secondary}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center -space-x-3">
            {[
              { name: "Michael Rodriguez", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
              { name: "Emily Watson", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
              { name: "David Kim", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
              { name: "Lisa Thompson", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
              { name: "James Wilson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" }
            ].map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="relative"
              >
                <Image
                  src={user.image}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full border-2 border-white shadow-lg dark:border-slate-700"
                />
                {index === 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-100 text-sm font-medium text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
            >
              +5K
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-center text-sm text-slate-600 dark:text-slate-400"
          >
            <span className="font-semibold text-slate-900 dark:text-white">10,000+ professionals</span> trust Calento to manage their calendar
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute -inset-x-10 sm:-inset-x-20 -inset-y-10 -z-10 bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
        
        <div className="overflow-hidden rounded-lg md:rounded-xl border border-slate-200 bg-white shadow-xl md:shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
          <div className="flex items-center gap-1.5 md:gap-2 border-b border-slate-200 bg-slate-50 px-3 md:px-4 py-2 md:py-3 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex gap-1">
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="ml-2 md:ml-4 flex-1 rounded-md bg-white px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500 truncate">
              app.calento.space/dashboard/calendar
            </div>
          </div>
          
          <div className="relative aspect-[16/10] md:aspect-[16/10] bg-slate-50 dark:bg-slate-950 min-h-[300px] md:min-h-[400px]">
            <DashboardPreview />
          </div>
        </div>
        <div className='hidden lg:block z-[9999] absolute -top-40 -left-10'>
          <div className="relative">
            <Image src="/images/dashed-arrow-icon.png" alt="Calendar View" className="-rotate-[100deg]" height={132} width={132} />
            <div className="absolute -left-4 -top-14">
              <p className="text-sm xl:text-base font-bold text-slate-900 dark:text-white">Your Schedule</p>
              <p className="text-xs xl:text-sm text-slate-600 dark:text-slate-400">All events in one view </p>
            </div>
          </div>
        </div>

        <div className='hidden lg:block z-[9999] absolute -right-28 -bottom-20'>
          <div className="relative">
            <Image src="/images/dashed-arrow-icon.png" alt="AI Assistant" className="rotate-90" height={132} width={132} />
            <div className="absolute -right-4 -bottom-14">
              <p className="text-sm xl:text-base font-bold text-slate-900 dark:text-white">Try it now</p>
              <p className="text-xs xl:text-sm text-slate-600 dark:text-slate-400">Ask AI anything! 🚀</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12 md:mt-16 lg:mt-24"
      >
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Trusted by industry leaders
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join over 40,000 organizations worldwide who trust Calento to streamline their scheduling
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative py-16 overflow-hidden"
      >
          <Marquee
            gradient={false}
            speed={35}
            pauseOnHover={true}
            className="py-8 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {[
              { name: 'Google', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg' },
              { name: 'Microsoft', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg' },
              { name: 'Slack', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg' },
              { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
              { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
              { name: 'Stripe', logo: 'https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg' },
              { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png' }
            ].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="mx-8 group cursor-pointer"
              >
                <div className="flex h-20 w-32 items-center justify-center transition-all duration-300">
                  <Image 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain transition-all duration-300"
                  />
                </div>
              </div>
            ))}
            
            {[
              { name: 'Google', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg' },
              { name: 'Microsoft', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg' },
              { name: 'Slack', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg' },
              { name: 'Notion', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
              { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
              { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
              { name: 'Stripe', logo: 'https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg' },
              { name: 'Vercel', logo: 'https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png' }
            ].map((company, index) => (
              <div
                key={`${company.name}-duplicate-${index}`}
                className="mx-8 group cursor-pointer"
              >
                <div className="flex h-20 w-32 items-center justify-center transition-all duration-300">
                  <Image 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </Marquee>
      </motion.div>

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
    </section>
  );
};
