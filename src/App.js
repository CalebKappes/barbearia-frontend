// src/App.js

import React, { useState, useEffect } from 'react';
// ### A CORREÇÃO ESTÁ AQUI: Adicionamos 'Navigate' ###
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';

import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';
import AdminDashboard from './components/AdminDashboard';
import RegistrationForm from './components/RegistrationForm';

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
    </Routes>
  );
}


// O AppWrapper que tínhamos antes não é a forma mais correta de usar o router.
// A forma correta é colocar o <BrowserRouter> no index.js, como já fizemos.
// Vamos remover o AppWrapper para deixar o código mais limpo.

export default App;