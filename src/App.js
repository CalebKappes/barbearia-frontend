// src/App.js

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Importando os componentes de rota protegida
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Importando as páginas
import Header from './components/Header';
import LoginForm from './pages/LoginForm';
import Scheduler from './pages/Scheduler';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegistrationForm from './pages/RegistrationForm';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
    const location = useLocation();
    const { user } = useAuth(); // Usar 'user' é um pouco mais robusto que 'authToken'

    // Não mostra o Header nas páginas de login e registo
    const showHeader = location.pathname !== '/login' && location.pathname !== '/register';

    return (
        <div className="app-container">
            {showHeader && <Header />}
            <main className="main-content">
                <Routes>
                    {/* Rotas Públicas: Login e Registro */}
                    {/* Se o usuário já estiver logado, ele é redirecionado da página de login/registro */}
                    <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <RegistrationForm /> : <Navigate to="/" />} />

                    {/* Rotas Privadas para Usuários Logados */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Scheduler />} />
                        <Route path="/meus-agendamentos" element={<MyBookingsPage />} />
                    </Route>

                    {/* Rota Privada para Administradores */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/*" element={<AdminDashboard />} />
                    </Route>

                    {/* Rota de fallback: se não encontrar a rota, volta para a home ou login */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;