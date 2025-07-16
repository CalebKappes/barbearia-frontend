import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Cria o contexto
const AuthContext = createContext();

// Componente Provedor
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Quando o authToken muda, tentamos decodificar o token para obter os dados do usuário
    if (authToken) {
      try {
        const decodedUser = jwtDecode(authToken);
        setUser(decodedUser);
      } catch (e) {
        console.error("Token inválido:", e);
        // Se o token for inválido, limpa o estado
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
      }
    } else {
        setUser(null);
    }
  }, [authToken]);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    navigate('/'); // Redireciona para a página principal após o login
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  const value = {
    authToken,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};