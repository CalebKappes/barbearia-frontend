// src/components/LoginForm.js

import React, { useState } from 'react';

// Recebemos uma função 'onLoginSuccess' do componente pai (App.js)
function LoginForm({ onLoginSuccess }) {
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
        // Se o login for bem-sucedido, chamamos a função do pai
        // para avisá-lo e passar o token.
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
      </header>
    </div>
  );
}

export default LoginForm;