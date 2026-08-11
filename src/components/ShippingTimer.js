import React, { useState, useEffect } from 'react';

const ShippingTimer = ({ shippingDays = 2, cutoffHour = 14 }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    const calculateShippingDeadline = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const isWeekend = now.getDay() === 0 || now.getDay() === 6;

      // Calculate next business day cutoff
      let targetDate = new Date(now);

      if (isWeekend) {
        // If weekend, show Monday cutoff
        const daysUntilMonday = (8 - now.getDay()) % 7 || 1;
        targetDate.setDate(now.getDate() + daysUntilMonday);
        targetDate.setHours(cutoffHour, 0, 0, 0);
      } else if (currentHour >= cutoffHour) {
        // After cutoff, show next business day
        targetDate.setDate(now.getDate() + 1);
        if (targetDate.getDay() === 6) targetDate.setDate(targetDate.getDate() + 2); // Skip Saturday
        if (targetDate.getDay() === 0) targetDate.setDate(targetDate.getDate() + 1); // Skip Sunday
        targetDate.setHours(cutoffHour, 0, 0, 0);
      } else {
        // Before cutoff, same day
        targetDate.setHours(cutoffHour, 0, 0, 0);
      }

      const diffMs = targetDate.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffMs <= 0) {
        setTimeLeft('Order by 2pm tomorrow');
        setUrgency('low');
      } else if (diffHours < 2) {
        setTimeLeft(`${diffHours}h ${diffMinutes}m left`);
        setUrgency('high');
      } else if (diffHours < 6) {
        setTimeLeft(`${diffHours}h ${diffMinutes}m left`);
        setUrgency('medium');
      } else {
        setTimeLeft(`Order by ${cutoffHour}:00`);
        setUrgency('normal');
      }

      return diffMs;
    };

    // Calculate immediately
    calculateShippingDeadline();

    // Update every minute
    const interval = setInterval(() => {
      const remaining = calculateShippingDeadline();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [cutoffHour]);

  const getShippingDate = () => {
    const now = new Date();
    const shippingDate = new Date(now);

    // Add shipping days, skip weekends
    let daysAdded = 0;
    while (daysAdded < shippingDays) {
      shippingDate.setDate(shippingDate.getDate() + 1);
      if (shippingDate.getDay() !== 0 && shippingDate.getDay() !== 6) {
        daysAdded++;
      }
    }

    return shippingDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUrgencyStyles = () => {
    switch (urgency) {
      case 'high':
        return {
          background: '#EF4444',
          color: 'white'
        };
      case 'medium':
        return {
          background: '#F59E0B',
          color: 'white'
        };
      case 'low':
        return {
          background: 'var(--gray-100)',
          color: 'var(--color-text-secondary)'
        };
      default:
        return {
          background: 'var(--color-success)',
          color: 'white'
        };
    }
  };

  return (
    <div className="shipping-timer" style={getUrgencyStyles()}>
      <div className="timer-content">
        <div className="timer-icon">
          {urgency === 'high' ? '!' : urgency === 'medium' ? '!' : ''}
        </div>
        <div className="timer-text">
          <div className="timer-main">
            {urgency === 'high' ? 'HURRY!' : urgency === 'medium' ? 'Almost out of time!' : 'Free shipping'}
          </div>
          <div className="timer-detail">
            {timeLeft} → arrives {getShippingDate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingTimer;