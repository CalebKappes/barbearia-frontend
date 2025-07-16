import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom'; // Removido pois não estava em uso
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../services/api'; // Corrigido

function MyBookingsPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [agendamentoParaCancelar, setAgendamentoParaCancelar] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgendamentos = useCallback(() => {
    api.get('/api/agendamentos/')
      .then(response => setAgendamentos(response.data))
      .catch(error => console.error("Erro ao buscar agendamentos", error));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/agendamentos/'),
      api.get('/api/servicos/'),
      api.get('/api/profissionais/')
    ]).then(([agendamentosRes, servicosRes, profissionaisRes]) => {
      setAgendamentos(agendamentosRes.data);
      setServicos(servicosRes.data);
      setProfissionais(profissionaisRes.data);
    }).catch(error => {
      console.error("Erro ao carregar dados da página", error);
      setMensagem({ texto: 'Erro ao carregar seus dados.', tipo: 'erro' });
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleCancelBookingClick = (agendamentoId) => {
    setAgendamentoParaCancelar(agendamentoId);
  };

  const confirmCancel = () => {
    api.post(`/api/agendamentos/${agendamentoParaCancelar}/cancelar/`)
      .then(() => {
        setMensagem({ texto: 'Agendamento cancelado com sucesso!', tipo: 'sucesso' });
        fetchAgendamentos();
      })
      .catch(() => {
        setMensagem({ texto: 'Erro ao cancelar o agendamento.', tipo: 'erro' });
      })
      .finally(() => {
        setAgendamentoParaCancelar(null);
      });
  };

  const formatarStatus = (status) => {
    const statusMap = { 'AGD': 'Agendado', 'CAN': 'Cancelado', 'FIN': 'Finalizado' };
    return statusMap[status] || status;
  };
  
  const getNome = (lista, id) => {
    const item = lista.find(i => i.id === id);
    return item ? item.nome : 'Carregando...';
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meus Agendamentos</h1>
        {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
        <div className="admin-container">
          {loading ? <p>Carregando agendamentos...</p> : (
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
                    <td>{getNome(servicos, ag.servico)}</td>
                    <td>{getNome(profissionais, ag.profissional)}</td>
                    <td>{new Date(ag.data_hora_inicio).toLocaleString('pt-BR')}</td>
                    <td>{formatarStatus(ag.status)}</td>
                    <td>
                      {ag.status === 'AGD' && (
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
          )}
        </div>
      </header>

      <ConfirmationModal
        isOpen={agendamentoParaCancelar !== null}
        message="Você tem certeza que quer cancelar este agendamento?"
        onConfirm={confirmCancel}
        onCancel={() => setAgendamentoParaCancelar(null)}
      />
    </div>
  );
}

export default MyBookingsPage;