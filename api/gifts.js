const { db } = require('./_shared/database');
const { setCorsHeaders } = require('./_shared/cors');
const { validateGiftQueryParams } = require('./_shared/validation');

export default function handler(req, res) {
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
    let sqlQuery = 'SELECT * FROM gifts WHERE 1=1';
    const params = [];

    if (validated.category) {
      sqlQuery += ' AND category = ?';
      params.push(validated.category);
    }

    if (validated.minPrice !== undefined) {
      sqlQuery += ' AND price >= ?';
      params.push(validated.minPrice);
    }

    if (validated.maxPrice !== undefined) {
      sqlQuery += ' AND price <= ?';
      params.push(validated.maxPrice);
    }

    if (validated.minSuccessRate !== undefined) {
      sqlQuery += ' AND success_rate >= ?';
      params.push(validated.minSuccessRate);
    }

    if (validated.search) {
      sqlQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchPattern = `%${validated.search}%`;
      params.push(searchPattern, searchPattern);
    }

    // Add ordering and pagination
    sqlQuery += ' ORDER BY success_rate DESC, total_reviews DESC';

    if (validated.limit) {
      sqlQuery += ' LIMIT ?';
      params.push(validated.limit);
    }

    if (validated.offset) {
      sqlQuery += ' OFFSET ?';
      params.push(validated.offset);
    }

    const stmt = db.prepare(sqlQuery);
    const gifts = stmt.all(...params);

    let countQuery = 'SELECT COUNT(*) as total FROM gifts WHERE 1=1';
    const countParams = [];

    if (validated.category) {
      countQuery += ' AND category = ?';
      countParams.push(validated.category);
    }

    if (validated.minPrice !== undefined) {
      countQuery += ' AND price >= ?';
      countParams.push(validated.minPrice);
    }

    if (validated.maxPrice !== undefined) {
      countQuery += ' AND price <= ?';
      countParams.push(validated.maxPrice);
    }

    if (validated.minSuccessRate !== undefined) {
      countQuery += ' AND success_rate >= ?';
      countParams.push(validated.minSuccessRate);
    }

    if (validated.search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchPattern = `%${validated.search}%`;
      countParams.push(searchPattern, searchPattern);
    }

    const countStmt = db.prepare(countQuery);
    const { total } = countStmt.get(...countParams);

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