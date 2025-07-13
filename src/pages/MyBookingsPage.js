// src/components/MyBookingsPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal'; // 1. Importamos nosso modal

// Garanta que o componente recebe as props
function MyBookingsPage({ servicos, profissionais }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  
  // 2. Novo estado para controlar o modal
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);

  const fetchAgendamentos = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setAgendamentos(data));
  };

  useEffect(() => { fetchAgendamentos(); }, []);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);
  
  // 3. A função agora apenas abre o modal
  const handleCancelBookingClick = (agendamentoId) => {
    setAgendamentoParaCancelar(agendamentoId);
  };
  
  // 4. A lógica de apagar foi movida para esta nova função
  const confirmCancel = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/${agendamentoParaCancelar}/cancelar/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Agendamento cancelado com sucesso!', tipo: 'sucesso' });
        fetchAgendamentos();
      } else {
        setMensagem({ texto: 'Erro ao cancelar o agendamento.', tipo: 'erro' });
      }
    })
    .finally(() => {
      setAgendamentoParaCancelar(null); // Fecha o modal
    });
  };

  const formatarStatus = (status) => {
    const statusMap = { 'AGD': 'Agendado', 'CAN': 'Cancelado', 'FIN': 'Finalizado' };
    return statusMap[status] || status;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-nav">
          <Link to="/" className="admin-link">Fazer Novo Agendamento</Link>
        </div>
        <h1>Meus Agendamentos</h1>
        {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
        <div className="admin-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Profissional</th>
                <th>Data e Hora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.length > 0 ? agendamentos.map(ag => (
                <tr key={ag.id} className={ag.status === 'CAN' ? 'agendamento-cancelado' : ''}>
                  <td>{servicos.find(s => s.id === ag.servico)?.nome || '...'}</td>
                  <td>{profissionais.find(p => p.id === ag.profissional)?.nome || '...'}</td>
                  <td>{new Date(ag.data_hora_inicio).toLocaleString('pt-BR')}</td>
                  <td>{formatarStatus(ag.status)}</td>
                  <td>
                    {ag.status === 'AGD' && (
                      // O botão agora chama a função que abre o modal
                      <button onClick={() => handleCancelBookingClick(ag.id)} className="btn-delete">
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5">Você ainda não possui agendamentos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </header>

      {/* 5. Renderizamos nosso modal de confirmação aqui */}
      <ConfirmationModal
        isOpen={agendamentoParaCancelar !== null}
        message="Você tem certeza que quer cancelar este agendamento?"
        onConfirm={confirmCancel}
        onCancel={() => setAgendamentoParaCancelar(null)}
      />
    </div>
  );
}

// O Wrapper continua o mesmo, passando os dados necessários
function MyBookingsPageWrapper() {
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
          fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, { headers: { 'Authorization': `Bearer ${token}` }})
              .then(res => res.json()).then(data => setServicos(data));
          fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/`, { headers: { 'Authorization': `Bearer ${token}` }})
              .then(res => res.json()).then(data => setProfissionais(data));
        }
    }, []);
    return <MyBookingsPage servicos={servicos} profissionais={profissionais} />
}

export default MyBookingsPageWrapper;