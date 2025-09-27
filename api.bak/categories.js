const { db } = require('./_shared/database');
const { setCorsHeaders } = require('./_shared/cors');

export default function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) {
    return; // Preflight request was handled
  }

  const startTime = Date.now();
  const { method } = req;

  try {
    if (method === 'GET') {
      return handleGetCategories(req, res, startTime);
    } else {
      res.status(405).json({
        error: 'Method not allowed',
        message: `${method} method is not supported for this endpoint`,
        allowed_methods: ['GET']
      });
    }
  } catch (error) {
    console.error('Categories API Error:', error);

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

function handleGetCategories(req, res, startTime) {
  console.log('GET /api/categories', {
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']?.slice(0, 100),
    timestamp: new Date().toISOString()
  });

  try {
    // Get categories with counts
    const query = `
      SELECT
        category,
        COUNT(*) as count,
        AVG(price) as avg_price,
        AVG(success_rate) as avg_success_rate
      FROM gifts
      GROUP BY category
      ORDER BY count DESC
    `;

    const stmt = db.prepare(query);
    const categories = stmt.all();

    // Format the response
    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat.count,
      avg_price: Math.round(cat.avg_price * 100) / 100, // Round to 2 decimal places
      avg_success_rate: Math.round(cat.avg_success_rate)
    }));

    const processingTime = Date.now() - startTime;

    const response = {
      categories: formattedCategories,
      total_categories: categories.length,
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Categories query successful: ${categories.length} categories in ${processingTime}ms`);

    res.status(200).json(response);

  } catch (error) {
    console.error('Database query error:', error);

    const processingTime = Date.now() - startTime;

    res.status(500).json({
      error: 'Database error',
      message: 'Failed to fetch categories from database',
      processing_time_ms: processingTime,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
}