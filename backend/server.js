const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost/giftgenius'
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate session ID
function generateSessionId() {
  return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Calculate and update gift success rates
async function calculateSuccessRates() {
  try {
    const query = `
      UPDATE gifts g
      SET
        success_rate = subquery.rate,
        total_reviews = subquery.count
      FROM (
        SELECT
          gift_id,
          COUNT(*) as count,
          ROUND(100.0 * COUNT(CASE WHEN partner_rating >= 4 THEN 1 END) / COUNT(*)) as rate
        FROM testimonials
        GROUP BY gift_id
        HAVING COUNT(*) >= 3
      ) as subquery
      WHERE g.id = subquery.gift_id
    `;
    await pool.query(query);
    console.log('Success rates updated');
  } catch (err) {
    console.error('Error updating success rates:', err);
  }
}

// Routes

// Get all gifts with filters and pagination
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

    let query = 'SELECT * FROM gifts WHERE is_active = true';
    const params = [];
    let paramCount = 0;

    // Build filters
    if (category) {
      params.push(category);
      query += ` AND category = $${++paramCount}`;
    }
    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${++paramCount}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${++paramCount}`;
    }
    if (occasion) {
      params.push(occasion);
      query += ` AND occasion = $${++paramCount}`;
    }
    if (relationshipStage) {
      params.push(relationshipStage);
      query += ` AND relationship_stage = $${++paramCount}`;
    }
    if (minSuccessRate) {
      params.push(minSuccessRate);
      query += ` AND success_rate >= $${++paramCount}`;
    }

    // Sorting options
    const sortOptions = {
      'success_rate': 'success_rate DESC NULLS LAST, total_reviews DESC',
      'price_low': 'price ASC',
      'price_high': 'price DESC',
      'newest': 'created_at DESC',
      'popular': 'total_reviews DESC NULLS LAST'
    };
    query += ` ORDER BY ${sortOptions[sortBy] || sortOptions['success_rate']}`;

    // Pagination
    params.push(limit);
    query += ` LIMIT $${++paramCount}`;
    params.push(offset);
    query += ` OFFSET $${++paramCount}`;

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM gifts WHERE is_active = true';
    const countParams = [];
    paramCount = 0;

    if (category) {
      countParams.push(category);
      countQuery += ` AND category = $${++paramCount}`;
    }
    if (minPrice) {
      countParams.push(minPrice);
      countQuery += ` AND price >= $${++paramCount}`;
    }
    if (maxPrice) {
      countParams.push(maxPrice);
      countQuery += ` AND price <= $${++paramCount}`;
    }
    if (occasion) {
      countParams.push(occasion);
      countQuery += ` AND occasion = $${++paramCount}`;
    }
    if (relationshipStage) {
      countParams.push(relationshipStage);
      countQuery += ` AND relationship_stage = $${++paramCount}`;
    }
    if (minSuccessRate) {
      countParams.push(minSuccessRate);
      countQuery += ` AND success_rate >= $${++paramCount}`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      gifts: result.rows,
      total: totalCount,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching gifts' });
  }
});

// Get single gift with testimonials
app.get('/api/gifts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get gift details
    const giftQuery = 'SELECT * FROM gifts WHERE id = $1 AND is_active = true';
    const giftResult = await pool.query(giftQuery, [id]);

    if (giftResult.rows.length === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // Get testimonials
    const testimonialQuery = `
      SELECT * FROM testimonials
      WHERE gift_id = $1
      ORDER BY partner_rating DESC, helpful_votes DESC, created_at DESC
      LIMIT 10
    `;
    const testimonialResult = await pool.query(testimonialQuery, [id]);

    // Get similar gifts (same category, different gift)
    const similarQuery = `
      SELECT * FROM gifts
      WHERE category = $1 AND id != $2 AND is_active = true
      ORDER BY success_rate DESC NULLS LAST
      LIMIT 4
    `;
    const similarResult = await pool.query(similarQuery, [giftResult.rows[0].category, id]);

    res.json({
      gift: giftResult.rows[0],
      testimonials: testimonialResult.rows,
      similarGifts: similarResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching gift details' });
  }
});

// Get all testimonials for a gift
app.get('/api/testimonials/:giftId', async (req, res) => {
  try {
    const { giftId } = req.params;
    const query = `
      SELECT * FROM testimonials
      WHERE gift_id = $1
      ORDER BY partner_rating DESC, helpful_votes DESC, created_at DESC
    `;
    const result = await pool.query(query, [giftId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
});

// Mark testimonial as helpful
app.post('/api/testimonials/:testimonialId/helpful', async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const query = `
      UPDATE testimonials
      SET helpful_votes = helpful_votes + 1
      WHERE id = $1
      RETURNING helpful_votes
    `;
    const result = await pool.query(query, [testimonialId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ helpful_votes: result.rows[0].helpful_votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating testimonial' });
  }
});

// Get categories with counts
app.get('/api/categories', async (req, res) => {
  try {
    const query = `
      SELECT
        category,
        COUNT(*) as count,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(success_rate)::INTEGER as avg_success_rate
      FROM gifts
      WHERE is_active = true
      GROUP BY category
      ORDER BY count DESC
    `;
    const result = await pool.query(query);

    // Add display names and icons for categories
    const categoryInfo = {
      jewelry: { name: 'Jewelry', icon: '💎' },
      experiences: { name: 'Experiences', icon: '🎭' },
      home: { name: 'Home & Living', icon: '🏠' },
      fashion: { name: 'Fashion', icon: '👗' },
      beauty: { name: 'Beauty & Wellness', icon: '💄' },
      tech: { name: 'Tech & Gadgets', icon: '📱' },
      unique: { name: 'Unique & Creative', icon: '✨' }
    };

    const categories = result.rows.map(row => ({
      ...row,
      displayName: categoryInfo[row.category]?.name || row.category,
      icon: categoryInfo[row.category]?.icon || '🎁'
    }));

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

// Quick recommendations endpoint
app.get('/api/gifts/quick-recommend', async (req, res) => {
  try {
    const { budget, occasion, urgency } = req.query;

    // Define price ranges
    let priceRange = { min: 0, max: 10000 };
    if (budget === 'low') priceRange = { min: 0, max: 50 };
    if (budget === 'medium') priceRange = { min: 50, max: 150 };
    if (budget === 'high') priceRange = { min: 150, max: 500 };
    if (budget === 'luxury') priceRange = { min: 500, max: 10000 };

    // Define delivery urgency
    let maxDeliveryDays = 30;
    if (urgency === 'today') maxDeliveryDays = 0;
    if (urgency === 'week') maxDeliveryDays = 7;
    if (urgency === 'month') maxDeliveryDays = 30;

    let query = `
      SELECT g.*,
        COALESCE(g.success_rate, 0) as success_rate,
        COALESCE(g.total_reviews, 0) as total_reviews
      FROM gifts g
      WHERE g.is_active = true
        AND g.price >= $1 AND g.price <= $2
        AND g.delivery_days <= $3
    `;

    const params = [priceRange.min, priceRange.max, maxDeliveryDays];

    if (occasion && occasion !== 'any') {
      params.push(occasion);
      query += ` AND g.occasion = $4`;
    }

    query += `
      ORDER BY
        CASE WHEN g.success_rate IS NOT NULL THEN 1 ELSE 2 END,
        g.success_rate DESC,
        g.total_reviews DESC
      LIMIT 5
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error getting recommendations' });
  }
});

