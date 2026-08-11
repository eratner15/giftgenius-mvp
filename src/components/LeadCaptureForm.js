import React, { useState } from 'react';
import AffiliateTracker from '../utils/affiliateTracker';

const LeadCaptureForm = ({
  formType = 'newsletter',
  title = 'Get Exclusive Gift Ideas',
  subtitle = 'Join 10,000+ smart gift-givers',
  buttonText = 'Get Free Recommendations',
  showName = false,
  inline = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    interests: '',
    occasion: '',
    source: formType
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Track email capture event
      if (window.affiliateTracker) {
        window.affiliateTracker.trackInteraction('email_captured', {
          source: formType,
          email: formData.email,
          leadScore: window.affiliateTracker.leadScore,
          conversionProbability: window.affiliateTracker.conversionProbability
        });
      }

      // Google Analytics event
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'lead_generation',
          event_label: formType,
          currency: 'USD',
          value: 25 // Estimated lead value
        });
      }

      // Facebook Pixel event
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: title,
          content_category: formType,
          value: 25,
          currency: 'USD'
        });
      }

      // Submit to GiftGenius API
      const response = await fetch('/gifts/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          source: formData.source,
          occasion: formData.occasion,
          interests: formData.interests,
        })
      });

      if (response.ok) {
        setIsSubmitted(true);

        // Show success message
        setTimeout(() => {
          showSuccessNotification();
        }, 500);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSuccessNotification = () => {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🎉</div>
        <div class="notification-message">
          <h3>Welcome to GiftGenius!</h3>
          <p>Check your email for exclusive gift recommendations</p>
        </div>
      </div>
    `;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-accent);
      color: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(14, 165, 233, 0.3);
      z-index: 10000;
      animation: slideIn 0.5s ease-out;
      max-width: 350px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.5s ease-in';
      setTimeout(() => notification.remove(), 500);
    }, 4000);
  };

  if (isSubmitted) {
    return (
      <div className={`lead-capture-success ${className}`}>
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h3>You're All Set!</h3>
          <p>Check your email for exclusive gift recommendations</p>
          <div className="success-benefits">
            <div>💎 Personalized gift suggestions</div>
            <div>⚡ Price drop alerts</div>
            <div>🎁 Exclusive deals & discounts</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`lead-capture-form ${inline ? 'inline' : ''} ${className}`}>
      {!inline && (
        <div className="form-header">
          <h3>{title}</h3>
          <p>{subtitle}</p>
          <div className="social-proof">
            <div className="proof-stats">
              <span>⭐⭐⭐⭐⭐ 4.9/5</span>
              <span>•</span>
              <span>10,000+ subscribers</span>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="capture-form"
      >

        {showName && (
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        {formType === 'gift-finder' && (
          <>
            <div className="form-group">
              <select
                name="occasion"
                value={formData.occasion}
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              >
                <option value="">What's the occasion?</option>
                <option value="birthday">Birthday</option>
                <option value="christmas">Christmas</option>
                <option value="anniversary">Anniversary</option>
                <option value="wedding">Wedding</option>
                <option value="graduation">Graduation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="interests"
                placeholder="Their interests (e.g., cooking, reading, travel)"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
              />
            </div>
          </>
        )}

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Joining...' : buttonText}
        </button>

        <div className="form-footer">
          <small>✅ No spam, unsubscribe anytime</small>
        </div>
      </form>

      <style jsx>{`
        .lead-capture-form {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        }

        .lead-capture-form.inline {
          padding: 20px;
          max-width: 300px;
        }

        .form-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .form-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .form-header p {
          color: #64748b;
          margin-bottom: 16px;
        }

        .social-proof {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }

        .proof-stats {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--color-accent);
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--color-accent);
        }

        .submit-button {
          width: 100%;
          background: var(--color-accent);
          color: white;
          border: none;
          padding: 16px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 12px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          color: #64748b;
        }

        .form-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          text-align: center;
        }

        .lead-capture-success {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          font-size: 3rem;
        }

        .success-content h3 {
          color: #1a202c;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .success-content p {
          color: #64748b;
          margin: 0;
        }

        .success-benefits {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
          text-align: left;
        }

        .success-benefits div {
          color: var(--color-accent);
          font-weight: 500;
        }

        .success-notification .notification-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-icon {
          font-size: 2rem;
        }

        .notification-message h3 {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
        }

        .notification-message p {
          margin: 0;
          opacity: 0.9;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }

        @media (max-width: 768px) {
          .lead-capture-form {
            padding: 24px;
            margin: 0 16px;
          }

          .form-header h3 {
            font-size: 1.3rem;
          }

          .success-notification {
            left: 16px !important;
            right: 16px !important;
            top: 16px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Pre-built form variants
export const NewsletterForm = (props) => (
  <LeadCaptureForm
    formType="newsletter"
    title="Never Miss the Perfect Gift"
    subtitle="Get weekly personalized gift recommendations"
    buttonText="Get Free Recommendations"
    {...props}
  />
);

export const ExitIntentForm = (props) => (
  <LeadCaptureForm
    formType="exit-intent"
    title="Wait! Don't Leave Empty Handed"
    subtitle="Get our top 10 gift ideas before you go"
    buttonText="Send Me Gift Ideas"
    inline={true}
    {...props}
  />
);

export const QuizResultForm = (props) => (
  <LeadCaptureForm
    formType="quiz-result"
    title="Get Your Personalized Results"
    subtitle="Enter your email to see your perfect gift matches"
    buttonText="See My Results"
    showName={true}
    {...props}
  />
);

export const GiftFinderForm = (props) => (
  <LeadCaptureForm
    formType="gift-finder"
    title="Find the Perfect Gift"
    subtitle="Tell us about the recipient and we'll find amazing options"
    buttonText="Find Gifts"
    showName={true}
    {...props}
  />
);

export default LeadCaptureForm;