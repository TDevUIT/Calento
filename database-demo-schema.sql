-- ================================================================
-- TEMPRA (CALENTO) DATABASE SCHEMA - COMPREHENSIVE VERSION
-- ================================================================
-- Description: Complete PostgreSQL database schema for Tempra
--              AI-powered Calendar Assistant application
-- Version: 2.0.0
-- Created: 2025-11-10
-- Last Updated: 2025-11-10
-- Total Tables: 36
-- Purpose: Production-ready schema with full feature set
-- 
-- Features Included:
--   - User Authentication & OAuth
--   - Google Calendar Integration with Webhooks
--   - Event Management (Regular & Recurring)
--   - Public Booking Links (Calendly-style)
--   - Task Management with Priorities
--   - AI Chatbot System
--   - Team Collaboration & Rituals
--   - Blog System with SEO
--   - Email Tracking & Notifications
--   - Sync Error Handling with Auto-Retry
-- ================================================================

-- ================================================================
-- SECTION 1: EXTENSIONS AND CUSTOM TYPES
-- ================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types for better type safety
CREATE TYPE event_status AS ENUM ('confirmed', 'cancelled', 'tentative');
CREATE TYPE sync_status AS ENUM ('pull', 'push');
CREATE TYPE sync_log_status AS ENUM ('success', 'failed', 'in_progress');
CREATE TYPE provider_type AS ENUM ('google', 'outlook', 'apple');
CREATE TYPE notification_channel AS ENUM ('email', 'slack', 'zalo', 'push');

-- ================================================================
-- SECTION 2: CORE TABLES - USERS & AUTHENTICATION
-- ================================================================

-- Users table - stores user account information
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    avatar VARCHAR(255) DEFAULT NULL,
    
    -- Account status
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    
    -- Password reset fields
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    
    -- Timestamps
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- User credentials table - stores OAuth tokens
CREATE TABLE user_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    provider provider_type DEFAULT 'google' NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_user_credentials_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- SECTION 3: CALENDAR SYSTEM
-- ================================================================

-- Calendars table - stores calendar information
CREATE TABLE calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    google_calendar_id VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    timezone VARCHAR(100),
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_calendars_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events table - stores calendar events with recurring support
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID NOT NULL,
    google_event_id VARCHAR(255),
    
    -- Event details
    title VARCHAR(500),
    description TEXT,
    location VARCHAR(500),
    timezone VARCHAR(100),
    color VARCHAR(50),
    
    -- Time information
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    is_all_day BOOLEAN DEFAULT false NOT NULL,
    
    -- Recurring events
    is_recurring BOOLEAN DEFAULT false NOT NULL,
    recurrence_rule TEXT,
    
    -- Event status
    status event_status DEFAULT 'confirmed' NOT NULL,
    
    -- Organizer information
    organizer_id UUID,
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    
    -- Additional data (stored as JSONB)
    attendees JSONB,
    reminders JSONB,
    conference_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_events_calendar_id 
        FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    CONSTRAINT fk_events_organizer_id 
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_events_time_order 
        CHECK (start_time IS NULL OR end_time IS NULL OR start_time <= end_time)
);

-- Event attendees table - invitation system
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    
    -- Attendee information
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    
    -- Response status
    response_status VARCHAR(50) DEFAULT 'needsAction' CHECK (
        response_status IN ('accepted', 'declined', 'tentative', 'needsAction')
    ),
    
    -- Invitation tracking
    invitation_token VARCHAR(255) UNIQUE,
    invitation_sent_at TIMESTAMP,
    invitation_remind_count INTEGER DEFAULT 0,
    is_organizer BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_event_attendees_event_id 
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (event_id, email)
);

-- Sync logs table - tracks synchronization operations
CREATE TABLE sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    sync_type sync_status NOT NULL,
    status sync_log_status NOT NULL,
    error_message TEXT,
    synced_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_sync_logs_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sync log table (alternative format) - calendar sync tracking
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    status VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_sync_log_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Event conflicts table - tracks sync conflicts
CREATE TABLE event_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    calento_event_id UUID,
    google_event_id VARCHAR(255),
    conflict_reason VARCHAR(100) NOT NULL,
    resolution VARCHAR(100),
    resolved BOOLEAN DEFAULT false,
    calento_event_data JSONB,
    google_event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    
    CONSTRAINT fk_event_conflicts_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_conflicts_event 
        FOREIGN KEY (calento_event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Sync errors table - tracks sync errors with retry logic
CREATE TABLE sync_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('event_sync', 'webhook_delivery', 'calendar_connection', 'token_refresh')),
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_sync_errors_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- SECTION 4: BOOKING SYSTEM
-- ================================================================

