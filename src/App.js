// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

import LoginForm from './pages/LoginForm';
import Scheduler from './pages/Scheduler';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrationForm from './pages/RegistrationForm';
import MyBookingsPage from './pages/MyBookingsPage';

// ... (o resto do seu App.js, que já está correto, continua aqui) ...

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    if (decodedUser.is_staff) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Scheduler user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={<LoginForm onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigate('/register')} />} 
      />
      <Route
        path="/register"
        element={<RegistrationForm onNavigateToLogin={() => navigate('/login')} />}
      />
      <Route 
        path="/admin"
        element={user && user.is_staff ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/meus-agendamentos"
        element={user ? <MyBookingsPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;