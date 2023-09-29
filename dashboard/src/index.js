import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppRouterProvider from './router/router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouterProvider />
  </React.StrictMode>
);
