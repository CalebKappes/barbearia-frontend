import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ServicoManager from './ServicoManager';
import ProfissionalManager from './ProfissionalManager';
import AgendaView from './AgendaView';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('gerenciar');

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-nav">
          <Link to="/" className="admin-link">Voltar para o App</Link>
        </div>
        <h1>Painel de Gestão</h1>

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