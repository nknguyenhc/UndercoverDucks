import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppRouterProvider from './router/router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouterProvider />
  </React.StrictMode>
);
