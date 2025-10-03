-- UP Migration: Create initial database schema v1.0.0 26/9/2025
-- ==============================================


-- =====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CUSTOM TYPES 
-- =============
CREATE TYPE event_status AS ENUM ('confirmed', 'cancelled', 'tentative');
CREATE TYPE sync_status AS ENUM ('pull', 'push');
CREATE TYPE sync_log_status AS ENUM ('success', 'failed', 'in_progress');
CREATE TYPE provider_type AS ENUM ('google', 'outlook', 'apple');
CREATE TYPE notification_channel AS ENUM ('email', 'slack', 'zalo', 'push');

-- 1. CREATE TABLES
-- ================

-- Users table - stores user account information
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User credentials table - stores OAuth tokens and credentials
CREATE TABLE user_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    provider provider_type DEFAULT 'google' NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Calendars table - stores calendar information from Google Calendar
CREATE TABLE calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    google_calendar_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    timezone VARCHAR(100),
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Events table - stores calendar events
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID NOT NULL,
    google_event_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    description TEXT,
    location VARCHAR(500),
    timezone VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_all_day BOOLEAN DEFAULT false NOT NULL,
    is_recurring BOOLEAN DEFAULT false NOT NULL,
    recurrence TEXT,
    status event_status DEFAULT 'confirmed' NOT NULL,
    attendees JSONB,
    reminders JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Sync log table - tracks synchronization operations
CREATE TABLE sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    sync_type sync_status NOT NULL,
    status sync_log_status NOT NULL,
    error_message TEXT,
    synced_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Availabilities table - stores user availability schedules
CREATE TABLE availabilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_availabilities_time_order CHECK (start_time < end_time)
);

-- Bookings table - stores meeting bookings
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- user being booked
    event_id UUID NOT NULL,
    booked_by UUID NOT NULL, -- user who made the booking
    booking_start_time TIMESTAMP NOT NULL,
    booking_end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_bookings_time_order CHECK (booking_start_time < booking_end_time)
);

-- Integrations table - stores third-party service integrations
CREATE TABLE integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    provider provider_type NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    workspace_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Notifications table - stores notification settings and logs
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    channel notification_channel NOT NULL,
    remind_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Meeting notes table - stores AI-generated meeting notes
CREATE TABLE meeting_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    content TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
-- 2. ADD FOREIGN KEY CONSTRAINTS
-- ==============================

ALTER TABLE user_credentials
    ADD CONSTRAINT fk_user_credentials_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE calendars
    ADD CONSTRAINT fk_calendars_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE events
    ADD CONSTRAINT fk_events_calendar_id 
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE;

ALTER TABLE sync_logs
    ADD CONSTRAINT fk_sync_logs_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign keys for new tables
ALTER TABLE availabilities
    ADD CONSTRAINT fk_availabilities_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_event_id 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_booked_by 
    FOREIGN KEY (booked_by) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE integrations
    ADD CONSTRAINT fk_integrations_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_event_id 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE meeting_notes
    ADD CONSTRAINT fk_meeting_notes_event_id 
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- 3. ADD CHECK CONSTRAINTS
-- ========================

-- No additional check constraints needed for ENUM types

ALTER TABLE events
    ADD CONSTRAINT chk_events_time_order 
    CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time);

-- 4. CREATE INDEXES FOR PERFORMANCE
-- =================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User credentials indexes
CREATE INDEX idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX idx_user_credentials_provider ON user_credentials(provider);

-- Calendars indexes
CREATE INDEX idx_calendars_user_id ON calendars(user_id);
CREATE INDEX idx_calendars_google_id ON calendars(google_calendar_id);
CREATE INDEX idx_calendars_primary ON calendars(is_primary);

-- Events indexes
CREATE INDEX idx_events_calendar_id ON events(calendar_id);
CREATE INDEX idx_events_google_id ON events(google_event_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_time_range ON events(start_time, end_time);

-- Sync logs indexes
CREATE INDEX idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);

-- Availabilities indexes
CREATE INDEX idx_availabilities_user_id ON availabilities(user_id);
CREATE INDEX idx_availabilities_day_of_week ON availabilities(day_of_week);
CREATE INDEX idx_availabilities_time_range ON availabilities(start_time, end_time);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_booked_by ON bookings(booked_by);
CREATE INDEX idx_bookings_time_range ON bookings(booking_start_time, booking_end_time);
CREATE INDEX idx_bookings_start_time ON bookings(booking_start_time);

-- Integrations indexes
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
CREATE INDEX idx_integrations_provider ON integrations(provider);

