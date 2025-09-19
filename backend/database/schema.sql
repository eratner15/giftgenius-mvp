-- Drop existing tables if they exist
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS gifts CASCADE;

-- Create gifts table
CREATE TABLE gifts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    relationship_stage VARCHAR(50),
    image_url TEXT,
    affiliate_url TEXT NOT NULL,
    retailer VARCHAR(100),
    delivery_days INTEGER,
    success_rate INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    gift_id INTEGER REFERENCES gifts(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(100) NOT NULL,
    relationship_length VARCHAR(100),
    partner_rating INTEGER NOT NULL CHECK (partner_rating >= 1 AND partner_rating <= 5),
    testimonial_text TEXT NOT NULL,
    occasion VARCHAR(50),
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics table
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    gift_id INTEGER REFERENCES gifts(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_gifts_category ON gifts(category);
CREATE INDEX idx_gifts_price ON gifts(price);
CREATE INDEX idx_gifts_success_rate ON gifts(success_rate);
CREATE INDEX idx_gifts_occasion ON gifts(occasion);
CREATE INDEX idx_gifts_relationship_stage ON gifts(relationship_stage);
CREATE INDEX idx_testimonials_gift_id ON testimonials(gift_id);
CREATE INDEX idx_testimonials_rating ON testimonials(partner_rating);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_gift_id ON analytics(gift_id);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);