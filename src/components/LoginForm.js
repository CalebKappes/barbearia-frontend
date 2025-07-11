// src/components/LoginForm.js

import React, { useState, useEffect } from 'react';

function LoginForm({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Adicionamos o estado para controlar a mensagem
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Efeito para limpar a mensagem após 5 segundos
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ texto: '', tipo: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

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
        // Trocamos o alert() pela nossa mensagem de erro
        setMensagem({ texto: 'Nome de usuário ou senha inválidos.', tipo: 'erro' });
      }
    })
    .catch(error => {
      console.error('Erro de login:', error);
      setMensagem({ texto: 'Não foi possível conectar ao servidor.', tipo: 'erro' });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login da Barbearia</h1>

        {/* Exibimos a mensagem aqui */}
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>

        <button onClick={onNavigateToRegister} className="link-botao">
          Não tem uma conta? Cadastre-se
        </button>
      </header>
    </div>
  );
}

export default LoginForm;