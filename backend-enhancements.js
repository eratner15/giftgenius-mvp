// Backend Enhancement Suggestions for GiftGenius
// Apply these improvements to your existing server.js file

// 1. Enhanced CORS configuration with your actual domains
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

// 2. Request logging middleware for production debugging
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
      userAgent: userAgent.substring(0, 200), // Truncate long user agents
      ip,
      query: Object.keys(req.query).length ? req.query : undefined,
      body: req.method === 'POST' && req.body ? JSON.stringify(req.body).substring(0, 200) : undefined
    };
    
    console.log(JSON.stringify(logData));
  });
  next();
};

// 3. Enhanced health check endpoint with database connectivity
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Test database connectivity
    const testQuery = await db.get('SELECT 1 as test');
    const giftCount = await db.get('SELECT COUNT(*) as count FROM gifts');
    const testimonialCount = await db.get('SELECT COUNT(*) as count FROM testimonials');
    
    const dbResponseTime = Date.now() - startTime;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`,
        totalGifts: giftCount.count,
        totalTestimonials: testimonialCount.count
      },
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: 'disconnected'
    });
  }
});

// 4. Enhanced gifts endpoint with better error handling and caching
app.get('/api/gifts', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minSuccessRate,
      limit = 50,
      offset = 0,
      sortBy = 'success_rate',
      sortOrder = 'DESC'
    } = req.query;

    // Input validation
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return res.status(400).json({ 
        error: 'Limit must be between 1 and 100',
        received: limit 
      });
    }

    // Build dynamic query
    let query = `
      SELECT 
        g.*,
        COALESCE(AVG(t.partner_rating) * 20, 0) as calculated_success_rate,
        COUNT(t.id) as review_count
      FROM gifts g
      LEFT JOIN testimonials t ON g.id = t.gift_id
      WHERE 1=1
    `;
    
    const params = [];

    if (category) {
      query += ' AND g.category = ?';
      params.push(category);
    }

    if (minPrice) {
      query += ' AND g.price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND g.price <= ?';
      params.push(parseFloat(maxPrice));
    }

    query += ' GROUP BY g.id';

    if (minSuccessRate) {
      query += ' HAVING calculated_success_rate >= ?';
      params.push(parseInt(minSuccessRate));
    }

    // Add sorting
    const validSortFields = ['price', 'success_rate', 'created_at', 'title'];
    const validSortOrders = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
      if (sortBy === 'success_rate') {
        query += ` ORDER BY calculated_success_rate ${sortOrder.toUpperCase()}`;
      } else {
        query += ` ORDER BY g.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    } else {
      query += ' ORDER BY calculated_success_rate DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const gifts = await db.all(query, params);

    // Format the response
    const formattedGifts = gifts.map(gift => ({
      id: gift.id,
      title: gift.title,
      price: parseFloat(gift.price),
      category: gift.category,
      success_rate: Math.round(gift.calculated_success_rate || gift.success_rate || 0),
      total_reviews: gift.review_count || gift.total_reviews || 0,
      image_url: gift.image_url,
      affiliate_url: gift.affiliate_url,
      description: gift.description
    }));

    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'ETag': JSON.stringify(formattedGifts).slice(0, 32)
    });

    res.json({
      gifts: formattedGifts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: formattedGifts.length,
        hasMore: formattedGifts.length === parseInt(limit)
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        minSuccessRate
      }
    });

  } catch (error) {
    console.error('Error fetching gifts:', error);
    res.status(500).json({
      error: 'Failed to fetch gifts',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 5. Enhanced gift details endpoint with testimonials
app.get('/api/gifts/:id', async (req, res) => {
  try {
    const giftId = parseInt(req.params.id);
    
    if (isNaN(giftId)) {
      return res.status(400).json({ error: 'Invalid gift ID' });
    }

    // Get gift details
    const gift = await db.get(`
      SELECT 
        g.*,
        COALESCE(AVG(t.partner_rating) * 20, 0) as calculated_success_rate,
        COUNT(t.id) as review_count
      FROM gifts g
      LEFT JOIN testimonials t ON g.id = t.gift_id
      WHERE g.id = ?
      GROUP BY g.id
    `, [giftId]);

    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // Get testimonials for this gift
    const testimonials = await db.all(`
      SELECT 
        id,
        reviewer_name,
        partner_rating,
        testimonial_text,
        relationship_stage,
        gift_occasion,
        helpful_votes,
        created_at
      FROM testimonials 
      WHERE gift_id = ?
      ORDER BY helpful_votes DESC, created_at DESC
    `, [giftId]);

    const formattedGift = {
      id: gift.id,
      title: gift.title,
      price: parseFloat(gift.price),
      category: gift.category,
      success_rate: Math.round(gift.calculated_success_rate || gift.success_rate || 0),
      total_reviews: gift.review_count || testimonials.length,
      image_url: gift.image_url,
      affiliate_url: gift.affiliate_url,
      description: gift.description
    };

    res.json({
      gift: formattedGift,
      testimonials: testimonials.map(t => ({
        id: t.id,
        reviewer_name: t.reviewer_name,
        partner_rating: t.partner_rating,
        testimonial_text: t.testimonial_text,
        relationship_stage: t.relationship_stage,
        gift_occasion: t.gift_occasion,
        helpful_votes: t.helpful_votes || 0,
        created_at: t.created_at
      }))
    });

  } catch (error) {
    console.error('Error fetching gift details:', error);
    res.status(500).json({
      error: 'Failed to fetch gift details',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// 6. Enhanced analytics endpoint with better tracking
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { eventType, giftId, sessionId, metadata } = req.body;

    if (!eventType || !sessionId) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['eventType', 'sessionId']
      });
    }

    await db.run(`
      INSERT INTO analytics (
        event_type,
        gift_id,
        session_id,
        metadata,
        user_agent,
        ip_address,
        timestamp,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      eventType,
      giftId || null,
      sessionId,
      metadata ? JSON.stringify(metadata) : null,
      req.get('User-Agent')?.substring(0, 500) || null,
      req.ip || req.connection.remoteAddress || null,
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    res.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request for analytics errors
    res.json({ success: false, error: 'Tracking failed' });
  }
});

// 7. Enhanced error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('Server Error:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  if (error.code === 'SQLITE_BUSY') {
    return res.status(503).json({ 
      error: 'Database is busy, please try again',
      retry: true
    });
  }

  if (error.code === 'SQLITE_LOCKED') {
    return res.status(503).json({ 
      error: 'Database is locked, please try again',
      retry: true
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: error.message
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
};

// 8. Rate limiting for production
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: message,
      retryAfter: Math.round(windowMs / 1000)
    });
  }
});

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // limit each IP to 200 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

const analyticsLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  50, // limit analytics events
  'Too many analytics events, please slow down.'
);

// 9. Input validation middleware
const validateGiftQuery = (req, res, next) => {
  const { 
    category, 
    minPrice, 
    maxPrice, 
    minSuccessRate, 
    limit, 
    offset,
    sortBy,
    sortOrder 
  } = req.query;

  // Validate limit
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ 
        error: 'Limit must be between 1 and 100',
        received: limit
      });
    }
  }

  // Validate offset
  if (offset !== undefined) {
    const offsetNum = parseInt(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      return res.status(400).json({ 
        error: 'Offset must be non-negative',
        received: offset
      });
    }
  }

  // Validate prices
  if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
    return res.status(400).json({ 
      error: 'Min price must be a positive number',
      received: minPrice
    });
  }

  if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0)) {
    return res.status(400).json({ 
      error: 'Max price must be a positive number',
      received: maxPrice
    });
  }

  // Validate success rate
  if (minSuccessRate !== undefined) {
    const rate = parseInt(minSuccessRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return res.status(400).json({ 
        error: 'Min success rate must be between 0 and 100',
        received: minSuccessRate
      });
    }
  }

  // Validate category
  if (category !== undefined) {
    const validCategories = ['jewelry', 'experiences', 'home', 'fashion', 'beauty', 'tech', 'unique'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category',
        received: category,
        valid: validCategories
      });
    }
  }

  next();
};

// 10. How to apply these improvements to your existing server:

/*
1. Add these imports at the top of your server.js:
   const rateLimit = require('express-rate-limit');

2. Apply middleware in this order:
   app.use(cors(corsOptions));
   app.use(requestLogger);
   app.use('/api', generalLimiter);
   app.use(express.json({ limit: '10mb' }));

3. Update your existing routes:
   - Replace your /api/gifts route with the enhanced version above
   - Replace your /api/gifts/:id route with the enhanced version above
   - Replace your /api/analytics/track route with the enhanced version above
   - Replace your /api/health route with the enhanced version above

4. Add error handling at the end:
   app.use(errorHandler);

5. Add these environment variables to your .env:
   NODE_ENV=production
   LOG_LEVEL=info

6. Test the improvements:
   - Verify CORS works with your frontend domain
   - Test rate limiting by making many requests
   - Check that error responses are properly formatted
   - Verify analytics tracking works
   - Test the enhanced health check endpoint
*/

console.log("✅ Backend enhancements ready to implement!");
console.log("📝 Apply these changes to your existing server.js file");
console.log("🚀 Expected improvements:");
console.log("   - Better error handling and user feedback");
console.log("   - Enhanced performance with caching");
console.log("   - Rate limiting for production stability");
console.log("   - Comprehensive request logging");
console.log("   - Input validation and security");
