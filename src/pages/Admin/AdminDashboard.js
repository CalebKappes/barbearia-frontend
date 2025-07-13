// src/pages/Admin/AdminDashboard.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServicoManager from './ServicoManager';
import ProfissionalManager from './ProfissionalManager';
import AgendaView from './AgendaView'; // 1. Importamos a nova visão de agenda

function AdminDashboard() {
  // 2. Novo estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState('gerenciar'); // 'gerenciar' ou 'agenda'

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-nav">
          <Link to="/" className="admin-link">Voltar para o App</Link>
        </div>
        <h1>Painel de Gestão</h1>

        {/* 3. Botões para alternar entre as abas */}
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'gerenciar' ? 'active' : ''}`}
            onClick={() => setActiveTab('gerenciar')}
          >
            Gerenciar
          </button>
          <button 
            className={`tab-button ${activeTab === 'agenda' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda')}
          >
            Agenda
          </button>
        </div>
        
        <div className="admin-container">
          {/* 4. Renderização condicional baseada na aba ativa */}
          {activeTab === 'gerenciar' ? (
            <>
              <ServicoManager />
              <hr className="admin-divider" />
              <ProfissionalManager />
            </>
          ) : (
            <AgendaView />
          )}
        </div>

      </header>
    </div>
  );
}

export default AdminDashboard;
