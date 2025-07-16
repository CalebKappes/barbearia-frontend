import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Corrigido

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ texto: '', tipo: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });
    setErrors({});

    const dadosCadastro = { username, password, email, nome, celular };

    api.post('/api/register/', dadosCadastro)
    .then(() => {
        setMensagem({ texto: 'Cadastro realizado com sucesso! Redirecionando para o login...', tipo: 'sucesso' });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
    })
    .catch(error => {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        setMensagem({ texto: 'Por favor, corrija os erros abaixo.', tipo: 'erro' });
      } else {
        setMensagem({ texto: 'Não foi possível conectar ao servidor.', tipo: 'erro' });
        console.error('Erro no cadastro:', error);
      }
    });
  };

  const onNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crie sua Conta</h1>
        
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          {errors.nome && <div className="mensagem erro" style={{padding: '0.5rem', margin: '-0.5rem 0 0.5rem 0'}}><small>{errors.nome.join(', ')}</small></div>}
          
          <input type="text" placeholder="Celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
          {errors.celular && <div className="mensagem erro" style={{padding: '0.5rem', margin: '-0.5rem 0 0.5rem 0'}}><small>{errors.celular.join(', ')}</small></div>}

          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errors.email && <div className="mensagem erro" style={{padding: '0.5rem', margin: '-0.5rem 0 0.5rem 0'}}><small>{errors.email.join(', ')}</small></div>}
          
          <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
          {errors.username && <div className="mensagem erro" style={{padding: '0.5rem', margin: '-0.5rem 0 0.5rem 0'}}><small>{errors.username.join(', ')}</small></div>}
          
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errors.password && <div className="mensagem erro" style={{padding: '0.5rem', margin: '-0.5rem 0 0.5rem 0'}}><small>{errors.password.join(', ')}</small></div>}

          <button type="submit">Cadastrar</button>
        </form>

        <button onClick={onNavigateToLogin} className="link-botao">
          Já tem uma conta? Faça o login
        </button>
      </header>
    </div>
  );
}

export default RegistrationForm;