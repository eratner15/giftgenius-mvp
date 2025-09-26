import React, { useRef } from 'react';

const FilterBar = ({
  filter,
  setFilter,
  showSuggestions,
  setShowSuggestions,
  searchSuggestions,
  selectedSuggestion,
  handleSearchKeyDown,
  selectSuggestion,
  clearFilters,
  getActiveFilters,
  removeFilter,
  quickScenarios,
  handleQuickFilter
}) => {
  const searchRef = useRef(null);

  return (
    <>
      {/* Quick Recommendations */}
      <div className="quick-recs">
        <h2>What's the occasion?</h2>
        <div className="quick-buttons">
          {quickScenarios.map(scenario => (
            <button
              key={scenario.id}
              className={`quick-btn ${filter.quickFilter === scenario.id ? 'active' : ''}`}
              onClick={() => handleQuickFilter(scenario.id)}
            >
              <span className="emoji">{scenario.emoji}</span>
              <div>
                <div className="label">{scenario.label}</div>
                <div className="desc">{scenario.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-container">
          <input
            ref={searchRef}
            type="text"
            className="search-input"
            placeholder="Search gifts, categories, or occasions..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => filter.search && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item ${index === selectedSuggestion ? 'active' : ''}`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-text">{suggestion.text}</span>
                  <span className="suggestion-category">{suggestion.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={filter.category}
          onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="jewelry">💎 Jewelry</option>
          <option value="experiences">🎭 Experiences</option>
          <option value="home">🏠 Home & Living</option>
          <option value="fashion">👗 Fashion</option>
          <option value="beauty">💄 Beauty</option>
          <option value="tech">📱 Tech</option>
          <option value="unique">✨ Unique</option>
        </select>

        <input
          type="range"
          min="25"
          max="1000"
          value={filter.maxPrice}
          onChange={(e) => setFilter(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
          style={{ minWidth: '120px' }}
        />
        <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
          Under ${filter.maxPrice}
        </span>

        <select
          value={filter.minSuccessRate}
          onChange={(e) => setFilter(prev => ({ ...prev, minSuccessRate: parseInt(e.target.value) }))}
        >
          <option value={0}>Any Success Rate</option>
          <option value={80}>80%+ Success</option>
          <option value={90}>90%+ Success</option>
          <option value={95}>95%+ Success</option>
        </select>

        <select
          value={filter.occasion}
          onChange={(e) => setFilter(prev => ({ ...prev, occasion: e.target.value }))}
        >
          <option value="">Any Occasion</option>
          <option value="birthday">🎂 Birthday</option>
          <option value="anniversary">💕 Anniversary</option>
          <option value="wedding">💒 Wedding</option>
          <option value="graduation">🎓 Graduation</option>
          <option value="holiday">🎄 Holiday</option>
          <option value="thank you">🙏 Thank You</option>
          <option value="valentines">💝 Valentine's</option>
        </select>

        <select
          value={filter.relationship}
          onChange={(e) => setFilter(prev => ({ ...prev, relationship: e.target.value }))}
        >
          <option value="">Any Relationship</option>
          <option value="dating">💕 Dating</option>
          <option value="married">💑 Married</option>
          <option value="family">👨‍👩‍👧‍👦 Family</option>
          <option value="friend">👯 Friend</option>
          <option value="colleague">💼 Colleague</option>
        </select>

        <button className="clear-filters enhanced-button" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <div className="active-filters">
          {getActiveFilters().map(activeFilter => (
            <div key={activeFilter.key} className="filter-badge">
              {activeFilter.label}
              <span
                className="filter-badge-remove"
                onClick={() => removeFilter(activeFilter.key)}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FilterBar;