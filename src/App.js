import React, { useState, useEffect } from 'react';
import { getGifts as getGiftsWithFallback } from './api/gifts';
import './styles/DesignSystem.css';
import './styles/Critical.css';
import './styles/App.css';
import './styles/SimpleFilterBar.css';
import './styles/GiftCard.css';
import './styles/Hero.css';
import './styles/QuickGiftFinder.css';
import './styles/ProductDetailModal.css';
import './styles/AIGiftingExpert.css';
import './styles/Footer.css';
import './styles/Wishlist.css';
import './styles/GiftComparison.css';
import './styles/PersonalityQuiz.css';
import './styles/AffiliateDisclosure.css';
import './styles/LegalPages.css';
import './styles/ShippingTimer.css';
import './styles/Navigation.css';
import './styles/ProductShowcase.css';
import './styles/GiftQuiz.css';
import './styles/GiftConcierge.css';
import './styles/GiftGuides.css';
import './styles/GiftMomentCreator.css';
import './styles/SocialProofEngine.css';
import './styles/ConciergePage.css';
import './styles/PageHeaders.css';
import './styles/SupportPages.css';
import './styles/AboutAndHowItWorks.css';
import './styles/FloatingAI.css';

import Navigation from './components/Navigation';
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
import Wishlist from './components/Wishlist';
import GiftComparison from './components/GiftComparison';
import PersonalityQuiz from './components/PersonalityQuiz';
import AffiliateDisclosure from './components/AffiliateDisclosure';
import ProductShowcase from './components/ProductShowcase';
import GiftQuiz from './components/GiftQuiz';
import GiftConcierge from './components/GiftConcierge';
import AgenticChatInterface from './components/AgenticChatInterface';
import GiftGuides from './components/GiftGuides';
import GiftMomentCreator from './components/GiftMomentCreator';
import SocialProofEngine from './components/SocialProofEngine';

// New Page Components
import FAQ from './components/FAQ';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import AssetPreloader from './components/AssetPreloader';
import AffiliateManager from './components/AffiliateManager';
import SEOLandingPage from './components/SEOLandingPage';
import AnalyticsProvider from './components/GoogleAnalytics';
import SEORouter from './components/SEORouter';
import ThankYouPage from './components/ThankYouPage';
import { NewsletterForm } from './components/LeadCaptureForm';

