// src/App.js

import React, { useState } from 'react';
import './App.css';

import LoginForm from './components/LoginForm';
import Scheduler from './components/Scheduler';
import RegistrationForm from './components/RegistrationForm'; // Importa o novo componente

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  // NOVO ESTADO: controla qual tela mostrar (login ou register)
  const [view, setView] = useState('login'); 

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setView('login'); // Garante que ao sair, volte para a tela de login
  };

  // Renderização principal do App
  let content;
  if (token) {
    // Se está logado, mostra o agendador
    content = <Scheduler token={token} onLogout={handleLogout} />;
  } else if (view === 'login') {
    // Se não está logado e a view é 'login', mostra o formulário de login
    // Passamos a função para mudar a view para 'register'
    content = <LoginForm onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setView('register')} />;
  } else {
    // Se não está logado e a view é 'register', mostra o formulário de cadastro
    // Passamos a função para mudar a view de volta para 'login'
    content = <RegistrationForm onNavigateToLogin={() => setView('login')} />;
  }

  return (
    <div>
      {content}
    </div>
  );
}

export default App;