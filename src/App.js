// src/App.js

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import Header from './components/Header'; // Importamos nosso novo Header
import LoginForm from './pages/LoginForm';
import Scheduler from './pages/Scheduler';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrationForm from './pages/RegistrationForm';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  const location = useLocation();
  const token = localStorage.getItem('authToken');

  // Não mostra o Header nas páginas de login e registo
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="app-container">
      {showHeader && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!token ? <LoginForm /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <RegistrationForm /> : <Navigate to="/" />} />
          
          <Route path="/" element={token ? <Scheduler /> : <Navigate to="/login" />} />
          <Route path="/meus-agendamentos" element={token ? <MyBookingsPage /> : <Navigate to="/login" />} />
          <Route path="/admin" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

