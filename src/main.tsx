import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handlers to prevent Safari from silently crashing
// Safari aggressively kills pages on unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection caught:', event.reason);
  event.preventDefault(); // Prevent Safari from killing the page
});

window.addEventListener('error', (event) => {
  console.warn('Global error caught:', event.message);
  // Don't prevent default for actual errors - just log them
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
