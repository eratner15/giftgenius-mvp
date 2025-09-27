const app = require('./index.js');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🎁 GiftGenius API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});