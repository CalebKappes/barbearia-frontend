import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe o hook

function Header() {
  const { user, logout } = useAuth(); // Use o hook

  return (
    <header className="app-header-main">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src="/LogoShelock.JPG" alt="Logo da Barbearia" className="logo-img" />
          <span className="logo-text">Sherlock Barber</span>
        </Link>
        <nav className="main-nav">
          {user && (
            <>
              <Link to="/meus-agendamentos" className="nav-link">Meus Agendamentos</Link>
              {user.is_staff && (
                <Link to="/admin" className="nav-link">Área de Gestão</Link>
              )}
              {/* Chama a função de logout do contexto */}
              <button onClick={logout} className="nav-button logout">Sair</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;