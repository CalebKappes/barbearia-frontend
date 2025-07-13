// src/App.js

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Importa todas as nossas páginas
import LoginForm from './pages/LoginForm';
import Scheduler from './pages/Scheduler';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrationForm from './pages/RegistrationForm';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Efeito para verificar o token ao carregar o app
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        // Limpa um token inválido
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  // Função chamada pelo LoginForm após um login bem-sucedido
  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    // Redireciona para o painel de admin ou para a home
    if (decodedUser.is_staff) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  // Estrutura de rotas final
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
