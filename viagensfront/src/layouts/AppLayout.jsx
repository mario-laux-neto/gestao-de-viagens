import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AppLayout.css';

export function AppLayout() {
  const location = useLocation();
  const { usuario } = useAuth();

  const userNome = usuario?.nome || "Maria Hoppe";
  const userAvatar = userNome.charAt(0).toUpperCase();

  return (
    <div className="app-layout">
      <nav className="appbar">
        <Link to="/" className="brand">
          <span className="ov">OV</span>
          Organiza Viagens
        </Link>
        
        <div className="nav">
          <Link to="/" className={location.pathname === '/' ? 'on' : ''}>Início</Link>
          <Link to="/destinos" className={location.pathname.startsWith('/destinos') ? 'on' : ''}>Destinos</Link>
          <Link to="/roteiros" className={location.pathname.startsWith('/roteiros') ? 'on' : ''}>Roteiros</Link>
          <Link to="/atividades" className={location.pathname.startsWith('/atividades') ? 'on' : ''}>Atividades</Link>
        </div>

        <div className="user-chip">
          <Link 
            to="/perfil" 
            className="user-link"
            title="Ver meu perfil"
          >
            <span className="avatar">
              {usuario?.foto ? (
                <img 
                  src={usuario.foto} 
                  alt={userNome} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                />
              ) : (
                userAvatar
              )}
            </span>
            <span>{userNome}</span>
          </Link>
        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
