import React, { useState, useEffect } from 'react';

const PremiumLoader = ({
  type = 'default',
  size = 'medium',
  color = 'primary',
  text = 'Loading...',
  overlay = false,
  progress = null
}) => {
  const [dots, setDots] = useState('');
  const [currentTip, setCurrentTip] = useState(0);

  const loadingTips = [
    '🎯 Analyzing gift preferences...',
    '✨ Finding perfect matches...',
    '💝 Curating personalized recommendations...',
    '🎉 Almost ready with amazing options...',
    '🚀 Preparing your gift discovery...'
  ];

  useEffect(() => {
    if (type === 'dots') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }

    if (type === 'tips') {
      const interval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [type]);

  const getLoaderContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`premium-spinner ${size} ${color}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`premium-pulse ${size} ${color}`}>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`premium-wave ${size} ${color}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="wave-bar" style={{ '--delay': `${i * 0.1}s` }}></div>
            ))}
          </div>
        );

      case 'morphing':
        return (
          <div className={`premium-morphing ${size} ${color}`}>
            <div className="morph-shape"></div>
          </div>
        );

      case 'particles':
        return (
          <div className={`premium-particles ${size} ${color}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="particle" style={{ '--angle': `${i * 45}deg` }}></div>
            ))}
          </div>
        );

      case 'gift':
        return (
          <div className={`premium-gift ${size} ${color}`}>
            <div className="gift-box">
              <div className="gift-lid"></div>
              <div className="gift-body"></div>
              <div className="gift-ribbon-h"></div>
              <div className="gift-ribbon-v"></div>
              <div className="gift-sparkles">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="sparkle" style={{ '--delay': `${i * 0.2}s` }}>✨</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className={`premium-progress ${size} ${color}`}>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress || 0}%` }}
              ></div>
              <div className="progress-glow"></div>
            </div>
            <div className="progress-text">{progress ? `${Math.round(progress)}%` : text}</div>
          </div>
        );

      case 'skeleton':
        return (
          <div className={`premium-skeleton ${size}`}>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-line long"></div>
              <div className="skeleton-line medium"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className={`premium-tips ${size} ${color}`}>
            <div className="tips-icon">🎁</div>
            <div className="tips-text">
              {loadingTips[currentTip]}
            </div>
            <div className="tips-dots">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="tip-dot" style={{ '--delay': `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        );

      case 'dots':
        return (
          <div className={`premium-dots ${size} ${color}`}>
            <span>{text}</span>
            <span className="dots">{dots}</span>
          </div>
        );

      default:
        return (
          <div className={`premium-default ${size} ${color}`}>
            <div className="default-spinner"></div>
            <div className="default-text">{text}</div>
          </div>
        );
    }
  };

  const content = (
    <div className={`premium-loader ${type} ${overlay ? 'overlay' : ''}`}>
      {getLoaderContent()}
    </div>
  );

  if (overlay) {
    return (
      <div className="premium-loader-overlay">
        {content}
      </div>
    );
  }

  return content;
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [progress, setProgress] = useState(0);

  const startLoading = (text = 'Loading...') => {
    setLoading(true);
    setLoadingText(text);
    setProgress(0);
  };

  const stopLoading = () => {
    setLoading(false);
    setProgress(100);
  };

  const updateProgress = (value) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const updateText = (text) => {
    setLoadingText(text);
  };

  return {
    loading,
    loadingText,
    progress,
    startLoading,
    stopLoading,
    updateProgress,
    updateText
  };
};

export default PremiumLoader;