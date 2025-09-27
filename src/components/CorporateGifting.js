import React, { useState, useCallback, useMemo } from 'react';

// Corporate Gifting Manager
export class CorporateGiftingManager {
  constructor() {
    this.giftingPrograms = [
      {
        id: 'employee-appreciation',
        name: 'Employee Appreciation',
        icon: '🏆',
        description: 'Recognize outstanding employees with thoughtful gifts',
        budgetRanges: ['$25-50', '$50-100', '$100-250'],
        occasions: ['Work Anniversary', 'Promotion', 'Project Completion', 'Holiday Bonus'],
        recommendedCategories: ['tech', 'home', 'experiences', 'personalized']
      },
      {
        id: 'client-relations',
        name: 'Client Relations',
        icon: '🤝',
        description: 'Strengthen relationships with key clients and partners',
        budgetRanges: ['$50-100', '$100-250', '$250-500', '$500+'],
        occasions: ['Holiday Gifts', 'Contract Signing', 'Anniversary', 'Thank You'],
        recommendedCategories: ['luxury', 'experiences', 'gourmet', 'branded']
      },
      {
        id: 'onboarding',
        name: 'New Employee Welcome',
        icon: '🎉',
        description: 'Make new hires feel valued from day one',
        budgetRanges: ['$25-50', '$50-100'],
        occasions: ['First Day', 'First Week', 'First Month'],
        recommendedCategories: ['tech', 'office', 'branded', 'welcome-kit']
      },
      {
        id: 'milestone-rewards',
        name: 'Milestone Rewards',
        icon: '🎯',
        description: 'Celebrate significant achievements and milestones',
        budgetRanges: ['$100-250', '$250-500', '$500+'],
        occasions: ['5 Year Anniversary', '10 Year Anniversary', 'Retirement', 'Major Achievement'],
        recommendedCategories: ['luxury', 'personalized', 'experiences', 'jewelry']
      }
    ];

    this.bulkOrders = this.loadBulkOrders();
    this.corporateClients = this.loadCorporateClients();
  }

  loadBulkOrders() {
    const saved = localStorage.getItem('giftgenius_bulk_orders');
    return saved ? JSON.parse(saved) : [];
  }

  loadCorporateClients() {
    const saved = localStorage.getItem('giftgenius_corporate_clients');
    return saved ? JSON.parse(saved) : [];
  }

  saveBulkOrders() {
    localStorage.setItem('giftgenius_bulk_orders', JSON.stringify(this.bulkOrders));
  }

  saveCorporateClients() {
    localStorage.setItem('giftgenius_corporate_clients', JSON.stringify(this.corporateClients));
  }

  createBulkOrder(orderData) {
    const order = {
      id: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      status: 'pending',
      createdAt: Date.now(),
      estimatedDelivery: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      totalAmount: this.calculateBulkOrderTotal(orderData)
    };

    this.bulkOrders.push(order);
    this.saveBulkOrders();
    return order;
  }

  calculateBulkOrderTotal(orderData) {
    const basePrice = orderData.pricePerUnit || 50;
    const quantity = orderData.quantity || 1;
    const subtotal = basePrice * quantity;

    // Volume discounts
    let discount = 0;
    if (quantity >= 100) discount = 0.20; // 20% for 100+
    else if (quantity >= 50) discount = 0.15; // 15% for 50+
    else if (quantity >= 25) discount = 0.10; // 10% for 25+
    else if (quantity >= 10) discount = 0.05; // 5% for 10+

    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    return {
      subtotal,
      discount: discountAmount,
      discountPercentage: discount * 100,
      total,
      pricePerUnit: total / quantity
    };
  }

  addCorporateClient(clientData) {
    const client = {
      id: `client_${Date.now()}`,
      ...clientData,
      createdAt: Date.now(),
      status: 'active',
      totalOrders: 0,
      totalSpent: 0
    };

    this.corporateClients.push(client);
    this.saveCorporateClients();
    return client;
  }

