import React, { useState, useEffect } from 'react';
import PremiumLoader from './PremiumLoader';

const AdvancedFilter = ({ onFilterChange, gifts = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000 },
    successRate: 0,
    occasion: '',
    recipient: '',
    colors: [],
    tags: [],
    rating: 0,
    availability: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [quickFilters, setQuickFilters] = useState([]);
  const [filterStats, setFilterStats] = useState({});

  const categories = [
    { id: 'jewelry', name: 'Jewelry', icon: '💎', count: 0 },
    { id: 'tech', name: 'Technology', icon: '📱', count: 0 },
    { id: 'home', name: 'Home & Living', icon: '🏠', count: 0 },
    { id: 'fashion', name: 'Fashion', icon: '👗', count: 0 },
    { id: 'experiences', name: 'Experiences', icon: '🎪', count: 0 },
    { id: 'food', name: 'Food & Drink', icon: '🍷', count: 0 },
    { id: 'beauty', name: 'Beauty', icon: '💄', count: 0 },
    { id: 'unique', name: 'Unique Finds', icon: '✨', count: 0 }
  ];

  const occasions = [
    'Birthday', 'Anniversary', 'Wedding', 'Christmas', 'Valentine\'s Day',
    'Mother\'s Day', 'Father\'s Day', 'Graduation', 'Housewarming', 'Thank You'
  ];

  const recipients = [
    'Partner', 'Mom', 'Dad', 'Sister', 'Brother', 'Friend',
    'Colleague', 'Boss', 'Teacher', 'Grandparent'
  ];

  const colors = [
    { name: 'Red', value: '#ef4444', count: 0 },
    { name: 'Blue', value: '#3b82f6', count: 0 },
    { name: 'Green', value: '#10b981', count: 0 },
    { name: 'Purple', value: '#8b5cf6', count: 0 },
    { name: 'Pink', value: '#ec4899', count: 0 },
    { name: 'Gold', value: '#f59e0b', count: 0 },
    { name: 'Silver', value: '#6b7280', count: 0 },
    { name: 'Black', value: '#1f2937', count: 0 }
  ];

  const popularTags = [
    'Luxury', 'Eco-Friendly', 'Handmade', 'Personalized', 'Trending',
    'Best Seller', 'Limited Edition', 'Premium', 'Sustainable', 'Artisan'
  ];

  useEffect(() => {
    // Calculate filter statistics
    const stats = {
      totalGifts: gifts.length,
      averagePrice: gifts.reduce((sum, gift) => sum + gift.price, 0) / gifts.length || 0,
      averageRating: gifts.reduce((sum, gift) => sum + (gift.success_rate || 0), 0) / gifts.length || 0,
      priceRange: {
        min: Math.min(...gifts.map(g => g.price)),
        max: Math.max(...gifts.map(g => g.price))
      }
    };

    // Update category counts
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: gifts.filter(gift => gift.category === cat.id).length
    }));

    setFilterStats(stats);

    // Generate quick filters based on data
    const quickFilterSuggestions = [
      { label: 'Under $50', filter: { priceRange: { min: 0, max: 50 } }, icon: '💸' },
      { label: 'High Success Rate', filter: { successRate: 90 }, icon: '🎯' },
      { label: 'Trending Now', filter: { tags: ['Trending'] }, icon: '🔥' },
      { label: 'Premium Quality', filter: { tags: ['Premium'] }, icon: '👑' },
      { label: 'Personalized', filter: { tags: ['Personalized'] }, icon: '🎨' }
    ];

    setQuickFilters(quickFilterSuggestions);
  }, [gifts]);

  useEffect(() => {
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        // Simulate search API call
        setTimeout(() => {
          const results = gifts.filter(gift =>
            gift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gift.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(results);
          setIsSearching(false);
        }, 300);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, gifts]);

  const handleFilterUpdate = (newFilters) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: '',
      priceRange: { min: 0, max: 1000 },
      successRate: 0,
      occasion: '',
      recipient: '',
      colors: [],
      tags: [],
      rating: 0,
      availability: 'all'
    };
    setActiveFilters(defaultFilters);
    setSearchTerm('');
    onFilterChange(defaultFilters);
  };

  const applyQuickFilter = (quickFilter) => {
    handleFilterUpdate(quickFilter.filter);
  };

  const toggleColorFilter = (color) => {
    const updatedColors = activeFilters.colors.includes(color.name)
      ? activeFilters.colors.filter(c => c !== color.name)
      : [...activeFilters.colors, color.name];

    handleFilterUpdate({ colors: updatedColors });
  };

  const toggleTagFilter = (tag) => {
    const updatedTags = activeFilters.tags.includes(tag)
      ? activeFilters.tags.filter(t => t !== tag)
      : [...activeFilters.tags, tag];

    handleFilterUpdate({ tags: updatedTags });
  };

  const hasActiveFilters = () => {
    return activeFilters.category ||
           activeFilters.priceRange.min > 0 ||
           activeFilters.priceRange.max < 1000 ||
           activeFilters.successRate > 0 ||
           activeFilters.occasion ||
           activeFilters.recipient ||
           activeFilters.colors.length > 0 ||
           activeFilters.tags.length > 0 ||
           activeFilters.rating > 0 ||
           searchTerm.length > 0;
  };

  return (
    <div className="advanced-filter">
      {/* Search Bar */}
      <div className="filter-search">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search for the perfect gift..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
          {isSearching && (
            <div className="search-loading">
              <PremiumLoader type="pulse" size="small" />
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.slice(0, 5).map(gift => (
              <div key={gift.id} className="search-result-item">
                <img src={gift.image_url} alt={gift.title} />
                <span>{gift.title}</span>
                <span className="result-price">${gift.price}</span>
              </div>
            ))}
            {searchResults.length > 5 && (
              <div className="search-more">
                +{searchResults.length - 5} more results
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div className="quick-filters">
        <div className="quick-filters-label">Quick Filters:</div>
        <div className="quick-filters-grid">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              className="quick-filter-btn"
              onClick={() => applyQuickFilter(filter)}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span className="filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="advanced-toggle">
        <button
          className={`toggle-btn ${isExpanded ? 'expanded' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Advanced Filters</span>
          <span className="toggle-arrow">⌄</span>
        </button>

        {hasActiveFilters() && (
          <div className="active-filters-indicator">
            <span className="filter-count">{
              [activeFilters.category, activeFilters.occasion, activeFilters.recipient]
                .filter(Boolean).length +
              activeFilters.colors.length +
              activeFilters.tags.length +
              (activeFilters.successRate > 0 ? 1 : 0) +
              (searchTerm.length > 0 ? 1 : 0)
            }</span>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filter Panel */}
      <div className={`advanced-panel ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-section">
          <h3>Categories</h3>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeFilters.category === category.id ? 'active' : ''}`}
                onClick={() => handleFilterUpdate({ category: category.id === activeFilters.category ? '' : category.id })}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-slider">
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={activeFilters.priceRange.min}
              onChange={(e) => handleFilterUpdate({
                priceRange: { ...activeFilters.priceRange, min: parseInt(e.target.value) }
              })}
              className="slider min-slider"
            />
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={activeFilters.priceRange.max}
              onChange={(e) => handleFilterUpdate({
                priceRange: { ...activeFilters.priceRange, max: parseInt(e.target.value) }
              })}
              className="slider max-slider"
            />
            <div className="price-labels">
              <span>${activeFilters.priceRange.min}</span>
              <span>${activeFilters.priceRange.max}</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Success Rate</h3>
          <div className="success-rate-slider">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeFilters.successRate}
              onChange={(e) => handleFilterUpdate({ successRate: parseInt(e.target.value) })}
              className="slider"
            />
            <div className="success-rate-label">
              {activeFilters.successRate}%+ success rate
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Occasion</h3>
          <div className="dropdown-grid">
            {occasions.map(occasion => (
              <button
                key={occasion}
                className={`occasion-btn ${activeFilters.occasion === occasion ? 'active' : ''}`}
                onClick={() => handleFilterUpdate({ occasion: occasion === activeFilters.occasion ? '' : occasion })}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Recipient</h3>
          <div className="dropdown-grid">
            {recipients.map(recipient => (
              <button
                key={recipient}
                className={`recipient-btn ${activeFilters.recipient === recipient ? 'active' : ''}`}
                onClick={() => handleFilterUpdate({ recipient: recipient === activeFilters.recipient ? '' : recipient })}
              >
                {recipient}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Colors</h3>
          <div className="color-palette">
            {colors.map(color => (
              <button
                key={color.name}
                className={`color-btn ${activeFilters.colors.includes(color.name) ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => toggleColorFilter(color)}
                title={color.name}
              >
                {activeFilters.colors.includes(color.name) && <span className="check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Tags</h3>
          <div className="tags-grid">
            {popularTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${activeFilters.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTagFilter(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Stats */}
      {filterStats.totalGifts > 0 && (
        <div className="filter-stats">
          <div className="stat-item">
            <span className="stat-value">{filterStats.totalGifts}</span>
            <span className="stat-label">Total Gifts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">${Math.round(filterStats.averagePrice)}</span>
            <span className="stat-label">Avg Price</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Math.round(filterStats.averageRating)}%</span>
            <span className="stat-label">Avg Success</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilter;