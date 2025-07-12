// src/components/ServicoManager.js

import React, { useState, useEffect } from 'react';

function ServicoManager() {
  const [servicos, setServicos] = useState([]);
  
  // --- NOVOS ESTADOS PARA O FORMULÁRIO DE CRIAÇÃO ---
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('01:00:00'); // Valor padrão de 1 hora
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Função para buscar os serviços da API
  const fetchServicos = () => {
    // ... (esta função continua a mesma)
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setServicos(data))
    .catch(error => console.error("Erro ao buscar serviços:", error));
  };

  useEffect(() => {
    fetchServicos();
  }, []);
  
  // Efeito para limpar a mensagem após 3 segundos
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // --- NOVA FUNÇÃO PARA CRIAR UM SERVIÇO ---
  const handleCreateServico = (e) => {
    e.preventDefault(); // Impede o recarregamento da página pelo formulário
    const token = localStorage.getItem('authToken');

    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, descricao, preco, duracao })
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Serviço criado com sucesso!', tipo: 'sucesso' });
        fetchServicos(); // Atualiza a lista de serviços
        // Limpa os campos do formulário
        setNome('');
        setDescricao('');
        setPreco('');
        setDuracao('01:00:00');
      } else {
        setMensagem({ texto: 'Erro ao criar serviço.', tipo: 'erro' });
      }
    });
  };

  return (
    <div className="admin-section">
      <h2>Gerenciar Serviços</h2>

      {/* Exibidor de mensagens de feedback */}
      {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      {/* --- NOVO FORMULÁRIO DE CRIAÇÃO --- */}
      <form onSubmit={handleCreateServico} className="admin-form">
        <h3>Adicionar Novo Serviço</h3>
        <input type="text" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="text" placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <input type="number" step="0.01" placeholder="Preço (ex: 70.00)" value={preco} onChange={e => setPreco(e.target.value)} required />
        <input type="text" placeholder="Duração (HH:MM:SS)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
        <button type="submit">Adicionar Serviço</button>
      </form>

      {/* Tabela que já tínhamos */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Duração</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map(servico => (
            <tr key={servico.id}>
              <td>{servico.nome}</td>
              <td>{servico.duracao}</td>
              <td>R$ {servico.preco}</td>
              <td>
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicoManager;