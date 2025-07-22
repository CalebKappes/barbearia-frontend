// src/components/auth/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Enquanto o AuthContext verifica o usuário, mostramos uma mensagem.
  // Isso evita o "piscar" da tela.
  if (loading) {
    return <div>Carregando autenticação...</div>;
  }

  // Se, após a verificação, não houver usuário, redireciona para a tela de login.
  if (!user) {
    // ESTA É A CORREÇÃO: Redireciona para '/login' em vez de '/'.
    return <Navigate to="/login" replace />;
  }

  // Se o usuário estiver logado, permite o acesso à rota filha.
  return <Outlet />;
};

export default ProtectedRoute;
