// Contact Form Interfaces
export interface ContactFormData {
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  emailAddress: string;
  inquiryType: string;
  message: string;
  subscribeOffers: boolean;
}

// Select Option Interfaces
export interface SelectOption {
  value: string;
  label: string;
}

export interface InquiryType {
  value: string;
  label: string;
}

// Contact Information Interfaces
export interface ContactInfo {
  type: 'location' | 'social' | 'email' | 'contact';
  title: string;
  content: string[];
}
