-- UP Migration: Create booking system tables
-- ==============================================

-- Booking links table - stores public booking pages
CREATE TABLE IF NOT EXISTS booking_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    buffer_time_minutes INTEGER DEFAULT 0,
    max_bookings_per_day INTEGER,
    advance_notice_hours INTEGER DEFAULT 24,
    booking_window_days INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true NOT NULL,
    color VARCHAR(50),
    timezone VARCHAR(100) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT chk_buffer_non_negative CHECK (buffer_time_minutes >= 0),
    CONSTRAINT chk_advance_notice_non_negative CHECK (advance_notice_hours >= 0)
);

-- Bookings table - stores actual bookings
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_link_id UUID NOT NULL REFERENCES booking_links(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    booker_name VARCHAR(255) NOT NULL,
    booker_email VARCHAR(255) NOT NULL,
    booker_phone VARCHAR(50),
    booker_notes TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by VARCHAR(50),
    confirmation_token VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_booking_time_order CHECK (start_time < end_time),
    CONSTRAINT chk_status_values CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Indexes for performance
CREATE INDEX idx_booking_links_user_id ON booking_links(user_id);
CREATE INDEX idx_booking_links_slug ON booking_links(slug);
CREATE INDEX idx_booking_links_is_active ON booking_links(is_active) WHERE is_active = true;

CREATE INDEX idx_bookings_booking_link_id ON bookings(booking_link_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booker_email ON bookings(booker_email);
CREATE INDEX idx_bookings_confirmation_token ON bookings(confirmation_token);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_link_time ON bookings(booking_link_id, start_time);

-- Auto-update updated_at trigger for booking_links
CREATE OR REPLACE FUNCTION update_booking_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_booking_links_timestamp
    BEFORE UPDATE ON booking_links
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_links_updated_at();

-- Auto-update updated_at trigger for bookings
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bookings_timestamp
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at();

-- DOWN Migration
-- DROP TRIGGER IF EXISTS trigger_update_bookings_timestamp ON bookings;
-- DROP TRIGGER IF EXISTS trigger_update_booking_links_timestamp ON booking_links;
-- DROP FUNCTION IF EXISTS update_bookings_updated_at();
-- DROP FUNCTION IF EXISTS update_booking_links_updated_at();
-- DROP INDEX IF EXISTS idx_bookings_link_time;
-- DROP INDEX IF EXISTS idx_bookings_user_status;
-- DROP INDEX IF EXISTS idx_bookings_confirmation_token;
-- DROP INDEX IF EXISTS idx_bookings_booker_email;
-- DROP INDEX IF EXISTS idx_bookings_status;
-- DROP INDEX IF EXISTS idx_bookings_start_time;
-- DROP INDEX IF EXISTS idx_bookings_event_id;
-- DROP INDEX IF EXISTS idx_bookings_user_id;
-- DROP INDEX IF EXISTS idx_bookings_booking_link_id;
-- DROP INDEX IF EXISTS idx_booking_links_is_active;
-- DROP INDEX IF EXISTS idx_booking_links_slug;
-- DROP INDEX IF EXISTS idx_booking_links_user_id;
-- DROP TABLE IF EXISTS bookings;
-- DROP TABLE IF EXISTS booking_links;
