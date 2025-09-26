import React, { useState, useEffect, useRef, useCallback } from 'react';

// Touch Gesture Handler Hook
export const useTouchGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onDoubleTap,
  onLongPress,
  sensitivity = 50,
  longPressDuration = 500
} = {}) => {
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    startTime: 0,
    touches: [],
    isLongPressing: false,
    lastTap: 0
  });

  const longPressTimer = useRef(null);
  const element = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const now = Date.now();

    setTouchState(prev => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
      endX: touch.clientX,
      endY: touch.clientY,
      startTime: now,
      touches: Array.from(e.touches),
      isLongPressing: false
    }));

    // Start long press timer
    if (onLongPress && e.touches.length === 1) {
      longPressTimer.current = setTimeout(() => {
        setTouchState(prev => ({ ...prev, isLongPressing: true }));
        onLongPress(e);
      }, longPressDuration);
    }

    // Handle double tap
    if (onDoubleTap && e.touches.length === 1) {
      if (now - touchState.lastTap < 300) {
        onDoubleTap(e);
        setTouchState(prev => ({ ...prev, lastTap: 0 }));
      } else {
        setTouchState(prev => ({ ...prev, lastTap: now }));
      }
    }
  }, [onLongPress, onDoubleTap, longPressDuration, touchState.lastTap]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault(); // Prevent scrolling during gesture

    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      endX: touch.clientX,
      endY: touch.clientY,
      touches: Array.from(e.touches)
    }));

    // Cancel long press if moving
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Handle pinch zoom
    if (onPinchZoom && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (touchState.touches.length === 2) {
        const prevTouch1 = touchState.touches[0];
        const prevTouch2 = touchState.touches[1];
        const prevDistance = Math.hypot(
          prevTouch2.clientX - prevTouch1.clientX,
          prevTouch2.clientY - prevTouch1.clientY
        );

        const scale = currentDistance / prevDistance;
        onPinchZoom({ scale, center: {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2
        }});
      }
    }
  }, [onPinchZoom, touchState.touches]);

  const handleTouchEnd = useCallback((e) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (touchState.isLongPressing) {
      return; // Don't process swipes after long press
    }

    const deltaX = touchState.endX - touchState.startX;
    const deltaY = touchState.endY - touchState.startY;
    const deltaTime = Date.now() - touchState.startTime;

    // Only process swipes for single finger gestures
    if (e.touches.length === 0 && touchState.touches.length === 1) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if it's a swipe (minimum distance and time)
      if ((absX > sensitivity || absY > sensitivity) && deltaTime < 1000) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight({ deltaX, deltaY, deltaTime });
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft({ deltaX, deltaY, deltaTime });
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown({ deltaX, deltaY, deltaTime });
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp({ deltaX, deltaY, deltaTime });
          }
        }
      }
    }

    setTouchState(prev => ({
      ...prev,
      touches: Array.from(e.touches),
      isLongPressing: false
    }));
  }, [
    touchState,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    sensitivity
  ]);

  const touchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    ref: element
  };

  return [touchHandlers, touchState];
};

// Swipeable Gift Card Component
export const SwipeableGiftCard = ({
  gift,
  onSwipeLeft,
  onSwipeRight,
  onDoubleTap,
  onLongPress,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [transform, setTransform] = useState('');
  const [opacity, setOpacity] = useState(1);

  const handleSwipeLeft = useCallback((gesture) => {
    setIsAnimating(true);
    setTransform('translateX(-100%) rotateZ(-10deg)');
    setOpacity(0);

    setTimeout(() => {
      onSwipeLeft && onSwipeLeft(gift, gesture);
      setTransform('');
      setOpacity(1);
      setIsAnimating(false);
    }, 300);
  }, [gift, onSwipeLeft]);

  const handleSwipeRight = useCallback((gesture) => {
    setIsAnimating(true);
    setTransform('translateX(100%) rotateZ(10deg)');
    setOpacity(0);

    setTimeout(() => {
      onSwipeRight && onSwipeRight(gift, gesture);
      setTransform('');
      setOpacity(1);
      setIsAnimating(false);
    }, 300);
  }, [gift, onSwipeRight]);

  const handleDoubleTap = useCallback((e) => {
    setTransform('scale(1.05)');
    setTimeout(() => setTransform(''), 200);
    onDoubleTap && onDoubleTap(gift, e);
  }, [gift, onDoubleTap]);

  const handleLongPress = useCallback((e) => {
    setTransform('scale(0.95)');
    setTimeout(() => setTransform(''), 500);
    onLongPress && onLongPress(gift, e);
  }, [gift, onLongPress]);

  const [touchHandlers] = useTouchGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
    sensitivity: 80
  });

  return (
    <div
      {...touchHandlers}
      className={`swipeable-gift-card ${className} ${isAnimating ? 'animating' : ''}`}
      style={{
        transform,
        opacity,
        transition: isAnimating ? 'all 0.3s ease-out' : 'transform 0.2s ease-out'
      }}
    >
      <div className="card-content">
        <img
          src={gift.image_url || '/api/placeholder/200/200'}
          alt={gift.name || gift.title}
          className="gift-image"
          draggable="false"
        />
        <div className="gift-info">
          <h3>{gift.name || gift.title}</h3>
          <p className="gift-price">${gift.price}</p>
          <div className="gift-rating">
            {'★'.repeat(Math.floor(gift.success_rate / 20))}
            <span className="rating-text">{gift.success_rate}% success</span>
          </div>
        </div>
      </div>

      <div className="swipe-indicators">
        <div className="swipe-hint left">
          <span className="hint-icon">👎</span>
          <span className="hint-text">Skip</span>
        </div>
        <div className="swipe-hint right">
          <span className="hint-icon">❤️</span>
          <span className="hint-text">Like</span>
        </div>
      </div>
    </div>
  );
};

