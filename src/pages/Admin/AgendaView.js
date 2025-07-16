import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import api from '../../services/api'; // Corrigido

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

function AgendaView() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/agenda/'),
      api.get('/api/profissionais/'),
      api.get('/api/servicos/'),
      api.get('/api/clientes/'),
    ])
    .then(([agendamentosRes, profissionaisRes, servicosRes, clientesRes]) => {
      const agendamentosData = agendamentosRes.data;
      const profissionaisData = profissionaisRes.data;
      const servicosData = servicosRes.data;
      const clientesData = clientesRes.data;

      const eventosFormatados = agendamentosData.map(ag => {
        const servico = servicosData.find(s => s.id === ag.servico);
        const cliente = clientesData.find(c => c.id === ag.cliente);
        const profissional = profissionaisData.find(p => p.id === ag.profissional);
        
        return {
          id: ag.id,
          title: `${servico?.nome || 'Serviço'} - ${cliente?.nome || 'Cliente'}`,
          start: new Date(ag.data_hora_inicio),
          end: new Date(ag.data_hora_fim),
          resource: profissional?.nome,
        };
      });
      setAgendamentos(eventosFormatados);
    })
    .catch(error => {
      setMensagem({ texto: "Erro ao carregar dados da agenda. Verifique suas permissões.", tipo: 'erro' });
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
          min={new Date(0, 0, 0, 6, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 59)}
          step={15}
          timeslots={4}
        />
      </div>
    </div>
  );
}

export default AgendaView;