import React, { useState, useEffect } from 'react';
import GiftGrid from './GiftGrid';
import SEOSchema from './SEOSchema';
import OptimizedImage from './OptimizedImage';

const SEOLandingPage = ({
  demographic = 'mom',
  occasion = 'birthday',
  priceRange = 'under-100',
  interests = [],
  age = null
}) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroInsight, setHeroInsight] = useState('');

  // Generate SEO-optimized content
  const pageTitle = generatePageTitle(demographic, occasion, priceRange, age);
  const metaDescription = generateMetaDescription(demographic, occasion, priceRange);
  const h1Title = generateH1(demographic, occasion, priceRange, age);
  const breadcrumbs = generateBreadcrumbs(demographic, occasion, priceRange);

  useEffect(() => {
    // Set page title and meta description
    document.title = pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDescription);
    }

    // Generate AI insight for this specific demographic
    generateAIInsight();
    fetchFilteredGifts();
  }, [demographic, occasion, priceRange]);

  const generatePageTitle = (demo, occ, price, age) => {
    const ageText = age ? `${age} Year Old ` : '';
    const priceText = price.replace('-', ' to $').replace('under', 'Under $');
    return `${capitalizeFirst(occ)} Gifts for ${ageText}${capitalizeFirst(demo)} ${priceText} | GiftGenius`;
  };

  const generateMetaDescription = (demo, occ, price) => {
    return `Find the perfect ${occ} gifts for ${demo} ${price}. AI-curated collection with 95%+ success rate. Free shipping, expert recommendations, guaranteed satisfaction.`;
  };

  const generateH1 = (demo, occ, price, age) => {
    const ageText = age ? ` ${age} Year Old` : '';
    return `Best ${capitalizeFirst(occ)} Gifts for${ageText} ${capitalizeFirst(demo)} ${capitalizeFirst(price)}`;
  };

  const generateBreadcrumbs = (demo, occ, price) => [
    { name: 'Home', url: '/' },
    { name: 'Gifts', url: '/gifts' },
    { name: capitalizeFirst(occ), url: `/gifts/${occ}` },
    { name: `For ${capitalizeFirst(demo)}`, url: `/gifts/${occ}/${demo}` },
    { name: capitalizeFirst(price), url: `/gifts/${occ}/${demo}/${price}` }
  ];

  const generateAIInsight = async () => {
    // This would typically call your AI API
    const insights = {
      'mom-birthday-under-50': "Moms love personalized gifts that show thoughtfulness. Focus on experiences, self-care, or items that acknowledge her interests beyond just being 'mom'.",
      'dad-fathers-day-under-100': "Dads appreciate practical gifts with a personal touch. Tools, tech gadgets, or hobby-related items that enhance his existing interests work best.",
      'teenager-birthday-under-30': "Teens value authenticity and trends. Focus on what's popular on TikTok, customizable items, or experiences they can share with friends."
    };

    const key = `${demographic}-${occasion}-${priceRange}`;
    setHeroInsight(insights[key] || "Our AI analyzes thousands of successful gifts to recommend the perfect choice for your recipient.");
  };

  const fetchFilteredGifts = async () => {
    setLoading(true);
    // Filter gifts based on criteria
    // This would typically call your API with filters
    try {
      // Simulate API call
      const mockGifts = generateMockGifts(demographic, occasion, priceRange);
      setGifts(mockGifts);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockGifts = (demo, occ, price) => {
    // This would be replaced with actual API calls
    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Perfect ${occ} Gift #${i + 1} for ${demo}`,
      description: `Carefully selected ${occ} gift that ${demo} will absolutely love`,
      price: Math.floor(Math.random() * 50) + 20,
      image_url: `https://images.unsplash.com/photo-${1513885535751 + i}?w=400&h=400&fit=crop`,
      success_rate: 90 + Math.floor(Math.random() * 8),
      total_reviews: Math.floor(Math.random() * 500) + 100,
      category: demo,
      affiliate_link: `https://amazon.com/dp/example${i}?tag=giftgenius-20`
    }));
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Generate FAQ for this specific page
  const pageSpecificFAQ = [
    {
      question: `What are the best ${occasion} gifts for ${demographic}?`,
      answer: `The best ${occasion} gifts for ${demographic} depend on their interests, but our AI recommends personalized items, experiences, and thoughtful surprises that show you care.`
    },
    {
      question: `How much should I spend on a ${occasion} gift for ${demographic}?`,
      answer: `For ${priceRange} gifts, you can find meaningful presents that show thoughtfulness without overspending. Quality and personalization matter more than price.`
    },
    {
      question: `When should I order ${occasion} gifts for ${demographic}?`,
      answer: `Order at least 1-2 weeks in advance to ensure delivery and avoid rush shipping fees. Our recommendations include shipping estimates.`
    }
  ];

  return (
    <div className="seo-landing-page">
      <SEOSchema
        pageType="category"
        categoryData={{
          name: `${capitalizeFirst(occasion)} Gifts for ${capitalizeFirst(demographic)}`,
          itemCount: gifts.length,
          items: gifts
        }}
        breadcrumbs={breadcrumbs}
        faqData={pageSpecificFAQ}
      />

      {/* Hero Section */}
      <div className="seo-hero">
        <div className="hero-container">
          <nav className="breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={index}>
                <a href={crumb.url}>{crumb.name}</a>
                {index < breadcrumbs.length - 1 && ' > '}
              </span>
            ))}
          </nav>

          <h1 className="seo-h1">{h1Title}</h1>

          <div className="hero-stats">
            <div className="stat">
              <strong>2,847+</strong> successful gifts delivered
            </div>
            <div className="stat">
              <strong>95%</strong> recipient satisfaction
            </div>
            <div className="stat">
              <strong>24hr</strong> shipping available
            </div>
          </div>

          <div className="ai-insight-box">
            <div className="insight-icon">🤖</div>
            <div className="insight-content">
              <h3>AI Gift Expert Insight</h3>
              <p>{heroInsight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Grid */}
      <div className="seo-content">
        <div className="content-container">
          <div className="section-header">
            <h2>Top-Rated {capitalizeFirst(occasion)} Gifts for {capitalizeFirst(demographic)}</h2>
            <p>Each gift is backed by our 95% satisfaction guarantee and expert curation.</p>
          </div>

          <GiftGrid
            gifts={gifts}
            loading={loading}
            onGiftClick={(gift) => {
              // Track affiliate click
              if (window.gtag) {
                window.gtag('event', 'affiliate_click', {
                  event_category: 'SEO Landing Page',
                  event_label: `${demographic}-${occasion}-${priceRange}`,
                  gift_id: gift.id,
                  value: gift.price
                });
              }
              // Redirect to affiliate link
              window.open(gift.affiliate_link, '_blank');
            }}
          />

          {/* SEO Content Sections */}
          <div className="seo-content-sections">
            <section className="buying-guide">
              <h2>Ultimate {capitalizeFirst(occasion)} Gift Guide for {capitalizeFirst(demographic)}</h2>
              <div className="guide-content">
                <h3>What Makes a Perfect {capitalizeFirst(occasion)} Gift?</h3>
                <p>When choosing a {occasion} gift for {demographic}, consider their personality, interests, and lifestyle. The best gifts show thoughtfulness and create memorable moments.</p>

                <h3>Top Categories for {capitalizeFirst(demographic)}</h3>
                <ul>
                  <li><strong>Personalized Gifts:</strong> Custom items that show you care</li>
                  <li><strong>Experience Gifts:</strong> Create lasting memories</li>
                  <li><strong>Practical Luxuries:</strong> Everyday items with a premium touch</li>
                  <li><strong>Hobby-Related:</strong> Gifts that support their passions</li>
                </ul>

                <h3>Price Range Recommendations</h3>
                <p>For {priceRange} gifts, focus on quality over quantity. A well-chosen, meaningful gift will always be appreciated more than an expensive but impersonal one.</p>
              </div>
            </section>

            <section className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {pageSpecificFAQ.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="why-giftgenius">
              <h2>Why Choose GiftGenius for {capitalizeFirst(occasion)} Gifts?</h2>
              <div className="benefits-grid">
                <div className="benefit">
                  <h4>🤖 AI-Powered Recommendations</h4>
                  <p>Our algorithm analyzes thousands of successful gifts to recommend the perfect choice.</p>
                </div>
                <div className="benefit">
                  <h4>📦 Fast, Free Shipping</h4>
                  <p>Get your gifts delivered quickly with our network of trusted retailers.</p>
                </div>
                <div className="benefit">
                  <h4>💝 Satisfaction Guarantee</h4>
                  <p>95% of recipients love their GiftGenius-recommended gifts.</p>
                </div>
                <div className="benefit">
                  <h4>💰 Best Price Promise</h4>
                  <p>We find the best deals and exclusive discounts for all our recommendations.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOLandingPage;