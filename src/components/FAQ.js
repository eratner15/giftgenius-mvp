import React, { useState } from 'react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      category: "Getting Started",
      items: [
        {
          question: "How does GiftGenius work?",
          answer: "Our AI-powered platform asks you questions about the recipient, occasion, and your budget. We then analyze our database of successful gifts to provide personalized recommendations that have high success rates with similar recipients."
        },
        {
          question: "Is GiftGenius really free to use?",
          answer: "Yes! Our recommendation service is completely free. We earn small commissions when you purchase through our affiliate links, but this never affects the price you pay or the quality of our recommendations."
        },
        {
          question: "How accurate are your recommendations?",
          answer: "Our recommendations have a 94% satisfaction rate based on user feedback. We continuously improve our AI by learning from successful gift outcomes and user reviews."
        }
      ]
    },
    {
      category: "Recommendations",
      items: [
        {
          question: "Why should I trust your gift suggestions?",
          answer: "Our recommendations are based on real data from successful gifts, not just popular products. We analyze recipient preferences, occasion appropriateness, and price-to-value ratios to suggest gifts that actually work."
        },
        {
          question: "Can I get recommendations for any budget?",
          answer: "Absolutely! Whether you're looking to spend $10 or $500, our AI finds gifts that maximize impact within your budget. We believe thoughtful gifts matter more than expensive ones."
        },
        {
          question: "What if the recipient doesn't like the gift?",
          answer: "While we can't guarantee every gift will be perfect, our 94% success rate speaks for itself. Most purchases are made through retailers with generous return policies for additional peace of mind."
        },
        {
          question: "Do you recommend gifts for all ages and relationships?",
          answer: "Yes! Our AI covers gifts for everyone from babies to grandparents, including family, friends, colleagues, and romantic partners. We have successful gift data across all demographics."
        }
      ]
    },
    {
      category: "Shopping & Purchasing",
      items: [
        {
          question: "Do I buy gifts directly from GiftGenius?",
          answer: "No, we don't sell products directly. We recommend gifts and provide links to trusted retailers like Amazon, Walmart, and specialty stores where you complete your purchase."
        },
        {
          question: "Are prices different when I use your links?",
          answer: "No! Prices are identical whether you use our links or go directly to the retailer. We earn a small commission from the retailer, but you pay the same price."
        },
        {
          question: "What about shipping and returns?",
          answer: "All shipping and return policies are handled by the retailer where you make your purchase. We recommend checking their policies before buying, but most offer fast shipping and easy returns."
        },
        {
          question: "Can I track my orders through GiftGenius?",
          answer: "Order tracking is handled by the retailer where you purchased. Once you click through our link and buy, you'll receive tracking information directly from them."
        }
      ]
    },
    {
      category: "Privacy & Data",
      items: [
        {
          question: "What information do you collect about me?",
          answer: "We only collect what's needed for recommendations: quiz answers, optional email for gift guides, and anonymous usage data to improve our service. We never sell your personal information."
        },
        {
          question: "Is my quiz data secure?",
          answer: "Yes! We use industry-standard security measures to protect your data. Quiz responses are used solely for providing recommendations and improving our AI."
        },
        {
          question: "Can I delete my data?",
          answer: "Absolutely. Contact us at privacy@giftgenius.com and we'll delete your personal data within 48 hours. You can also opt out of emails anytime."
        }
      ]
    },
    {
      category: "Technical Support",
      items: [
        {
          question: "The quiz isn't loading properly. What should I do?",
          answer: "Try refreshing the page or clearing your browser cache. If the problem persists, contact us at support@giftgenius.com with your browser and device details."
        },
        {
          question: "I clicked a product link but it goes to the wrong page",
          answer: "Product availability changes frequently. If a link is broken, try searching for the product name on the retailer's site, or contact us to report the issue."
        },
        {
          question: "Can I use GiftGenius on mobile?",
          answer: "Yes! Our website is fully optimized for mobile devices. The quiz and recommendations work seamlessly on phones and tablets."
        },
        {
          question: "Do you have an app?",
          answer: "Not yet, but our mobile website provides an app-like experience. You can bookmark us to your home screen for quick access to gift recommendations."
        }
      ]
    },
    {
      category: "Account & Features",
      items: [
        {
          question: "Do I need to create an account?",
          answer: "No account required! You can use our quiz and get recommendations instantly. Optionally, you can subscribe to our email list for seasonal gift guides."
        },
        {
          question: "How often do you add new gift options?",
          answer: "We continuously update our database with new products and successful gift outcomes. Our AI learns from every interaction to improve recommendations."
        },
        {
          question: "Can I save my favorite recommendations?",
          answer: "Yes! You can bookmark products or add them to your browser favorites. We're working on a wishlist feature for even easier gift planning."
        }
      ]
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Get instant answers to common questions about GiftGenius</p>
      </div>

      <div className="faq-container">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="faq-category">
            <h2 className="faq-category-title">{category.category}</h2>
            <div className="faq-items">
              {category.items.map((item, itemIndex) => {
                const itemKey = `${categoryIndex}-${itemIndex}`;
                const isOpen = openItems[itemKey];

                return (
                  <div key={itemKey} className="faq-item">
                    <button
                      className={`faq-question ${isOpen ? 'open' : ''}`}
                      onClick={() => toggleItem(itemKey)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{item.question}</span>
                      <span className="faq-toggle-icon">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="faq-footer">
          <div className="faq-contact">
            <h3>Still have questions?</h3>
            <p>We're here to help! Contact our support team and we'll get back to you within 24 hours.</p>
            <div className="faq-contact-methods">
              <div className="contact-method">
                <span className="contact-icon">Email</span>
                <div>
                  <strong>Email Support</strong>
                  <p>support@giftgenius.com</p>
                </div>
              </div>
              <div className="contact-method">
                <span className="contact-icon">Fast</span>
                <div>
                  <strong>Quick Response</strong>
                  <p>Most questions answered within 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;