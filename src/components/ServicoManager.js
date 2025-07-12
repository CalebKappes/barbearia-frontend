// src/components/ServicoManager.js

import React, { useState, useEffect } from 'react';

function ServicoManager() {
  const [servicos, setServicos] = useState([]);

  // Função para buscar os serviços da API
  const fetchServicos = () => {
    const token = localStorage.getItem('authToken');
    fetch(`${process.env.REACT_APP_API_URL}/api/servicos/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => setServicos(data))
    .catch(error => console.error("Erro ao buscar serviços:", error));
  };

  // useEffect para buscar os serviços quando o componente carregar
  useEffect(() => {
    fetchServicos();
  }, []);

  return (
    <div>
      <h2>Gerenciar Serviços</h2>
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
                <button className="btn-edit">Editar</button>
                <button className="btn-delete">Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServicoManager;