const { setCorsHeaders } = require('./_shared/cors');

export default function handler(req, res) {
  // Handle CORS
  if (setCorsHeaders(req, res)) {
    return; // Preflight request was handled
  }

  try {
    res.status(200).json({
      status: 'healthy',
      message: 'GiftGenius API is operational',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime ? process.uptime() : null
    });
  } catch (error) {
    console.error('Health check error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}