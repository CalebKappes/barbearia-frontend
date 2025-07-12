// src/components/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import ServicoManager from './ServicoManager'; // Importamos o nosso novo componente

function AdminDashboard() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-nav">
          {/* Link para voltar para a página principal */}
          <Link to="/" className="admin-link">Voltar para o App</Link>
        </div>

        <h1>Painel de Gestão</h1>
        
        {/* Renderizamos o gerenciador de serviços aqui */}
        <div className="admin-container">
          <ServicoManager />
          {/* No futuro, poderíamos adicionar <ProfissionalManager /> aqui */}
        </div>

      </header>
    </div>
  );
}

export default AdminDashboard;