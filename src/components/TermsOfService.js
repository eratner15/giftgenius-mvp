import React from 'react';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

        <section>
          <h2>Service Description</h2>
          <p>
            GiftGenius provides personalized gift recommendations through our quiz-based platform.
            We partner with retailers through affiliate programs to help you find and purchase gifts.
            All purchases are completed on third-party retailer websites subject to their terms and conditions.
          </p>
        </section>

        <section>
          <h2>How Our Service Works</h2>
          <ol>
            <li>You complete our gift finder quiz</li>
            <li>We provide personalized product recommendations</li>
            <li>You click affiliate links to retailer websites</li>
            <li>Purchases are completed directly with retailers</li>
            <li>We may earn a commission at no extra cost to you</li>
          </ol>
        </section>

        <section>
          <h2>Affiliate Relationship Disclosure</h2>
          <p>
            <strong>IMPORTANT:</strong> GiftGenius is an affiliate marketing website. We earn commissions
            when you make qualifying purchases through our links. This relationship does not affect
            the price you pay or our recommendation quality.
          </p>
          <p>
            We are participants in affiliate programs including:
          </p>
          <ul>
            <li>Amazon Associates Program</li>
            <li>Walmart Affiliate Program</li>
            <li>Various retailer affiliate networks</li>
          </ul>
        </section>

        <section>
          <h2>Your Responsibilities</h2>
          <ul>
            <li>Provide accurate information in our quiz for better recommendations</li>
            <li>Verify product details, pricing, and availability on retailer websites</li>
            <li>Read retailer terms and return policies before purchasing</li>
            <li>Use our service in compliance with applicable laws</li>
            <li>Respect intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h2>Disclaimers</h2>
          <p><strong>Product Information:</strong></p>
          <ul>
            <li>Product availability, pricing, and details may change without notice</li>
            <li>Always verify information on the retailer's website before purchasing</li>
            <li>We are not responsible for product quality, shipping, or customer service</li>
          </ul>

          <p><strong>Recommendations:</strong></p>
          <ul>
            <li>Our recommendations are suggestions based on general preferences</li>
            <li>We cannot guarantee recipient satisfaction</li>
            <li>Gift success depends on many personal factors we cannot control</li>
          </ul>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            GiftGenius provides recommendations "as is" without warranties. We are not liable for:
          </p>
          <ul>
            <li>Purchase decisions made through our recommendations</li>
            <li>Product defects, shipping issues, or retailer problems</li>
            <li>Recipient reactions to gifts</li>
            <li>Third-party website issues or data breaches</li>
            <li>Lost commissions or technical errors</li>
          </ul>
          <p>
            Your use of our service is at your own risk. Our liability is limited to the maximum
            extent permitted by law.
          </p>
        </section>

        <section>
          <h2>User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Manipulate or abuse our affiliate links</li>
            <li>Use automated tools to access our service</li>
            <li>Attempt to reverse engineer our recommendation algorithms</li>
            <li>Submit false information or spam</li>
            <li>Violate any applicable laws</li>
          </ul>
        </section>

        <section>
          <h2>Intellectual Property</h2>
          <p>
            GiftGenius owns the rights to our website design, quiz algorithms, and original content.
            Product images and descriptions belong to their respective retailers.
            You may not reproduce our content without permission.
          </p>
        </section>

        <section>
          <h2>Privacy</h2>
          <p>
            Your privacy is important to us. Please review our
            <a href="/privacy-policy" style={{color: '#6366f1', textDecoration: 'underline'}}>
              Privacy Policy
            </a> to understand how we collect and use your information.
          </p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            We may update these terms as our service evolves. Significant changes will be
            communicated through our website. Continued use constitutes acceptance of new terms.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service for violations
            of these terms. You may stop using our service at any time.
          </p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>
            Questions about these Terms of Service?<br/>
            <strong>Email:</strong> legal@giftgenius.com<br/>
            <strong>Response Time:</strong> Within 48 hours
          </p>
        </section>

        <div className="legal-footer">
          <p><small>These terms comply with FTC affiliate marketing guidelines and applicable consumer protection laws.</small></p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;