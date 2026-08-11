import React from 'react';

const FastSkeletonLoader = ({
  type = 'card',
  count = 1,
  className = '',
  height = 'auto',
  width = '100%'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton-card ${className}`}>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-rating"></div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`skeleton-text ${className}`} style={{ height, width }}></div>
        );

      case 'image':
        return (
          <div className={`skeleton-image-only ${className}`} style={{ height, width }}></div>
        );

      case 'avatar':
        return (
          <div className={`skeleton-avatar ${className}`}></div>
        );

      case 'list':
        return (
          <div className={`skeleton-list ${className}`}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton-list-item">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-list-content">
                  <div className="skeleton-text" style={{ width: '80%' }}></div>
                  <div className="skeleton-text" style={{ width: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className={`skeleton-default ${className}`} style={{ height, width }}></div>;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-wrapper">
          {renderSkeleton()}
        </div>
      ))}

      <style jsx>{`
        .skeleton-wrapper {
          display: contents;
        }

        .skeleton-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .skeleton-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
        }

        .skeleton-image-only {
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 12px;
        }

        .skeleton-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-title {
          height: 20px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 4px;
          width: 85%;
        }

        .skeleton-price {
          height: 18px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 4px;
          width: 40%;
        }

        .skeleton-description {
          height: 14px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 4px;
          width: 90%;
        }

        .skeleton-rating {
          height: 14px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 4px;
          width: 60%;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 4px;
          width: 100%;
        }

        .skeleton-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          flex-shrink: 0;
        }

        .skeleton-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .skeleton-list-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .skeleton-list-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-default {
          background: linear-gradient(90deg, #f0f2f5 25%, #e4e6ea 50%, #f0f2f5 75%);
          background-size: 200% 100%;
          animation: loading 1.2s infinite;
          border-radius: 8px;
          min-height: 20px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .skeleton-image,
          .skeleton-image-only,
          .skeleton-title,
          .skeleton-price,
          .skeleton-description,
          .skeleton-rating,
          .skeleton-text,
          .skeleton-avatar,
          .skeleton-default {
            animation: none;
            background: #f0f2f5;
          }
        }
      `}</style>
    </>
  );
};

export default FastSkeletonLoader;