import React, { useState, useEffect } from 'react';
import { getGifts as getGiftsWithFallback } from './api/gifts';
import './styles/App.css';

import Hero from './components/Hero';
import GiftGrid from './components/GiftGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ResultsSummary from './components/ResultsSummary';
import ProductDetailView from './components/ProductDetailView';
import GiftFinderWizard from './components/GiftFinderWizard';

function App() {
  const [gifts, setGifts] = useState([]);
  const [allGifts, setAllGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGiftsWithFallback(filters);
      if (response && response.gifts) {
        setAllGifts(response.gifts);
        setGifts(response.gifts);
      }
    } catch (err) {
      console.error('Error fetching gifts:', err);
      setError('Failed to load gifts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    try {
      setLoading(true);
      const response = await getGiftsWithFallback(newFilters);
      if (response && response.gifts) {
        setGifts(response.gifts);
      }
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGiftClick = (gift) => {
    window.location.href = `/products/${gift.id}`;
  };

  const pathname = window.location.pathname;

  if (pathname && pathname.startsWith('/gift-finder')) {
    return <GiftFinderWizard />;
  }

  if (pathname && pathname.startsWith('/products/')) {
    const id = pathname.split('/').pop();
    return <ProductDetailView id={id} />;
  }

  if (loading) {
    return (
      <div className="app-container">
        <Hero />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Hero />
        <ErrorMessage message={error} onRetry={fetchGifts} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Hero />
      <div className="simple-filter-bar">
        <input
          type="text"
          placeholder="Search gifts..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange({ ...filters, category: e.target.value })}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="jewelry">Jewelry</option>
          <option value="tech">Tech</option>
          <option value="home">Home & Living</option>
          <option value="experiences">Experiences</option>
          <option value="fashion">Fashion</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange({ ...filters, minPrice: e.target.value })}
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange({ ...filters, maxPrice: e.target.value })}
          className="price-input"
        />
      </div>
      <ResultsSummary count={gifts.length} total={allGifts.length} />
      <GiftGrid
        gifts={gifts}
        onGiftClick={handleGiftClick}
      />
    </div>
  );
}

export default App;