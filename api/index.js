const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

let db;

/**
 * Initialize the SQLite database and populate with sample data if empty.
 */
function initializeDatabase() {
  if (db) {
    return;
  }
  db = new sqlite3.Database('/tmp/giftgenius.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS gifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        occasion TEXT NOT NULL,
        relationship_stage TEXT,
        min_age INTEGER DEFAULT 18,
        max_age INTEGER DEFAULT 99,
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

    // Insert sample data if table is empty
    db.get('SELECT COUNT(*) AS count FROM gifts', (err, row) => {
      if (err) {
        console.error('Error counting gifts:', err);
        return;
      }
      if (row.count === 0) {
        const sampleGifts = [
          {
            title: 'Wireless Earbuds',
            description: 'High-quality earbuds with noise cancellation.',
            price: 99.99,
            category: 'tech',
            occasion: 'birthday',
            relationship_stage: 'dating',
            min_age: 16,
            max_age: 60,
            image_url: '',
            affiliate_url: 'https://example.com/wireless-earbuds',
            retailer: 'ExampleStore',
            delivery_days: 3,
            success_rate: 85,
            total_reviews: 150
          },
          {
            title: 'Spa Gift Card',
            description: 'Relaxing spa experience for two.',
            price: 150.00,
            category: 'experiences',
            occasion: 'anniversary',
            relationship_stage: 'married',
            min_age: 21,
            max_age: 65,
            image_url: '',
            affiliate_url: 'https://example.com/spa-gift-card',
            retailer: 'ExampleSpa',
            delivery_days: 0,
            success_rate: 90,
            total_reviews: 200
          },
          {
            title: 'Gourmet Chocolate Box',
            description: 'Artisan chocolates in assorted flavors.',
            price: 35.00,
            category: 'unique',
            occasion: 'thank you',
            relationship_stage: null,
            min_age: 5,
            max_age: 99,
            image_url: '',
            affiliate_url: 'https://example.com/gourmet-chocolate',
            retailer: 'ExampleChocolates',
            delivery_days: 2,
            success_rate: 95,
            total_reviews: 300
          }
        ];

        const insertStmt = db.prepare('INSERT INTO gifts (title, description, price, category, occasion, relationship_stage, min_age, max_age, image_url, affiliate_url, retailer, delivery_days, success_rate, total_reviews) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        sampleGifts.forEach(gift => {
          insertStmt.run(
            gift.title,
            gift.description,
            gift.price,
            gift.category,
            gift.occasion,
            gift.relationship_stage,
            gift.min_age,
            gift.max_age,
            gift.image_url,
            gift.affiliate_url,
            gift.retailer,
            gift.delivery_days,
            gift.success_rate,
            gift.total_reviews
          );
        });
        insertStmt.finalize();
      }
    });
  });
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    initializeDatabase();
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Categories endpoint
app.get('/api/categories', (req, res) => {
  const categories = ['jewelry', 'experiences', 'home', 'fashion', 'beauty', 'tech', 'unique'];
  res.json({ categories });
});

// Get gifts with filters
app.get('/api/gifts', async (req, res) => {
  const {
    category,
    occasion,
    relationship_stage,
    minAge,
    maxAge,
    minPrice,
    maxPrice,
    minSuccessRate,
    minTotalReviews,
    limit
  } = req.query;

  let query = 'SELECT * FROM gifts WHERE is_active = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (occasion) {
    query += ' AND occasion = ?';
    params.push(occasion);
  }
  if (relationship_stage) {
    query += ' AND relationship_stage = ?';
    params.push(relationship_stage);
  }
  if (minAge) {
    query += ' AND max_age >= ?';
    params.push(parseInt(minAge));
  }
  if (maxAge) {
    query += ' AND min_age <= ?';
    params.push(parseInt(maxAge));
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }
  if (minSuccessRate) {
    query += ' AND success_rate >= ?';
    params.push(parseInt(minSuccessRate));
  }
  if (minTotalReviews) {
    query += ' AND total_reviews >= ?';
    params.push(parseInt(minTotalReviews));
  }

  query += ' ORDER BY success_rate DESC, total_reviews DESC LIMIT ?';
  params.push(limit ? parseInt(limit) : 20);

  try {
    const gifts = await runQuery(query, params);
    res.json({ gifts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint for popular gifts
app.get('/api/analytics/popular', async (req, res) => {
  try {
    const popular = await runQuery('SELECT * FROM gifts WHERE is_active = 1 ORDER BY success_rate DESC, total_reviews DESC LIMIT 10');
    res.json({ popular });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Survey questions endpoint
app.get('/api/survey', (req, res) => {
  const survey = [
    { id: 'age', question: 'How old is the recipient?', type: 'number' },
    { id: 'category', question: 'Preferred gift category?', type: 'choice', options: ['jewelry','experiences','home','fashion','beauty','tech','unique'] },
    { id: 'budgetMin', question: 'Minimum budget', type: 'number' },
    { id: 'budgetMax', question: 'Maximum budget', type: 'number' }
  ];
  res.json(survey);
});

// Survey result endpoint
app.post('/api/survey-result', async (req, res) => {
  const { age, category, budgetMin, budgetMax } = req.body;

  let query = 'SELECT * FROM gifts WHERE is_active = 1';
  const params = [];

  if (age) {
    query += ' AND min_age <= ? AND max_age >= ?';
    params.push(parseInt(age), parseInt(age));
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (budgetMin) {
    query += ' AND price >= ?';
    params.push(parseFloat(budgetMin));
  }
  if (budgetMax) {
    query += ' AND price <= ?';
    params.push(parseFloat(budgetMax));
  }

  query += ' ORDER BY success_rate DESC, total_reviews DESC LIMIT 10';

  try {
    const suggestions = await runQuery(query, params);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
