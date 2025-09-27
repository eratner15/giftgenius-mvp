import React from 'react';
import { createRoot } from 'react-dom/client';
import SimpleApp from './SimpleApp';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <SimpleApp />
  </ErrorBoundary>
);