function App() {
  const [gifts, setGifts] = useState([]);
  const [allGifts, setAllGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinder, setShowFinder] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false); // Browse-first: let users discover value
  const [showAgenticChat, setShowAgenticChat] = useState(false); // New agentic commerce chat
  const [showWishlist, setShowWishlist] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false);
  const [showGiftQuiz, setShowGiftQuiz] = useState(false);
  const [quizRecommendations, setQuizRecommendations] = useState(null);
  const [showConcierge, setShowConcierge] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [showMomentCreator, setShowMomentCreator] = useState(false);
  const [selectedMomentGift, setSelectedMomentGift] = useState(null);
  const [activeView, setActiveView] = useState('home'); // home, guides, concierge
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
        // AI-first: Don't show grid by default, let AI drive discovery
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

  const handleRemoveFromWishlist = (giftId) => {
    const newFavorites = favorites.filter(f => f.id !== giftId);
    setFavorites(newFavorites);
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

  const handlePersonalityQuizComplete = async (personalityProfile) => {
    setShowPersonalityQuiz(false);
    setShowResults(true);

    // Apply filters based on personality profile
    const personalityFilters = {
      category: personalityProfile.giftPreferences.filters.categories[0] || '',
      minPrice: personalityProfile.giftPreferences.priceRange === 'budget' ? '' : '50',
      maxPrice: personalityProfile.giftPreferences.priceRange === 'budget' ? '50' : '',
      search: personalityProfile.primaryTrait
    };

    await handleFilterChange(personalityFilters);
    window.scrollTo({ top: document.querySelector('.simple-filter-bar')?.offsetTop - 20, behavior: 'smooth' });
  };

  // Strip /gifts prefix for sub-path deployment
  const getPath = () => window.location.pathname.replace(/^\/gifts/, '') || '/';
  const pathname = getPath();

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

  // Check for special routes
  const currentPath = getPath();

  // Thank you page
  if (currentPath === '/thank-you') {
    return (
      <AffiliateManager>
        <AnalyticsProvider googleAnalyticsId="G-XXXXXXXXXX" />
        <ThankYouPage />
      </AffiliateManager>
    );
  }

  // Check if this is an SEO landing page
  const seoComponent = SEORouter();
  if (seoComponent) {
    return (
      <AffiliateManager>
        <AnalyticsProvider googleAnalyticsId="G-XXXXXXXXXX" />
        {seoComponent}
      </AffiliateManager>
    );
  }

  return (
    <AffiliateManager>
      <AnalyticsProvider googleAnalyticsId="G-XXXXXXXXXX" />
      <div className="app-container">
        <AssetPreloader />
        <Navigation
        onShowAIChat={() => setShowAIChat(true)}
        onShowWishlist={() => setShowWishlist(true)}
        onNavigate={(view) => {
          console.log('Navigating to:', view); // Debug log
          setActiveView(view);
          // Close any open modals when navigating
          setShowGiftQuiz(false);
          setShowConcierge(false);
          setShowMomentCreator(false);
          setQuizRecommendations(null);

          // Scroll to top on navigation
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
        wishlistCount={favorites.length}
      />
      <AffiliateDisclosure placement="banner" />

      {/* Hero only shows on home page */}
      {activeView === 'home' && (
        <Hero
          onBrowseGifts={() => {
            const showcase = document.querySelector('.product-showcase');
            if (showcase) {
              showcase.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onStartQuiz={() => {
            setShowGiftQuiz(true);
            setShowAIChat(false);
          }}
        />
      )}

      {/* View-based content rendering */}
      {activeView === 'home' && (
        <>
          <ProductShowcase
            gifts={quizRecommendations ? quizRecommendations.recommendations : allGifts}
            isRecommendation={!!quizRecommendations}
            recommendationData={quizRecommendations}
          />
          <div style={{maxWidth: '480px', margin: '48px auto', padding: '0 20px'}}>
            <NewsletterForm />
          </div>
        </>
      )}

      {activeView === 'guides' && (
        <div className="page-wrapper">
          <div className="page-header">
            <h1>Expert Gift Guides</h1>
            <p>Curated collections that guarantee gift-giving success</p>
          </div>
          <GiftGuides
            onSelectGuide={(guide, gifts) => {
              // Handle guide selection if needed
            }}
            onGiftClick={handleGiftClick}
          />
        </div>
      )}

      {activeView === 'concierge' && (
        <div className="concierge-page">
          <div className="concierge-intro">
            <h1>Your Personal Gift Concierge</h1>
            <p>Let our AI expert understand your unique situation and create the perfect gift moment</p>
            <button
              className="start-concierge-btn"
              onClick={() => setShowConcierge(true)}
            >
              Start Your Personal Consultation
            </button>
          </div>

          {/* Social proof for concierge service */}
          <div className="concierge-testimonials">
            <h3>Why 97% Choose Our Personal Concierge</h3>
            <div className="testimonial-grid">
              <div className="testimonial">
                <p>"I was so stressed about my anniversary gift. The concierge made it effortless and my wife was in tears of joy!"</p>
                <span>- Michael R.</span>
              </div>
              <div className="testimonial">
                <p>"The moment they created for my mom's birthday was absolutely perfect. I could never have planned something so thoughtful."</p>
                <span>- Sarah L.</span>
              </div>
              <div className="testimonial">
                <p>"Professional, personal, and powerful. This is the future of gift giving."</p>
                <span>- David K.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'browse' && (
        <div className="page-wrapper">
          <div className="page-header">
            <h1>Browse All Gifts</h1>
            <p>Discover our complete collection of curated gifts</p>
          </div>
          <SimpleFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <ResultsSummary count={gifts.length} total={allGifts.length} />
          <GiftGrid
            gifts={gifts}
            onGiftClick={handleGiftClick}
          />
        </div>
      )}

      {activeView === 'faq' && <FAQ />}

      {activeView === 'contact' && <ContactUs />}

      {activeView === 'about' && <AboutUs />}

      {activeView === 'how-it-works' && <HowItWorks />}

      {showFinder && (
        <QuickGiftFinder
          onComplete={handleFinderComplete}
          onClose={() => setShowFinder(false)}
        />
      )}

      {showPersonalityQuiz && (
        <PersonalityQuiz
          onComplete={handlePersonalityQuizComplete}
          onClose={() => setShowPersonalityQuiz(false)}
        />
      )}

      {showGiftQuiz && (
        <GiftQuiz
          gifts={allGifts}
          onComplete={(result) => {
            setQuizRecommendations(result);
            setShowGiftQuiz(false);
            setShowResults(true);
            // Scroll to results
            setTimeout(() => {
              const showcase = document.querySelector('.product-showcase');
              if (showcase) {
                showcase.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
          onClose={() => setShowGiftQuiz(false)}
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
          onCreateMoment={(gift) => {
            setSelectedMomentGift(gift);
            setShowMomentCreator(true);
          }}
        />
      )}

      {/* Gift Concierge Modal */}
      {showConcierge && (
        <GiftConcierge
          onRecommendation={(recommendations) => {
            setQuizRecommendations(recommendations);
            setShowConcierge(false);
            setActiveView('home');
          }}
          onClose={() => setShowConcierge(false)}
        />
      )}

      {/* Gift Moment Creator */}
      {showMomentCreator && selectedMomentGift && (
        <GiftMomentCreator
          gift={selectedMomentGift}
          onCreateMoment={(momentData) => {
            console.log('Creating gift moment:', momentData);
            setShowMomentCreator(false);
            setSelectedMomentGift(null);
            // Could integrate with shopping cart or checkout here
          }}
          onClose={() => {
            setShowMomentCreator(false);
            setSelectedMomentGift(null);
          }}
        />
      )}

      {/* Social Proof Engine - appears on product pages */}
      {selectedGift && (
        <SocialProofEngine
          gift={selectedGift}
          onUrgencyAction={(action) => {
            if (action === 'flash_sale') {
              // Could trigger immediate checkout or special offer
              console.log('Flash sale action triggered');
            }
          }}
        />
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

      {showWishlist && (
        <Wishlist
          onClose={() => setShowWishlist(false)}
          onGiftClick={(gift) => {
            setSelectedGift(gift);
            setShowWishlist(false);
          }}
          onRemoveFromFavorites={handleRemoveFromWishlist}
        />
      )}

      {showComparison && (
        <GiftComparison
          gifts={allGifts}
          onClose={() => setShowComparison(false)}
          onGiftClick={(gift) => {
            setSelectedGift(gift);
            setShowComparison(false);
          }}
        />
      )}

      {/* Agentic Commerce Chat Interface */}
      {showAgenticChat && (
        <AgenticChatInterface
          onClose={() => setShowAgenticChat(false)}
          initialMessage={null}
        />
      )}

      {/* Floating AI Assistant Button */}
      {!showAgenticChat && (
        <button
          className="floating-ai-button"
          onClick={() => setShowAgenticChat(true)}
          title="Chat with AI Gift Assistant"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Ask AI
        </button>
      )}

      <Footer onNavigate={(view) => {
        setActiveView(view);
        // Close any open modals when navigating
        setShowGiftQuiz(false);
        setShowConcierge(false);
        setShowMomentCreator(false);
        setQuizRecommendations(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
      </div>
    </AffiliateManager>
  );
}

export default App;