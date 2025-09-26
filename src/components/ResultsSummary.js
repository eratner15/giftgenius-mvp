import React from 'react';

const ResultsSummary = ({
  giftsCount,
  totalGifts,
  sortBy,
  setSortBy,
  isFiltered,
  searchQuery
}) => {
  const sortOptions = [
    { value: 'relevance', label: '⭐ Best Match', icon: '🎯' },
    { value: 'success', label: '📊 Success Rate', icon: '📈' },
    { value: 'price-low', label: '💰 Price: Low to High', icon: '⬆️' },
    { value: 'price-high', label: '💎 Price: High to Low', icon: '⬇️' },
    { value: 'reviews', label: '👥 Most Reviews', icon: '💬' },
    { value: 'newest', label: '✨ Newest First', icon: '🆕' }
  ];

  return (
    <div className="results-summary">
      <div className="results-info">
        <div className="results-count">
          {isFiltered || searchQuery ? (
            <>
              <strong>{giftsCount}</strong> of {totalGifts} gifts
              {searchQuery && (
                <span className="search-context">
                  {' '}for "{searchQuery}"
                </span>
              )}
            </>
          ) : (
            <>
              <strong>{giftsCount}</strong> curated gifts
            </>
          )}
        </div>
        {isFiltered && (
          <div className="filter-status">
            <span className="filter-indicator">🎯</span>
            Filtered results
          </div>
        )}
      </div>

      <div className="sort-section">
        <label className="sort-label">Sort by:</label>
        <div className="sort-options">
          {sortOptions.map(option => (
            <button
              key={option.value}
              className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => setSortBy(option.value)}
              title={option.label}
            >
              <span className="sort-icon">{option.icon}</span>
              <span className="sort-text">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;