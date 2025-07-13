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

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // Busca TODOS os agendamentos para o admin.
    // O backend precisa de uma view que permita isso.
    // Por enquanto, vamos assumir que /api/agendamentos/ retorna todos se o user for admin.
    // Se não, teríamos que criar um endpoint /api/admin/all-agendamentos/
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao buscar agendamentos.');
      }
      return response.json();
    })
    .then(data => {
      const eventosFormatados = data.map(ag => ({
        id: ag.id,
        title: `Serviço ID: ${ag.servico} - Cliente ID: ${ag.cliente}`, // Placeholder
        start: new Date(ag.data_hora_inicio),
        end: new Date(ag.data_hora_fim),
        resource: `Profissional ID: ${ag.profissional}`, // Placeholder
      }));
      setAgendamentos(eventosFormatados);
    })
    .catch(error => {
      setMensagem({ texto: error.message, tipo: 'erro' });
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
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={agendamentos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          defaultView="week"
          views={['day', 'week', 'month']}
          
          // ### AS NOVAS PROPRIEDADES ESTÃO AQUI ###
          min={new Date(0, 0, 0, 6, 0, 0)} // Define a hora mínima para 06:00
          max={new Date(0, 0, 0, 23, 0, 0)} // Define a hora máxima para 23:00
        />
      </div>
    </div>
  );
}

export default AgendaView;
