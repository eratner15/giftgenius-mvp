import React, { useState, useEffect } from 'react';
import { getGifts as getGiftsWithFallback } from './api/gifts';
import './styles/App.css';
import './styles/SimpleFilterBar.css';
import './styles/GiftCard.css';
import './styles/Hero.css';
import './styles/QuickGiftFinder.css';
import './styles/ProductDetailModal.css';
import './styles/AIGiftingExpert.css';
import './styles/Footer.css';

import Hero from './components/Hero';
import QuickGiftFinder from './components/QuickGiftFinder';
import SimpleFilterBar from './components/SimpleFilterBar';
import GiftGrid from './components/GiftGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ResultsSummary from './components/ResultsSummary';
import ProductDetailView from './components/ProductDetailView';
import ProductDetailModal from './components/ProductDetailModal';
import AIGiftingExpert from './components/AIGiftingExpert';
import Footer from './components/Footer';
import GiftFinderWizard from './components/GiftFinderWizard';

function App() {
  const [gifts, setGifts] = useState([]);
  const [allGifts, setAllGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinder, setShowFinder] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('giftgenius_favorites');
    return saved ? JSON.parse(saved) : [];
  });
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
    setSelectedGift(gift);
  };

  const handleAddToFavorites = (gift) => {
    const isFavorited = favorites.some(f => f.id === gift.id);
    let newFavorites;

    if (isFavorited) {
      newFavorites = favorites.filter(f => f.id !== gift.id);
    } else {
      newFavorites = [...favorites, gift];
    }

    setFavorites(newFavorites);
    localStorage.setItem('giftgenius_favorites', JSON.stringify(newFavorites));
  };

  const handleScenarioSelect = async (scenario) => {
    if (scenario === 'wizard') {
      setShowFinder(true);
    } else if (scenario === 'browse') {
      setShowResults(true);
      window.scrollTo({ top: document.querySelector('.simple-filter-bar')?.offsetTop - 20, behavior: 'smooth' });
    } else {
      // Quick filter for specific occasions
      setShowResults(true);
      await handleFilterChange({ ...filters, search: scenario });
      window.scrollTo({ top: document.querySelector('.simple-filter-bar')?.offsetTop - 20, behavior: 'smooth' });
    }
  };

  const handleFinderComplete = async (finderFilters) => {
    setShowFinder(false);
    setShowResults(true);

    // Apply filters from wizard
    const newFilters = {
      category: finderFilters.interests[0] || '',
      minPrice: finderFilters.minPrice,
      maxPrice: finderFilters.maxPrice,
      search: finderFilters.occasion
    };

    await handleFilterChange(newFilters);
    window.scrollTo({ top: document.querySelector('.simple-filter-bar')?.offsetTop - 20, behavior: 'smooth' });
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
      <Hero onScenarioSelect={handleScenarioSelect} />

      {showFinder && (
        <QuickGiftFinder
          onComplete={handleFinderComplete}
          onClose={() => setShowFinder(false)}
        />
      )}

      {showResults && (
        <>
          <SimpleFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <ResultsSummary count={gifts.length} total={allGifts.length} />
          <GiftGrid
            gifts={gifts}
            onGiftClick={handleGiftClick}
          />
        </>
      )}

      {selectedGift && (
        <ProductDetailModal
          gift={selectedGift}
          onClose={() => setSelectedGift(null)}
          onAddToFavorites={handleAddToFavorites}
          isFavorited={favorites.some(f => f.id === selectedGift.id)}
        />
      )}

      {!showAIChat && (
        <button
          className="ai-chat-toggle"
          onClick={() => setShowAIChat(true)}
          title="Chat with AI Gifting Expert"
        >
          🤖
        </button>
      )}

      {showAIChat && (
        <AIGiftingExpert
          onClose={() => setShowAIChat(false)}
          gifts={allGifts}
          onRecommendGift={(gift) => {
            setSelectedGift(gift);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;