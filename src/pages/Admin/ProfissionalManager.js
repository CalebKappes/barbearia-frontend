// src/pages/Admin/ProfissionalManager.js

import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';

function ProfissionalManager() {
  const [profissionais, setProfissionais] = useState([]);
  
  // Estados para o formulário
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  
  // Estados de controle da UI
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [itemParaDeletar, setItemParaDeletar] = useState(null);
  const [itemEmEdicao, setItemEmEdicao] = useState(null);

  // --- Funções de API ---
  const fetchProfissionais = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setProfissionais(data));
  };

  useEffect(() => { fetchProfissionais(); }, []);
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    itemEmEdicao ? handleUpdate() : handleCreate();
  };

  const handleCreate = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome, celular })
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Profissional criado com sucesso!', tipo: 'sucesso' });
        fetchProfissionais();
        resetForm();
      } else {
        setMensagem({ texto: 'Erro ao criar profissional.', tipo: 'erro' });
      }
    });
  };
  
  const handleUpdate = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/${itemEmEdicao.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome, celular })
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Profissional atualizado com sucesso!', tipo: 'sucesso' });
        fetchProfissionais();
        resetForm();
      } else {
        setMensagem({ texto: 'Erro ao atualizar profissional.', tipo: 'erro' });
      }
    });
  };

  const handleEditClick = (profissional) => {
    setItemEmEdicao(profissional);
    setNome(profissional.nome);
    setCelular(profissional.celular || ''); // Garante que não seja null
    setIsFormVisible(true);
  };
  
  const resetForm = () => {
    setNome(''); setCelular('');
    setIsFormVisible(false);
    setItemEmEdicao(null);
  };

  const handleDeleteClick = (id) => { setItemParaDeletar(id); };

  const confirmDelete = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/${itemParaDeletar}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Profissional apagado com sucesso!', tipo: 'sucesso' });
        fetchProfissionais();
      } else {
        setMensagem({ texto: 'Erro ao apagar profissional.', tipo: 'erro' });
      }
    })
    .finally(() => { setItemParaDeletar(null); });
  };

  return (
    <div className="admin-section">
      <h2>Gerenciar Profissionais</h2>
      {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
      <div className="admin-form-toggle">
        <button onClick={() => { isFormVisible ? resetForm() : setIsFormVisible(true) }}>
          {isFormVisible ? 'Cancelar' : 'Adicionar Novo Profissional'}
        </button>
      </div>
      {isFormVisible && (
        <form onSubmit={handleSubmitForm} className="admin-form">
          <h3>{itemEmEdicao ? 'Editar Profissional' : 'Adicionar Novo Profissional'}</h3>
          <input type="text" placeholder="Nome do Profissional" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="text" placeholder="Celular (opcional)" value={celular} onChange={e => setCelular(e.target.value)} />
          <button type="submit">{itemEmEdicao ? 'Salvar Alterações' : 'Adicionar Profissional'}</button>
        </form>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Celular</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map(profissional => (
            <tr key={profissional.id}>
              <td>{profissional.nome}</td>
              <td>{profissional.celular}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEditClick(profissional)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDeleteClick(profissional.id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationModal
        isOpen={itemParaDeletar !== null}
        message="Você tem certeza que quer apagar este profissional?"
        onConfirm={confirmDelete}
        onCancel={() => setItemParaDeletar(null)}
      />
    </div>
  );
}

export default ProfissionalManager;