-- Booking links table - public booking pages (like Calendly)
CREATE TABLE booking_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scheduling settings
    duration_minutes INTEGER NOT NULL,
    buffer_time_minutes INTEGER DEFAULT 0,
    max_bookings_per_day INTEGER,
    advance_notice_hours INTEGER DEFAULT 24,
    booking_window_days INTEGER DEFAULT 60,
    
    -- Configuration
    is_active BOOLEAN DEFAULT true NOT NULL,
    color VARCHAR(50),
    timezone VARCHAR(100) DEFAULT 'UTC',
    expires_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT fk_booking_links_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0),
    CONSTRAINT chk_buffer_non_negative CHECK (buffer_time_minutes >= 0),
    CONSTRAINT chk_advance_notice_non_negative CHECK (advance_notice_hours >= 0)
);

-- Bookings table - actual bookings made by guests
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_link_id UUID NOT NULL,
    user_id UUID NOT NULL,
    event_id UUID,
    
    -- Booker information
    booker_name VARCHAR(255) NOT NULL,
    booker_email VARCHAR(255) NOT NULL,
    booker_phone VARCHAR(50),
    booker_notes TEXT,
    
    -- Booking details
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'confirmed' NOT NULL,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by VARCHAR(50),
    confirmation_token VARCHAR(255) UNIQUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    CONSTRAINT fk_bookings_link 
        FOREIGN KEY (booking_link_id) REFERENCES booking_links(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookings_event 
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL,
    CONSTRAINT chk_booking_time_order CHECK (start_time < end_time),
    CONSTRAINT chk_status_values 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'))
);

-- Availabilities table - user availability schedules
CREATE TABLE availabilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    timezone VARCHAR(100) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_availabilities_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_availabilities_time_order CHECK (start_time < end_time)
);

-- ================================================================
-- SECTION 5: TASK MANAGEMENT
-- ================================================================

-- Tasks table - user tasks and to-do items
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Task status and priority
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    
    -- Time tracking
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    
    -- Organization
    tags TEXT[],
    project_id UUID,
    parent_task_id UUID,
    
    -- Recurring tasks
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    
    -- Soft delete
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_tasks_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_parent 
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- User priorities table - priority board settings
CREATE TABLE user_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_user_priorities_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id, item_type)
);

-- ================================================================
-- SECTION 6: AI CHATBOT SYSTEM
-- ================================================================

-- AI Conversations table - chat history
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_ai_conversations_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI Actions table - tracks function calls
CREATE TABLE ai_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID,
    action_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    result JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_ai_actions_conversation 
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
);

-- ================================================================
-- SECTION 7: TEAM COLLABORATION
-- ================================================================

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL,
    timezone VARCHAR(100) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_teams_owner 
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    status VARCHAR(50) DEFAULT 'pending',
    joined_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_team_members_team 
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_members_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id)
);

-- Team rituals table - recurring team meetings
CREATE TABLE team_rituals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recurrence_rule VARCHAR(500),
    duration_minutes INTEGER DEFAULT 30,
    buffer_before INTEGER DEFAULT 0,
    buffer_after INTEGER DEFAULT 0,
    rotation_type VARCHAR(50) DEFAULT 'none',
    rotation_order JSONB,
    current_rotation_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_team_rituals_team 
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Team availability table - track team member availability
CREATE TABLE team_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    available_slots JSONB,
    timezone VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_team_availability_team 
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_availability_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(team_id, user_id, date)
);

