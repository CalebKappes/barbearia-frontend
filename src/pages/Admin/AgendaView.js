// src/pages/Admin/AgendaView.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

function AgendaView() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [profissionais, setProfissionais] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Busca todos os dados necessários quando o componente carrega
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${token}` };

    // Função para buscar dados de um endpoint
    const fetchData = (url) => fetch(url, { headers }).then(res => res.json());

    Promise.all([
      fetchData(`${process.env.REACT_APP_API_URL}/api/agendamentos/`),
      fetchData(`${process.env.REACT_APP_API_URL}/api/profissionais/`),
      fetchData(`${process.env.REACT_APP_API_URL}/api/servicos/`),
      fetchData(`${process.env.REACT_APP_API_URL}/api/clientes/`),
    ])
    .then(([agendamentosData, profissionaisData, servicosData, clientesData]) => {
      setProfissionais(profissionaisData);
      setServicos(servicosData);
      setClientes(clientesData);

      const eventosFormatados = agendamentosData.map(ag => {
        const servico = servicosData.find(s => s.id === ag.servico);
        const cliente = clientesData.find(c => c.id === ag.cliente);
        const profissional = profissionaisData.find(p => p.id === ag.profissional);
        
        return {
          id: ag.id,
          title: `${servico?.nome || 'Serviço não encontrado'} - ${cliente?.nome || 'Cliente não encontrado'}`,
          start: new Date(ag.data_hora_inicio),
          end: new Date(ag.data_hora_fim),
          resource: profissional?.nome || 'Profissional não encontrado',
        };
      });
      setAgendamentos(eventosFormatados);
    })
    .catch(error => {
      setMensagem({ texto: "Erro ao carregar dados da agenda.", tipo: 'erro' });
      console.error("Erro ao buscar dados:", error);
    });
  }, []);

  const messages = {
    allDay: 'Dia Inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período.',
    showMore: total => `+ Ver mais (${total})`
  };

  return (
    <div className="admin-section">
      <h2>Agenda de Atendimentos</h2>
      {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
      <div style={{ height: '70vh', backgroundColor: 'white', color: 'black', padding: '1rem', borderRadius: '8px' }}>
        <Calendar
          localizer={localizer}
          events={agendamentos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          defaultView="week"
          views={['day', 'week', 'month']}
          
          // ### CONFIGURAÇÃO FINAL E CORRETA ###
          min={new Date(0, 0, 0, 6, 0, 0)}     // Hora mínima para 06:00
          max={new Date(0, 0, 0, 23, 59, 59)} // Hora máxima para 23:59
          step={15}                             // A grelha avança de 15 em 15 minutos
          timeslots={4}                         // Mostra 4 "ranhuras" por hora (60/15 = 4)
        />
      </div>
    </div>
  );
}

export default AgendaView;