  getVolumeDiscountInfo(quantity) {
    if (quantity >= 100) return { percentage: 20, savings: 'Save 20%' };
    if (quantity >= 50) return { percentage: 15, savings: 'Save 15%' };
    if (quantity >= 25) return { percentage: 10, savings: 'Save 10%' };
    if (quantity >= 10) return { percentage: 5, savings: 'Save 5%' };
    return { percentage: 0, savings: 'No discount' };
  }
}

// Corporate Gifting Dashboard
export const CorporateGiftingDashboard = ({ corporateManager, onCreateOrder, onViewProgram }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <div className="corporate-gifting-dashboard">
      <div className="corporate-header">
        <div className="corporate-title">
          <h2>🏢 Corporate Gifting Solutions</h2>
          <p>Streamline your business gifting with bulk orders and volume discounts</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setActiveTab('create-order')}
        >
          Create Bulk Order
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="corporate-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          Programs
        </button>
        <button
          className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`nav-tab ${activeTab === 'create-order' ? 'active' : ''}`}
          onClick={() => setActiveTab('create-order')}
        >
          Create Order
        </button>
      </div>

      {/* Tab Content */}
      <div className="corporate-content">
        {activeTab === 'overview' && (
          <CorporateOverview
            corporateManager={corporateManager}
            onViewProgram={setSelectedProgram}
          />
        )}

        {activeTab === 'programs' && (
          <GiftingPrograms
            programs={corporateManager.giftingPrograms}
            onSelectProgram={setSelectedProgram}
          />
        )}

        {activeTab === 'orders' && (
          <BulkOrderHistory
            orders={corporateManager.bulkOrders}
            corporateManager={corporateManager}
          />
        )}

        {activeTab === 'create-order' && (
          <BulkOrderForm
            corporateManager={corporateManager}
            onSubmit={onCreateOrder}
          />
        )}
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onCreateOrder={() => {
            setActiveTab('create-order');
            setSelectedProgram(null);
          }}
        />
      )}
    </div>
  );
};