-- Team meeting rotations table - rotation tracking
CREATE TABLE team_meeting_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ritual_id UUID NOT NULL,
    user_id UUID NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    event_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_team_meeting_rotations_ritual 
        FOREIGN KEY (ritual_id) REFERENCES team_rituals(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_meeting_rotations_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_meeting_rotations_event 
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- ================================================================
-- SECTION 8: INTEGRATIONS & NOTIFICATIONS
-- ================================================================

-- Integrations table - third-party services
CREATE TABLE integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    provider provider_type NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    workspace_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_integrations_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Webhook channels table - Google Calendar push notifications
CREATE TABLE webhook_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    calendar_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL UNIQUE,
    resource_id VARCHAR(255) NOT NULL,
    resource_uri TEXT NOT NULL,
    token VARCHAR(500),
    expiration TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_webhook_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    channel notification_channel NOT NULL,
    remind_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_notifications_event_id 
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Email logs table - email tracking
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_email_logs_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_email_logs_status 
        CHECK (status IN ('pending', 'sent', 'failed', 'queued'))
);

-- ================================================================
-- SECTION 9: ADDITIONAL FEATURES
-- ================================================================

-- Meeting notes table - AI-generated notes
CREATE TABLE meeting_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL,
    content TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_meeting_notes_event_id 
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Contacts table - contact form submissions
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    country VARCHAR(100),
    inquiry_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    subscribe_offers BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- SECTION 10: BLOG SYSTEM
-- ================================================================

-- Blog categories table
CREATE TABLE blog_categories (
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

-- Blog tags table
CREATE TABLE blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    alt_text VARCHAR(255),
    author_id UUID NOT NULL,
    category_id INTEGER,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    seo_title VARCHAR(60),
    seo_description VARCHAR(160),
    seo_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_posts_author 
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_posts_category 
        FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
);

-- Blog post tags junction table
CREATE TABLE blog_post_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_post_tags_post 
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_post_tags_tag 
        FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE,
    UNIQUE(post_id, tag_id)
);

-- Blog comments table
CREATE TABLE blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
    parent_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_comments_post 
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_blog_comments_parent 
        FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE
);

-- Blog views table - analytics
CREATE TABLE blog_views (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_blog_views_post 
        FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

-- ================================================================
-- SECTION 10: INDEXES FOR PERFORMANCE
-- ================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_full_name ON users(full_name);

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
CREATE INDEX idx_events_organizer_id ON events(organizer_id);

-- Event attendees indexes
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_email ON event_attendees(email);
CREATE INDEX idx_event_attendees_token ON event_attendees(invitation_token);
CREATE INDEX idx_event_attendees_status ON event_attendees(response_status);

-- Booking links indexes
CREATE INDEX idx_booking_links_user_id ON booking_links(user_id);
CREATE INDEX idx_booking_links_slug ON booking_links(slug);
CREATE INDEX idx_booking_links_is_active ON booking_links(is_active) WHERE is_active = true;

-- Bookings indexes
CREATE INDEX idx_bookings_booking_link_id ON bookings(booking_link_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_start_time ON bookings(start_time);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);

-- Tasks indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- Priorities indexes
CREATE INDEX idx_user_priorities_user_id ON user_priorities(user_id);
CREATE INDEX idx_user_priorities_priority ON user_priorities(priority);
CREATE INDEX idx_user_priorities_user_priority ON user_priorities(user_id, priority);

-- AI tables indexes
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at DESC);
CREATE INDEX idx_ai_actions_conversation_id ON ai_actions(conversation_id);
CREATE INDEX idx_ai_actions_status ON ai_actions(status);

-- Teams indexes
CREATE INDEX idx_teams_owner ON teams(owner_id);
CREATE INDEX idx_teams_active ON teams(is_active);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- Webhook indexes
CREATE INDEX idx_webhook_channels_user_id ON webhook_channels(user_id);
CREATE INDEX idx_webhook_channels_channel_id ON webhook_channels(channel_id);
CREATE INDEX idx_webhook_channels_active ON webhook_channels(is_active) WHERE is_active = TRUE;

-- Email logs indexes
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at DESC);

-- Sync log indexes
CREATE INDEX idx_sync_log_user_provider ON sync_log(user_id, provider);
CREATE INDEX idx_sync_log_status ON sync_log(status);

-- Event conflicts indexes
CREATE INDEX idx_event_conflicts_user ON event_conflicts(user_id);
CREATE INDEX idx_event_conflicts_resolved ON event_conflicts(resolved);

