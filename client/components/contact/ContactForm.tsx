"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactFormData, SelectOption, InquiryType } from "@/types/contact.types";

interface ContactFormProps {
  formData: ContactFormData;
  onFormChange: (field: string, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  countryOptions: SelectOption[];
  inquiryTypes: InquiryType[];
}

export function ContactForm({ 
  formData, 
  onFormChange, 
  onSubmit, 
  isSubmitting,
  countryOptions,
  inquiryTypes
}: ContactFormProps) {
  return (
    <div className="bg-white p-6 lg:p-10 min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex-1"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How Can We Help You?
          </h2>
          <p className="text-slate-600 mb-8 text-sm">
            Whether you need support, have questions, or want to explore partnerships, 
            we&apos;re here to help. Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => onFormChange('firstName', e.target.value)}
                  className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => onFormChange('lastName', e.target.value)}
                  className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-slate-700">
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => onFormChange('country', value)}>
                  <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => onFormChange('phoneNumber', e.target.value)}
                  className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={(e) => onFormChange('emailAddress', e.target.value)}
                className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiryType" className="text-sm font-medium text-slate-700">
                Type of Inquiry
              </Label>
              <Select value={formData.inquiryType} onValueChange={(value) => onFormChange('inquiryType', value)}>
                <SelectTrigger className="rounded-lg bg-slate-50 border-slate-200 focus:bg-white">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Message"
                value={formData.message}
                onChange={(e) => onFormChange('message', e.target.value)}
                className="min-h-24 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-lg"
                rows={4}
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="subscribeOffers"
                type="checkbox"
                checked={formData.subscribeOffers}
                onChange={(e) => onFormChange('subscribeOffers', e.target.checked)}
                className="mt-0.5 h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
              />
              <Label htmlFor="subscribeOffers" className="text-sm text-slate-600">
                I&apos;d like to receive exclusive offers and updates
              </Label>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full theme-btn-primary font-medium py-3 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
