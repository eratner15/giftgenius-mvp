const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create or open database
const db = new sqlite3.Database('./giftgenius.db');

// Read and parse the seed data
const seedData = require('./seed-data.js');

db.serialize(() => {
  // Create tables
  db.run(`DROP TABLE IF EXISTS analytics`);
  db.run(`DROP TABLE IF EXISTS testimonials`);
  db.run(`DROP TABLE IF EXISTS gifts`);

  db.run(`
    CREATE TABLE gifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      occasion TEXT NOT NULL,
      relationship_stage TEXT,
      image_url TEXT,
      affiliate_url TEXT NOT NULL,
      retailer TEXT,
      delivery_days INTEGER,
      success_rate INTEGER DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gift_id INTEGER REFERENCES gifts(id) ON DELETE CASCADE,
      reviewer_name TEXT NOT NULL,
      relationship_length TEXT,
      partner_rating INTEGER NOT NULL CHECK (partner_rating >= 1 AND partner_rating <= 5),
      testimonial_text TEXT NOT NULL,
      occasion TEXT,
      helpful_votes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      gift_id INTEGER REFERENCES gifts(id) ON DELETE CASCADE,
      session_id TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.run(`CREATE INDEX idx_gifts_category ON gifts(category)`);
  db.run(`CREATE INDEX idx_gifts_price ON gifts(price)`);
  db.run(`CREATE INDEX idx_gifts_success_rate ON gifts(success_rate)`);
  db.run(`CREATE INDEX idx_gifts_occasion ON gifts(occasion)`);
  db.run(`CREATE INDEX idx_testimonials_gift_id ON testimonials(gift_id)`);
  db.run(`CREATE INDEX idx_testimonials_rating ON testimonials(partner_rating)`);
  db.run(`CREATE INDEX idx_analytics_event_type ON analytics(event_type)`);

  // Insert gifts
  const giftStmt = db.prepare(`
    INSERT INTO gifts (title, description, price, category, occasion, relationship_stage, image_url, affiliate_url, retailer, delivery_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  seedData.gifts.forEach(gift => {
    giftStmt.run(
      gift.title,
      gift.description,
      gift.price,
      gift.category,
      gift.occasion,
      gift.relationship_stage,
      gift.image_url,
      gift.affiliate_url,
      gift.retailer,
      gift.delivery_days
    );
  });
  giftStmt.finalize();

  // Insert testimonials
  const testimonialStmt = db.prepare(`
    INSERT INTO testimonials (gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  seedData.testimonials.forEach(testimonial => {
    testimonialStmt.run(
      testimonial.gift_id,
      testimonial.reviewer_name,
      testimonial.relationship_length,
      testimonial.partner_rating,
      testimonial.testimonial_text,
      testimonial.occasion
    );
  });
  testimonialStmt.finalize();

  // Update success rates
  db.run(`
    UPDATE gifts
    SET
      success_rate = (
        SELECT ROUND(100.0 * COUNT(CASE WHEN partner_rating >= 4 THEN 1 END) / COUNT(*))
        FROM testimonials
        WHERE testimonials.gift_id = gifts.id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM testimonials
        WHERE testimonials.gift_id = gifts.id
      )
    WHERE id IN (
      SELECT DISTINCT gift_id FROM testimonials
    )
  `);

  console.log('Database setup complete!');
  console.log('Created tables: gifts, testimonials, analytics');
  console.log(`Inserted ${seedData.gifts.length} gifts`);
  console.log(`Inserted ${seedData.testimonials.length} testimonials`);
});

db.close();