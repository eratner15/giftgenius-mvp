// CORS configuration for Vercel functions
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://giftgenius-mvp.vercel.app',
    'https://giftgenius-l6me3ymz6-eratner15s-projects.vercel.app',
    /^https:\/\/.*-eratner15s-projects\.vercel\.app$/,
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  // Check if origin is allowed
  const isAllowed = corsOptions.origin.some(allowed => {
    if (typeof allowed === 'string') {
      return allowed === origin;
    } else if (allowed instanceof RegExp) {
      return allowed.test(origin);
    }
    return false;
  });

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true; // Indicates preflight was handled
  }

  return false; // Continue with normal request processing
}

module.exports = { setCorsHeaders, corsOptions };