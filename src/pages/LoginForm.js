import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Corrigido
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

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
    
    api.post('/api/token/', { username, password })
    .then(response => {
      if (response.data.access) {
        login(response.data.access);
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        setMensagem({ texto: 'Nome de usuário ou senha inválidos.', tipo: 'erro' });
      } else {
        setMensagem({ texto: 'Não foi possível conectar ao servidor.', tipo: 'erro' });
      }
      console.error('Erro de login:', error);
    });
  };

  const onNavigateToRegister = () => {
    navigate('/register');
  }

  return (
    <div className="App">
      <header className="App-header">
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