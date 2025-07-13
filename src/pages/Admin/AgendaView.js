// src/pages/Admin/AgendaView.js

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br'; // Importa a localização para português do Brasil

// Configura o localizador para usar o moment em português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

function AgendaView() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // Busca TODOS os agendamentos quando o componente é montado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao buscar agendamentos. Você tem permissão de administrador?');
      }
      return response.json();
    })
    .then(data => {
      // Formata os dados para o formato que o calendário entende
      const eventosFormatados = data.map(ag => ({
        id: ag.id,
        title: `${ag.servico.nome} - ${ag.cliente.nome}`,
        start: new Date(ag.data_hora_inicio),
        end: new Date(ag.data_hora_fim),
        resource: ag.profissional.nome, // Usamos 'resource' para o profissional
      }));
      setAgendamentos(eventosFormatados);
    })
    .catch(error => {
      setMensagem({ texto: error.message, tipo: 'erro' });
    });
  }, []);

  // Configurações de tradução para os botões do calendário
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
      <div style={{ height: '70vh' }}> {/* Define uma altura para o container do calendário */}
        <Calendar
          localizer={localizer}
          events={agendamentos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          messages={messages}
          defaultView="week" // Visão padrão será a de semana
          views={['day', 'week', 'month']} // Visões disponíveis
        />
      </div>
    </div>
  );
}

export default AgendaView;
