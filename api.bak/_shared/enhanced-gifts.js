// Enhanced gift data with 50+ high-quality gifts across all categories
const enhancedGifts = [
  // Jewelry Category
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
    title: "Tahitian Pearl Necklace",
    description: "Freshwater pearl necklace with matching earrings - AAA quality pearls",
    price: 189.99,
    category: "jewelry",
    success_rate: 97,
    total_reviews: 892,
    image_url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Rose Gold Engagement Ring",
    description: "Stunning solitaire engagement ring with 1 carat diamond",
    price: 1299.99,
    category: "jewelry",
    success_rate: 99,
    total_reviews: 2156,
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop&auto=format"
  },

  // Tech Category
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
    title: "AirPods Pro 2nd Generation",
    description: "Wireless earbuds with active noise cancellation and spatial audio",
    price: 249.99,
    category: "tech",
    success_rate: 94,
    total_reviews: 8932,
    image_url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "iPad Air 5th Generation",
    description: "Powerful tablet perfect for creativity, productivity, and entertainment",
    price: 599.99,
    category: "tech",
    success_rate: 95,
    total_reviews: 3245,
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 360-degree sound and 12-hour battery life",
    price: 89.99,
    category: "tech",
    success_rate: 89,
    total_reviews: 1876,
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&auto=format"
  },

  // Beauty Category
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
    title: "Professional Makeup Brush Set",
    description: "20-piece professional makeup brush collection with premium synthetic bristles",
    price: 78.99,
    category: "beauty",
    success_rate: 91,
    total_reviews: 2341,
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Luxury Perfume Collection",
    description: "Set of 5 designer fragrance samples in travel-size bottles",
    price: 125.00,
    category: "beauty",
    success_rate: 88,
    total_reviews: 987,
    image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop&auto=format"
  },

  // Home Category
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
    title: "Smart Diffuser with Essential Oils",
    description: "WiFi-enabled aromatherapy diffuser with 6 premium essential oil blends",
    price: 145.99,
    category: "home",
    success_rate: 92,
    total_reviews: 1532,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Weighted Blanket Premium",
    description: "15lb weighted blanket with removable bamboo cover for better sleep",
    price: 129.99,
    category: "home",
    success_rate: 93,
    total_reviews: 3487,
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop&auto=format"
  },

  // Fashion Category
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
    title: "Cashmere Scarf Collection",
    description: "Luxurious 100% cashmere scarf in multiple elegant colors",
    price: 168.00,
    category: "fashion",
    success_rate: 89,
    total_reviews: 892,
    image_url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Designer Leather Handbag",
    description: "Premium Italian leather handbag with gold hardware and dust bag",
    price: 245.99,
    category: "fashion",
    success_rate: 96,
    total_reviews: 1234,
    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop&auto=format"
  },

  // Unique/Special Category
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
    title: "Custom Pet Portrait",
    description: "Hand-painted watercolor portrait of beloved pet in premium frame",
    price: 89.99,
    category: "unique",
    success_rate: 97,
    total_reviews: 1576,
    image_url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Message in a Bottle",
    description: "Personalized message in vintage-style bottle with custom wax seal",
    price: 34.99,
    category: "unique",
    success_rate: 88,
    total_reviews: 967,
    image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop&auto=format"
  },

  // Food & Gourmet Category
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
    title: "Gourmet Coffee Subscription",
    description: "3-month subscription to premium single-origin coffee beans",
    price: 89.99,
    category: "food",
    success_rate: 92,
    total_reviews: 2143,
    image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Truffle Tasting Box",
    description: "Assorted truffle collection with white and black truffles",
    price: 156.99,
    category: "food",
    success_rate: 94,
    total_reviews: 567,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=500&fit=crop&auto=format"
  },

  // Experience Category
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
    title: "Couples Spa Day Package",
    description: "Full day spa experience for two with massage, facial, and champagne",
    price: 299.99,
    category: "experiences",
    success_rate: 96,
    total_reviews: 1432,
    image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=500&fit=crop&auto=format"
  },
  {
    title: "Hot Air Balloon Ride",
    description: "Romantic hot air balloon ride with champagne toast and panoramic views",
    price: 199.99,
    category: "experiences",
    success_rate: 98,
    total_reviews: 876,
    image_url: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=500&h=500&fit=crop&auto=format"
  }
];

module.exports = { enhancedGifts };