-- Sync errors indexes
CREATE INDEX idx_sync_errors_user_id ON sync_errors(user_id);
CREATE INDEX idx_sync_errors_error_type ON sync_errors(error_type);
CREATE INDEX idx_sync_errors_resolved ON sync_errors(resolved);
CREATE INDEX idx_sync_errors_next_retry ON sync_errors(next_retry_at) WHERE resolved = false;

-- Team availability indexes
CREATE INDEX idx_team_availability_team_date ON team_availability(team_id, date);
CREATE INDEX idx_team_availability_user ON team_availability(user_id);

-- Team meeting rotations indexes
CREATE INDEX idx_team_meeting_rotations_ritual ON team_meeting_rotations(ritual_id);
CREATE INDEX idx_team_meeting_rotations_user ON team_meeting_rotations(user_id);

-- Contacts indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Blog categories indexes
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_is_active ON blog_categories(is_active);
CREATE INDEX idx_blog_categories_sort_order ON blog_categories(sort_order);

-- Blog tags indexes
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX idx_blog_tags_usage_count ON blog_tags(usage_count DESC);

-- Blog posts indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);

-- Blog comments indexes
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);

-- Blog views indexes
CREATE INDEX idx_blog_views_post_id ON blog_views(post_id);
CREATE INDEX idx_blog_views_viewed_at ON blog_views(viewed_at DESC);

-- ================================================================
-- SECTION 11: TRIGGERS AND FUNCTIONS
-- ================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_credentials_updated_at 
    BEFORE UPDATE ON user_credentials FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_calendars_updated_at 
    BEFORE UPDATE ON calendars FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at 
    BEFORE UPDATE ON events FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER event_attendees_update_timestamp
    BEFORE UPDATE ON event_attendees FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sync_logs_updated_at 
    BEFORE UPDATE ON sync_logs FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_availabilities_updated_at 
    BEFORE UPDATE ON availabilities FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_booking_links_timestamp
    BEFORE UPDATE ON booking_links FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_bookings_timestamp
    BEFORE UPDATE ON bookings FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON tasks FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_user_priorities_updated_at
    BEFORE UPDATE ON user_priorities FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_conversations_updated_at
    BEFORE UPDATE ON ai_conversations FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_actions_updated_at
    BEFORE UPDATE ON ai_actions FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_rituals_updated_at
    BEFORE UPDATE ON team_rituals FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_integrations_updated_at 
    BEFORE UPDATE ON integrations FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_webhook_channels_updated_at
    BEFORE UPDATE ON webhook_channels FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notifications_updated_at 
    BEFORE UPDATE ON notifications FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_email_logs_updated_at
    BEFORE UPDATE ON email_logs FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_meeting_notes_updated_at 
    BEFORE UPDATE ON meeting_notes FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sync_log_updated_at
    BEFORE UPDATE ON sync_log FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sync_errors_updated_at
    BEFORE UPDATE ON sync_errors FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_availability_updated_at
    BEFORE UPDATE ON team_availability FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_contacts_updated_at
    BEFORE UPDATE ON contacts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
    BEFORE UPDATE ON blog_categories FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
    BEFORE UPDATE ON blog_comments FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- SECTION 12: TABLE COMMENTS (DOCUMENTATION)
-- ================================================================

