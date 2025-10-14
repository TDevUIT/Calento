import { InquiryType, SelectOption, ContactInfo } from '@/types/contact.types';
import { APP_CONFIG } from '@/config/app.config';

export const INQUIRY_TYPES: InquiryType[] = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "feature", label: "Feature Request" },
  { value: "integration", label: "Calendar Integration" },
  { value: "billing", label: "Billing & Account" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" }
];

export const COUNTRY_OPTIONS: SelectOption[] = [
  { value: "us", label: "United States" },
  { value: "vn", label: "Vietnam" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
  { value: "other", label: "Other" }
];

export const CONTACT_INFO: ContactInfo[] = [
  {
    type: 'location',
    title: 'Location',
    content: [
      'Calento Headquarters',
      '123 Tech Street',
      'San Francisco, CA 94105',
      'Monday-Sunday | 08:00 - 22:00',
      '(local time)'
    ]
  },
  {
    type: 'social',
    title: 'Social Media',
    content: [
      'Twitter',
      'LinkedIn', 
      'Facebook',
      'Instagram'
    ]
  },
  {
    type: 'email',
    title: 'Email',
    content: [
      APP_CONFIG.support.email || 'hello@calento.space'
    ]
  },
  {
    type: 'contact',
    title: 'Contact',
    content: [
      '+1 (555) 123-4567'
    ]
  }
];
