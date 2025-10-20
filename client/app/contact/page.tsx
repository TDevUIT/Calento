"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MainContent } from "@/components/layout/main-content";
import { Button } from "@/components/ui/button";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { INQUIRY_TYPES, COUNTRY_OPTIONS, CONTACT_INFO } from "@/constants/contact.constants";
import { ContactFormData } from "@/types/contact.types";
import { useSubmitContact } from "@/hook/contact/use-submit-contact";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = React.useState<ContactFormData>({
    firstName: '',
    lastName: '',
    country: '',
    phoneNumber: '',
    emailAddress: '',
    inquiryType: '',
    message: '',
    subscribeOffers: false
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const submitContactMutation = useSubmitContact();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.emailAddress || !formData.inquiryType || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    submitContactMutation.mutate(
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone_number: formData.phoneNumber,
        country: formData.country,
        inquiry_type: formData.inquiryType,
        message: formData.message,
        subscribe_offers: formData.subscribeOffers
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        }
      }
    );
  };

  if (isSubmitted) {
    return (
      <MainContent className="bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 min-h-screen">
        <section className="relative mx-auto max-w-4xl px-6 py-20 md:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 ring-8 ring-blue-100/50 dark:ring-blue-900/20">
              <svg className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                ðŸŽ‰ Message Sent Successfully!
              </h1>
              <p className="mb-8 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Thank you for reaching out to us! We&apos;ve received your message and will get back to you within 24 hours.
              </p>
              
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 mb-8 max-w-md mx-auto">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">What happens next?</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">âœ“</span>
                    Our team reviews your inquiry
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">âœ“</span>
                    Personalized response within 24 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">âœ“</span>
                    Follow-up support if needed
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = PUBLIC_ROUTES.HOME} 
                  size="lg"
                  className="theme-btn-primary"
                >
                  Back to Home
                </Button>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      firstName: '',
                      lastName: '',
                      country: '',
                      phoneNumber: '',
                      emailAddress: '',
                      inquiryType: '',
                      message: '',
                      subscribeOffers: false
                    });
                  }} 
                  variant="outline"
                  size="lg"
                >
                  Send Another Message
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </MainContent>
    );
  }

  return (
    <MainContent className="overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <ContactHero contactInfo={CONTACT_INFO} />
        <ContactForm
          formData={formData}
          onFormChange={handleInputChange}
          onSubmit={handleSubmit}
          isSubmitting={submitContactMutation.isPending}
          countryOptions={COUNTRY_OPTIONS}
          inquiryTypes={INQUIRY_TYPES}
        />
      </div>
    </MainContent>
  );
}
