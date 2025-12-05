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

export interface SelectOption {
  value: string;
  label: string;
}

export interface InquiryType {
  value: string;
  label: string;
}

export interface ContactInfo {
  type: 'location' | 'social' | 'email' | 'contact';
  title: string;
  content: string[];
}

export interface CreateContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
}

export interface ContactResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
  status: string;
  created_at: string;
}
