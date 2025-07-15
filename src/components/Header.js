// src/components/Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (e) {
      console.error("Token inválido:", e);
      localStorage.removeItem('authToken');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <header className="app-header-main">
      <div className="header-content">
        <Link to="/" className="logo-container">
          {/* AQUI ESTÁ A MUDANÇA: Usamos a sua logo em vez do logo.svg */}
          <img src="/LogoShelock.jpg" alt="Logo da Barbearia" className="logo-img" />
          <span className="logo-text">Sherlock Barber</span>
        </Link>
        <nav className="main-nav">
          {user && (
            <>
              <Link to="/meus-agendamentos" className="nav-link">Meus Agendamentos</Link>
              {user.is_staff && (
                <Link to="/admin" className="nav-link">Área de Gestão</Link>
              )}
              <button onClick={handleLogout} className="nav-button logout">Sair</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
