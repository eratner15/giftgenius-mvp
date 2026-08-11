import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Wait for DOM to be ready
function initializeApp() {
  const container = document.getElementById('root');

  if (!container) {
    console.error('Root element not found');
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    container.innerHTML = '<div style="padding: 20px; color: red;">Failed to load application. Please check console for details.</div>';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}