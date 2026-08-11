import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Quiz Responses:</strong> Your answers to our gift finder quiz to personalize recommendations</li>
            <li><strong>Email Address:</strong> When you opt-in to receive gift guides and recommendations (optional)</li>
            <li><strong>Usage Data:</strong> Anonymous analytics to improve our service (page views, clicks, search terms)</li>
            <li><strong>Cookies:</strong> Essential cookies for site functionality and analytics</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Provide personalized gift recommendations based on quiz responses</li>
            <li>Send gift guides and recommendations (only if you subscribe)</li>
            <li>Improve our service through anonymous usage analytics</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>Affiliate Disclosure</h2>
          <p>
            <strong>GiftGenius participates in affiliate programs with Amazon, Walmart, and other retailers.</strong>
            We earn commissions on qualifying purchases at no extra cost to you. Our recommendations are based on
            quality and user preferences, not commission rates.
          </p>
          <p>
            When you click on affiliate links and make purchases, we may receive a small commission.
            This helps us keep our service free while providing you with valuable gift recommendations.
          </p>
        </section>

        <section>
          <h2>Data Sharing</h2>
          <p>We do NOT sell, rent, or share your personal information with third parties except:</p>
          <ul>
            <li>Anonymous analytics data with Google Analytics to improve our service</li>
            <li>When required by law or to protect our legal rights</li>
            <li>With your explicit consent</li>
          </ul>
        </section>

        <section>
          <h2>Your Rights</h2>
          <ul>
            <li><strong>Access:</strong> Request a copy of your data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Correction:</strong> Update incorrect information</li>
            <li><strong>Opt-out:</strong> Unsubscribe from emails anytime</li>
          </ul>
          <p>Contact us at <strong>privacy@giftgenius.com</strong> for any data requests.</p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We use industry-standard security measures to protect your information. However,
            no internet transmission is 100% secure. We encourage you to use caution when
            sharing personal information online.
          </p>
        </section>

        <section>
          <h2>Cookies Policy</h2>
          <p>We use essential cookies for:</p>
          <ul>
            <li>Site functionality and user preferences</li>
            <li>Anonymous analytics (Google Analytics)</li>
            <li>Affiliate link tracking for commission purposes</li>
          </ul>
          <p>You can disable cookies in your browser settings, but this may affect site functionality.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            For questions about this Privacy Policy, contact us at:<br/>
            <strong>Email:</strong> privacy@giftgenius.com<br/>
            <strong>Response Time:</strong> Within 48 hours
          </p>
        </section>

        <section>
          <h2>Updates to This Policy</h2>
          <p>
            We may update this policy as our service evolves. Changes will be posted on this page
            with an updated "Last Modified" date. Continued use of our service constitutes acceptance
            of any changes.
          </p>
        </section>

        <div className="legal-footer">
          <p><small>This policy complies with GDPR, CCPA, and FTC guidelines for affiliate marketing.</small></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;