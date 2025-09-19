const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const db = new sqlite3.Database('./giftgenius.db');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate session ID
function generateSessionId() {
  return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Helper to run database queries with promises
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

// Calculate and update gift success rates
async function calculateSuccessRates() {
  try {
    const sql = `
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
    `;
    await runStatement(sql);
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

    let query = 'SELECT * FROM gifts WHERE is_active = 1';
    const params = [];

    // Build filters
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

    // Sorting options
    const sortOptions = {
      'success_rate': 'success_rate DESC, total_reviews DESC',
      'price_low': 'price ASC',
      'price_high': 'price DESC',
      'newest': 'created_at DESC',
      'popular': 'total_reviews DESC'
    };
    query += ` ORDER BY ${sortOptions[sortBy] || sortOptions['success_rate']}`;

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const countResult = await runQuery(countQuery, params);
    const totalCount = countResult[0].count;

    // Add pagination
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

// Get single gift with testimonials
app.get('/api/gifts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get gift details
    const giftQuery = 'SELECT * FROM gifts WHERE id = ? AND is_active = 1';
    const gifts = await runQuery(giftQuery, [id]);

    if (gifts.length === 0) {
      return res.status(404).json({ error: 'Gift not found' });
    }

    // Get testimonials
    const testimonialQuery = `
      SELECT * FROM testimonials
      WHERE gift_id = ?
      ORDER BY partner_rating DESC, helpful_votes DESC, created_at DESC
      LIMIT 10
    `;
    const testimonials = await runQuery(testimonialQuery, [id]);

    // Get similar gifts (same category, different gift)
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

// Get all testimonials for a gift
app.get('/api/testimonials/:giftId', async (req, res) => {
  try {
    const { giftId } = req.params;
    const query = `
      SELECT * FROM testimonials
      WHERE gift_id = ?
      ORDER BY partner_rating DESC, helpful_votes DESC, created_at DESC
    `;
    const testimonials = await runQuery(query, [giftId]);
    res.json(testimonials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching testimonials' });
  }
});

// Mark testimonial as helpful
app.post('/api/testimonials/:testimonialId/helpful', async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const updateQuery = `
      UPDATE testimonials
      SET helpful_votes = helpful_votes + 1
      WHERE id = ?
    `;
    await runStatement(updateQuery, [testimonialId]);

    const selectQuery = 'SELECT helpful_votes FROM testimonials WHERE id = ?';
    const result = await runQuery(selectQuery, [testimonialId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json({ helpful_votes: result[0].helpful_votes });
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
        CAST(AVG(success_rate) AS INTEGER) as avg_success_rate
      FROM gifts
      WHERE is_active = 1
      GROUP BY category
      ORDER BY count DESC
    `;
    const categories = await runQuery(query);

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
      SELECT *,
        COALESCE(success_rate, 0) as success_rate,
        COALESCE(total_reviews, 0) as total_reviews
      FROM gifts
      WHERE is_active = 1
        AND price >= ? AND price <= ?
        AND delivery_days <= ?
    `;

    const params = [priceRange.min, priceRange.max, maxDeliveryDays];

    if (occasion && occasion !== 'any') {
      query += ' AND occasion = ?';
      params.push(occasion);
    }

    query += `
      ORDER BY
        CASE WHEN success_rate IS NOT NULL THEN 1 ELSE 2 END,
        success_rate DESC,
        total_reviews DESC
      LIMIT 5
    `;

    const gifts = await runQuery(query, params);
    res.json(gifts);
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
        AND datetime(a.created_at) > datetime('now', '-7 days')
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
      WHERE datetime(created_at) > datetime('now', '-7 days')
    `;

    // Category performance
    const categoryQuery = `
      SELECT
        g.category,
        COUNT(DISTINCT a.session_id) as unique_views,
        COUNT(CASE WHEN a.event_type = 'click_buy' THEN 1 END) as purchases
      FROM analytics a
      JOIN gifts g ON a.gift_id = g.id
      WHERE datetime(a.created_at) > datetime('now', '-7 days')
      GROUP BY g.category
      ORDER BY unique_views DESC
    `;

    const [topViewed, conversion, categories] = await Promise.all([
      runQuery(topViewedQuery),
      runQuery(conversionQuery),
      runQuery(categoryQuery)
    ]);

    res.json({
      topViewedGifts: topViewed,
      conversionFunnel: conversion[0],
      categoryPerformance: categories
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
      WHERE is_active = 1
        AND (
          LOWER(title) LIKE LOWER(?)
          OR LOWER(description) LIKE LOWER(?)
          OR LOWER(category) LIKE LOWER(?)
        )
      ORDER BY success_rate DESC
      LIMIT ?
    `;

    const searchTerm = `%${q}%`;
    const gifts = await runQuery(query, [searchTerm, searchTerm, searchTerm, parseInt(limit)]);

    res.json(gifts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error searching gifts' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await runQuery('SELECT 1');
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
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});