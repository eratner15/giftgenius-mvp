import React, { useState, useEffect, useCallback } from 'react';

// Gift Reminder System
export class GiftReminderManager {
  constructor() {
    this.reminders = this.loadReminders();
    this.defaultOccasions = [
      {
        name: 'Anniversary',
        icon: '💍',
        category: 'relationship',
        leadTime: 14, // days before to remind
        suggestions: ['jewelry', 'experiences', 'personalized']
      },
      {
        name: 'Birthday',
        icon: '🎂',
        category: 'celebration',
        leadTime: 7,
        suggestions: ['fashion', 'beauty', 'tech']
      },
      {
        name: "Valentine's Day",
        icon: '💝',
        category: 'holiday',
        leadTime: 10,
        suggestions: ['jewelry', 'flowers', 'romantic']
      },
      {
        name: 'Christmas',
        icon: '🎄',
        category: 'holiday',
        leadTime: 21,
        suggestions: ['fashion', 'home', 'experiences']
      },
      {
        name: "Mother's Day",
        icon: '🌸',
        category: 'holiday',
        leadTime: 14,
        suggestions: ['beauty', 'jewelry', 'spa']
      }
    ];
  }

  loadReminders() {
    const saved = localStorage.getItem('giftgenius_reminders');
    return saved ? JSON.parse(saved) : [];
  }

  saveReminders() {
    localStorage.setItem('giftgenius_reminders', JSON.stringify(this.reminders));
  }

  addReminder(reminderData) {
    const reminder = {
      id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...reminderData,
      createdAt: Date.now(),
      status: 'active',
      notificationsSent: 0
    };

    this.reminders.push(reminder);
    this.saveReminders();
    return reminder;
  }

  updateReminder(id, updates) {
    const index = this.reminders.findIndex(r => r.id === id);
    if (index >= 0) {
      this.reminders[index] = { ...this.reminders[index], ...updates };
      this.saveReminders();
      return this.reminders[index];
    }
    return null;
  }

  deleteReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.saveReminders();
  }

  getUpcomingReminders(daysAhead = 30) {
    const now = Date.now();
    const future = now + (daysAhead * 24 * 60 * 60 * 1000);

    return this.reminders
      .filter(r => r.status === 'active')
      .filter(r => {
        const reminderDate = new Date(r.date).getTime();
        const notifyDate = reminderDate - (r.leadTime * 24 * 60 * 60 * 1000);
        return notifyDate >= now && notifyDate <= future;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getDueReminders() {
    const now = Date.now();

    return this.reminders
      .filter(r => r.status === 'active')
      .filter(r => {
        const reminderDate = new Date(r.date).getTime();
        const notifyDate = reminderDate - (r.leadTime * 24 * 60 * 60 * 1000);
        return now >= notifyDate && now <= reminderDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  markAsNotified(id) {
    const reminder = this.reminders.find(r => r.id === id);
    if (reminder) {
      reminder.notificationsSent++;
      reminder.lastNotified = Date.now();
      this.saveReminders();
    }
  }

  generateYearlyReminders(partnerInfo) {
    const currentYear = new Date().getFullYear();
    const suggestions = [];

    if (partnerInfo.birthday) {
      suggestions.push({
        occasion: 'Birthday',
        date: new Date(currentYear, new Date(partnerInfo.birthday).getMonth(), new Date(partnerInfo.birthday).getDate()),
        person: partnerInfo.name,
        leadTime: 7
      });
    }

    if (partnerInfo.anniversaryDate) {
      suggestions.push({
        occasion: 'Anniversary',
        date: new Date(currentYear, new Date(partnerInfo.anniversaryDate).getMonth(), new Date(partnerInfo.anniversaryDate).getDate()),
        person: partnerInfo.name,
        leadTime: 14
      });
    }

    // Add common holidays
    const holidays = [
      { name: "Valentine's Day", month: 1, day: 14, leadTime: 10 },
      { name: "Mother's Day", month: 4, day: 12, leadTime: 14 }, // Second Sunday in May (approximate)
      { name: "Christmas", month: 11, day: 25, leadTime: 21 }
    ];

    holidays.forEach(holiday => {
      suggestions.push({
        occasion: holiday.name,
        date: new Date(currentYear, holiday.month, holiday.day),
        person: partnerInfo.name,
        leadTime: holiday.leadTime
      });
    });

    return suggestions;
  }
}

// Gift Reminder Dashboard
export const GiftReminderDashboard = ({ reminderManager, onGiftSearch }) => {
  const [reminders, setReminders] = useState(reminderManager.reminders);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dueReminders, setDueReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

  useEffect(() => {
    const updateReminders = () => {
      setReminders([...reminderManager.reminders]);
      setDueReminders(reminderManager.getDueReminders());
      setUpcomingReminders(reminderManager.getUpcomingReminders());
    };

    updateReminders();
    const interval = setInterval(updateReminders, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [reminderManager]);

  const handleStartGiftSearch = useCallback((reminder) => {
    const occasion = reminderManager.defaultOccasions.find(o => o.name === reminder.occasion);
    const searchParams = {
      occasion: reminder.occasion.toLowerCase(),
      suggestions: occasion?.suggestions || [],
      deadline: reminder.date,
      person: reminder.person
    };

    onGiftSearch(searchParams);
    reminderManager.markAsNotified(reminder.id);
  }, [reminderManager, onGiftSearch]);

  return (
    <div className="reminder-dashboard">
      <div className="reminder-header">
        <h2>🗓️ Gift Reminders</h2>
        <button
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add Reminder
        </button>
      </div>

      {/* Due Now Section */}
      {dueReminders.length > 0 && (
        <div className="reminder-section urgent">
          <h3>🚨 Action Needed</h3>
          <div className="reminder-cards">
            {dueReminders.map(reminder => (
              <div key={reminder.id} className="reminder-card due">
                <div className="reminder-urgent-indicator">
                  <span className="urgent-pulse"></span>
                  ACTION NEEDED
                </div>

                <div className="reminder-content">
                  <div className="reminder-occasion">
                    <span className="occasion-icon">
                      {reminderManager.defaultOccasions.find(o => o.name === reminder.occasion)?.icon || '🎁'}
                    </span>
                    <div className="occasion-info">
                      <h4>{reminder.occasion}</h4>
                      <p>{reminder.person}</p>
                    </div>
                  </div>

                  <div className="reminder-timing">
                    <div className="days-until">
                      {Math.ceil((new Date(reminder.date) - new Date()) / (1000 * 60 * 60 * 24))} days until
                    </div>
                    <div className="reminder-date">
                      {new Date(reminder.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="reminder-actions">
                  <button
                    className="btn-primary start-shopping"
                    onClick={() => handleStartGiftSearch(reminder)}
                  >
                    Start Shopping
                  </button>
                  <button
                    className="btn-secondary snooze"
                    onClick={() => {
                      reminderManager.updateReminder(reminder.id, {
                        leadTime: reminder.leadTime + 3
                      });
                    }}
                  >
                    Snooze 3 days
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingReminders.length > 0 && (
        <div className="reminder-section upcoming">
          <h3>📅 Coming Up</h3>
          <div className="reminder-list">
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="reminder-item">
                <div className="reminder-info">
                  <span className="reminder-icon">
                    {reminderManager.defaultOccasions.find(o => o.name === reminder.occasion)?.icon || '🎁'}
                  </span>
                  <div className="reminder-details">
                    <h4>{reminder.occasion} - {reminder.person}</h4>
                    <p>{new Date(reminder.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="reminder-countdown">
                  {Math.ceil((new Date(reminder.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Reminder Form */}
      {showAddForm && (
        <ReminderForm
          reminderManager={reminderManager}
          onClose={() => setShowAddForm(false)}
          onSave={(reminderData) => {
            reminderManager.addReminder(reminderData);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Quick Setup */}
      <div className="reminder-section quick-setup">
        <h3>⚡ Quick Setup</h3>
        <p>Let us help you never miss an important date again</p>
        <div className="quick-setup-options">
          <button
            className="quick-setup-btn"
            onClick={() => setShowAddForm(true)}
          >
            📱 Add Partner's Birthday
          </button>
          <button
            className="quick-setup-btn"
            onClick={() => setShowAddForm(true)}
          >
            💍 Set Anniversary Reminder
          </button>
          <button
            className="quick-setup-btn"
            onClick={() => {
              // Auto-add holiday reminders
              const holidays = [
                { occasion: "Valentine's Day", date: '2024-02-14', leadTime: 10 },
                { occasion: "Mother's Day", date: '2024-05-12', leadTime: 14 },
                { occasion: "Christmas", date: '2024-12-25', leadTime: 21 }
              ];

              holidays.forEach(holiday => {
                reminderManager.addReminder({
                  ...holiday,
                  person: 'Partner',
                  notes: 'Auto-generated holiday reminder'
                });
              });
            }}
          >
            🎄 Add Holiday Reminders
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Reminder Form
const ReminderForm = ({ reminderManager, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    occasion: '',
    person: '',
    date: '',
    leadTime: 7,
    notes: '',
    recurring: false,
    customOccasion: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const reminderData = {
      ...formData,
      occasion: formData.occasion === 'custom' ? formData.customOccasion : formData.occasion
    };
    onSave(reminderData);
  };

  return (
    <div className="reminder-form-overlay">
      <div className="reminder-form">
        <div className="form-header">
          <h3>Add Gift Reminder</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Occasion</label>
            <select
              value={formData.occasion}
              onChange={(e) => setFormData(prev => ({...prev, occasion: e.target.value}))}
              required
            >
              <option value="">Select occasion</option>
              {reminderManager.defaultOccasions.map(occasion => (
                <option key={occasion.name} value={occasion.name}>
                  {occasion.icon} {occasion.name}
                </option>
              ))}
              <option value="custom">✏️ Custom Occasion</option>
            </select>
          </div>

          {formData.occasion === 'custom' && (
            <div className="form-group">
              <label>Custom Occasion Name</label>
              <input
                type="text"
                value={formData.customOccasion}
                onChange={(e) => setFormData(prev => ({...prev, customOccasion: e.target.value}))}
                placeholder="e.g., Graduation, Promotion, etc."
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Person</label>
            <input
              type="text"
              value={formData.person}
              onChange={(e) => setFormData(prev => ({...prev, person: e.target.value}))}
              placeholder="e.g., Sarah, Mom, Best Friend"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Remind me</label>
            <select
              value={formData.leadTime}
              onChange={(e) => setFormData(prev => ({...prev, leadTime: parseInt(e.target.value)}))}
            >
              <option value={3}>3 days before</option>
              <option value={7}>1 week before</option>
              <option value={14}>2 weeks before</option>
              <option value={21}>3 weeks before</option>
              <option value={30}>1 month before</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Gift ideas, preferences, budget notes..."
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.recurring}
                onChange={(e) => setFormData(prev => ({...prev, recurring: e.target.checked}))}
              />
              Make this a yearly recurring reminder
            </label>
          </div>

          <div className="form-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reminder Notification Component
export const ReminderNotifications = ({ reminderManager, onDismiss, onAction }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkForDueReminders = () => {
      const due = reminderManager.getDueReminders()
        .filter(r => !r.lastNotified || (Date.now() - r.lastNotified) > (24 * 60 * 60 * 1000)) // Not notified in last 24h
        .slice(0, 3); // Show max 3 at once

      setNotifications(due);
    };

    checkForDueReminders();
    const interval = setInterval(checkForDueReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminderManager]);

  if (notifications.length === 0) return null;

  return (
    <div className="reminder-notifications">
      {notifications.map(reminder => (
        <div key={reminder.id} className="notification-card reminder">
          <div className="notification-icon">
            {reminderManager.defaultOccasions.find(o => o.name === reminder.occasion)?.icon || '🎁'}
          </div>

          <div className="notification-content">
            <h4>Time to find a gift!</h4>
            <p>{reminder.occasion} for {reminder.person} is coming up on {new Date(reminder.date).toLocaleDateString()}</p>
          </div>

          <div className="notification-actions">
            <button
              className="btn-primary small"
              onClick={() => {
                onAction(reminder);
                onDismiss(reminder.id);
                reminderManager.markAsNotified(reminder.id);
              }}
            >
              Start Shopping
            </button>
            <button
              className="btn-ghost small"
              onClick={() => {
                onDismiss(reminder.id);
                reminderManager.markAsNotified(reminder.id);
              }}
            >
              Later
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  GiftReminderManager,
  GiftReminderDashboard,
  ReminderNotifications
};