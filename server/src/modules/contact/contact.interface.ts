export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  country?: string;
  inquiry_type: string;
  message: string;
  subscribe_offers: boolean;
  status: ContactStatus;
  created_at: Date;
  updated_at: Date;
}

export enum ContactStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum InquiryType {
  GENERAL = 'general',
  SALES = 'sales',
  SUPPORT = 'support',
  PARTNERSHIP = 'partnership',
  FEEDBACK = 'feedback',
  OTHER = 'other',
}
