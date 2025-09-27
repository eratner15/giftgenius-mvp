const { setCorsHeaders } = require('./_shared/cors');
const { validateGiftQueryParams } = require('./_shared/validation');
const { enhancedGifts } = require('./_shared/enhanced-gifts');

module.exports = function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) {
    return; // Preflight request was handled
  }

  const startTime = Date.now();
  const { method, query } = req;

  try {
    if (method === 'GET') {
      return handleGetGifts(req, res, startTime);
    } else {
      res.status(405).json({
        error: 'Method not allowed',
        message: `${method} method is not supported for this endpoint`,
        allowed_methods: ['GET']
      });
    }
  } catch (error) {
    console.error('API Error:', error);

    const processingTime = Date.now() - startTime;

    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function handleGetGifts(req, res, startTime) {
  const validated = validateGiftQueryParams(req.query);

  console.log('GET /api/gifts', {
    query: validated,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.slice(0, 100),
    timestamp: new Date().toISOString()
  });

  try {
    // Use in-memory filtering instead of SQLite for Vercel compatibility
    let gifts = [...enhancedGifts];

    // Apply filters
    if (validated.category) {
      gifts = gifts.filter(gift => gift.category === validated.category);
    }

    if (validated.minPrice !== undefined) {
      gifts = gifts.filter(gift => gift.price >= validated.minPrice);
    }

    if (validated.maxPrice !== undefined) {
      gifts = gifts.filter(gift => gift.price <= validated.maxPrice);
    }

    if (validated.minSuccessRate !== undefined) {
      gifts = gifts.filter(gift => gift.success_rate >= validated.minSuccessRate);
    }

    if (validated.search) {
      const searchTerm = validated.search.toLowerCase();
      gifts = gifts.filter(gift =>
        gift.title.toLowerCase().includes(searchTerm) ||
        gift.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by success rate and reviews
    gifts.sort((a, b) => {
      if (b.success_rate !== a.success_rate) {
        return b.success_rate - a.success_rate;
      }
      return b.total_reviews - a.total_reviews;
    });

    const total = gifts.length;

    // Apply pagination
    const startIndex = validated.offset || 0;
    const endIndex = startIndex + (validated.limit || 50);
    gifts = gifts.slice(startIndex, endIndex);

    const processingTime = Date.now() - startTime;

    // Return the results
    const response = {
      gifts,
      pagination: {
        total,
        count: gifts.length,
        limit: validated.limit,
        offset: validated.offset,
        has_more: validated.offset + gifts.length < total
      },
      filters: {
        category: validated.category,
        minPrice: validated.minPrice,
        maxPrice: validated.maxPrice,
        minSuccessRate: validated.minSuccessRate,
        search: validated.search
      },
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Query successful: ${gifts.length} gifts returned in ${processingTime}ms`);

    res.status(200).json(response);

  } catch (error) {
    console.error('Database query error:', error);

    const processingTime = Date.now() - startTime;

    res.status(500).json({
      error: 'Database error',
      message: 'Failed to fetch gifts from database',
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
}