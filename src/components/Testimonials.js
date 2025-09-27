import React, { useState } from 'react';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "San Francisco, CA",
      occasion: "Anniversary Gift",
      rating: 5,
      text: "I was completely lost on what to get my husband for our 5-year anniversary. The AI expert helped me find a personalized star map of our first date - he absolutely loved it! The success rate data was spot on.",
      gift: "Personalized Star Map",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 89
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      location: "Austin, TX",
      occasion: "Mother's Day",
      rating: 5,
      text: "My mom is notoriously hard to shop for. Used the gift finder wizard and it suggested the aromatherapy diffuser set. She uses it every single day now and keeps thanking me. Will definitely use this again!",
      gift: "Essential Oil Diffuser Set",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 76
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "London, UK",
      occasion: "Birthday Surprise",
      rating: 5,
      text: "The AI chat was like having a personal shopping assistant! It asked all the right questions about my best friend's interests. The cashmere scarf I ended up choosing was perfect - she said it was the best gift she'd ever received.",
      gift: "Luxury Cashmere Scarf",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 92
    },
    {
      id: 4,
      name: "David Park",
      location: "Seattle, WA",
      occasion: "Wedding Gift",
      rating: 5,
      text: "Finding a wedding gift for a couple who has everything seemed impossible. The success rate data helped me choose the wine aerator set. They sent me a photo of them using it at their first dinner party - mission accomplished!",
      gift: "Professional Wine Aerator Set",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 68
    },
    {
      id: 5,
      name: "Lisa Wang",
      location: "New York, NY",
      occasion: "Housewarming",
      rating: 5,
      text: "I'm terrible at gift-giving but this site changed everything. The filtering system helped me find the perfect bamboo cutting board set for my friend's new apartment. She said it was exactly what she needed!",
      gift: "Bamboo Kitchen Set",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 84
    },
    {
      id: 6,
      name: "James Miller",
      location: "Chicago, IL",
      occasion: "Thank You Gift",
      rating: 5,
      text: "Needed to thank my mentor for years of guidance. The AI suggested a premium coffee subscription based on his interests. Three months later, he still mentions how much he enjoys discovering new roasts each month.",
      gift: "Artisan Coffee Subscription",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      helpfulVotes: 71
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "24/7", label: "AI Support" }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>Real Stories, Real Success</h2>
          <p>Join thousands of gift-givers who found their perfect match</p>
        </div>

        {/* Stats Section */}
        <div className="testimonials-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Testimonial Display */}
        <div className="testimonial-carousel">
          <button className="carousel-btn prev" onClick={prevTestimonial}>
            ‹
          </button>

          <div className="testimonial-main">
            <div className="testimonial-content">
              <div className="testimonial-text">
                <div className="quote-mark">"</div>
                <p>{testimonials[activeTestimonial].text}</p>
              </div>

              <div className="testimonial-gift">
                <div className="gift-tag">
                  🎁 Perfect Match: <strong>{testimonials[activeTestimonial].gift}</strong>
                </div>
              </div>

              <div className="testimonial-author">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="author-image"
                />
                <div className="author-info">
                  <div className="author-name">
                    {testimonials[activeTestimonial].name}
                    {testimonials[activeTestimonial].verified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                  <div className="author-location">{testimonials[activeTestimonial].location}</div>
                  <div className="author-occasion">{testimonials[activeTestimonial].occasion}</div>
                  <div className="author-rating">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>
                </div>
              </div>

              <div className="testimonial-helpful">
                👍 {testimonials[activeTestimonial].helpfulVotes} people found this helpful
              </div>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextTestimonial}>
            ›
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeTestimonial ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className="testimonials-grid">
          <h3>More Success Stories</h3>
          <div className="testimonials-grid-items">
            {testimonials.filter((_, index) => index !== activeTestimonial).slice(0, 3).map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="card-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="card-text">"{testimonial.text.substring(0, 120)}..."</p>
                <div className="card-author">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <div className="card-name">{testimonial.name}</div>
                    <div className="card-occasion">{testimonial.occasion}</div>
                  </div>
                </div>
                <div className="card-gift">
                  Perfect Match: {testimonial.gift}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <div className="trust-text">Secure & Private</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">✅</div>
            <div className="trust-text">Verified Reviews</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💝</div>
            <div className="trust-text">98% Success Rate</div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🚀</div>
            <div className="trust-text">Instant Results</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;