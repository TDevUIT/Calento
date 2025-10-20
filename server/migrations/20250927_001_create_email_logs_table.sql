-- Migration: Create email_logs table
-- Description: Stores email sending history and status for auditing and tracking
-- Created: 2025-09-27

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "to" VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  template VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_status ON email_logs(user_id, status);

-- Add check constraint for status
ALTER TABLE email_logs
ADD CONSTRAINT chk_email_logs_status 
CHECK (status IN ('pending', 'sent', 'failed', 'queued'));

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_email_logs_updated_at ON email_logs;

CREATE TRIGGER trigger_update_email_logs_updated_at
BEFORE UPDATE ON email_logs
FOR EACH ROW
EXECUTE FUNCTION update_email_logs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Stores email sending history and delivery status';
COMMENT ON COLUMN email_logs.id IS 'Unique identifier for email log';
COMMENT ON COLUMN email_logs.user_id IS 'Reference to user who triggered the email';
COMMENT ON COLUMN email_logs."to" IS 'Recipient email address';
COMMENT ON COLUMN email_logs.subject IS 'Email subject line';
COMMENT ON COLUMN email_logs.template IS 'Email template used (if any)';
COMMENT ON COLUMN email_logs.status IS 'Email delivery status: pending, sent, failed, queued';
COMMENT ON COLUMN email_logs.error_message IS 'Error message if email failed';
COMMENT ON COLUMN email_logs.sent_at IS 'Timestamp when email was successfully sent';
COMMENT ON COLUMN email_logs.created_at IS 'Timestamp when email was queued';
COMMENT ON COLUMN email_logs.updated_at IS 'Timestamp of last update';
