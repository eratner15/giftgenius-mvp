const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
const dbPath = './giftgenius.db';
let db;

// Initialize database
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }

      console.log('Connected to SQLite database');

      // Check if tables exist
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='gifts'", async (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          console.log('Setting up database for first time...');
          await setupDatabase();
        }

        resolve();
      });
    });
  });
}

// Setup database with tables and data
async function setupDatabase() {
  const seedData = require('./database/seed-data.js');

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables
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
      db.run(`CREATE INDEX idx_testimonials_gift_id ON testimonials(gift_id)`);

      // Insert gifts
      const giftStmt = db.prepare(`
        INSERT INTO gifts (title, description, price, category, occasion, relationship_stage, image_url, affiliate_url, retailer, delivery_days)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      seedData.gifts.forEach(gift => {
        giftStmt.run(
          gift.title, gift.description, gift.price, gift.category,
          gift.occasion, gift.relationship_stage, gift.image_url,
          gift.affiliate_url, gift.retailer, gift.delivery_days
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
          testimonial.gift_id, testimonial.reviewer_name, testimonial.relationship_length,
          testimonial.partner_rating, testimonial.testimonial_text, testimonial.occasion
        );
      });
      testimonialStmt.finalize(() => {
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
        `, () => {
          console.log('Database setup complete!');
          resolve();
        });
      });
    });
  });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://giftgenius.netlify.app', 'https://giftgenius-mvp.netlify.app'],
  credentials: true
}));
app.use(express.json());

// Helper functions
function generateSessionId() {
  return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runStatement(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// Routes
app.get('/api/gifts', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      occasion,
      relationshipStage,
      minSuccessRate,
      sortBy = 'success_rate',
      limit = 20,
      offset = 0
    } = req.query;

    let query = 'SELECT * FROM gifts WHERE is_active = 1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    if (occasion) {
      query += ' AND occasion = ?';
      params.push(occasion);
    }
    if (relationshipStage) {
      query += ' AND relationship_stage = ?';
      params.push(relationshipStage);
    }
    if (minSuccessRate) {
      query += ' AND success_rate >= ?';
      params.push(minSuccessRate);
    }

    const sortOptions = {
      'success_rate': 'success_rate DESC, total_reviews DESC',
      'price_low': 'price ASC',
      'price_high': 'price DESC',
      'newest': 'created_at DESC',
      'popular': 'total_reviews DESC'
    };
    query += ` ORDER BY ${sortOptions[sortBy] || sortOptions['success_rate']}`;

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = await runQuery(countQuery, params);
    const totalCount = countResult[0].count;

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const gifts = await runQuery(query, params);

    res.json({
      gifts,
      total: totalCount,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching gifts' });
  }
});

app.get('/api/gifts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const giftQuery = 'SELECT * FROM gifts WHERE id = ? AND is_active = 1';
    const gifts = await runQuery(giftQuery, [id]);

    if (gifts.length === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    const testimonialQuery = `
      SELECT * FROM testimonials
      WHERE gift_id = ?
      ORDER BY partner_rating DESC, helpful_votes DESC, created_at DESC
      LIMIT 10
    `;
    const testimonials = await runQuery(testimonialQuery, [id]);

    const similarQuery = `
      SELECT * FROM gifts
      WHERE category = ? AND id != ? AND is_active = 1
      ORDER BY success_rate DESC
      LIMIT 4
    `;
    const similarGifts = await runQuery(similarQuery, [gifts[0].category, id]);

    res.json({
      gift: gifts[0],
      testimonials,
      similarGifts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching gift details' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const query = `
      SELECT
        category,
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        CAST(AVG(success_rate) AS INTEGER) as avg_success_rate
      FROM gifts
      WHERE is_active = 1
      GROUP BY category
      ORDER BY count DESC
    `;
    const categories = await runQuery(query);

    const categoryInfo = {
      jewelry: { name: 'Jewelry', icon: '💎' },
      experiences: { name: 'Experiences', icon: '🎭' },
      home: { name: 'Home & Living', icon: '🏠' },
      fashion: { name: 'Fashion', icon: '👗' },
      beauty: { name: 'Beauty & Wellness', icon: '💄' },
      tech: { name: 'Tech & Gadgets', icon: '📱' },
      unique: { name: 'Unique & Creative', icon: '✨' }
    };

    const categoriesWithInfo = categories.map(row => ({
      ...row,
      displayName: categoryInfo[row.category]?.name || row.category,
      icon: categoryInfo[row.category]?.icon || '🎁'
    }));

    res.json(categoriesWithInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

app.post('/api/analytics/track', async (req, res) => {
  try {
    const { eventType, giftId, sessionId, metadata } = req.body;

    const query = `
      INSERT INTO analytics (event_type, gift_id, session_id, metadata)
      VALUES (?, ?, ?, ?)
    `;

    const result = await runStatement(query, [
      eventType,
      giftId || null,
      sessionId || generateSessionId(),
      JSON.stringify(metadata || {})
    ]);

    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error tracking analytics' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    await runQuery('SELECT 1');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Start server after database initialization
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎁 GiftGenius Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});