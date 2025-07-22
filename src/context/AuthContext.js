import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    // 1. Adicionamos o estado de loading, iniciando como true
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (authToken) {
                const decodedUser = jwtDecode(authToken);
                // Verifica se o token não expirou
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser(decodedUser);
                } else {
                    // Se o token expirou, limpa tudo
                    localStorage.removeItem('authToken');
                    setAuthToken(null);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Erro ao processar token:", e);
            setUser(null);
        } finally {
            // 2. Ao final da verificação, definimos loading como false
            setLoading(false);
        }
    }, [authToken]);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        // Redireciona para a página principal após o login
        // A lógica no App.js vai garantir que o usuário vá para a página certa
        navigate('/'); 
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        // Redireciona para a página de login após o logout
        navigate('/login'); 
    };

    // 3. Exportamos o 'loading' no valor do contexto
    const value = {
        authToken,
        user,
        loading, 
        login,
        logout,
    };

    // 4. Enquanto estiver carregando, não renderizamos nada para evitar o "piscar"
    if (loading) {
        return null; // Ou um componente de Spinner/Loading global
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
