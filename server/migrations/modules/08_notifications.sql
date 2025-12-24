-- ============================================================================
-- MODULE: 08_NOTIFICATIONS
-- Notifications, Meeting Notes, Email Logs
-- ============================================================================

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    channel notification_channel NOT NULL,
    remind_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE notifications IS 'Stores notification settings and logs';

-- Meeting notes table
CREATE TABLE IF NOT EXISTS meeting_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    content TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE meeting_notes IS 'Stores AI-generated meeting notes and summaries';

-- Email logs table
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_email_logs_status CHECK (status IN ('pending', 'sent', 'failed', 'queued'))
);

COMMENT ON TABLE email_logs IS 'Stores email sending history and delivery status';
COMMENT ON COLUMN email_logs."to" IS 'Recipient email address';
COMMENT ON COLUMN email_logs.template IS 'Email template used (if any)';
COMMENT ON COLUMN email_logs.status IS 'Email delivery status: pending, sent, failed, queued';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_notifications_event_id ON notifications(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_channel ON notifications(channel);
CREATE INDEX IF NOT EXISTS idx_notifications_remind_at ON notifications(remind_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_sent ON notifications(is_sent);

CREATE INDEX IF NOT EXISTS idx_meeting_notes_event_id ON meeting_notes(event_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notes_created_at ON meeting_notes(created_at);

CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_status ON email_logs(user_id, status);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_notifications_updated_at ON notifications;
CREATE TRIGGER trigger_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_meeting_notes_updated_at ON meeting_notes;
CREATE TRIGGER trigger_meeting_notes_updated_at 
    BEFORE UPDATE ON meeting_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_email_logs_updated_at ON email_logs;
CREATE TRIGGER trigger_update_email_logs_updated_at
    BEFORE UPDATE ON email_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
