import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlCA3BhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==',
  lazy = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [lazy, isVisible]);

  // Preload the actual image
  useEffect(() => {
    if (!isVisible || !src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsError(true);
    img.src = src;
  }, [isVisible, src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
  };

  return (
    <div
      ref={imgRef}
      className={`optimized-image-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
      {...props}
    >
      {/* Placeholder/Loading State */}
      {!isLoaded && !isError && (
        <img
          src={placeholder}
          alt=""
          className={`optimized-image-placeholder ${isVisible ? 'loading' : ''}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(4px)',
            transition: 'opacity 0.3s ease',
            opacity: isVisible ? 0.6 : 1
          }}
        />
      )}

      {/* Actual Image */}
      {isVisible && src && !isError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(1.05)'
          }}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Error State */}
      {isError && (
        <div
          className="optimized-image-error"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '14px'
          }}
        >
          Image unavailable
        </div>
      )}

      {/* Loading Shimmer Effect */}
      {!isLoaded && !isError && isVisible && (
        <div
          className="loading-shimmer"
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1
          }}
        />
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .optimized-image-placeholder.loading {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;