// src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';
import AdminDashboard from './components/AdminDashboard';
import RegistrationForm from './components/RegistrationForm';
import MyBookingsPage from './components/MyBookingsPage';

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

  // ### BLOCO DE ROTAS CORRIGIDO ###
  return (
    <Routes>
      {/* Rota Principal (Agendador) */}
      <Route 
        path="/" 
        element={user ? <Scheduler user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
      />
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={<LoginForm onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigate('/register')} />} 
      />
      {/* Rota de Cadastro */}
      <Route
        path="/register"
        element={<RegistrationForm onNavigateToLogin={() => navigate('/login')} />}
      />
      {/* Rota da Área de Gestão (Admin) */}
      <Route 
        path="/admin"
        element={user && user.is_staff ? <AdminDashboard /> : <Navigate to="/" />}
      />
      {/* Rota para Meus Agendamentos */}
      <Route
        path="/meus-agendamentos"
        element={user ? <MyBookingsPage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;