// Track analytics events
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { eventType, giftId, sessionId, metadata } = req.body;

    const query = `
      INSERT INTO analytics (event_type, gift_id, session_id, metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const result = await pool.query(query, [
      eventType,
      giftId || null,
      sessionId || generateSessionId(),
      metadata || {}
    ]);

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error tracking analytics' });
  }
});

// Get analytics summary (admin endpoint)
app.get('/api/analytics/summary', async (req, res) => {
  try {
    // Top viewed gifts
    const topViewedQuery = `
      SELECT
        g.id,
        g.title,
        g.category,
        g.price,
        COUNT(a.id) as view_count
      FROM analytics a
      JOIN gifts g ON a.gift_id = g.id
      WHERE a.event_type = 'view_gift'
        AND a.created_at > NOW() - INTERVAL '7 days'
      GROUP BY g.id, g.title, g.category, g.price
      ORDER BY view_count DESC
      LIMIT 10
    `;

    // Conversion funnel
    const conversionQuery = `
      SELECT
        COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as visitors,
        COUNT(DISTINCT CASE WHEN event_type = 'view_gift' THEN session_id END) as viewers,
        COUNT(DISTINCT CASE WHEN event_type = 'click_buy' THEN session_id END) as clickers,
        ROUND(
          100.0 * COUNT(DISTINCT CASE WHEN event_type = 'click_buy' THEN session_id END) /
          NULLIF(COUNT(DISTINCT CASE WHEN event_type = 'view_gift' THEN session_id END), 0),
          2
        ) as conversion_rate
      FROM analytics
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;

    // Category performance
    const categoryQuery = `
      SELECT
        g.category,
        COUNT(DISTINCT a.session_id) as unique_views,
        COUNT(CASE WHEN a.event_type = 'click_buy' THEN 1 END) as purchases
      FROM analytics a
      JOIN gifts g ON a.gift_id = g.id
      WHERE a.created_at > NOW() - INTERVAL '7 days'
      GROUP BY g.category
      ORDER BY unique_views DESC
    `;

    const [topViewed, conversion, categories] = await Promise.all([
      pool.query(topViewedQuery),
      pool.query(conversionQuery),
      pool.query(categoryQuery)
    ]);

    res.json({
      topViewedGifts: topViewed.rows,
      conversionFunnel: conversion.rows[0],
      categoryPerformance: categories.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching analytics' });
  }
});

// Search gifts
app.get('/api/gifts/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const query = `
      SELECT * FROM gifts
      WHERE is_active = true
        AND (
          LOWER(title) LIKE LOWER($1)
          OR LOWER(description) LIKE LOWER($1)
          OR LOWER(category) LIKE LOWER($1)
        )
      ORDER BY success_rate DESC NULLS LAST
      LIMIT $2
    `;

    const searchTerm = `%${q}%`;
    const result = await pool.query(query, [searchTerm, limit]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error searching gifts' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Initialize success rates on startup
calculateSuccessRates();

// Update success rates periodically
setInterval(calculateSuccessRates, 5 * 60 * 1000); // Every 5 minutes

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});