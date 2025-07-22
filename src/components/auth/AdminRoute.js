// src/components/auth/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user } = useAuth();

    // Se não há usuário ou se o usuário não é um admin (is_staff),
    // redireciona para a página principal.
    if (!user || !user.is_staff) {
        return <Navigate to="/" replace />;
    }

    // Se for um admin, permite o acesso.
    return <Outlet />;
};

export default AdminRoute;