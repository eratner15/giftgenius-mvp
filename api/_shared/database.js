const Database = require('better-sqlite3');
const path = require('path');
const { enhancedGifts } = require('./enhanced-gifts');

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'api', 'gifts.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    success_rate INTEGER NOT NULL,
    total_reviews INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Enhanced gift database with comprehensive data and high-quality images
const sampleGifts = [
  {
    title: "Personalized Star Map",
    description: "Custom star map showing the night sky from any date and location - perfect for anniversaries",
    price: 45.99,
    category: "unique",
    success_rate: 95,
    total_reviews: 2847,
    image_url: "https://images.unsplash.com/photo-1446776676547-bc4daea5638e?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Diamond Tennis Bracelet",
    description: "Elegant 14k white gold bracelet with genuine diamonds - a timeless classic",
    price: 299.99,
    category: "jewelry",
    success_rate: 98,
    total_reviews: 1523,
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Wine Tasting Experience",
    description: "Private wine tasting session at a local vineyard - create lasting memories together",
    price: 120.00,
    category: "experiences",
    success_rate: 92,
    total_reviews: 987,
    image_url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Luxury Silk Pillowcase Set",
    description: "100% Mulberry silk pillowcases for better sleep and skincare - hypoallergenic and temperature regulating",
    price: 89.99,
    category: "home",
    success_rate: 94,
    total_reviews: 2156,
    image_url: "https://images.unsplash.com/photo-1587222318667-31212ce2828d?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Premium Rose Gold Watch",
    description: "Sophisticated rose gold watch with leather band - perfect for special occasions",
    price: 185.00,
    category: "fashion",
    success_rate: 91,
    total_reviews: 743,
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Luxury Skincare Ritual Set",
    description: "Complete skincare routine with organic ingredients - vitamin C serum, retinol, and moisturizer",
    price: 156.99,
    category: "beauty",
    success_rate: 94,
    total_reviews: 1876,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Apple Watch Series 9",
    description: "Latest Apple Watch with health monitoring, GPS, and cellular connectivity",
    price: 399.99,
    category: "tech",
    success_rate: 96,
    total_reviews: 4521,
    image_url: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Artisan Belgian Chocolate Collection",
    description: "Handcrafted chocolates from premium Belgian cocoa - 24 piece luxury gift box",
    price: 62.50,
    category: "food",
    success_rate: 88,
    total_reviews: 1294,
    image_url: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Tahitian Pearl Necklace",
    description: "Freshwater pearl necklace with matching earrings - AAA quality pearls",
    price: 189.99,
    category: "jewelry",
    success_rate: 97,
    total_reviews: 892,
    image_url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop"
  },
  {
    title: "Cooking Class Voucher",
    description: "Professional cooking class with celebrity chef",
    price: 95.00,
    category: "experiences",
    success_rate: 93,
    total_reviews: 567,
    image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop"
  },
  {
    title: "Smart Home Starter Kit",
    description: "Complete smart home automation system",
    price: 179.99,
    category: "tech",
    success_rate: 90,
    total_reviews: 2034,
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
  },
  {
    title: "Designer Handbag",
    description: "Genuine leather handbag from Italian designer",
    price: 345.00,
    category: "fashion",
    success_rate: 95,
    total_reviews: 1243,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
  },
  {
    title: "Essential Oil Diffuser Set",
    description: "Ultrasonic diffuser with premium essential oil collection",
    price: 79.99,
    category: "home",
    success_rate: 87,
    total_reviews: 1687,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"
  },
  {
    title: "Anti-Aging Serum",
    description: "Clinical-grade retinol serum for youthful skin",
    price: 124.50,
    category: "beauty",
    success_rate: 92,
    total_reviews: 2378,
    image_url: "https://images.unsplash.com/photo-1556228578-626910d5d61a?w=400&h=400&fit=crop"
  },
  {
    title: "Custom Portrait Commission",
    description: "Hand-painted portrait by professional artist",
    price: 225.00,
    category: "unique",
    success_rate: 99,
    total_reviews: 456,
    image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop"
  },
  {
    title: "Gold Chain Bracelet",
    description: "18k gold plated chain bracelet with charm",
    price: 167.99,
    category: "jewelry",
    success_rate: 94,
    total_reviews: 1089,
    image_url: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400&h=400&fit=crop"
  },
  {
    title: "Spa Day Package",
    description: "Full day spa experience with massage and facial",
    price: 180.00,
    category: "experiences",
    success_rate: 96,
    total_reviews: 734,
    image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop"
  },
  {
    title: "Wireless Earbuds Pro",
    description: "Premium noise-canceling wireless earbuds",
    price: 199.99,
    category: "tech",
    success_rate: 91,
    total_reviews: 3256,
    image_url: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=400&h=400&fit=crop"
  },
  {
    title: "Cashmere Sweater",
    description: "100% pure cashmere sweater in multiple colors",
    price: 289.00,
    category: "fashion",
    success_rate: 98,
    total_reviews: 867,
    image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop"
  },
  {
    title: "Aromatherapy Starter Set",
    description: "Complete aromatherapy kit with diffuser and oils",
    price: 92.50,
    category: "home",
    success_rate: 85,
    total_reviews: 1456,
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop"
  },
  {
    title: "Luxury Face Mask Set",
    description: "Professional-grade hydrating face masks",
    price: 78.99,
    category: "beauty",
    success_rate: 89,
    total_reviews: 2134,
    image_url: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop"
  },
  {
    title: "Craft Beer Brewing Kit",
    description: "Complete home brewing kit for craft beer enthusiasts",
    price: 134.99,
    category: "unique",
    success_rate: 86,
    total_reviews: 1012,
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop"
  },
  {
    title: "Statement Earrings",
    description: "Bold geometric earrings with crystal accents",
    price: 76.50,
    category: "jewelry",
    success_rate: 93,
    total_reviews: 1567,
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
  },
  {
    title: "Virtual Reality Headset",
    description: "Immersive VR experience with wireless controller",
    price: 399.99,
    category: "tech",
    success_rate: 88,
    total_reviews: 2789,
    image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=400&fit=crop"
  }
];

// Initialize database with sample data
function initializeDatabase() {
  try {
    // Check if gifts table has data
    const count = db.prepare('SELECT COUNT(*) as count FROM gifts').get();

    if (count.count === 0) {
      console.log('Initializing database with sample gifts...');

      const insertGift = db.prepare(`
        INSERT INTO gifts (title, description, price, category, success_rate, total_reviews, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((gifts) => {
        for (const gift of gifts) {
          insertGift.run(
            gift.title,
            gift.description,
            gift.price,
            gift.category,
            gift.success_rate,
            gift.total_reviews,
            gift.image_url
          );
        }
      });

      insertMany(enhancedGifts);
      console.log(`Inserted ${enhancedGifts.length} enhanced gifts into database`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize on module load
initializeDatabase();

module.exports = { db };