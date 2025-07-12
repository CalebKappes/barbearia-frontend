// src/components/ServicoManager.js

import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal'; // 1. Importamos nosso novo modal

function ServicoManager() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('01:00:00');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // 2. Novo estado para controlar o modal de exclusão
  const [servicoParaDeletar, setServicoParaDeletar] = useState(null);

  // ... (fetchServicos e useEffects continuam os mesmos) ...
  const fetchServicos = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, { headers: { 'Authorization': `Bearer ${token}` }})
      .then(response => response.json())
      .then(data => setServicos(data));
  };
  useEffect(() => { fetchServicos(); }, []);
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleCreateServico = (e) => { /* ... (código sem alterações) ... */
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
        setNome(''); setDescricao(''); setPreco(''); setDuracao('01:00:00');
        setIsFormVisible(false);
      } else {
        setMensagem({ texto: 'Erro ao criar serviço.', tipo: 'erro' });
      }
    });
  };

  // 3. A função de apagar agora é dividida em duas partes
  const handleDeleteServico = (servicoId) => {
    // Apenas define qual serviço será apagado, abrindo o modal
    setServicoParaDeletar(servicoId);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/${servicoParaDeletar}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Serviço apagado com sucesso!', tipo: 'sucesso' });
        fetchServicos();
      } else {
        setMensagem({ texto: 'Erro ao apagar serviço.', tipo: 'erro' });
      }
    })
    .finally(() => {
      setServicoParaDeletar(null); // Fecha o modal
    });
  };

  const cancelDelete = () => {
    setServicoParaDeletar(null); // Apenas fecha o modal
  };

  return (
    <div className="admin-section">
      {/* ... (o resto do JSX até a tabela continua o mesmo) ... */}
      <h2>Gerenciar Serviços</h2>
      {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
      <div className="admin-form-toggle">
        <button onClick={() => setIsFormVisible(!isFormVisible)}>
          {isFormVisible ? 'Cancelar' : 'Adicionar Novo Serviço'}
        </button>
      </div>
      {isFormVisible && (
        <form onSubmit={handleCreateServico} className="admin-form">
          <input type="text" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="text" placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <input type="number" step="0.01" placeholder="Preço (ex: 70.00)" value={preco} onChange={e => setPreco(e.target.value)} required />
          <input type="text" placeholder="Duração (HH:MM:SS)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
          <button type="submit">Salvar Serviço</button>
        </form>
      )}

      <table className="admin-table">
        {/* ... (cabeçalho da tabela sem alterações) ... */}
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
                {/* O botão agora chama a função que abre o modal */}
                <button className="btn-delete" onClick={() => handleDeleteServico(servico.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 4. Renderizamos nosso modal de confirmação aqui */}
      <ConfirmationModal
        isOpen={servicoParaDeletar !== null}
        message="Você tem certeza que quer apagar este serviço?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}

export default ServicoManager;