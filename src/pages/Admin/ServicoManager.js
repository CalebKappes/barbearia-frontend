// src/components/ServicoManager.js

import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';

function ServicoManager() {
  const [servicos, setServicos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracao, setDuracao] = useState('01:00:00');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [servicoParaDeletar, setServicoParaDeletar] = useState(null);

  // ### NOVO ESTADO PARA CONTROLAR A EDIÇÃO ###
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);

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

  // ### FUNÇÃO DE SUBMISSÃO DO FORMULÁRIO ATUALIZADA ###
  // Agora ela sabe se deve criar um novo serviço ou atualizar um existente
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (servicoEmEdicao) {
      handleUpdateServico(); // Se estiver a editar, chama a função de update
    } else {
      handleCreateServico(); // Senão, chama a função de criar
    }
  };

  const handleCreateServico = () => {
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
        resetForm();
      } else {
        setMensagem({ texto: 'Erro ao criar serviço.', tipo: 'erro' });
      }
    });
  };
  
  // ### NOVA FUNÇÃO PARA ATUALIZAR UM SERVIÇO ###
  const handleUpdateServico = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/${servicoEmEdicao.id}/`, {
      method: 'PUT', // O método HTTP para atualizar
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome, descricao, preco, duracao })
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Serviço atualizado com sucesso!', tipo: 'sucesso' });
        fetchServicos();
        resetForm();
      } else {
        setMensagem({ texto: 'Erro ao atualizar serviço.', tipo: 'erro' });
      }
    });
  };

  // ### NOVA FUNÇÃO PARA INICIAR A EDIÇÃO ###
  const handleEditClick = (servico) => {
    setServicoEmEdicao(servico); // Guarda o serviço que queremos editar
    // Preenche o formulário com os dados do serviço
    setNome(servico.nome);
    setDescricao(servico.descricao);
    setPreco(servico.preco);
    setDuracao(servico.duracao);
    setIsFormVisible(true); // Mostra o formulário
  };
  
  // Função para limpar e esconder o formulário
  const resetForm = () => {
    setNome(''); setDescricao(''); setPreco(''); setDuracao('01:00:00');
    setIsFormVisible(false);
    setServicoEmEdicao(null); // Limpa o estado de edição
  };

  // ... (funções de delete continuam as mesmas) ...
  const handleDeleteServico = (servicoId) => { setServicoParaDeletar(servicoId); };
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
    .finally(() => { setServicoParaDeletar(null); });
  };
  const cancelDelete = () => { setServicoParaDeletar(null); };

  return (
    <div className="admin-section">
      <h2>Gerenciar Serviços</h2>
      {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
      <div className="admin-form-toggle">
        <button onClick={() => { isFormVisible ? resetForm() : setIsFormVisible(true) }}>
          {isFormVisible ? 'Cancelar' : 'Adicionar Novo Serviço'}
        </button>
      </div>
      {isFormVisible && (
        // O formulário agora chama a função de submissão geral
        <form onSubmit={handleSubmitForm} className="admin-form">
          {/* O título do formulário muda dependendo da ação */}
          <h3>{servicoEmEdicao ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
          <input type="text" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="text" placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
          <input type="number" step="0.01" placeholder="Preço (ex: 70.00)" value={preco} onChange={e => setPreco(e.target.value)} required />
          <input type="text" placeholder="Duração (HH:MM:SS)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
          <button type="submit">{servicoEmEdicao ? 'Salvar Alterações' : 'Adicionar Serviço'}</button>
        </form>
      )}
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
                {/* O botão de editar agora chama a função handleEditClick */}
                <button className="btn-edit" onClick={() => handleEditClick(servico)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDeleteServico(servico.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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