// Corporate Overview Component
const CorporateOverview = ({ corporateManager, onViewProgram }) => {
  const stats = useMemo(() => {
    const orders = corporateManager.bulkOrders;
    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + (order.totalAmount?.total || 0), 0),
      averageOrderSize: orders.length ? Math.round(orders.reduce((sum, order) => sum + (order.quantity || 0), 0) / orders.length) : 0,
      activePrograms: corporateManager.giftingPrograms.length
    };
  }, [corporateManager]);

  return (
    <div className="corporate-overview">
      {/* Key Stats */}
      <div className="corporate-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalSpent.toLocaleString()}</h3>
            <p>Total Spent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.averageOrderSize}</h3>
            <p>Avg. Order Size</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.activePrograms}</h3>
            <p>Programs Available</p>
          </div>
        </div>
      </div>

      {/* Volume Discount Info */}
      <div className="discount-tiers">
        <h3>Volume Discount Tiers</h3>
        <div className="discount-grid">
          <div className="discount-tier">
            <div className="tier-quantity">10-24 items</div>
            <div className="tier-discount">5% OFF</div>
          </div>
          <div className="discount-tier">
            <div className="tier-quantity">25-49 items</div>
            <div className="tier-discount">10% OFF</div>
          </div>
          <div className="discount-tier">
            <div className="tier-quantity">50-99 items</div>
            <div className="tier-discount">15% OFF</div>
          </div>
          <div className="discount-tier popular">
            <div className="tier-badge">Most Popular</div>
            <div className="tier-quantity">100+ items</div>
            <div className="tier-discount">20% OFF</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="corporate-quick-actions">
        <h3>Popular Programs</h3>
        <div className="program-quick-cards">
          {corporateManager.giftingPrograms.slice(0, 3).map(program => (
            <div
              key={program.id}
              className="program-quick-card"
              onClick={() => onViewProgram(program)}
            >
              <div className="program-icon">{program.icon}</div>
              <div className="program-info">
                <h4>{program.name}</h4>
                <p>{program.description}</p>
              </div>
              <div className="program-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="corporate-benefits">
        <h3>Why Choose Corporate Gifting?</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">💼</div>
            <h4>Professional Management</h4>
            <p>Dedicated account managers for large orders</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🚚</div>
            <h4>Flexible Delivery</h4>
            <p>Coordinated delivery to multiple locations</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🎨</div>
            <h4>Custom Branding</h4>
            <p>Add your company logo and messaging</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">📈</div>
            <h4>Volume Discounts</h4>
            <p>Save up to 20% on bulk orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Gifting Programs Component
const GiftingPrograms = ({ programs, onSelectProgram }) => {
  return (
    <div className="gifting-programs">
      <div className="programs-header">
        <h3>Corporate Gifting Programs</h3>
        <p>Choose the perfect program for your business needs</p>
      </div>

      <div className="programs-grid">
        {programs.map(program => (
          <div
            key={program.id}
            className="program-card"
            onClick={() => onSelectProgram(program)}
          >
            <div className="program-header">
              <div className="program-icon">{program.icon}</div>
              <h4>{program.name}</h4>
            </div>

            <p className="program-description">{program.description}</p>

            <div className="program-details">
              <div className="detail-section">
                <h5>Budget Ranges</h5>
                <div className="budget-tags">
                  {program.budgetRanges.map(range => (
                    <span key={range} className="budget-tag">{range}</span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h5>Occasions</h5>
                <div className="occasion-list">
                  {program.occasions.slice(0, 3).map(occasion => (
                    <span key={occasion} className="occasion-item">{occasion}</span>
                  ))}
                  {program.occasions.length > 3 && (
                    <span className="occasion-more">+{program.occasions.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>

            <button className="program-select-btn">
              View Program →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bulk Order Form
const BulkOrderForm = ({ corporateManager, onSubmit }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    program: '',
    occasion: '',
    quantity: 10,
    budgetPerItem: 50,
    deliveryDate: '',
    deliveryAddress: '',
    customizations: '',
    notes: ''
  });

  const [quotation, setQuotation] = useState(null);

  const calculateQuotation = useCallback(() => {
    if (formData.quantity && formData.budgetPerItem) {
      const orderData = {
        quantity: parseInt(formData.quantity),
        pricePerUnit: parseFloat(formData.budgetPerItem)
      };
      const total = corporateManager.calculateBulkOrderTotal(orderData);
      setQuotation(total);
    }
  }, [formData.quantity, formData.budgetPerItem, corporateManager]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      pricePerUnit: parseFloat(formData.budgetPerItem)
    };
    onSubmit(orderData);
  };

  return (
    <div className="bulk-order-form">
      <div className="form-header">
        <h3>Create Bulk Order</h3>
        <p>Get instant pricing and place your corporate gift order</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Information */}
        <div className="form-section">
          <h4>Company Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Name</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({...prev, contactName: e.target.value}))}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                required
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="form-section">
          <h4>Order Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Gifting Program</label>
              <select
                value={formData.program}
                onChange={(e) => setFormData(prev => ({...prev, program: e.target.value}))}
                required
              >
                <option value="">Select program</option>
                {corporateManager.giftingPrograms.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.icon} {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Occasion</label>
              <input
                type="text"
                value={formData.occasion}
                onChange={(e) => setFormData(prev => ({...prev, occasion: e.target.value}))}
                placeholder="e.g., Holiday Gifts, Employee Appreciation"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => {
                  setFormData(prev => ({...prev, quantity: e.target.value}));
                  calculateQuotation();
                }}
                required
              />
              <div className="quantity-helper">
                {corporateManager.getVolumeDiscountInfo(parseInt(formData.quantity)).savings}
              </div>
            </div>
            <div className="form-group">
              <label>Budget per Item</label>
              <input
                type="number"
                min="10"
                step="5"
                value={formData.budgetPerItem}
                onChange={(e) => {
                  setFormData(prev => ({...prev, budgetPerItem: e.target.value}));
                  calculateQuotation();
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* Quotation Display */}
        {quotation && (
          <div className="quotation-display">
            <h4>💰 Instant Quote</h4>
            <div className="quote-breakdown">
              <div className="quote-line">
                <span>Subtotal ({formData.quantity} items)</span>
                <span>${quotation.subtotal.toFixed(2)}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="quote-line discount">
                  <span>Volume Discount ({quotation.discountPercentage}%)</span>
                  <span>-${quotation.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="quote-line total">
                <span>Total</span>
                <span>${quotation.total.toFixed(2)}</span>
              </div>
              <div className="quote-per-item">
                ${quotation.pricePerUnit.toFixed(2)} per item after discount
              </div>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        <div className="form-section">
          <h4>Delivery Information</h4>
          <div className="form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData(prev => ({...prev, deliveryDate: e.target.value}))}
              min={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 7 days from now
              required
            />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea
              value={formData.deliveryAddress}
              onChange={(e) => setFormData(prev => ({...prev, deliveryAddress: e.target.value}))}
              placeholder="Full delivery address including any special instructions"
              rows={3}
              required
            />
          </div>
        </div>

        {/* Customizations */}
        <div className="form-section">
          <h4>Customizations (Optional)</h4>
          <div className="form-group">
            <label>Customization Requests</label>
            <textarea
              value={formData.customizations}
              onChange={(e) => setFormData(prev => ({...prev, customizations: e.target.value}))}
              placeholder="Company logo, custom messaging, special packaging, etc."
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Any special requirements or preferences"
              rows={2}
            />
          </div>
        </div>

        <div className="form-footer">
          <button type="submit" className="btn-primary large">
            Submit Order Request
          </button>
          <div className="form-note">
            You'll receive a detailed quotation and timeline within 2 business hours
          </div>
        </div>
      </form>
    </div>
  );
};

// Bulk Order History
const BulkOrderHistory = ({ orders, corporateManager }) => {
  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-icon">📦</div>
        <h3>No orders yet</h3>
        <p>Your bulk orders will appear here once you place them</p>
      </div>
    );
  }

  return (
    <div className="bulk-order-history">
      <h3>Order History</h3>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <div className="order-info">
                <h4>Order #{order.id.substr(-8)}</h4>
                <p>{order.companyName} • {order.quantity} items</p>
              </div>
              <div className={`order-status ${order.status}`}>
                {order.status}
              </div>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span>Program:</span>
                <span>{order.program}</span>
              </div>
              <div className="detail-row">
                <span>Total:</span>
                <span>${order.totalAmount?.total?.toFixed(2) || 'TBD'}</span>
              </div>
              <div className="detail-row">
                <span>Delivery:</span>
                <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="order-actions">
              <button className="btn-secondary small">View Details</button>
              {order.status === 'pending' && (
                <button className="btn-ghost small">Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Program Detail Modal
const ProgramDetailModal = ({ program, onClose, onCreateOrder }) => {
  return (
    <div className="program-modal-overlay">
      <div className="program-modal">
        <div className="program-modal-header">
          <div className="program-modal-title">
            <span className="program-icon">{program.icon}</span>
            <h3>{program.name}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="program-modal-content">
          <p className="program-description">{program.description}</p>

          <div className="program-details-grid">
            <div className="detail-section">
              <h4>Budget Ranges</h4>
              <div className="budget-options">
                {program.budgetRanges.map(range => (
                  <span key={range} className="budget-option">{range}</span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Perfect For</h4>
              <div className="occasions-list">
                {program.occasions.map(occasion => (
                  <div key={occasion} className="occasion-item">
                    <span className="occasion-dot">•</span>
                    <span>{occasion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Recommended Categories</h4>
              <div className="categories-list">
                {program.recommendedCategories.map(category => (
                  <span key={category} className="category-tag">
                    {category.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="program-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Learn More Later
          </button>
          <button className="btn-primary" onClick={onCreateOrder}>
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

const CorporateGiftingExports = {
  CorporateGiftingManager,
  CorporateGiftingDashboard
};

export default CorporateGiftingExports;