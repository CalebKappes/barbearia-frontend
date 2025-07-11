// src/components/RegistrationForm.js

import React, { useState, useEffect } from 'react';

function RegistrationForm({ onNavigateToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  
  // O estado da mensagem já existia, mas vamos garantir que ele é usado corretamente
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Efeito para limpar a mensagem
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

    const dadosCadastro = { username, password, email, nome, celular };

    fetch(`${process.env.REACT_APP_API_URL}/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosCadastro),
    })
    .then(async response => { // Tornamos a função async para ler o JSON do erro
      if (response.ok) {
        // Trocamos o alert() por uma mensagem de sucesso
        setMensagem({ texto: 'Cadastro realizado com sucesso! Redirecionando para o login...', tipo: 'sucesso' });
        // Aguarda um pouco antes de navegar para o usuário poder ler a mensagem
        setTimeout(() => {
          onNavigateToLogin();
        }, 2000);
      } else {
        const data = await response.json();
        let errorString = '';
        for (const key in data) {
            errorString += `${key}: ${data[key].join(', ')}\n`;
        }
        setMensagem({ texto: errorString || 'Ocorreu um erro no cadastro.', tipo: 'erro' });
      }
    })
    .catch(error => {
      console.error('Erro no cadastro:', error);
      setMensagem({ texto: 'Não foi possível conectar ao servidor.', tipo: 'erro' });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crie sua Conta</h1>
        
        {/* O <pre> ajuda a formatar erros de múltiplas linhas */}
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            <pre>{mensagem.texto}</pre>
          </div>
        )}

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