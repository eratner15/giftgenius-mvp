// Vercel serverless function for health check

module.exports = (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({ status: 'OK', message: 'GiftGenius API is running' });
};
