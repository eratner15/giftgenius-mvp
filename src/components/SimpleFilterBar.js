import React from 'react';

const SimpleFilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.search;

  return (
    <div className="simple-filter-bar">
      <div className="filter-group">
        <div className="search-wrapper">
          <span className="search-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
          <input
            type="text"
            placeholder="Search gifts..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="jewelry">Jewelry</option>
          <option value="tech">Tech</option>
          <option value="home">Home & Living</option>
          <option value="experiences">Experiences</option>
          <option value="fashion">Fashion</option>
          <option value="beauty">Beauty</option>
          <option value="food">Food & Gourmet</option>
          <option value="unique">Unique</option>
        </select>

        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="price-input"
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="price-input"
            min="0"
          />
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            ✕ Clear
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          {filters.category && (
            <span className="filter-tag">
              Category: {filters.category}
              <button onClick={() => handleChange('category', '')}>✕</button>
            </span>
          )}
          {filters.minPrice && (
            <span className="filter-tag">
              Min: ${filters.minPrice}
              <button onClick={() => handleChange('minPrice', '')}>✕</button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="filter-tag">
              Max: ${filters.maxPrice}
              <button onClick={() => handleChange('maxPrice', '')}>✕</button>
            </span>
          )}
          {filters.search && (
            <span className="filter-tag">
              Search: "{filters.search}"
              <button onClick={() => handleChange('search', '')}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleFilterBar;