-- UP Migration: Create Blog System for Landing Page
-- ============================================
-- Date: 2024-10-07
-- Description: Create comprehensive blog system with posts, categories, tags, and comments

-- Create blog_categories table
CREATE TABLE blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1', -- Hex color for category display
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_tags table
CREATE TABLE blog_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_posts table
CREATE TABLE blog_posts (
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

-- Create blog_post_tags junction table (many-to-many)
CREATE TABLE blog_post_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, tag_id)
);

-- Create blog_comments table
CREATE TABLE blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'deleted')),
    parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE, -- For nested comments
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_views table for analytics
CREATE TABLE blog_views (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance

-- Blog posts indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_status_published ON blog_posts(status, published_at DESC);

-- Blog categories indexes
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_is_active ON blog_categories(is_active);
CREATE INDEX idx_blog_categories_sort_order ON blog_categories(sort_order);

-- Blog tags indexes
CREATE INDEX idx_blog_tags_slug ON blog_tags(slug);
CREATE INDEX idx_blog_tags_usage_count ON blog_tags(usage_count DESC);

-- Blog comments indexes
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON blog_comments(status);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX idx_blog_comments_created_at ON blog_comments(created_at DESC);

-- Blog views indexes
CREATE INDEX idx_blog_views_post_id ON blog_views(post_id);
CREATE INDEX idx_blog_views_viewed_at ON blog_views(viewed_at DESC);
CREATE INDEX idx_blog_views_ip_address ON blog_views(ip_address);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_categories_updated_at 
    BEFORE UPDATE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
    BEFORE UPDATE ON blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update tag usage count
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
$$ language 'plpgsql';

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON blog_post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color, sort_order) VALUES
('Product Updates', 'product-updates', 'Latest features and improvements to Tempra', '#10b981', 1),
('Best Practices', 'best-practices', 'Tips and best practices for calendar management', '#3b82f6', 2),
('AI & Technology', 'ai-technology', 'Insights into AI-powered scheduling and productivity', '#8b5cf6', 3),
('Company News', 'company-news', 'Company announcements and milestones', '#f59e0b', 4),
('Integrations', 'integrations', 'Guides for Google Calendar, Slack, and other integrations', '#06b6d4', 5);

-- Insert sample blog tags
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
('remote-work', 'remote-work');

-- Add comments to document table purposes
COMMENT ON TABLE blog_categories IS 'Categories for organizing blog posts';
COMMENT ON TABLE blog_tags IS 'Tags for labeling blog posts';
COMMENT ON TABLE blog_posts IS 'Main blog posts table with SEO and content management features';
COMMENT ON TABLE blog_post_tags IS 'Many-to-many relationship between posts and tags';
COMMENT ON TABLE blog_comments IS 'User comments on blog posts with moderation support';
COMMENT ON TABLE blog_views IS 'Analytics table for tracking blog post views';

COMMENT ON COLUMN blog_posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN blog_posts.seo_title IS 'SEO optimized title (max 60 chars)';
COMMENT ON COLUMN blog_posts.seo_description IS 'Meta description for SEO (max 160 chars)';
COMMENT ON COLUMN blog_posts.seo_keywords IS 'Comma-separated keywords for SEO';
COMMENT ON COLUMN blog_comments.parent_id IS 'Reference to parent comment for nested replies';
COMMENT ON COLUMN blog_views.ip_address IS 'Visitor IP address for analytics (anonymized in production)';

-- DOWN Migration: Remove Blog System
-- ===================================

-- DROP TRIGGER IF EXISTS update_tag_usage_count_trigger ON blog_post_tags;
-- DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
-- DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
-- DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
-- DROP FUNCTION IF EXISTS update_tag_usage_count();
-- DROP FUNCTION IF EXISTS update_updated_at_column();

-- DROP TABLE IF EXISTS blog_views;
-- DROP TABLE IF EXISTS blog_comments;
-- DROP TABLE IF EXISTS blog_post_tags;
-- DROP TABLE IF EXISTS blog_posts;
-- DROP TABLE IF EXISTS blog_tags;
-- DROP TABLE IF EXISTS blog_categories;
