import React from 'react';
import PremiumLoader from './PremiumLoader';

const LoadingSpinner = ({
  size = 'medium',
  message = 'Loading amazing gifts...',
  type = 'gift',
  overlay = false
}) => {
  return (
    <PremiumLoader
      type={type}
      size={size}
      text={message}
      overlay={overlay}
      color="primary"
    />
  );
};

export default LoadingSpinner;