import React from 'react';
import { createRoot } from 'react-dom/client';
import MinimalApp from './MinimalApp';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<MinimalApp />);