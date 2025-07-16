import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import api from '../services/api'; // Corrigido

function Scheduler() {
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState('');
    const [profissionalSelecionado, setProfissionalSelecionado] = useState('');
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [horarioParaAgendar, setHorarioParaAgendar] = useState(null);

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            try {
                const [servicosRes, profissionaisRes] = await Promise.all([
                    api.get('/api/servicos/'),
                    api.get('/api/profissionais/')
                ]);
                setServicos(servicosRes.data);
                setProfissionais(profissionaisRes.data);
            } catch (error) {
                console.error("Erro ao buscar dados iniciais", error);
                setMensagem({ texto: 'Erro ao carregar serviços ou profissionais.', tipo: 'erro' });
            }
        };

        carregarDadosIniciais();
    }, []);

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
        
        const url = `/api/profissionais/${profissionalSelecionado}/horarios_disponiveis/?data=${dataSelecionada}&servico_id=${servicoSelecionado}`;
        
        api.get(url)
            .then(response => {
                setHorariosDisponiveis(response.data);
            })
            .catch(error => {
                console.error("Erro ao verificar disponibilidade", error);
                setMensagem({ texto: 'Não foi possível buscar os horários.', tipo: 'erro' });
            })
            .finally(() => {
                setCarregando(false);
            });
    };

    const handleAgendarClick = (horario) => {
        setHorarioParaAgendar(horario);
    };

    const confirmAgendamento = () => {
        const dadosAgendamento = {
            data_hora_inicio: `${dataSelecionada}T${horarioParaAgendar}:00`,
            servico: servicoSelecionado,
            profissional: profissionalSelecionado,
        };

        api.post('/api/agendamentos/', dadosAgendamento)
            .then(() => {
                setMensagem({ texto: 'Horário agendado com sucesso!', tipo: 'sucesso' });
                handleVerificarDisponibilidade(); 
            })
            .catch(error => {
                const erroMsg = error.response?.data?.detail || 'Não foi possível agendar.';
                setMensagem({ texto: `Erro: ${erroMsg}`, tipo: 'erro' });
            })
            .finally(() => {
                setHorarioParaAgendar(null);
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Agende seu Horário</h1>
                {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
                <div className="selecao-container">
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
                                    <button className="horario-botao" onClick={() => handleAgendarClick(horario)}>
                                        {horario}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (<p>{carregando ? '' : 'Selecione as opções acima para ver os horários.'}</p>)}
                </div>
            </header>

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