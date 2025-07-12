// src/components/ServicoManager.js

import React, { useState, useEffect } from 'react';

function ServicoManager() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('01:00:00');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // ### NOVO ESTADO PARA CONTROLAR A VISIBILIDADE DO FORMULÁRIO ###
  const [isFormVisible, setIsFormVisible] = useState(false);

  // ... (a função fetchServicos e os useEffects continuam os mesmos) ...
  const fetchServicos = () => {
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
  
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleCreateServico = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');

    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome, descricao, preco, duracao })
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Serviço criado com sucesso!', tipo: 'sucesso' });
        fetchServicos();
        setNome('');
        setDescricao('');
        setPreco('');
        setDuracao('01:00:00');
        setIsFormVisible(false); // Esconde o formulário após o sucesso
      } else {
        setMensagem({ texto: 'Erro ao criar serviço.', tipo: 'erro' });
      }
    });
  };

  return (
    <div className="admin-section">
      <h2>Gerenciar Serviços</h2>

      {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      {/* ### NOVO BOTÃO PARA MOSTRAR/ESCONDER O FORMULÁRIO ### */}
      <div className="admin-form-toggle">
        <button onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? 'Cancelar' : 'Adicionar Novo Serviço'}
        </button>
      </div>

      {/* ### O FORMULÁRIO AGORA SÓ APARECE SE isFormVisible FOR TRUE ### */}
      {isFormVisible && (
        <form onSubmit={handleCreateServico} className="admin-form">
          <input type="text" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="text" placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <input type="number" step="0.01" placeholder="Preço (ex: 70.00)" value={preco} onChange={e => setPreco(e.target.value)} required />
          <input type="text" placeholder="Duração (HH:MM:SS)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
          <button type="submit">Salvar Serviço</button>
        </form>
      )}

      {/* A tabela de serviços continua a mesma */}
      <table className="admin-table">
       {/* ... (conteúdo da tabela sem alterações) ... */}
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