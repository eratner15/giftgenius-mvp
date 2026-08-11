import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      initials: "SC",
      bio: "Former Amazon product manager with 8 years in e-commerce. Started GiftGenius after struggling to find the perfect anniversary gift."
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      initials: "MJ",
      bio: "AI engineer from Google. Built recommendation systems that processed millions of purchases. Believes technology should make life more thoughtful."
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Curation",
      initials: "ER",
      bio: "Former Nordstrom personal shopper with 12 years of gift expertise. Has helped over 10,000 customers find perfect gifts."
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      initials: "DK",
      bio: "PhD in behavioral psychology. Analyzes gift success patterns to understand what makes recipients genuinely happy."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Problem",
      description: "Our founders experienced the universal struggle: spending hours finding gifts that end up forgotten in closets."
    },
    {
      year: "Early 2024",
      title: "The Solution",
      description: "Combined AI technology with real gift success data to create personalized recommendations that actually work."
    },
    {
      year: "Mid 2024",
      title: "Beta Launch",
      description: "Launched with 500 beta users and achieved 94% gift satisfaction rate - proving our approach works."
    },
    {
      year: "Late 2024",
      title: "Public Launch",
      description: "Opened to everyone with 10,000+ successful gift recommendations and growing daily."
    }
  ];

  const stats = [
    { number: "94%", label: "Gift Success Rate" },
    { number: "50,000+", label: "Happy Recipients" },
    { number: "15 min", label: "Average Time Saved" },
    { number: "$2.1M", label: "In Perfect Gifts Recommended" }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>About GiftGenius</h1>
        <p>We're on a mission to make gift-giving effortless and meaningful</p>
      </div>

      <div className="about-container">
        {/* Our Story */}
        <section className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <div className="story-text">
              <p className="story-highlight">
                <strong>GiftGenius was born from a simple frustration:</strong> Why is finding the perfect gift so hard?
              </p>
              <p>
                Our founders spent countless hours browsing endless product lists, reading reviews, and still ended up
                with gifts that missed the mark. There had to be a better way.
              </p>
              <p>
                We realized that successful gift-giving isn't about having more options—it's about having the
                <em> right</em> options. So we built an AI that learns from real gift successes and failures,
                not just purchase data.
              </p>
              <p>
                Today, GiftGenius has helped over 50,000 people give gifts that create genuine joy and connection.
                We're proud that 94% of recipients love the gifts recommended through our platform.
              </p>
            </div>
          </div>

          <div className="story-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Mission */}
        <section className="about-mission">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <div className="mission-cards">
              <div className="mission-card">
                <div className="mission-icon">Target</div>
                <h3>Eliminate Gift Anxiety</h3>
                <p>No more stress, second-guessing, or last-minute panic purchases. We make gift-giving confident and enjoyable.</p>
              </div>

              <div className="mission-card">
                <div className="mission-icon">Heart</div>
                <h3>Create Meaningful Connections</h3>
                <p>Great gifts strengthen relationships. We help you show people you truly understand and care about them.</p>
              </div>

              <div className="mission-card">
                <div className="mission-icon">Fast</div>
                <h3>Save Time & Energy</h3>
                <p>Why spend hours researching when our AI can find perfect options in minutes? Focus on what matters—the giving.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="about-timeline">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">{milestone.year}</div>
                <div className="timeline-content">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section className="about-team">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            We're a diverse group of technologists, retailers, and gift enthusiasts united by one goal:
            making gift-giving better for everyone.
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">{member.initials}</div>
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Technology */}
        <section className="about-technology">
          <h2>How We're Different</h2>
          <div className="tech-grid">
            <div className="tech-feature">
              <h3>Real Success Data</h3>
              <p>We don't just track purchases—we track gift outcomes. Our AI learns from what recipients actually love.</p>
            </div>

            <div className="tech-feature">
              <h3>Context-Aware Matching</h3>
              <p>Same gift, different occasions = different success rates. We understand the nuances of gift-giving.</p>
            </div>

            <div className="tech-feature">
              <h3>Continuous Learning</h3>
              <p>Every successful gift teaches our AI something new. Our recommendations get better with every interaction.</p>
            </div>

            <div className="tech-feature">
              <h3>Quality Over Quantity</h3>
              <p>We'd rather show you 3 perfect options than 300 mediocre ones. Less choice paralysis, more confidence.</p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-content">
            <div className="value-item">
              <h3>Transparency First</h3>
              <p>We're upfront about our affiliate partnerships and how we make money. Trust is earned through honesty.</p>
            </div>

            <div className="value-item">
              <h3>Gift Recipients Come First</h3>
              <p>Our recommendations prioritize recipient happiness over profit margins. Happy recipients = happy gift-givers.</p>
            </div>

            <div className="value-item">
              <h3>Data-Driven Decisions</h3>
              <p>Every feature and recommendation is backed by real data, not assumptions or trends.</p>
            </div>

            <div className="value-item">
              <h3>Continuous Improvement</h3>
              <p>We're never satisfied with "good enough." Every day, we work to make gift-giving a little bit better.</p>
            </div>
          </div>
        </section>

        {/* Join Us */}
        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to Give Better Gifts?</h2>
            <p>Join thousands of confident gift-givers who trust GiftGenius for their most important moments.</p>
            <div className="cta-buttons">
              <button
                className="cta-primary"
                onClick={() => {
                  const quiz = document.querySelector('.hero');
                  if (quiz) quiz.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Finding Perfect Gifts
              </button>
              <button
                className="cta-secondary"
                onClick={() => window.location.hash = 'contact'}
              >
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;