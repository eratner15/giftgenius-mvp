import React, { useEffect } from 'react';
import { NewsletterForm } from './LeadCaptureForm';

const ThankYouPage = () => {
  useEffect(() => {
    // Track conversion event
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-XXXXXXXXX/XXXXXXXXX', // Google Ads conversion ID
        event_category: 'lead_generation',
        event_label: 'email_signup',
        value: 25
      });
    }

    // Facebook Pixel conversion
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: 'Email Signup',
        status: 'completed',
        value: 25,
        currency: 'USD'
      });
    }

    // Pinterest conversion
    if (window.pintrk) {
      window.pintrk('track', 'signup', {
        value: 25,
        currency: 'USD'
      });
    }

    // Update page title
    document.title = 'Welcome to GiftGenius! Check Your Email';
  }, []);

  const recommendedGifts = [
    {
      title: "Personalized Jewelry",
      description: "Custom necklaces and bracelets",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
      price: "$49.99",
      link: "https://amazon.com/personalized-jewelry?tag=giftgenius-20"
    },
    {
      title: "Smart Home Gadgets",
      description: "Voice assistants and smart lights",
      image: "https://images.unsplash.com/photo-1558618047-fcd95d83cd5f?w=200&h=200&fit=crop",
      price: "$89.99",
      link: "https://amazon.com/smart-home?tag=giftgenius-20"
    },
    {
      title: "Gourmet Gift Baskets",
      description: "Artisan foods and treats",
      image: "https://images.unsplash.com/photo-1544216717-3bbf52512659?w=200&h=200&fit=crop",
      price: "$79.99",
      link: "https://amazon.com/gift-baskets?tag=giftgenius-20"
    }
  ];

  const handleGiftClick = (gift, index) => {
    // Track affiliate click from thank you page
    if (window.gtag) {
      window.gtag('event', 'select_item', {
        event_category: 'thank_you_page',
        event_label: gift.title,
        item_id: `thank-you-${index}`,
        value: parseFloat(gift.price.replace('$', ''))
      });
    }

    // Open affiliate link
    window.open(gift.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        {/* Hero Section */}
        <div className="thank-you-hero">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>

          <h1>Welcome to GiftGenius!</h1>
          <p className="hero-subtitle">
            Your personalized gift recommendations are on the way
          </p>

          <div className="next-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Check Your Email</h3>
                <p>Look for a welcome message with your first recommendations</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set Your Preferences</h3>
                <p>Tell us about your gift recipients for better suggestions</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Shopping</h3>
                <p>Browse personalized recommendations and exclusive deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Immediate Value Section */}
        <div className="immediate-value">
          <h2>🎁 Start Shopping: Today's Top Picks</h2>
          <p>Don't wait! Here are some of our most successful gift recommendations:</p>

          <div className="gift-grid">
            {recommendedGifts.map((gift, index) => (
              <div
                key={index}
                className="gift-card"
                onClick={() => handleGiftClick(gift, index)}
              >
                <img src={gift.image} alt={gift.title} />
                <div className="gift-info">
                  <h3>{gift.title}</h3>
                  <p>{gift.description}</p>
                  <div className="gift-price">{gift.price}</div>
                  <button className="shop-now-btn">
                    Shop Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="social-proof">
          <h2>Join 10,000+ Happy Gift-Givers</h2>
          <div className="testimonials">
            <div className="testimonial">
              <div className="testimonial-content">
                "GiftGenius helped me find the perfect anniversary gift. My wife was in tears of joy!"
              </div>
              <div className="testimonial-author">- Michael R.</div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "I never know what to get my teenage daughter. These recommendations are spot-on every time."
              </div>
              <div className="testimonial-author">- Sarah L.</div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                "Best gift-giving tool ever. Saved me hours of searching and the recipient loved it!"
              </div>
              <div className="testimonial-author">- David K.</div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        <div className="bonus-section">
          <h2>🎉 Bonus: Invite Friends & Get Rewards</h2>
          <p>Share GiftGenius with friends and earn exclusive benefits:</p>

          <div className="referral-benefits">
            <div className="benefit">
              <div className="benefit-icon">💰</div>
              <div className="benefit-text">
                <h3>10% Cashback</h3>
                <p>On purchases from your referrals</p>
              </div>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🎁</div>
              <div className="benefit-text">
                <h3>Exclusive Deals</h3>
                <p>Access to member-only discounts</p>
              </div>
            </div>
            <div className="benefit">
              <div className="benefit-icon">⭐</div>
              <div className="benefit-text">
                <h3>VIP Status</h3>
                <p>Priority support and early access</p>
              </div>
            </div>
          </div>

          <div className="sharing-buttons">
            <button
              className="share-btn facebook"
              onClick={() => window.open('https://facebook.com/share?url=https://giftgenius-mvp.netlify.app', '_blank')}
            >
              Share on Facebook
            </button>
            <button
              className="share-btn twitter"
              onClick={() => window.open('https://twitter.com/share?url=https://giftgenius-mvp.netlify.app&text=Found the perfect gift-finding tool!', '_blank')}
            >
              Share on Twitter
            </button>
            <button
              className="share-btn email"
              onClick={() => window.open('mailto:?subject=Check out GiftGenius&body=I found this amazing gift recommendation tool: https://giftgenius-mvp.netlify.app')}
            >
              Share via Email
            </button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="footer-cta">
          <h2>Ready to Find More Perfect Gifts?</h2>
          <div className="cta-buttons">
            <button
              className="cta-primary"
              onClick={() => window.location.href = '/'}
            >
              Take Gift Quiz
            </button>
            <button
              className="cta-secondary"
              onClick={() => window.location.href = '/browse'}
            >
              Browse All Gifts
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .thank-you-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 40px 20px;
        }

        .thank-you-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .thank-you-hero {
          text-align: center;
          padding: 60px 0;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }

        .success-animation {
          margin-bottom: 24px;
        }

        .checkmark {
          display: inline-block;
          font-size: 4rem;
          color: #10b981;
          background: #ecfdf5;
          padding: 20px;
          border-radius: 50%;
          animation: bounceIn 0.8s ease-out;
        }

        .thank-you-hero h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 16px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #64748b;
          margin-bottom: 48px;
        }

        .next-steps {
          display: flex;
          gap: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          max-width: 200px;
          text-align: left;
        }

        .step-number {
          background: var(--color-accent);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 8px 0;
        }

        .step p {
          color: #64748b;
          font-size: 0.9rem;
          margin: 0;
        }

        .immediate-value {
          background: white;
          padding: 48px 32px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
          text-align: center;
        }

        .immediate-value h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 16px;
        }

        .immediate-value p {
          color: #64748b;
          margin-bottom: 32px;
        }

        .gift-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .gift-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .gift-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.15);
        }

        .gift-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .gift-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .gift-info p {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .gift-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-accent);
          margin-bottom: 16px;
        }

        .shop-now-btn {
          background: var(--color-accent);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
        }

        .shop-now-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .social-proof {
          background: white;
          padding: 48px 32px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
          text-align: center;
        }

        .social-proof h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 32px;
        }

        .testimonials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .testimonial {
          background: #f8fafc;
          padding: 24px;
          border-radius: 12px;
          text-align: left;
        }

        .testimonial-content {
          color: #374151;
          font-style: italic;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .testimonial-author {
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 4px;
        }

        .testimonial-rating {
          color: #fbbf24;
        }

        .bonus-section {
          background: var(--color-accent);
          color: white;
          padding: 48px 32px;
          border-radius: 16px;
          text-align: center;
          margin-bottom: 40px;
        }

        .bonus-section h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .bonus-section p {
          opacity: 0.9;
          margin-bottom: 32px;
        }

        .referral-benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
        }

        .benefit-icon {
          font-size: 2rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .benefit-text h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .benefit-text p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .sharing-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .share-btn {
          padding: 12px 24px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .share-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .footer-cta {
          text-align: center;
          padding: 48px 0;
        }

        .footer-cta h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 32px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-primary,
        .cta-secondary {
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .cta-primary {
          background: var(--color-accent);
          color: white;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
        }

        .cta-secondary {
          background: white;
          color: var(--color-accent);
          border: 2px solid var(--color-accent);
        }

        .cta-secondary:hover {
          background: var(--color-accent);
          color: white;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .thank-you-hero {
            padding: 40px 24px;
          }

          .thank-you-hero h1 {
            font-size: 2rem;
          }

          .next-steps {
            flex-direction: column;
            align-items: center;
          }

          .step {
            max-width: 300px;
          }

          .immediate-value,
          .social-proof,
          .bonus-section {
            padding: 32px 24px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-primary,
          .cta-secondary {
            width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;