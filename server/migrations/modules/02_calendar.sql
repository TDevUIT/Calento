-- ============================================================================
-- MODULE: 02_CALENDAR
-- Calendars, Events, Attendees, and Availability
-- ============================================================================

-- Calendars table - stores calendar information
CREATE TABLE IF NOT EXISTS calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    google_calendar_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    timezone VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE calendars IS 'Stores calendar metadata synced from Google Calendar';

-- Events table - stores calendar events
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID NOT NULL REFERENCES calendars(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255), -- Nullable for local events
    title VARCHAR(500),
    description TEXT,
    location VARCHAR(500),
    timezone VARCHAR(100),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_all_day BOOLEAN DEFAULT FALSE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE NOT NULL,
    recurrence_rule TEXT, -- RRULE format (RFC 5545)
    status event_status DEFAULT 'confirmed' NOT NULL,
    color VARCHAR(50) DEFAULT 'blue',
    attendees JSONB, -- Legacy: use event_attendees table instead
    reminders JSONB,
    synced_at TIMESTAMP,
    -- Organizer information
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organizer_email VARCHAR(255),
    organizer_name VARCHAR(255),
    -- Video conference data
    conference_data JSONB,
    -- Privacy and response
    visibility VARCHAR(50) DEFAULT 'default' CHECK (visibility IN ('default', 'public', 'private', 'confidential')),
    response_status VARCHAR(50) DEFAULT 'accepted' CHECK (response_status IN ('accepted', 'declined', 'tentative', 'needsAction')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_events_time_order CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time)
);

COMMENT ON TABLE events IS 'Stores calendar events (both synced and local)';
COMMENT ON COLUMN events.google_event_id IS 'Google Calendar event ID (NULL for local events)';
COMMENT ON COLUMN events.recurrence_rule IS 'RRULE format for recurring events (RFC 5545 compliant)';
COMMENT ON COLUMN events.color IS 'Event color for UI display (e.g., blue, green, pink, purple, orange, red)';
COMMENT ON COLUMN events.synced_at IS 'Last time this event was synced with Google Calendar';
COMMENT ON COLUMN events.organizer_id IS 'Internal user ID who created/organized the event';
COMMENT ON COLUMN events.organizer_email IS 'Email of the organizer (for synced external events)';
COMMENT ON COLUMN events.organizer_name IS 'Display name of the organizer';
COMMENT ON COLUMN events.conference_data IS 'Video conference information (Google Meet, Zoom, MS Teams, etc.)';
COMMENT ON COLUMN events.visibility IS 'Event visibility level';
COMMENT ON COLUMN events.response_status IS 'User response to event invitation';

-- Event attendees table - stores attendees with invitation tracking
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    response_status VARCHAR(50) DEFAULT 'needsAction' CHECK (
        response_status IN ('accepted', 'declined', 'tentative', 'needsAction')
    ),
    is_optional BOOLEAN DEFAULT FALSE,
    is_organizer BOOLEAN DEFAULT FALSE,
    comment TEXT,
    -- Invitation tracking
    invitation_token VARCHAR(255) UNIQUE,
    invitation_sent_at TIMESTAMPTZ,
    invitation_responded_at TIMESTAMPTZ,
    invitation_remind_count INTEGER DEFAULT 0,
    -- Permissions
    can_modify_event BOOLEAN DEFAULT FALSE,
    can_invite_others BOOLEAN DEFAULT FALSE,
    can_see_guest_list BOOLEAN DEFAULT TRUE,
    -- Google sync
    google_calendar_synced BOOLEAN DEFAULT FALSE,
    google_event_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, email)
);

COMMENT ON TABLE event_attendees IS 'Stores event attendees with invitation tracking support';
COMMENT ON COLUMN event_attendees.invitation_token IS 'Secure token for accepting/declining invitation via email link';
COMMENT ON COLUMN event_attendees.response_status IS 'RSVP status: accepted, declined, tentative, or needsAction';
COMMENT ON COLUMN event_attendees.invitation_remind_count IS 'Number of times invitation reminder has been sent';
COMMENT ON COLUMN event_attendees.can_modify_event IS 'Guest permission to modify event details';
COMMENT ON COLUMN event_attendees.can_invite_others IS 'Guest permission to invite other attendees';
COMMENT ON COLUMN event_attendees.can_see_guest_list IS 'Guest permission to see other attendees';
COMMENT ON COLUMN event_attendees.google_calendar_synced IS 'Whether this attendee was synced to Google Calendar';

-- Availabilities table - stores user availability schedules
CREATE TABLE IF NOT EXISTS availabilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_availabilities_time_order CHECK (start_time < end_time)
);

COMMENT ON TABLE availabilities IS 'Stores user availability schedules for booking';
COMMENT ON COLUMN availabilities.is_active IS 'Whether this availability rule is currently active';
COMMENT ON COLUMN availabilities.timezone IS 'Timezone for the availability rule (e.g., UTC, America/New_York)';

-- Event conflicts table
CREATE TABLE IF NOT EXISTS event_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    calento_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255),
    conflict_reason VARCHAR(100) NOT NULL, -- 'duplicate', 'time_overlap', 'missing_mapping'
    resolution VARCHAR(100), -- 'prefer_calento', 'prefer_google', 'keep_both', 'manual'
    resolved BOOLEAN DEFAULT FALSE,
    calento_event_data JSONB,
    google_event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

COMMENT ON TABLE event_conflicts IS 'Stores conflicts detected during calendar sync';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_calendars_google_id ON calendars(google_calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendars_primary ON calendars(is_primary);

CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_google_id ON events(google_event_id) WHERE google_event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_end_time ON events(end_time);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_time_range ON events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_events_calendar_google ON events(calendar_id, google_event_id);
CREATE INDEX IF NOT EXISTS idx_events_color ON events(color);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_email ON events(organizer_email);
CREATE INDEX IF NOT EXISTS idx_events_conference_data ON events USING GIN (conference_data);
CREATE INDEX IF NOT EXISTS idx_events_recurrence_rule ON events(recurrence_rule) WHERE recurrence_rule IS NOT NULL AND recurrence_rule != '';

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_email ON event_attendees(email);
CREATE INDEX IF NOT EXISTS idx_event_attendees_response_status ON event_attendees(response_status);
CREATE INDEX IF NOT EXISTS idx_event_attendees_invitation_token ON event_attendees(invitation_token) WHERE invitation_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_event_attendees_pending_invitations ON event_attendees(event_id, response_status) WHERE response_status = 'needsAction';

CREATE INDEX IF NOT EXISTS idx_availabilities_user_id ON availabilities(user_id);
CREATE INDEX IF NOT EXISTS idx_availabilities_day_of_week ON availabilities(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availabilities_time_range ON availabilities(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_availabilities_is_active ON availabilities(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_availabilities_timezone ON availabilities(timezone);

CREATE INDEX IF NOT EXISTS idx_event_conflicts_user ON event_conflicts(user_id);
CREATE INDEX IF NOT EXISTS idx_event_conflicts_resolved ON event_conflicts(resolved);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_calendars_updated_at ON calendars;
CREATE TRIGGER trigger_calendars_updated_at 
    BEFORE UPDATE ON calendars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
CREATE TRIGGER trigger_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_event_attendees_updated_at ON event_attendees;
CREATE TRIGGER trigger_update_event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_availabilities_updated_at ON availabilities;
CREATE TRIGGER trigger_availabilities_updated_at 
    BEFORE UPDATE ON availabilities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
