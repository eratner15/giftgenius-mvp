import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Message Sent!</h1>
          <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        </div>
        <div className="contact-success">
          <div className="success-animation">Success!</div>
          <p>Redirecting you back to the form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We're here to help with any questions about gift recommendations</p>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have a question about our recommendations? Need help finding the perfect gift? We're here to help!</p>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">@</div>
                <div className="method-details">
                  <h3>Email Support</h3>
                  <p>support@giftgenius.com</p>
                  <small>Response within 2-24 hours</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">P</div>
                <div className="method-details">
                  <h3>Partnership Inquiries</h3>
                  <p>partnerships@giftgenius.com</p>
                  <small>For brands and retailers</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">Lock</div>
                <div className="method-details">
                  <h3>Privacy Requests</h3>
                  <p>privacy@giftgenius.com</p>
                  <small>Data deletion & privacy concerns</small>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">Legal</div>
                <div className="method-details">
                  <h3>Legal</h3>
                  <p>legal@giftgenius.com</p>
                  <small>Terms, policies, and legal matters</small>
                </div>
              </div>
            </div>

            <div className="response-time">
              <h3>Our Response Promise</h3>
              <ul>
                <li><strong>General Support:</strong> Within 24 hours</li>
                <li><strong>Technical Issues:</strong> Within 2 hours</li>
                <li><strong>Gift Emergencies:</strong> Same day response</li>
                <li><strong>Privacy Requests:</strong> Within 48 hours</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category">What can we help with?</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="general">General Question</option>
                    <option value="recommendations">Gift Recommendations</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="privacy">Privacy/Data Request</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief subject line"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                  <small className="char-count">
                    {formData.message.length}/1000 characters
                  </small>
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                    </>
                  )}
                </button>

                <p className="form-note">
                  <small>
                    * Required fields. We typically respond within 24 hours.
                    For urgent gift emergencies, mention "URGENT" in your subject line.
                  </small>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="contact-faq-links">
          <h3>Quick Answers</h3>
          <p>Looking for instant help? Check out our most common questions:</p>
          <div className="faq-quick-links">
            <a href="#faq" className="faq-link">How does GiftGenius work?</a>
            <a href="#faq" className="faq-link">Are your recommendations free?</a>
            <a href="#faq" className="faq-link">How do affiliate links work?</a>
            <a href="#faq" className="faq-link">Can I return recommended gifts?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;