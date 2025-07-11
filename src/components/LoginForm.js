// src/components/LoginForm.js

import React, { useState } from 'react';

// MUDANÇA 1: Adicionamos 'onNavigateToRegister' como um novo "parâmetro"
function LoginForm({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.access) {
        onLoginSuccess(data.access);
      } else {
        alert('Nome de usuário ou senha inválidos.');
      }
    })
    .catch(error => console.error('Erro de login:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login da Barbearia</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>

        {/* MUDANÇA 2: Adicionamos este botão/link */}
        <button onClick={onNavigateToRegister} className="link-botao">
          Não tem uma conta? Cadastre-se
        </button>
        
      </header>
    </div>
  );
}

export default LoginForm;