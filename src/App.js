// src/App.js

import React, { useState, useEffect } from 'react';
// Adicionamos 'Navigate' para redirecionar usuários não autorizados
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';
import AdminDashboard from './components/AdminDashboard'; // Importamos o novo painel

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
        // Se o token for inválido, limpa
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    // Se o usuário for admin, pode redirecionar para o painel, senão para a home.
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
      {/* Rota Principal (Agendador) - Protegida */}
      <Route 
        path="/" 
        element={user ? <Scheduler user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
      />
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={<LoginForm onLoginSuccess={handleLoginSuccess} />} 
      />
      {/* ### NOVA ROTA DE ADMIN PROTEGIDA ### */}
      <Route 
        path="/admin"
        element={user && user.is_staff ? <AdminDashboard /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;