// src/App.js

import React, { useState } from 'react';
import './App.css';

// Importa nossos novos componentes
import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';

function App() {
  // O App.js agora só se preocupa com uma coisa: o token de autenticação.
  // Usamos o localStorage para tentar "lembrar" do token entre sessões.
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken); // Guarda o token no navegador
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove o token do navegador
    setToken(null);
  };

  // Lógica de renderização: se não tem token, mostra o login.
  // Se tem, mostra o agendador.
  return (
    <div>
      {token ? (
        <Scheduler token={token} onLogout={handleLogout} />
      ) : (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;