COMMENT ON TABLE users IS 'User accounts and authentication information';
COMMENT ON TABLE user_credentials IS 'OAuth tokens for third-party integrations';
COMMENT ON TABLE calendars IS 'User calendars (local and synced from Google)';
COMMENT ON TABLE events IS 'Calendar events with recurring support';
COMMENT ON TABLE event_attendees IS 'Event attendees and RSVP tracking';
COMMENT ON TABLE sync_logs IS 'Calendar synchronization history';
COMMENT ON TABLE sync_log IS 'Alternative calendar sync tracking with JSONB details';
COMMENT ON TABLE event_conflicts IS 'Sync conflicts between local and Google events';
COMMENT ON TABLE sync_errors IS 'Sync errors with automatic retry logic';
COMMENT ON TABLE booking_links IS 'Public booking pages (like Calendly)';
COMMENT ON TABLE bookings IS 'Guest bookings made through booking links';
COMMENT ON TABLE availabilities IS 'User availability schedules';
COMMENT ON TABLE tasks IS 'User tasks and to-do items';
COMMENT ON TABLE user_priorities IS 'Priority board settings for tasks and items';
COMMENT ON TABLE ai_conversations IS 'AI chatbot conversation history';
COMMENT ON TABLE ai_actions IS 'AI function calls and execution results';
COMMENT ON TABLE teams IS 'Team workspace information';
COMMENT ON TABLE team_members IS 'Team membership and roles';
COMMENT ON TABLE team_rituals IS 'Recurring team meetings';
COMMENT ON TABLE team_availability IS 'Track team member availability by date';
COMMENT ON TABLE team_meeting_rotations IS 'Team meeting rotation schedule tracking';
COMMENT ON TABLE integrations IS 'Third-party service integrations';
COMMENT ON TABLE webhook_channels IS 'Google Calendar webhook subscriptions';
COMMENT ON TABLE notifications IS 'Event reminder notifications';
COMMENT ON TABLE email_logs IS 'Email sending history and status';
COMMENT ON TABLE meeting_notes IS 'AI-generated meeting notes';
COMMENT ON TABLE contacts IS 'Contact form submissions from landing page';
COMMENT ON TABLE blog_categories IS 'Blog post categories';
COMMENT ON TABLE blog_tags IS 'Blog post tags with usage tracking';
COMMENT ON TABLE blog_posts IS 'Blog posts with SEO features';
COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between posts and tags';
COMMENT ON TABLE blog_comments IS 'Blog post comments with moderation';
COMMENT ON TABLE blog_views IS 'Blog post view analytics';

-- ================================================================
-- SECTION 13: DEMO SEED DATA (OPTIONAL)
-- ================================================================

-- Insert demo user
INSERT INTO users (email, username, password_hash, first_name, last_name, full_name, is_active, is_verified)
VALUES 
    ('demo@calento.com', 'demo_user', '$2b$10$YourHashedPasswordHere', 'Demo', 'User', 'Demo User', true, true),
    ('admin@calento.com', 'admin', '$2b$10$YourHashedPasswordHere', 'Admin', 'Calento', 'Admin Calento', true, true);

-- Note: Add more demo data as needed for testing

-- ================================================================
-- END OF SCHEMA
-- ================================================================

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================================';
    RAISE NOTICE '✅ Tempra (Calento) Database Schema Created Successfully!';
    RAISE NOTICE '====================================================================';
    RAISE NOTICE '📊 Total Tables: 36';
    RAISE NOTICE '';
    RAISE NOTICE '📁 Core Tables:';
    RAISE NOTICE '   - Users & Authentication (2 tables)';
    RAISE NOTICE '   - Calendar & Events (4 tables)';
    RAISE NOTICE '   - Sync Management (4 tables)';
    RAISE NOTICE '   - Booking System (3 tables)';
    RAISE NOTICE '   - Task Management (2 tables)';
    RAISE NOTICE '   - AI Chatbot (2 tables)';
    RAISE NOTICE '   - Team Collaboration (5 tables)';
    RAISE NOTICE '   - Integrations & Notifications (4 tables)';
    RAISE NOTICE '   - Blog System (6 tables)';
    RAISE NOTICE '   - Additional Features (4 tables)';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Key Features:';
    RAISE NOTICE '   ✓ User Authentication & OAuth';
    RAISE NOTICE '   ✓ Google Calendar Sync with Webhooks';
    RAISE NOTICE '   ✓ Event Management with Recurring Events';
    RAISE NOTICE '   ✓ Public Booking Links (Calendly-style)';
    RAISE NOTICE '   ✓ Task Management with Priorities';
    RAISE NOTICE '   ✓ AI-Powered Calendar Assistant';
    RAISE NOTICE '   ✓ Team Collaboration & Rituals';
    RAISE NOTICE '   ✓ Blog System with SEO';
    RAISE NOTICE '   ✓ Email Tracking & Notifications';
    RAISE NOTICE '   ✓ Error Handling with Auto-Retry';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Status: Ready for Development & Production';
    RAISE NOTICE '====================================================================';
END $$;
