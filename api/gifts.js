

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
          return res.status(200).end();
    }

    try {
          // Initialize database
      const db = new sqlite3.Database('/tmp/giftgenius.db');

      // Create table if not exists
      await new Promise((resolve, reject) => {
              db.serialize(() => {
                        db.run(`CREATE TABLE IF NOT EXISTS gifts (
                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            title TEXT, description TEXT, price REAL, category TEXT,
                                                      occasion TEXT, image_url TEXT, success_rate INTEGER)
                                                              `, () => {
                                    // Add sample data
                                         db.run(`INSERT OR IGNORE INTO gifts (title, description, price, category, occasion, image_url, success_rate) VALUES
                                                     ('Jewelry Box', 'Elegant jewelry organizer', 79.99, 'jewelry', 'birthday', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', 88),
                                                                 ('Silk Pillowcase', '100% Mulberry silk pillowcases', 89.99, 'home', 'anniversary', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 94)
                                                                           `);
                                    resolve();
                        });
              });
      });

      // Query gifts with filters
      const { category, occasion, minPrice, maxPrice } = req.query;
          let query = 'SELECT * FROM gifts WHERE 1=1';
          const params = [];

      if (occasion) { query += ' AND occasion = ?'; params.push(occasion); }
          if (category) { query += ' AND category = ?'; params.push(category); }

      const gifts = await new Promise((resolve, reject) => {
              db.all(query, params, (err, rows) => {
                        if (err) reject(err); else resolve(rows);
              });
      });

      res.json({ gifts });
    } catch (error) {
          res.status(500).json({ error: error.message });
    }
};
