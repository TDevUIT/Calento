-- ============================================================================
-- MODULE: 00_SETUP
-- Extensions, Custom Types (ENUMs), and Shared Functions
-- ============================================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- CUSTOM TYPES (ENUMs)
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('confirmed', 'cancelled', 'tentative');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_status AS ENUM ('pull', 'push');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_log_status AS ENUM ('success', 'failed', 'in_progress');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE provider_type AS ENUM ('google', 'outlook', 'apple');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('email', 'slack', 'zalo', 'push');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- SHARED FUNCTIONS
-- Generic updated_at trigger function (reused by all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- ============================================================================
-- MODULE: 01_AUTH
-- Users, Credentials, and Settings
-- ============================================================================

-- Users table - stores user account information
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    -- Password reset fields
    reset_token_identifier VARCHAR(255) DEFAULT NULL,
    reset_token_secret VARCHAR(255) DEFAULT NULL,
    reset_token_expires_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE users IS 'Stores user account information and authentication data';
COMMENT ON COLUMN users.full_name IS 'Full display name (auto-generated from first_name + last_name)';
COMMENT ON COLUMN users.reset_token_identifier IS 'Public identifier for password reset token (safe to send in URLs)';
COMMENT ON COLUMN users.reset_token_secret IS 'Secret hash for password reset token verification';
COMMENT ON COLUMN users.reset_token_expires_at IS 'Expiration timestamp for password reset token';

-- User credentials table - stores OAuth tokens and credentials
CREATE TABLE IF NOT EXISTS user_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider provider_type DEFAULT 'google' NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP,
    scope TEXT,
    sync_enabled BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE user_credentials IS 'Stores OAuth tokens and sync settings for calendar providers';
COMMENT ON COLUMN user_credentials.sync_enabled IS 'Whether automatic sync with Google Calendar is enabled';
COMMENT ON COLUMN user_credentials.last_sync_at IS 'Last successful sync timestamp';
COMMENT ON COLUMN user_credentials.is_active IS 'Whether the connection is currently active';

-- User settings table - stores per-user application/UI preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE user_settings IS 'Stores per-user application settings and preferences';
COMMENT ON COLUMN user_settings.settings IS 'User preferences stored as JSONB';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_reset_token_identifier ON users(reset_token_identifier);
CREATE INDEX IF NOT EXISTS idx_users_reset_token_expires_at ON users(reset_token_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users(full_name);

CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_provider ON user_credentials(provider);
CREATE INDEX IF NOT EXISTS idx_user_credentials_sync ON user_credentials(user_id, provider, sync_enabled, is_active);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_credentials_updated_at ON user_credentials;
CREATE TRIGGER trigger_user_credentials_updated_at 
    BEFORE UPDATE ON user_credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_settings_updated_at ON user_settings;
CREATE TRIGGER trigger_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();



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



-- ============================================================================
-- MODULE: 03_BOOKING
-- Booking Links and Bookings
-- ============================================================================

-- Booking links table - stores public booking pages
CREATE TABLE IF NOT EXISTS booking_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    location_link TEXT,
    duration_minutes INTEGER NOT NULL,
    buffer_time_minutes INTEGER DEFAULT 0,
    max_bookings_per_day INTEGER,
    advance_notice_hours INTEGER DEFAULT 24,
    booking_window_days INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    color VARCHAR(50),
    timezone VARCHAR(100) DEFAULT 'UTC',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT chk_buffer_non_negative CHECK (buffer_time_minutes >= 0),
    CONSTRAINT chk_advance_notice_non_negative CHECK (advance_notice_hours >= 0)
);

COMMENT ON TABLE booking_links IS 'Stores public booking page configurations';
COMMENT ON COLUMN booking_links.expires_at IS 'Optional expiration date for booking link. Link will be auto-disabled after this date.';

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

COMMENT ON TABLE bookings IS 'Stores booking appointments made through booking links';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_booking_links_user_id ON booking_links(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_links_slug ON booking_links(slug);
CREATE INDEX IF NOT EXISTS idx_booking_links_is_active ON booking_links(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_booking_links_expires_at ON booking_links(expires_at) WHERE expires_at IS NOT NULL AND is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_bookings_booking_link_id ON bookings(booking_link_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booker_email ON bookings(booker_email);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_token ON bookings(confirmation_token);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_link_time ON bookings(booking_link_id, start_time);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_booking_links_timestamp ON booking_links;
CREATE TRIGGER trigger_update_booking_links_timestamp
    BEFORE UPDATE ON booking_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_bookings_timestamp ON bookings;
CREATE TRIGGER trigger_update_bookings_timestamp
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 04_TASKS
-- Tasks and Priorities
-- ============================================================================

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    project_id UUID,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tasks IS 'User tasks and to-do items';
COMMENT ON COLUMN tasks.status IS 'Task status: todo, in_progress, completed, cancelled';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, medium, high, critical';
COMMENT ON COLUMN tasks.recurrence_rule IS 'Recurrence rule in RRULE format';
COMMENT ON COLUMN tasks.estimated_duration IS 'Estimated duration in minutes';
COMMENT ON COLUMN tasks.actual_duration IS 'Actual duration in minutes';
COMMENT ON COLUMN tasks.is_deleted IS 'Soft deletion flag';

-- User priorities table - for priority board
CREATE TABLE IF NOT EXISTS user_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'task', 'booking_link', 'habit', 'smart_meeting'
    priority VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low', 'disabled'
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id, item_type)
);

COMMENT ON TABLE user_priorities IS 'Stores user priority settings for various items (tasks, booking links, etc.)';
COMMENT ON COLUMN user_priorities.item_type IS 'Type of item: task, booking_link, habit, smart_meeting';
COMMENT ON COLUMN user_priorities.priority IS 'Priority level: critical, high, medium, low, disabled';
COMMENT ON COLUMN user_priorities.position IS 'Position/order within the same priority column';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority);

CREATE INDEX IF NOT EXISTS idx_user_priorities_user_id ON user_priorities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_priorities_priority ON user_priorities(priority);
CREATE INDEX IF NOT EXISTS idx_user_priorities_item_type ON user_priorities(item_type);
CREATE INDEX IF NOT EXISTS idx_user_priorities_user_priority ON user_priorities(user_id, priority);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_tasks_updated_at ON tasks;
CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_user_priorities_updated_at ON user_priorities;
CREATE TRIGGER trigger_update_user_priorities_updated_at
    BEFORE UPDATE ON user_priorities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 05_TEAMS
-- Teams, Members, Rituals, and Team Availability
-- ============================================================================

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    timezone VARCHAR(100) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE teams IS 'Stores team information for collaborative scheduling';

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'inactive'
    joined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

COMMENT ON TABLE team_members IS 'Stores team membership and roles';

-- Team rituals table - recurring team meetings
CREATE TABLE IF NOT EXISTS team_rituals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recurrence_rule VARCHAR(500),
    duration_minutes INTEGER DEFAULT 30,
    buffer_before INTEGER DEFAULT 0,
    buffer_after INTEGER DEFAULT 0,
    rotation_type VARCHAR(50) DEFAULT 'none', -- 'none', 'round_robin', 'random'
    rotation_order JSONB,
    current_rotation_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE team_rituals IS 'Stores recurring team meeting templates';

-- Team availability table
CREATE TABLE IF NOT EXISTS team_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_slots JSONB,
    timezone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id, date)
);

COMMENT ON TABLE team_availability IS 'Stores team member availability for scheduling';

-- Team meeting rotations table
CREATE TABLE IF NOT EXISTS team_meeting_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ritual_id UUID NOT NULL REFERENCES team_rituals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE team_meeting_rotations IS 'Tracks meeting rotation assignments';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_active ON teams(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_rituals_team ON team_rituals(team_id);
CREATE INDEX IF NOT EXISTS idx_team_rituals_active ON team_rituals(is_active);
CREATE INDEX IF NOT EXISTS idx_team_availability_team_date ON team_availability(team_id, date);
CREATE INDEX IF NOT EXISTS idx_team_availability_user ON team_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_team_meeting_rotations_ritual ON team_meeting_rotations(ritual_id);

-- TRIGGERS
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_rituals_updated_at ON team_rituals;
CREATE TRIGGER update_team_rituals_updated_at
    BEFORE UPDATE ON team_rituals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_availability_updated_at ON team_availability;
CREATE TRIGGER update_team_availability_updated_at
    BEFORE UPDATE ON team_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 06_BLOG
-- Blog Categories, Posts, Tags, Comments, and Views
-- ============================================================================

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_tags IS 'Tags for labeling blog posts';

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    alt_text VARCHAR(255),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    reading_time INTEGER, -- Estimated reading time in minutes
    seo_title VARCHAR(60),
    seo_description VARCHAR(160),
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_posts IS 'Main blog posts table with SEO and content management features';
COMMENT ON COLUMN blog_posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN blog_posts.seo_title IS 'SEO optimized title (max 60 chars)';
COMMENT ON COLUMN blog_posts.seo_description IS 'Meta description for SEO (max 160 chars)';

-- Blog post tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, tag_id)
);

COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between posts and tags';

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
    parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_comments IS 'User comments on blog posts with moderation support';
