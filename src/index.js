// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Importe o BrowserRouter
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Importe o registrador

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolva o <App /> com o BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
// Ativa o registro do Service Worker
serviceWorkerRegistration.register();