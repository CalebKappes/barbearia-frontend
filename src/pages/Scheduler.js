// src/components/Scheduler.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal'; // 1. Importamos nosso modal

function Scheduler({ user, onLogout }) {
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  // 2. Novo estado para controlar o modal de agendamento
  const [horarioParaAgendar, setHorarioParaAgendar] = useState(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('authToken');
      fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(response => response.json())
        .then(data => setServicos(data));
      fetch(`${process.env.REACT_APP_API_URL}/api/profissionais/`, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(response => response.json())
        .then(data => setProfissionais(data));
    }
  }, [user]);

  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => { setMensagem({ texto: '', tipo: '' }); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleVerificarDisponibilidade = () => {
    if (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada) {
      setMensagem({ texto: 'Por favor, selecione um serviço, um profissional e uma data.', tipo: 'erro' });
      return;
    }
    setCarregando(true);
    setHorariosDisponiveis([]);
    const url = `${process.env.REACT_APP_API_URL}/api/profissionais/${profissionalSelecionado}/horarios_disponiveis/?data=${dataSelecionada}&servico_id=${servicoSelecionado}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setHorariosDisponiveis(data);
        setCarregando(false);
      });
  };

  // 3. A função agora só define qual horário agendar, abrindo o modal
  const handleAgendarClick = (horario) => {
    setHorarioParaAgendar(horario);
  };
  
  // 4. A lógica de criar o agendamento foi movida para esta nova função
  const confirmAgendamento = () => {
    const token = localStorage.getItem('authToken');
    const dadosAgendamento = {
      data_hora_inicio: `${dataSelecionada}T${horarioParaAgendar}:00`,
      servico: servicoSelecionado,
      profissional: profissionalSelecionado,
    };
    fetch(`${process.env.REACT_APP_API_URL}/api/agendamentos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dadosAgendamento),
    })
    .then(response => {
      if (response.ok) {
        setMensagem({ texto: 'Horário agendado com sucesso!', tipo: 'sucesso' });
        handleVerificarDisponibilidade();
      } else {
        response.json().then(data => {
          const erroMsg = data.detail || 'Não foi possível agendar.';
          setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'erro' });
        });
      }
    })
    .finally(() => {
      setHorarioParaAgendar(null); // Fecha o modal
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-nav">
          <Link to="/meus-agendamentos" className="admin-link">Meus Agendamentos</Link>
          {user && user.is_staff && (
            <Link to="/admin" className="admin-link">Área de Gestão</Link>
          )}
          <button onClick={onLogout} className="logout-botao">Sair</button>
        </div>
        <h1>Agende seu Horário</h1>
        {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
        <div className="selecao-container">
          {/* ... (seletores continuam iguais) ... */}
          <select value={servicoSelecionado} onChange={(e) => setServicoSelecionado(e.target.value)}>
                <option value="">Selecione um Serviço</option>
                {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                    {servico.nome} ({servico.duracao.substring(0, 5)})
                </option>
                ))}
            </select>
            <select value={profissionalSelecionado} onChange={(e) => setProfissionalSelecionado(e.target.value)}>
                <option value="">Selecione um Profissional</option>
                {profissionais.map(profissional => (
                <option key={profissional.id} value={profissional.id}>
                    {profissional.nome}
                </option>
                ))}
            </select>
            <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} />
            <button onClick={handleVerificarDisponibilidade} disabled={carregando}>
                {carregando ? 'Verificando...' : 'Verificar Disponibilidade'}
            </button>
        </div>
        <div className="resultados-container">
          <h2>Horários Disponíveis</h2>
          {horariosDisponiveis.length > 0 ? (
            <ul className="horarios-lista">
              {horariosDisponiveis.map(horario => (
                <li key={horario}>
                  {/* O botão agora chama a função que abre o modal */}
                  <button className="horario-botao" onClick={() => handleAgendarClick(horario)}>
                    {horario}
                  </button>
                </li>
              ))}
            </ul>
          ) : ( <p>{carregando ? '' : 'Selecione as opções acima para ver os horários.'}</p> )}
        </div>
      </header>

      {/* 5. Renderizamos nosso modal de confirmação aqui */}
      <ConfirmationModal
        isOpen={horarioParaAgendar !== null}
        message={`Você confirma o agendamento para as ${horarioParaAgendar}?`}
        onConfirm={confirmAgendamento}
        onCancel={() => setHorarioParaAgendar(null)}
      />
    </div>
  );
}

export default Scheduler;