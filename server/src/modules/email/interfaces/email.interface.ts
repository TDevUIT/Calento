export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  context?: Record<string, any>;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export interface EmailLog {
  id: string;
  user_id: string;
  to: string;
  subject: string;
  template?: string;
  status: EmailStatus;
  error_message?: string;
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  QUEUED = 'queued',
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  logId?: string;
}