// Touch-Optimized Button Component
export const TouchButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  hapticFeedback = true,
  className = '',
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleTouchStart = useCallback((e) => {
    setIsPressed(true);

    // Haptic feedback
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.touches[0].clientX - rect.left - size / 2;
    const y = e.touches[0].clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  }, [hapticFeedback]);

  const handleTouchEnd = useCallback((e) => {
    setIsPressed(false);

    // Trigger click
    if (!disabled && onClick) {
      setTimeout(() => onClick(e), 50); // Small delay for visual feedback
    }
  }, [disabled, onClick]);

  const buttonClass = [
    'touch-button',
    `touch-button--${variant}`,
    `touch-button--${size}`,
    isPressed && 'touch-button--pressed',
    disabled && 'touch-button--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsPressed(false)}
      disabled={disabled}
      {...props}
    >
      <span className="button-content">{children}</span>

      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="button-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
    </button>
  );
};

// Pull-to-Refresh Component
export const PullToRefresh = ({
  children,
  onRefresh,
  threshold = 80,
  maxPull = 120,
  className = ''
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      setCanPull(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!canPull || isRefreshing) return;

    const touch = e.touches[0];
    const container = containerRef.current;
    const startY = container.dataset.startY || touch.clientY;

    if (!container.dataset.startY) {
      container.dataset.startY = touch.clientY;
    }

    const currentY = touch.clientY;
    const distance = Math.min(maxPull, Math.max(0, (currentY - startY) * 0.5));

    setPullDistance(distance);

    if (distance > 0) {
      e.preventDefault(); // Prevent bounce scrolling
    }
  }, [canPull, isRefreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    const container = containerRef.current;
    delete container.dataset.startY;

    setCanPull(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);

      try {
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error('Refresh failed:', error);
      }

      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 500);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  const pullProgress = pullDistance / threshold;
  const refreshIconRotation = pullProgress * 180;

  return (
    <div
      ref={containerRef}
      className={`pull-to-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="pull-indicator"
        style={{
          height: pullDistance,
          opacity: pullProgress
        }}
      >
        <div className="pull-content">
          {isRefreshing ? (
            <div className="refresh-spinner">
              <div className="spinner-ring"></div>
            </div>
          ) : (
            <div
              className="refresh-icon"
              style={{ transform: `rotate(${refreshIconRotation}deg)` }}
            >
              ↻
            </div>
          )}
          <span className="pull-text">
            {isRefreshing ? 'Refreshing...' :
             pullDistance >= threshold ? 'Release to refresh' :
             'Pull to refresh'}
          </span>
        </div>
      </div>

      <div
        className="refresh-content"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Touch-Optimized Slider Component
export const TouchSlider = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  onChangeComplete,
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef(null);
  const thumbRef = useRef(null);

  const getValue = useCallback((clientX) => {
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = min + percentage * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  }, [min, max, step]);

  const handleTouchStart = useCallback((e) => {
    if (disabled) return;

    setIsDragging(true);
    const newValue = getValue(e.touches[0].clientX);
    setCurrentValue(newValue);

    if (onChange) onChange(newValue);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, [disabled, getValue, onChange]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || disabled) return;

    e.preventDefault();
    const newValue = getValue(e.touches[0].clientX);

    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      if (onChange) onChange(newValue);

      // Light haptic feedback on value change
      if (navigator.vibrate) {
        navigator.vibrate(2);
      }
    }
  }, [isDragging, disabled, getValue, onChange, currentValue]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (onChangeComplete) onChangeComplete(currentValue);
    }
  }, [isDragging, onChangeComplete, currentValue]);

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      className={`touch-slider ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="slider-track">
        <div
          className="slider-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        ref={thumbRef}
        className="slider-thumb"
        style={{ left: `${percentage}%` }}
      >
        <div className="thumb-indicator">
          <span className="value-display">{currentValue}</span>
        </div>
      </div>
    </div>
  );
};

// Mobile-Optimized Modal
export const TouchModal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  swipeToClose = true,
  className = ''
}) => {
  const [modalTransform, setModalTransform] = useState('');
  const [backdropOpacity, setBackdropOpacity] = useState(1);
  const modalRef = useRef(null);

  const handleSwipeDown = useCallback((gesture) => {
    if (!swipeToClose) return;

    const { deltaY } = gesture;
    if (deltaY > 100) {
      setModalTransform('translateY(100%)');
      setBackdropOpacity(0);
      setTimeout(() => {
        onClose && onClose();
        setModalTransform('');
        setBackdropOpacity(1);
      }, 300);
    }
  }, [swipeToClose, onClose]);

  const [touchHandlers] = useTouchGestures({
    onSwipeDown: handleSwipeDown,
    sensitivity: 30
  });

  if (!isOpen) return null;

  return (
    <div className={`touch-modal-backdrop ${className}`} style={{ opacity: backdropOpacity }}>
      <div
        ref={modalRef}
        {...touchHandlers}
        className="touch-modal-content"
        style={{
          transform: modalTransform,
          transition: modalTransform ? 'all 0.3s ease-out' : 'none'
        }}
      >
        {swipeToClose && (
          <div className="modal-handle">
            <div className="handle-bar"></div>
          </div>
        )}

        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <TouchButton
                variant="ghost"
                size="small"
                onClick={onClose}
                className="modal-close-btn"
              >
                ✕
              </TouchButton>
            )}
          </div>
        )}

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default {
  useTouchGestures,
  SwipeableGiftCard,
  TouchButton,
  PullToRefresh,
  TouchSlider,
  TouchModal
};