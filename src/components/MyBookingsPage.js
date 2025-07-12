// src/components/MyBookingsPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ### A CORREÇÃO ESTÁ AQUI: Adicionamos { servicos, profissionais } ###
function MyBookingsPage({ servicos, profissionais }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const fetchAgendamentos = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => setAgendamentos(data));
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleCancelBooking = (agendamentoId) => {
    if (!window.confirm("Você tem certeza que quer cancelar este agendamento?")) return;
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/${agendamentoId}/cancelar/`, {
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
    });
  };
  
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const formatarStatus = (status) => {
    const statusMap = {
      'AGD': 'Agendado',
      'CAN': 'Cancelado',
      'FIN': 'Finalizado'
    };
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
              {agendamentos.map(ag => (
                <tr key={ag.id} className={ag.status === 'CAN' ? 'agendamento-cancelado' : ''}>
                  {/* Agora 'servicos' e 'profissionais' existem aqui */}
                  <td>{servicos.find(s => s.id === ag.servico)?.nome || '...'}</td>
                  <td>{profissionais.find(p => p.id === ag.profissional)?.nome || '...'}</td>
                  <td>{new Date(ag.data_hora_inicio).toLocaleString('pt-BR')}</td>
                  <td>{formatarStatus(ag.status)}</td>
                  <td>
                    {ag.status === 'AGD' && (
                      <button onClick={() => handleCancelBooking(ag.id)} className="btn-delete">
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

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
    
    // Passamos os dados para o componente filho
    return <MyBookingsPage servicos={servicos} profissionais={profissionais} />
}

export default MyBookingsPageWrapper;