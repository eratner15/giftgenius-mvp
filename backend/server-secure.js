const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { body, query, param, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests from this IP for this endpoint.'
});

app.use('/api/', limiter);
app.use('/api/analytics/track', strictLimiter);

// Database setup
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'giftgenius.db');
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
      db.run(`CREATE INDEX idx_analytics_event_type ON analytics(event_type)`);
      db.run(`CREATE INDEX idx_analytics_created_at ON analytics(created_at)`);

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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://giftgenius.netlify.app',
  'https://giftgenius-mvp.netlify.app',
  'https://giftgenius-mvp.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      // In development, allow all origins
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

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

// Sanitize input helper
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
}

// API Routes
app.get('/api/health', async (req, res) => {
  try {
    if (db) {
      await runQuery('SELECT 1');
    }
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: db ? 'connected' : 'disconnected',
      version: '1.0.0'
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/gifts', [
  query('category').optional().isString().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('occasion').optional().isString().trim(),
  query('relationshipStage').optional().isString().trim(),
  query('minSuccessRate').optional().isInt({ min: 0, max: 100 }),
  query('sortBy').optional().isIn(['success_rate', 'price_low', 'price_high', 'newest', 'popular']),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 }),
  handleValidationErrors
], async (req, res) => {
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
      params.push(sanitizeInput(category));
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (occasion) {
      query += ' AND occasion = ?';
      params.push(sanitizeInput(occasion));
    }
    if (relationshipStage) {
      query += ' AND relationship_stage = ?';
      params.push(sanitizeInput(relationshipStage));
    }
    if (minSuccessRate) {
      query += ' AND success_rate >= ?';
      params.push(parseInt(minSuccessRate));
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
    res.status(500).json({
      error: 'Server error fetching gifts',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.get('/api/gifts/:id', [
  param('id').isInt({ min: 1 }),
  handleValidationErrors
], async (req, res) => {
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
    console.error('Error fetching gift details:', err);
    res.status(500).json({
      error: 'Server error fetching gift details',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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
    console.error('Error fetching categories:', err);
    res.status(500).json({
      error: 'Server error fetching categories',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.post('/api/analytics/track', [
  body('eventType').isString().trim().isLength({ min: 1, max: 100 }),
  body('giftId').optional().isInt({ min: 1 }),
  body('sessionId').optional().isString().trim().isLength({ max: 100 }),
  body('metadata').optional().isObject(),
  handleValidationErrors
], async (req, res) => {
  try {
    const { eventType, giftId, sessionId, metadata } = req.body;

    // Sanitize input
    const sanitizedEventType = sanitizeInput(eventType);
    const sanitizedSessionId = sessionId ? sanitizeInput(sessionId) : generateSessionId();

    const query = `
      INSERT INTO analytics (event_type, gift_id, session_id, metadata)
      VALUES (?, ?, ?, ?)
    `;

    const result = await runStatement(query, [
      sanitizedEventType,
      giftId || null,
      sanitizedSessionId,
      JSON.stringify(metadata || {})
    ]);

    res.json({
      success: true,
      id: result.id,
      sessionId: sanitizedSessionId
    });
  } catch (err) {
    console.error('Error tracking analytics:', err);
    res.status(500).json({
      error: 'Server error tracking analytics',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }

  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');

  app.use(express.static(frontendBuildPath, {
    maxAge: '1d',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendBuildPath, 'index.html'));
    }
  });
} else {
  // In development, just return a message for the root
  app.get('/', (req, res) => {
    res.json({
      message: 'GiftGenius Backend API',
      environment: 'development',
      endpoints: {
        health: '/api/health',
        gifts: '/api/gifts',
        categories: '/api/categories',
        analytics: '/api/analytics/track'
      }
    });
  });
}

// Start server after database initialization
initializeDatabase().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎁 GiftGenius Backend (Secure) running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Security: Helmet, CORS, Rate limiting enabled`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`🚀 Serving React app from /frontend/build`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed');
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      if (db) {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed');
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});