import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

import Header from './components/Header';
import LoginForm from './pages/LoginForm';
import Scheduler from './pages/Scheduler';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrationForm from './pages/RegistrationForm';
import MyBookingsPage from './pages/MyBookingsPage';

// Componente para proteger rotas que exigem login
const PrivateRoute = ({ children }) => {
  const { authToken } = useAuth();
  return authToken ? children : <Navigate to="/login" />;
};

// Componente para proteger rotas que exigem ser admin
const AdminRoute = ({ children }) => {
    const { user, authToken } = useAuth();
    if (!authToken) {
        return <Navigate to="/login" />;
    }
    return user && user.is_staff ? children : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  const { authToken } = useAuth();
  
  // Não mostra o Header nas páginas de login e registo
  const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="app-container">
      {showHeader && <Header />}
      <main className="main-content">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={!authToken ? <LoginForm /> : <Navigate to="/" />} />
          <Route path="/register" element={!authToken ? <RegistrationForm /> : <Navigate to="/" />} />
          
          {/* Rotas Privadas */}
          <Route path="/" element={<PrivateRoute><Scheduler /></PrivateRoute>} />
          <Route path="/meus-agendamentos" element={<PrivateRoute><MyBookingsPage /></PrivateRoute>} />
          
          {/* Rota Privada de Admin */}
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to={authToken ? "/" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;