import React from 'react';

const CategoriesPage = ({ onCategorySelect, allGifts }) => {
  const categories = [
    {
      id: 'jewelry',
      name: 'Jewelry',
      emoji: '💎',
      description: 'Elegant pieces that sparkle with meaning',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'experiences',
      name: 'Experiences',
      emoji: '🎭',
      description: 'Unforgettable moments to share together',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      id: 'home',
      name: 'Home & Living',
      emoji: '🏠',
      description: 'Comfort and style for your shared space',
      color: 'from-green-400 to-teal-400'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      emoji: '👗',
      description: 'Stylish pieces that express personality',
      color: 'from-pink-400 to-red-400'
    },
    {
      id: 'beauty',
      name: 'Beauty & Wellness',
      emoji: '💄',
      description: 'Self-care essentials for inner and outer glow',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'tech',
      name: 'Tech & Gadgets',
      emoji: '📱',
      description: 'Smart innovations for modern living',
      color: 'from-gray-400 to-blue-400'
    },
    {
      id: 'unique',
      name: 'Unique & Creative',
      emoji: '✨',
      description: 'One-of-a-kind gifts that surprise and delight',
      color: 'from-purple-400 to-indigo-400'
    }
  ];

  const getCategoryStats = (categoryId) => {
    const categoryGifts = allGifts.filter(gift => gift.category === categoryId);
    const avgPrice = categoryGifts.length > 0
      ? Math.round(categoryGifts.reduce((sum, gift) => sum + gift.price, 0) / categoryGifts.length)
      : 0;
    const avgSuccess = categoryGifts.length > 0
      ? Math.round(categoryGifts.reduce((sum, gift) => sum + (gift.successRate || 0), 0) / categoryGifts.length)
      : 0;

    return {
      count: categoryGifts.length,
      avgPrice,
      avgSuccess,
      priceRange: categoryGifts.length > 0 ? {
        min: Math.min(...categoryGifts.map(g => g.price)),
        max: Math.max(...categoryGifts.map(g => g.price))
      } : { min: 0, max: 0 }
    };
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Explore Gift Categories</h2>
        <p>Find the perfect gift by browsing our carefully curated categories</p>
      </div>

      <div className="categories-grid">
        {categories.map(category => {
          const stats = getCategoryStats(category.id);
          return (
            <div
              key={category.id}
              className="category-card"
              onClick={() => onCategorySelect(category.id)}
            >
              <div className={`category-header bg-gradient-to-br ${category.color}`}>
                <span className="category-emoji">{category.emoji}</span>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>

              <div className="category-stats">
                <div className="stat">
                  <span className="stat-number">{stats.count}</span>
                  <span className="stat-label">Gifts</span>
                </div>
                <div className="stat">
                  <span className="stat-number">${stats.avgPrice}</span>
                  <span className="stat-label">Avg Price</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{stats.avgSuccess}%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>

              {stats.count > 0 && (
                <div className="category-preview">
                  <span className="price-range">
                    ${stats.priceRange.min} - ${stats.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;