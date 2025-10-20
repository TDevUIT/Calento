"use client";

import { motion } from "framer-motion";
import { ContactInfo } from "@/types/contact.types";

interface ContactHeroProps {
  contactInfo: ContactInfo[];
}

export function ContactHero({ contactInfo }: ContactHeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 text-slate-900 dark:text-white p-8 lg:p-12 min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
          Get in Touch,<br />
          <span className="text-blue-600 dark:text-blue-400">We&apos;re Here to Help</span>
        </h1>
        
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-12 max-w-md leading-relaxed">
          Whether you have questions, need support, or want to explore partnerships, 
          our team is ready to assist you with your calendar management needs.
        </p>

        <div className="bg-slate-600 rounded-lg mb-12 h-64 lg:h-80 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096895103089!2d105.78011807503184!3d21.02879998062143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0xea31563511af2e80!2zSOG6u20gxJDhu5FuZywgTXkgxJDDrG5oLCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-8">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-3">{info.title}</h3>
            <div className="space-y-1">
              {info.content.map((line, lineIndex) => (
                <p key={lineIndex} className="text-sm text-slate-700 dark:text-slate-300">
                  {line}
                </p>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
