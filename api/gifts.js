// Vercel serverless function for gifts API - Static data version

module.exports = (req, res) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
              return res.status(200).end();
      }

      // Static gift data
      const allGifts = [
          {
                    id: 1,
                    title: 'Luxury Silk Pillowcase Set',
                    description: '100% Mulberry silk pillowcases for better sleep and skincare',
                    price: 89.99,
                    category: 'home',
                    occasion: 'anniversary',
                    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
                    success_rate: 94
          },
          {
                    id: 2,
                    title: 'LED Mirror Jewelry Organizer',
                    description: 'Elegant jewelry box with LED lighting and smart compartments',
                    price: 79.99,
                    category: 'jewelry',
                    occasion: 'birthday',
                    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
                    success_rate: 88
          },
          {
                    id: 3,
                    title: 'Custom Night Sky Star Map',
                    description: 'Capture the stars from your special night - first date, wedding, anniversary',
                    price: 59.99,
                    category: 'unique',
                    occasion: 'anniversary',
                    image_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
                    success_rate: 92
          },
          {
                    id: 4,
                    title: 'Designer Fragrance Sampler',
                    description: 'Collection of 10 luxury perfume samples with certificate',
                    price: 75.00,
                    category: 'beauty',
                    occasion: 'birthday',
                    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
                    success_rate: 91
          },
          {
                    id: 5,
                    title: 'WiFi Digital Photo Frame',
                    description: 'Share photos instantly from anywhere - perfect for memories',
                    price: 199.99,
                    category: 'tech',
                    occasion: 'valentine',
                    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
                    success_rate: 93
          }
            ];

      // Apply filters from query parameters
      const { category, occasion, minPrice, maxPrice } = req.query;
      let filteredGifts = [...allGifts];

      if (occasion) {
              filteredGifts = filteredGifts.filter(gift => gift.occasion === occasion);
      }

      if (category) {
              filteredGifts = filteredGifts.filter(gift => gift.category === category);
      }

      if (minPrice) {
              filteredGifts = filteredGifts.filter(gift => gift.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
              filteredGifts = filteredGifts.filter(gift => gift.price <= parseFloat(maxPrice));
      }

      res.status(200).json({ gifts: filteredGifts });
};
