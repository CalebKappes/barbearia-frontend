import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import api from '../../services/api'; // Corrigido

function ServicoManager() {
    const [servicos, setServicos] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [duracao, setDuracao] = useState('01:00:00');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [servicoParaDeletar, setServicoParaDeletar] = useState(null);
    const [servicoEmEdicao, setServicoEmEdicao] = useState(null);

    const fetchServicos = () => {
        api.get('/api/servicos/')
            .then(response => setServicos(response.data))
            .catch(error => console.error("Erro ao buscar serviços", error));
    };

    useEffect(() => { fetchServicos(); }, []);

    useEffect(() => {
        if (mensagem.texto) {
            const timer = setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensagem]);

    const handleSubmitForm = (e) => {
        e.preventDefault();
        const servicoData = { nome, descricao, preco, duracao };
        
        const request = servicoEmEdicao
            ? api.put(`/api/servicos/${servicoEmEdicao.id}/`, servicoData)
            : api.post('/api/servicos/', servicoData);

        request
            .then(() => {
                setMensagem({ texto: `Serviço ${servicoEmEdicao ? 'atualizado' : 'criado'} com sucesso!`, tipo: 'sucesso' });
                fetchServicos();
                resetForm();
            })
            .catch(() => {
                setMensagem({ texto: `Erro ao ${servicoEmEdicao ? 'atualizar' : 'criar'} serviço.`, tipo: 'erro' });
            });
    };
    
    const handleEditClick = (servico) => {
        setServicoEmEdicao(servico);
        setNome(servico.nome);
        setDescricao(servico.descricao);
        setPreco(servico.preco);
        setDuracao(servico.duracao);
        setIsFormVisible(true);
    };

    const resetForm = () => {
        setNome(''); setDescricao(''); setPreco(''); setDuracao('01:00:00');
        setIsFormVisible(false);
        setServicoEmEdicao(null);
    };

    const handleDeleteServico = (servicoId) => { setServicoParaDeletar(servicoId); };
    
    const confirmDelete = () => {
        api.delete(`/api/servicos/${servicoParaDeletar}/`)
            .then(() => {
                setMensagem({ texto: 'Serviço apagado com sucesso!', tipo: 'sucesso' });
                fetchServicos();
            })
            .catch(() => {
                setMensagem({ texto: 'Erro ao apagar serviço.', tipo: 'erro' });
            })
            .finally(() => { setServicoParaDeletar(null); });
    };
    
    const cancelDelete = () => { setServicoParaDeletar(null); };

    return (
        <div className="admin-section">
            <h2>Gerenciar Serviços</h2>
            {mensagem.texto && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}
            <div className="admin-form-toggle">
                <button onClick={() => { isFormVisible ? resetForm() : setIsFormVisible(true) }}>
                    {isFormVisible ? 'Cancelar' : 'Adicionar Novo Serviço'}
                </button>
            </div>
            {isFormVisible && (
                <form onSubmit={handleSubmitForm} className="admin-form">
                    <h3>{servicoEmEdicao ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h3>
                    <input type="text" placeholder="Nome do Serviço" value={nome} onChange={e => setNome(e.target.value)} required />
                    <input type="text" placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
                    <input type="number" step="0.01" placeholder="Preço (ex: 70.00)" value={preco} onChange={e => setPreco(e.target.value)} required />
                    <input type="text" placeholder="Duração (HH:MM:SS)" value={duracao} onChange={e => setDuracao(e.target.value)} required />
                    <button type="submit">{servicoEmEdicao ? 'Salvar Alterações' : 'Adicionar Serviço'}</button>
                </form>
            )}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Duração</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {servicos.map(servico => (
                        <tr key={servico.id}>
                            <td>{servico.nome}</td>
                            <td>{servico.duracao}</td>
                            <td>R$ {servico.preco}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEditClick(servico)}>Editar</button>
                                <button className="btn-delete" onClick={() => handleDeleteServico(servico.id)}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationModal
                isOpen={servicoParaDeletar !== null}
                message="Você tem certeza que quer apagar este serviço?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}

export default ServicoManager;