-- Notifications indexes
CREATE INDEX idx_notifications_event_id ON notifications(event_id);
CREATE INDEX idx_notifications_channel ON notifications(channel);
CREATE INDEX idx_notifications_remind_at ON notifications(remind_at);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);

-- Meeting notes indexes
CREATE INDEX idx_meeting_notes_event_id ON meeting_notes(event_id);
CREATE INDEX idx_meeting_notes_created_at ON meeting_notes(created_at);

-- 5. CREATE TRIGGERS AND FUNCTIONS
-- ================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_credentials_updated_at 
    BEFORE UPDATE ON user_credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_calendars_updated_at 
    BEFORE UPDATE ON calendars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sync_logs_updated_at 
    BEFORE UPDATE ON sync_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for new tables
CREATE TRIGGER trigger_availabilities_updated_at 
    BEFORE UPDATE ON availabilities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_integrations_updated_at 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_meeting_notes_updated_at 
    BEFORE UPDATE ON meeting_notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- DOWN Migration: Drop all created objects
-- ========================================

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_meeting_notes_updated_at ON meeting_notes;
DROP TRIGGER IF EXISTS trigger_notifications_updated_at ON notifications;
DROP TRIGGER IF EXISTS trigger_integrations_updated_at ON integrations;
DROP TRIGGER IF EXISTS trigger_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS trigger_availabilities_updated_at ON availabilities;
DROP TRIGGER IF EXISTS trigger_sync_logs_updated_at ON sync_logs;
DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
DROP TRIGGER IF EXISTS trigger_calendars_updated_at ON calendars;
DROP TRIGGER IF EXISTS trigger_user_credentials_updated_at ON user_credentials;
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes (foreign key indexes are dropped automatically with tables)
DROP INDEX IF EXISTS idx_meeting_notes_created_at;
DROP INDEX IF EXISTS idx_meeting_notes_event_id;
DROP INDEX IF EXISTS idx_notifications_is_sent;
DROP INDEX IF EXISTS idx_notifications_remind_at;
DROP INDEX IF EXISTS idx_notifications_channel;
DROP INDEX IF EXISTS idx_notifications_event_id;
DROP INDEX IF EXISTS idx_integrations_provider;
DROP INDEX IF EXISTS idx_integrations_user_id;
DROP INDEX IF EXISTS idx_bookings_start_time;
DROP INDEX IF EXISTS idx_bookings_time_range;
DROP INDEX IF EXISTS idx_bookings_booked_by;
DROP INDEX IF EXISTS idx_bookings_event_id;
DROP INDEX IF EXISTS idx_bookings_user_id;
DROP INDEX IF EXISTS idx_availabilities_time_range;
DROP INDEX IF EXISTS idx_availabilities_day_of_week;
DROP INDEX IF EXISTS idx_availabilities_user_id;
DROP INDEX IF EXISTS idx_sync_logs_created_at;
DROP INDEX IF EXISTS idx_sync_logs_status;
DROP INDEX IF EXISTS idx_sync_logs_user_id;
DROP INDEX IF EXISTS idx_events_time_range;
DROP INDEX IF EXISTS idx_events_status;
DROP INDEX IF EXISTS idx_events_end_time;
DROP INDEX IF EXISTS idx_events_start_time;
DROP INDEX IF EXISTS idx_events_google_id;
DROP INDEX IF EXISTS idx_events_calendar_id;
DROP INDEX IF EXISTS idx_calendars_primary;
DROP INDEX IF EXISTS idx_calendars_google_id;
DROP INDEX IF EXISTS idx_calendars_user_id;
DROP INDEX IF EXISTS idx_user_credentials_provider;
DROP INDEX IF EXISTS idx_user_credentials_user_id;
DROP INDEX IF EXISTS idx_users_created_at;
DROP INDEX IF EXISTS idx_users_active;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables (in reverse order due to foreign key dependencies)
DROP TABLE IF EXISTS meeting_notes;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS integrations;
DROP TABLE IF EXISTS availabilities;
DROP TABLE IF EXISTS sync_logs;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS calendars;
DROP TABLE IF EXISTS user_credentials;
DROP TABLE IF EXISTS users;

-- Drop custom types
DROP TYPE IF EXISTS notification_channel;
DROP TYPE IF EXISTS provider_type;
DROP TYPE IF EXISTS sync_log_status;
DROP TYPE IF EXISTS sync_status;
DROP TYPE IF EXISTS event_status;

-- Drop UUID extension
DROP EXTENSION IF EXISTS "uuid-ossp";
