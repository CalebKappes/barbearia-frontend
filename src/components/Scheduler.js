// src/components/Scheduler.js

import React, { useState, useEffect } from 'react';

function Scheduler({ token, onLogout }) {
  // --- ESTADO DO COMPONENTE ---
  const [servicos, setServicos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // ### NOVO ESTADO PARA MENSAGENS ###
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // tipo pode ser 'sucesso' ou 'erro'

  // --- EFEITOS ---
  useEffect(() => {
    // ... (este useEffect para buscar dados iniciais continua o mesmo)
    if (token) {
      fetch('http://localhost:8000/api/servicos/')
        .then(response => response.json())
        .then(data => setServicos(data));

      fetch('http://localhost:8000/api/profissionais/')
        .then(response => response.json())
        .then(data => setProfissionais(data));
    }
  }, [token]);

  // ### NOVO EFEITO PARA LIMPAR A MENSAGEM ###
  useEffect(() => {
    // Se uma mensagem for definida, cria um "timer" para limpá-la após 5 segundos
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ texto: '', tipo: '' });
      }, 5000);
      // Limpa o timer se o componente for desmontado
      return () => clearTimeout(timer);
    }
  }, [mensagem]);


  // --- FUNÇÕES DE LÓGICA (MODIFICADAS) ---
  const handleVerificarDisponibilidade = () => {
    if (!servicoSelecionado || !profissionalSelecionado || !dataSelecionada) {
      // Substituímos o alert() por setMensagem()
      setMensagem({ texto: 'Por favor, selecione um serviço, um profissional e uma data.', tipo: 'erro' });
      return;
    }
    setCarregando(true);
    setHorariosDisponiveis([]);
    const url = `http://localhost:8000/api/profissionais/${profissionalSelecionado}/horarios_disponiveis/?data=${dataSelecionada}&servico_id=${servicoSelecionado}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setHorariosDisponiveis(data);
        setCarregando(false);
      });
  };

  const handleAgendarHorario = (horario) => {
    // O window.confirm por enquanto pode ficar, pois é uma ação que exige confirmação explícita.
    if (!window.confirm(`Você confirma o agendamento para as ${horario}?`)) return;

    const dadosAgendamento = {
      data_hora_inicio: `${dataSelecionada}T${horario}:00`,
      servico: servicoSelecionado,
      profissional: profissionalSelecionado,
    };

    fetch('http://localhost:8000/api/agendamentos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(dadosAgendamento),
    })
    .then(response => {
      if (response.ok) {
        // Substituímos o alert() por setMensagem()
        setMensagem({ texto: 'Horário agendado com sucesso!', tipo: 'sucesso' });
        handleVerificarDisponibilidade();
      } else {
        response.json().then(data => {
          const erroMsg = data.detail || 'Não foi possível agendar.';
          // Substituímos o alert() por setMensagem()
          setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'erro' });
        });
      }
    });
  };

  // --- RENDERIZAÇÃO (COM O COMPONENTE DE MENSAGEM) ---
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onLogout} className="logout-botao">Sair</button>
        <h1>Agende seu Horário</h1>
        
        {/* ### NOVO COMPONENTE DE MENSAGEM ### */}
        {/* Ele só aparece se houver texto na nossa variável 'mensagem' */}
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <div className="selecao-container">
          {/* ... (o resto do JSX continua o mesmo) ... */}
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
          {/* ... (o resto do JSX continua o mesmo) ... */}
          <h2>Horários Disponíveis</h2>
          {horariosDisponiveis.length > 0 ? (
            <ul className="horarios-lista">
              {horariosDisponiveis.map(horario => (
                <li key={horario}>
                  <button className="horario-botao" onClick={() => handleAgendarHorario(horario)}>
                    {horario}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>{carregando ? '' : 'Selecione as opções acima para ver os horários.'}</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default Scheduler;