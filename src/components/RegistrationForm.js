// src/components/RegistrationForm.js

import React, { useState } from 'react';

// Recebe uma função para voltar para a tela de login
function RegistrationForm({ onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagem(''); // Limpa mensagens antigas

    const dadosCadastro = { username, password, email, nome, celular };

    fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosCadastro),
    })
    .then(response => {
      if (response.ok) {
        alert('Cadastro realizado com sucesso! Por favor, faça o login.');
        onNavigateToLogin(); // Navega de volta para o login
      } else {
        // Se houver erro, mostra a mensagem do backend
        response.json().then(data => {
            // Concatena os erros para mostrar ao usuário
            let errorString = '';
            for (const key in data) {
                errorString += `${key}: ${data[key].join(', ')}\n`;
            }
            setMensagem(errorString || 'Ocorreu um erro no cadastro.');
        });
      }
    })
    .catch(error => {
      console.error('Erro no cadastro:', error);
      setMensagem('Não foi possível conectar ao servidor.');
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crie sua Conta</h1>
        
        {/* Mostra mensagens de erro do servidor */}
        {mensagem && <pre className="mensagem erro">{mensagem}</pre>}

        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="text" placeholder="Celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
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