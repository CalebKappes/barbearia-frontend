// src/components/Scheduler.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importamos o Link

function Scheduler({ user, onLogout }) {
  // ... (toda a lógica interna do Scheduler continua exatamente a mesma)
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

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
      const timer = setTimeout(() => { setMensagem({ texto: '', tipo: '' }); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const handleVerificarDisponibilidade = () => { /* ...código sem alterações... */ 
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

  const handleAgendarHorario = (horario) => { /* ...código sem alterações... */
    if (!window.confirm(`Você confirma o agendamento para as ${horario}?`)) return;
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMensagem({ texto: 'Sessão expirada. Por favor, faça o login novamente.', tipo: 'erro' });
      return;
    }
    const dadosAgendamento = {
      data_hora_inicio: `${dataSelecionada}T${horario}:00`,
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
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* ### CONTAINER ADICIONADO PARA ORGANIZAR O TOPO ### */}
        <div className="header-nav">
          {/* Mostra o link para a área de gestão APENAS se o usuário for staff */}
          {user && user.is_staff && (
            <Link to="/admin" className="admin-link">Área de Gestão</Link>
          )}
          <button onClick={onLogout} className="logout-botao">Sair</button>
        </div>
        
        <h1>Agende seu Horário</h1>
        
        {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}

        <div className="selecao-container">
            {/* ...código dos seletores sem alterações... */}
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
                <li key={horario}><button className="horario-botao" onClick={() => handleAgendarHorario(horario)}>{horario}</button></li>
              ))}
            </ul>
          ) : ( <p>{carregando ? '' : 'Selecione as opções acima para ver os horários.'}</p> )}
        </div>
      </header>
    </div>
  );
}

export default Scheduler;