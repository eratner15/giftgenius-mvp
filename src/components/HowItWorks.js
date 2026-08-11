import React, { useState } from 'react';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Tell Us About Your Recipient",
      icon: "01",
      description: "Share who you're shopping for, your relationship, and the occasion. The more context, the better our recommendations.",
      details: [
        "Age range and gender",
        "Your relationship (family, friend, colleague, etc.)",
        "Special occasion or just because",
        "Their personality and lifestyle",
        "Any specific interests or hobbies"
      ],
      example: "Shopping for my tech-savvy brother's 30th birthday who loves gaming and coffee"
    },
    {
      number: "02",
      title: "Set Your Budget Range",
      icon: "02",
      description: "We find amazing gifts at any price point. From thoughtful $15 finds to luxurious $500 surprises.",
      details: [
        "Choose your comfortable spending range",
        "We optimize for value, not just price",
        "Great gifts exist at every budget level",
        "No judgment - every budget is valid",
        "We'll maximize your gift impact"
      ],
      example: "Budget: $50-100 for a meaningful but not extravagant gift"
    },
    {
      number: "03",
      title: "Our AI Gets to Work",
      icon: "03",
      description: "Our algorithm analyzes millions of successful gift outcomes to find options that recipients actually love.",
      details: [
        "Matches your criteria with our success database",
        "Considers recipient demographics and preferences",
        "Weighs occasion appropriateness",
        "Filters for high satisfaction ratings",
        "Prioritizes gifts with proven track records"
      ],
      example: "Processing 10,000+ similar gift scenarios to find the best matches"
    },
    {
      number: "04",
      title: "Get Curated Recommendations",
      icon: "04",
      description: "Receive 3-5 hand-picked options, each with detailed explanations of why it's perfect for your situation.",
      details: [
        "Only show gifts with 85%+ success rates",
        "Explain why each gift fits your recipient",
        "Include real user feedback and reviews",
        "Show price comparisons across retailers",
        "Provide gift-wrapping and timing tips"
      ],
      example: "Here are 3 gifts that 94% of similar recipients loved..."
    },
    {
      number: "05",
      title: "Purchase with Confidence",
      icon: "05",
      description: "Buy directly from trusted retailers. We earn a small commission, but you pay the same price.",
      details: [
        "Click through to Amazon, Walmart, or specialty stores",
        "Prices are identical to going direct",
        "We earn commission only if you purchase",
        "All shipping and returns handled by retailer",
        "Track your order through their platform"
      ],
      example: "Click → Buy on Amazon → Get tracking info → Gift arrives perfectly"
    }
  ];

  const features = [
    {
      icon: "AI",
      title: "AI-Powered Matching",
      description: "Our algorithm learns from 50,000+ successful gift outcomes, not just popular products."
    },
    {
      icon: "94%",
      title: "94% Success Rate",
      description: "Recipients love our recommendations because we focus on proven gift successes."
    },
    {
      icon: "15h",
      title: "Save 15+ Hours",
      description: "Skip the endless browsing. Get perfect options in under 5 minutes."
    },
    {
      icon: "Q",
      title: "Quality Over Quantity",
      description: "3-5 perfect options beats 300 mediocre ones. Less choice paralysis, more confidence."
    },
    {
      icon: "T",
      title: "Transparent & Honest",
      description: "We're upfront about how we make money and why we recommend certain gifts."
    },
    {
      icon: "++",
      title: "Always Improving",
      description: "Every successful gift makes our AI smarter for the next recommendation."
    }
  ];

  const comparisons = [
    {
      feature: "Time to find gifts",
      traditional: "2-5 hours of browsing",
      giftgenius: "5 minutes with quiz",
      better: true
    },
    {
      feature: "Number of options",
      traditional: "Thousands of products",
      giftgenius: "3-5 perfect matches",
      better: true
    },
    {
      feature: "Success guidance",
      traditional: "Generic reviews",
      giftgenius: "Success rate data",
      better: true
    },
    {
      feature: "Decision confidence",
      traditional: "Guesswork and hoping",
      giftgenius: "Data-backed certainty",
      better: true
    },
    {
      feature: "Cost to you",
      traditional: "Same price",
      giftgenius: "Same price",
      better: false
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>How GiftGenius Works</h1>
        <p>From confused browsing to confident gift-giving in 5 simple steps</p>
      </div>

      <div className="how-it-works-container">
        {/* Process Steps */}
        <section className="process-section">
          <h2>The GiftGenius Process</h2>
          <div className="steps-container">
            <div className="steps-navigation">
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`step-nav-item ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="step-nav-number">{step.number}</div>
                  <div className="step-nav-title">{step.title}</div>
                </button>
              ))}
            </div>

            <div className="step-content">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step-details ${activeStep === index ? 'active' : ''}`}
                >
                  <div className="step-header">
                    <div className="step-icon">{step.icon}</div>
                    <div>
                      <div className="step-number">Step {step.number}</div>
                      <h3 className="step-title">{step.title}</h3>
                    </div>
                  </div>

                  <p className="step-description">{step.description}</p>

                  <div className="step-details-grid">
                    <div className="step-checklist">
                      <h4>What We Consider:</h4>
                      <ul>
                        {step.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="step-example">
                      <h4>Example:</h4>
                      <p className="example-text">"{step.example}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="features-section">
          <h2>What Makes Us Different</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="comparison-section">
          <h2>GiftGenius vs Traditional Gift Shopping</h2>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-col">Feature</div>
              <div className="comparison-col">Traditional Shopping</div>
              <div className="comparison-col highlight">GiftGenius</div>
            </div>

            {comparisons.map((row, index) => (
              <div key={index} className="comparison-row">
                <div className="comparison-col feature">{row.feature}</div>
                <div className="comparison-col traditional">{row.traditional}</div>
                <div className={`comparison-col giftgenius ${row.better ? 'better' : ''}`}>
                  {row.giftgenius}
                  {row.better && <span className="better-badge">✓ Better</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Deep Dive */}
        <section className="technology-section">
          <h2>The Science Behind Our Recommendations</h2>

          <div className="tech-explainer">
            <div className="tech-stat">
              <div className="stat-big">50,000+</div>
              <div className="stat-label">Gift outcomes analyzed</div>
            </div>

            <div className="tech-process">
              <h3>Our AI Considers:</h3>
              <div className="tech-factors">
                <div className="tech-factor">
                  <strong>Recipient Demographics:</strong> Age, gender, lifestyle patterns
                </div>
                <div className="tech-factor">
                  <strong>Relationship Context:</strong> Family, friend, professional, romantic
                </div>
                <div className="tech-factor">
                  <strong>Occasion Appropriateness:</strong> Birthday, anniversary, holiday, just because
                </div>
                <div className="tech-factor">
                  <strong>Budget Optimization:</strong> Maximum impact within your range
                </div>
                <div className="tech-factor">
                  <strong>Success Probability:</strong> Historical satisfaction rates for similar scenarios
                </div>
                <div className="tech-factor">
                  <strong>Seasonal Trends:</strong> What's working right now vs. all-time favorites
                </div>
              </div>
            </div>
          </div>

          <div className="success-metrics">
            <div className="metric">
              <div className="metric-number">94%</div>
              <div className="metric-label">Recipient Satisfaction</div>
            </div>
            <div className="metric">
              <div className="metric-number">5 min</div>
              <div className="metric-label">Average Quiz Time</div>
            </div>
            <div className="metric">
              <div className="metric-number">3-5</div>
              <div className="metric-label">Perfect Options</div>
            </div>
            <div className="metric">
              <div className="metric-number">15+ hrs</div>
              <div className="metric-label">Time Saved</div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="how-faq-section">
          <h2>Common Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do you make money?</h3>
              <p>We earn small commissions when you purchase through our affiliate links. You pay the same price, but we get a small percentage from the retailer.</p>
            </div>

            <div className="faq-item">
              <h3>What if the recipient doesn't like it?</h3>
              <p>With a 94% success rate, this is rare! But all purchases are made through retailers with return policies for your peace of mind.</p>
            </div>

            <div className="faq-item">
              <h3>How is this different from Amazon recommendations?</h3>
              <p>Amazon shows what's popular or profitable. We show what actually makes recipients happy based on real gift outcome data.</p>
            </div>

            <div className="faq-item">
              <h3>Do you store my personal information?</h3>
              <p>We only keep quiz responses to improve recommendations. No names, addresses, or payment info—that's all handled by retailers.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="how-cta-section">
          <div className="cta-content">
            <h2>Ready to Give Gifts That Matter?</h2>
            <p>Join thousands who've upgraded from stressful guessing to confident gift-giving.</p>

            <div className="cta-stats">
              <div className="cta-stat">
                <strong>50,000+</strong> successful gifts recommended
              </div>
              <div className="cta-stat">
                <strong>15 minutes</strong> average time saved
              </div>
              <div className="cta-stat">
                <strong>94%</strong> recipient satisfaction rate
              </div>
            </div>

            <button
              className="how-cta-button"
              onClick={() => {
                const quiz = document.querySelector('.hero');
                if (quiz) quiz.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Your Gift Journey
            </button>

            <p className="cta-note">
              <small>Free to use • No account required • 5-minute quiz</small>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;