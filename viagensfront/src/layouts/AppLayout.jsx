import { Outlet, Link } from 'react-router-dom';
import './AppLayout.css';

export function AppLayout() {
  return (
    <div className="app-layout">
      {/* Barra de Navegação Superior */}
      <nav className="top-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <strong>MeuRoteiro</strong>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link active">Início</Link>
            <Link to="/destinos" className="nav-link">Destinos</Link>
            <Link to="/roteiros" className="nav-link">Roteiros</Link>
            <Link to="/atividades" className="nav-link">Atividades</Link>
          </div>

          <div className="nav-profile">
            <div className="avatar-circle">M</div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Dinâmico das Páginas */}
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
