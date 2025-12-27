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

-- Link events to teams (optional)
ALTER TABLE events
    ADD CONSTRAINT IF NOT EXISTS fk_events_team_id
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

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
