const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { body, query, param, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const serverless = require('serverless-http');

const app = express();

// Basic security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(compression());

// CORS configuration - allow all origins for Netlify
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup for Netlify
let db;

function initializeDatabase() {
  if (db) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const dbPath = '/tmp/giftgenius.db';
    db = new sqlite3.Database(dbPath, (err) => {
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

async function setupDatabase() {
  // Sample data for demonstration
  const sampleGifts = [
    {
      id: 1,
      title: "Luxury Silk Pillowcase Set",
      description: "Mulberry silk pillowcases for better sleep and skincare",
      price: 129.99,
      category: "home",
      occasion: "christmas",
      relationship_stage: "serious",
      image_url: "https://images.unsplash.com/photo-1587222318667-31212ce2828d",
      affiliate_url: "https://www.brooklinen.com/silk-pillowcase?source=affiliate",
      retailer: "Brooklinen",
      delivery_days: 2,
      success_rate: 100,
      total_reviews: 4
    },
    {
      id: 2,
      title: "Private Cooking Class for Two",
      description: "Learn to cook a 5-course Italian meal with professional chef",
      price: 189.99,
      category: "experiences",
      occasion: "anniversary",
      relationship_stage: "serious",
      image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
      affiliate_url: "https://www.masterclass.com/cooking-couples?ref=giftgenius",
      retailer: "MasterClass",
      delivery_days: 0,
      success_rate: 100,
      total_reviews: 4
    }
  ];

  const sampleTestimonials = [
    {
      id: 1,
      gift_id: 1,
      reviewer_name: "Alex M.",
      relationship_length: "3 years",
      partner_rating: 5,
      testimonial_text: "She absolutely loved these! Best gift ever.",
      occasion: "christmas"
    }
  ];

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables
      db.run(`
        CREATE TABLE gifts (
          id INTEGER PRIMARY KEY,
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
          id INTEGER PRIMARY KEY,
          gift_id INTEGER REFERENCES gifts(id),
          reviewer_name TEXT NOT NULL,
          relationship_length TEXT,
          partner_rating INTEGER NOT NULL,
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
          gift_id INTEGER,
          session_id TEXT,
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert sample data
      const giftStmt = db.prepare(`
        INSERT INTO gifts (id, title, description, price, category, occasion, relationship_stage, image_url, affiliate_url, retailer, delivery_days, success_rate, total_reviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      sampleGifts.forEach(gift => {
        giftStmt.run(
          gift.id, gift.title, gift.description, gift.price, gift.category,
          gift.occasion, gift.relationship_stage, gift.image_url,
          gift.affiliate_url, gift.retailer, gift.delivery_days,
          gift.success_rate, gift.total_reviews
        );
      });
      giftStmt.finalize();

      const testimonialStmt = db.prepare(`
        INSERT INTO testimonials (id, gift_id, reviewer_name, relationship_length, partner_rating, testimonial_text, occasion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      sampleTestimonials.forEach(testimonial => {
        testimonialStmt.run(
          testimonial.id, testimonial.gift_id, testimonial.reviewer_name,
          testimonial.relationship_length, testimonial.partner_rating,
          testimonial.testimonial_text, testimonial.occasion
        );
      });
      testimonialStmt.finalize(() => {
        console.log('Database setup complete!');
        resolve();
      });
    });
  });
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

// API Routes - add /api prefix to match frontend requests
app.get('/api/health', async (req, res) => {
  try {
    await initializeDatabase();
    await runQuery('SELECT 1');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/gifts', async (req, res) => {
  try {
    await initializeDatabase();

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
    console.error('Error fetching gifts:', err);
    res.status(500).json({ error: 'Server error fetching gifts' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    await initializeDatabase();

    const categories = [
      { category: 'jewelry', displayName: 'Jewelry', icon: '💎', count: 5, min_price: 50, max_price: 500, avg_success_rate: 95 },
      { category: 'experiences', displayName: 'Experiences', icon: '🎭', count: 4, min_price: 75, max_price: 300, avg_success_rate: 92 },
      { category: 'home', displayName: 'Home & Living', icon: '🏠', count: 6, min_price: 25, max_price: 200, avg_success_rate: 88 },
      { category: 'fashion', displayName: 'Fashion', icon: '👗', count: 7, min_price: 40, max_price: 350, avg_success_rate: 85 },
      { category: 'beauty', displayName: 'Beauty & Wellness', icon: '💄', count: 5, min_price: 30, max_price: 150, avg_success_rate: 90 },
      { category: 'tech', displayName: 'Tech & Gadgets', icon: '📱', count: 4, min_price: 50, max_price: 400, avg_success_rate: 87 },
      { category: 'unique', displayName: 'Unique & Creative', icon: '✨', count: 2, min_price: 25, max_price: 100, avg_success_rate: 93 }
    ];

    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

app.post('/api/analytics/track', async (req, res) => {
  try {
    await initializeDatabase();

    const { eventType, giftId, sessionId, metadata } = req.body;

    const query = `
      INSERT INTO analytics (event_type, gift_id, session_id, metadata)
      VALUES (?, ?, ?, ?)
    `;

    const result = await runStatement(query, [
      eventType,
      giftId || null,
      sessionId || 'anonymous',
      JSON.stringify(metadata || {})
    ]);

    res.json({ success: true, id: result.id });
  } catch (err) {
    console.error('Error tracking analytics:', err);
    res.status(500).json({ error: 'Server error tracking analytics' });
  }
});

// Export as Netlify function
module.exports.handler = serverless(app);