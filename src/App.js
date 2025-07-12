// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Note a importação correta
import './App.css';

import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';

function App() {
  // Agora guardamos o objeto do usuário, que decodificaremos do token
  const [user, setUser] = useState(null); 
  const navigate = useNavigate(); // Hook para nos ajudar a navegar entre páginas

  // Este efeito roda uma vez quando o app carrega
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('authToken', token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser); // Guarda as informações do usuário, não só o token
    navigate('/'); // Navega para a página principal após o login
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Navega para a página de login após o logout
  };

  // Lógica de renderização agora usa o sistema de Rotas
  return (
    <Routes>
      {/* Rota principal: se tem usuário, mostra o agendador, senão, vai para o login */}
      <Route 
        path="/" 
        element={user ? <Scheduler user={user} onLogout={handleLogout} /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} 
      />
      {/* Rota de login */}
      <Route 
        path="/login" 
        element={<LoginForm onLoginSuccess={handleLoginSuccess} />} 
      />
      {/* Aqui adicionaremos a rota de admin mais tarde */}
    </Routes>
  );
}

export default App;