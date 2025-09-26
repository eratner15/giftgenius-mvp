const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://giftgenius-l6me3ymz6-eratner15s-projects.vercel.app',
    /^https:\/\/.*-eratner15s-projects\.vercel\.app$/,
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Enhanced request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: userAgent.substring(0, 200),
      ip,
      query: Object.keys(req.query).length ? req.query : undefined
    };

    console.log(JSON.stringify(logData));
  });
  next();
};

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));

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
            title: 'Luxury Silk Pillowcase Set',
            description: '100% Mulberry silk pillowcases for better sleep and skincare',
            price: 89.99,
            category: 'home',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1587222318667-31212ce2828d?w=400',
            affiliate_url: 'https://example.com/luxury-silk-pillowcase-set',
            retailer: 'Brooklinen',
            delivery_days: 2,
            success_rate: 94,
            total_reviews: 127
          },
          {
            title: 'Custom Night Sky Star Map',
            description: 'Capture the stars from your special night - first date, wedding, anniversary',
            price: 59.99,
            category: 'unique',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
            affiliate_url: 'https://example.com/custom-night-sky-star-map',
            retailer: 'Under Lucky Stars',
            delivery_days: 5,
            success_rate: 92,
            total_reviews: 89
          },
          {
            title: 'Private Couples Cooking Experience',
            description: 'Learn to cook gourmet meals together with a professional chef',
            price: 189.00,
            category: 'experiences',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 21,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            affiliate_url: 'https://example.com/private-couples-cooking-experience',
            retailer: 'MasterClass',
            delivery_days: 0,
            success_rate: 96,
            total_reviews: 156
          },
          {
            title: 'LED Mirror Jewelry Organizer',
            description: 'Elegant jewelry box with LED lighting and smart compartments',
            price: 79.99,
            category: 'jewelry',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
            affiliate_url: 'https://example.com/led-mirror-jewelry-organizer',
            retailer: 'Vlando',
            delivery_days: 3,
            success_rate: 88,
            total_reviews: 203
          },
          {
            title: 'Luxury Spa Day for Two',
            description: 'Full day spa experience with massages, facials, and relaxation',
            price: 349.00,
            category: 'experiences',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 21,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
            affiliate_url: 'https://example.com/luxury-spa-day-for-two',
            retailer: 'SpaFinder',
            delivery_days: 0,
            success_rate: 98,
            total_reviews: 78
          },
          {
            title: 'Personalized Birthstone Pendant',
            description: '14k gold necklace with her birthstone - elegant and meaningful',
            price: 149.99,
            category: 'jewelry',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
            affiliate_url: 'https://example.com/personalized-birthstone-pendant',
            retailer: 'Mejuri',
            delivery_days: 7,
            success_rate: 91,
            total_reviews: 167
          },
          {
            title: 'Premium Wine Tasting Experience',
            description: 'Curated selection of 6 premium wines with tasting notes',
            price: 119.99,
            category: 'experiences',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 21,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
            affiliate_url: 'https://example.com/premium-wine-tasting-experience',
            retailer: 'Wine.com',
            delivery_days: 4,
            success_rate: 85,
            total_reviews: 94
          },
          {
            title: 'His & Hers Turkish Cotton Robes',
            description: 'Ultra-soft Turkish cotton bathrobes with personalization',
            price: 159.99,
            category: 'home',
            occasion: 'christmas',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400',
            affiliate_url: 'https://example.com/his-hers-turkish-cotton-robes',
            retailer: 'Parachute',
            delivery_days: 5,
            success_rate: 90,
            total_reviews: 112
          },
          {
            title: 'WiFi Digital Photo Frame',
            description: 'Share photos instantly from anywhere - perfect for memories',
            price: 199.99,
            category: 'tech',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
            affiliate_url: 'https://example.com/wifi-digital-photo-frame',
            retailer: 'Aura Frames',
            delivery_days: 2,
            success_rate: 93,
            total_reviews: 234
          },
          {
            title: 'Designer Fragrance Sampler',
            description: 'Collection of 10 luxury perfume samples with certificate',
            price: 75.00,
            category: 'beauty',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
            affiliate_url: 'https://example.com/designer-fragrance-sampler',
            retailer: 'Sephora',
            delivery_days: 3,
            success_rate: 87,
            total_reviews: 189
          },
          {
            title: 'Surprise Weekend Trip Package',
            description: 'Mystery weekend getaway with all details planned',
            price: 599.00,
            category: 'experiences',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 21,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
            affiliate_url: 'https://example.com/surprise-weekend-trip-package',
            retailer: 'Pack Up + Go',
            delivery_days: 14,
            success_rate: 97,
            total_reviews: 45
          },
          {
            title: 'Couples Fitness Tracker Set',
            description: 'Two premium fitness trackers with competition features',
            price: 279.99,
            category: 'tech',
            occasion: 'christmas',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400',
            affiliate_url: 'https://example.com/couples-fitness-tracker-set',
            retailer: 'Fitbit',
            delivery_days: 2,
            success_rate: 82,
            total_reviews: 156
          },
          {
            title: 'Luxury Cashmere Scarf Collection',
            description: 'Premium cashmere scarves in beautiful winter colors',
            price: 129.99,
            category: 'fashion',
            occasion: 'christmas',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
            affiliate_url: 'https://example.com/luxury-cashmere-scarf-collection',
            retailer: 'Everlane',
            delivery_days: 3,
            success_rate: 89,
            total_reviews: 98
          },
          {
            title: 'Artisan Coffee Discovery',
            description: 'Monthly delivery of premium single-origin coffees',
            price: 45.99,
            category: 'unique',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
            affiliate_url: 'https://example.com/artisan-coffee-discovery',
            retailer: 'Blue Bottle Coffee',
            delivery_days: 5,
            success_rate: 91,
            total_reviews: 267
          },
          {
            title: 'Luxury Silk Loungewear Set',
            description: 'Elegant silk robe with matching slippers for ultimate comfort',
            price: 189.99,
            category: 'home',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            affiliate_url: 'https://example.com/luxury-silk-loungewear-set',
            retailer: 'Lunya',
            delivery_days: 4,
            success_rate: 95,
            total_reviews: 134
          },
          {
            title: 'Retro Bluetooth Turntable',
            description: 'Classic vinyl player with modern Bluetooth connectivity',
            price: 299.99,
            category: 'tech',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            affiliate_url: 'https://example.com/retro-bluetooth-turntable',
            retailer: 'Audio-Technica',
            delivery_days: 3,
            success_rate: 87,
            total_reviews: 189
          },
          {
            title: 'Handcrafted Chocolate Collection',
            description: 'Gourmet chocolates made by award-winning chocolatiers',
            price: 69.99,
            category: 'unique',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 5,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
            affiliate_url: 'https://example.com/handcrafted-chocolate-collection',
            retailer: 'Vosges Chocolate',
            delivery_days: 2,
            success_rate: 96,
            total_reviews: 156
          },
          {
            title: 'Romantic Weekend Escape',
            description: 'Voucher for cozy cabin or boutique hotel weekend',
            price: 449.99,
            category: 'experiences',
            occasion: 'anniversary',
            relationship_stage: null,
            min_age: 21,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400',
            affiliate_url: 'https://example.com/romantic-weekend-escape',
            retailer: 'Airbnb Plus',
            delivery_days: 0,
            success_rate: 98,
            total_reviews: 89
          },
          {
            title: 'WiFi Essential Oil Diffuser',
            description: 'App-controlled aromatherapy diffuser with LED lighting',
            price: 89.99,
            category: 'tech',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
            affiliate_url: 'https://example.com/wifi-essential-oil-diffuser',
            retailer: 'Vitruvi',
            delivery_days: 2,
            success_rate: 84,
            total_reviews: 223
          },
          {
            title: 'Italian Leather Crossbody Bag',
            description: 'Handcrafted leather bag from Florence artisans',
            price: 329.99,
            category: 'fashion',
            occasion: 'christmas',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
            affiliate_url: 'https://example.com/italian-leather-crossbody-bag',
            retailer: 'Cuyana',
            delivery_days: 7,
            success_rate: 93,
            total_reviews: 145
          },
          {
            title: 'Professional Chef Knife Set',
            description: 'Japanese steel knives with wooden cutting board',
            price: 259.99,
            category: 'home',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1591000943565-8af9829ad5e5?w=400',
            affiliate_url: 'https://example.com/professional-chef-knife-set',
            retailer: 'Williams Sonoma',
            delivery_days: 4,
            success_rate: 90,
            total_reviews: 178
          },
          {
            title: 'Organic Cotton Meditation Kit',
            description: 'Eco-friendly meditation cushions with singing bowl',
            price: 79.99,
            category: 'unique',
            occasion: 'birthday',
            relationship_stage: null,
            min_age: 18,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            affiliate_url: 'https://example.com/organic-cotton-meditation-kit',
            retailer: 'Gaiam',
            delivery_days: 3,
            success_rate: 86,
            total_reviews: 134
          },
          {
            title: 'Premium Noise-Cancelling Earbuds',
            description: 'High-fidelity wireless earbuds with active noise cancellation',
            price: 199.99,
            category: 'tech',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
            affiliate_url: 'https://example.com/premium-noise-cancelling-earbuds',
            retailer: 'Sony',
            delivery_days: 1,
            success_rate: 88,
            total_reviews: 412
          },
          {
            title: 'Indoor Succulent Collection',
            description: 'Easy-care succulents with decorative pots and care guide',
            price: 39.99,
            category: 'home',
            occasion: 'valentine',
            relationship_stage: null,
            min_age: 16,
            max_age: 99,
            image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
            affiliate_url: 'https://example.com/indoor-succulent-collection',
            retailer: 'The Sill',
            delivery_days: 5,
            success_rate: 92,
            total_reviews: 298
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

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const color = req.query.color || 'cccccc';

  // Return a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#666">
        ${width} × ${height}
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
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

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  if (error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED') {
    return res.status(503).json({
      error: 'Database is busy, please try again',
      retry: true
    });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON in request body'
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
