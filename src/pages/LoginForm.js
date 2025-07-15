// src/pages/LoginForm.js

import React, { useState, useEffect } from 'react';
// 1. REMOVA a linha de importação da logo daqui.
// import logoBarbearia from '../LogoShelock.jpg'; 

function LoginForm({ onLoginSuccess, onNavigateToRegister }) {
  // ... (toda a sua lógica de state e a função handleLogin continua igual) ...
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

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
        setMensagem({ texto: 'Nome de usuário ou senha inválidos.', tipo: 'erro' });
      }
    })
    .catch(error => {
      setMensagem({ texto: 'Não foi possível conectar ao servidor.', tipo: 'erro' });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* 2. Altere o 'src' da imagem para um caminho público */}
        <img src="/LogoShelock.jpg" className="logo-login" alt="Logo da Barbearia" />
        
        <form onSubmit={handleLogin} className="login-form">
          <h1>Login da Barbearia</h1>
          {mensagem.texto && (
            <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
          )}
          <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required/>
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required/>
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