COMMENT ON COLUMN blog_comments.parent_id IS 'Reference to parent comment for nested replies';

-- Blog views table for analytics
CREATE TABLE IF NOT EXISTS blog_views (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_views IS 'Analytics table for tracking blog post views';
COMMENT ON COLUMN blog_views.ip_address IS 'Visitor IP address for analytics (anonymized in production)';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_is_active ON blog_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON blog_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_tags_usage_count ON blog_tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views_post_id ON blog_views(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_views_viewed_at ON blog_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_views_ip_address ON blog_views(ip_address);

-- TRIGGERS
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at 
    BEFORE UPDATE ON blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Blog tag usage counter
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tag_usage_count_trigger ON blog_post_tags;
CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON blog_post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- SEED DATA
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Product Updates', 'product-updates', 'Latest features and improvements to Calento', '#10b981', 1),
('Best Practices', 'best-practices', 'Tips and best practices for calendar management', '#3b82f6', 2),
('AI & Technology', 'ai-technology', 'Insights into AI-powered scheduling and productivity', '#8b5cf6', 3),
('Company News', 'company-news', 'Company announcements and milestones', '#f59e0b', 4),
('Integrations', 'integrations', 'Guides for Google Calendar, Slack, and other integrations', '#06b6d4', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_tags (name, slug) VALUES
('ai-scheduling', 'ai-scheduling'),
('google-calendar', 'google-calendar'),
('productivity', 'productivity'),
('time-management', 'time-management'),
('calendar-sync', 'calendar-sync'),
('slack-integration', 'slack-integration'),
('automation', 'automation'),
('meeting-management', 'meeting-management'),
('work-life-balance', 'work-life-balance'),
('remote-work', 'remote-work')
ON CONFLICT (slug) DO NOTHING;



-- ============================================================================
-- MODULE: 07_SYNC
-- Sync Logs, Sync Errors, Webhooks, Integrations
-- ============================================================================

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sync_type sync_status NOT NULL,
    status sync_log_status NOT NULL,
    error_message TEXT,
    synced_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE sync_logs IS 'Tracks synchronization operations';

-- Sync log (detailed) table
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'disconnected'
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sync_log IS 'Tracks sync operations history and status';

-- Sync errors table
CREATE TABLE IF NOT EXISTS sync_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('event_sync', 'webhook_delivery', 'calendar_connection', 'token_refresh')),
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE sync_errors IS 'Stores sync errors with retry logic for automatic error recovery';
COMMENT ON COLUMN sync_errors.error_type IS 'Type of sync error: event_sync, webhook_delivery, calendar_connection, token_refresh';
COMMENT ON COLUMN sync_errors.retry_count IS 'Current number of retry attempts';
COMMENT ON COLUMN sync_errors.max_retries IS 'Maximum number of retry attempts allowed';
COMMENT ON COLUMN sync_errors.next_retry_at IS 'Timestamp when next retry should be attempted';
COMMENT ON COLUMN sync_errors.metadata IS 'Additional error context and retry parameters in JSON format';

-- Webhook channels table
CREATE TABLE IF NOT EXISTS webhook_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    calendar_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL UNIQUE,
    resource_id VARCHAR(255) NOT NULL,
    resource_uri TEXT NOT NULL,
    token VARCHAR(500),
    expiration TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE webhook_channels IS 'Stores Google Calendar webhook watch channels for receiving push notifications about calendar changes';
COMMENT ON COLUMN webhook_channels.channel_id IS 'Unique channel ID generated when creating the watch';
COMMENT ON COLUMN webhook_channels.resource_id IS 'Resource ID returned by Google Calendar API';
COMMENT ON COLUMN webhook_channels.resource_uri IS 'URI of the resource being watched';
COMMENT ON COLUMN webhook_channels.token IS 'Optional verification token for webhook requests';
COMMENT ON COLUMN webhook_channels.expiration IS 'When the watch channel expires (max 7 days from creation)';

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider provider_type NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    workspace_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE integrations IS 'Stores third-party service integrations (Slack, etc.)';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_sync_log_user_provider ON sync_log(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);

CREATE INDEX IF NOT EXISTS idx_sync_errors_user_id ON sync_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_errors_error_type ON sync_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_sync_errors_resolved ON sync_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_sync_errors_next_retry ON sync_errors(next_retry_at) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_sync_errors_created_at ON sync_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_sync_errors_retry_lookup ON sync_errors(resolved, retry_count, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_sync_errors_user_resolved_created ON sync_errors(user_id, resolved, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_id ON webhook_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_channel_id ON webhook_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_active ON webhook_channels(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_expiration ON webhook_channels(expiration) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_calendar ON webhook_channels(user_id, calendar_id) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_sync_logs_updated_at ON sync_logs;
CREATE TRIGGER trigger_sync_logs_updated_at 
    BEFORE UPDATE ON sync_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_sync_errors_updated_at ON sync_errors;
CREATE TRIGGER trigger_sync_errors_updated_at
    BEFORE UPDATE ON sync_errors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_webhook_channels_updated_at ON webhook_channels;
CREATE TRIGGER trigger_update_webhook_channels_updated_at
    BEFORE UPDATE ON webhook_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_integrations_updated_at ON integrations;
CREATE TRIGGER trigger_integrations_updated_at 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();



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



-- ============================================================================
-- MODULE: 09_AI
-- AI Conversations and Actions
-- ============================================================================

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ai_conversations IS 'Stores AI conversation history for each user';
COMMENT ON COLUMN ai_conversations.messages IS 'Array of conversation messages in chronological order';
COMMENT ON COLUMN ai_conversations.context IS 'Additional context like timezone, preferences, etc.';

-- AI actions table
CREATE TABLE IF NOT EXISTS ai_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    result JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ai_actions IS 'Tracks AI function calls and their execution results';
COMMENT ON COLUMN ai_actions.status IS 'Status: pending, completed, or failed';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_actions_conversation_id ON ai_actions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_status ON ai_actions(status);
CREATE INDEX IF NOT EXISTS idx_ai_actions_created_at ON ai_actions(created_at DESC);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER trigger_ai_conversations_updated_at
    BEFORE UPDATE ON ai_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_ai_actions_updated_at ON ai_actions;
CREATE TRIGGER trigger_ai_actions_updated_at
    BEFORE UPDATE ON ai_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 10_CONTACTS
-- Contacts (Landing Page)
-- ============================================================================

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    country VARCHAR(100),
    inquiry_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    subscribe_offers BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE contacts IS 'Stores contact form submissions from landing page';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_inquiry_type ON contacts(inquiry_type);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_contacts_updated_at ON contacts;
CREATE TRIGGER trigger_update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 11_CONTEXT
-- User Context Summary (Vector Store)
-- ============================================================================

-- User Context Summary table
CREATE TABLE IF NOT EXISTS user_context_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context JSONB NOT NULL DEFAULT '{}',
    embedding vector(1536), -- Vector embedding for semantic search (OpenAI default)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_context_summary IS 'Stores context information for each user with vector embeddings';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_context_summary_user_id ON user_context_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_context_summary_created_at ON user_context_summary(created_at DESC);

-- HNSW Index for fast approximate nearest neighbor search
-- Note: 'vector_cosine_ops' is typical for embeddings. 
-- Adjust 'm' and 'ef_construction' if needed for performance tuning.
CREATE INDEX IF NOT EXISTS idx_user_context_summary_embedding 
    ON user_context_summary USING hnsw (embedding vector_cosine_ops);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_user_context_summary_updated_at ON user_context_summary;
CREATE TRIGGER trigger_update_user_context_summary_updated_at
    BEFORE UPDATE ON user_context_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- ============================================================================
-- MODULE: 12_HYBRID_SEARCH
-- Hybrid Search Support (tsvector)
-- ============================================================================

-- Add text_search_vector column
ALTER TABLE user_context_summary 
ADD COLUMN IF NOT EXISTS text_search_vector tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_user_context_summary_text_search 
ON user_context_summary USING GIN(text_search_vector);

-- Function to automatically update tsvector from context
CREATE OR REPLACE FUNCTION user_context_summary_tsvector_trigger() RETURNS trigger AS $$
DECLARE
    text_content TEXT;
BEGIN
    -- Try to extract text content from likely fields
    text_content := NEW.context->>'text' || ' ' || 
                    COALESCE(NEW.context->>'content', '') || ' ' || 
                    COALESCE(NEW.context->>'summary', '') || ' ' || 
                    COALESCE(NEW.context->>'message', '') || ' ' ||
                    COALESCE(NEW.context->>'_text_content', '');
    
    -- If empty, just stringify the whole thing (fallback)
    IF length(trim(text_content)) = 0 THEN
        text_content := NEW.context::text;
    END IF;

    NEW.text_search_vector := to_tsvector('english', text_content);
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger to update tsvector on insert or update
DROP TRIGGER IF EXISTS tsvectorupdate ON user_context_summary;
CREATE TRIGGER tsvectorupdate 
BEFORE INSERT OR UPDATE ON user_context_summary
FOR EACH ROW EXECUTE FUNCTION user_context_summary_tsvector_trigger();



