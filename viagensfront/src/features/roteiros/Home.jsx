import React from 'react';
import { Plus, CheckSquare, Square } from 'lucide-react';
import { StatusPill } from '../../components/StatusPill';
import './Home.css';

export function Home() {
  const usuario = { nome: "Maria" };
  const resumo = "Você tem 3 roteiros ativos e 1 viagem a menos de 60 dias.";

  return (
    <main className="home-container">
      {/* Bloco 1: Cabeçalho de Boas-vindas */}
      <header className="home-header">
        <div className="home-welcome">
          <span className="subtitle">BEM-VINDA DE VOLTA</span>
          <h1>Olá, {usuario.nome}.</h1>
          <p className="summary-text">{resumo}</p>
        </div>
        
        <button className="btn-primary">
          <Plus size={18} /> Novo roteiro
        </button>
      </header>

      {/* Bloco 2: Grid Principal (Esquerda 70% / Direita 30%) */}
      <section className="home-grid">
        <div className="grid-left next-trip-card">
          <div className="next-trip-header">
            <div>
              <span className="tag-gold">PRÓXIMA VIAGEM</span>
              <h2>Verão Europeu 2026</h2>
              <p>Lisboa, Portugal · 12 a 22 de julho</p>
            </div>
            <div className="countdown-badge">
              faltam <strong>62 dias</strong>
            </div>
          </div>
          
          <div className="next-trip-stats">
            <div className="stat-item">
              <span className="stat-label">ATIVIDADES</span>
              <span className="stat-value">8</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">CONCLUÍDAS</span>
              <span className="stat-value">2 / 8</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-label">CUSTO PREVISTO</span>
              <span className="stat-value">R$ 2.180</span>
            </div>
          </div>
        </div>
        
        <aside className="grid-right">
          <h3>OUTROS ROTEIROS</h3>
          <div className="other-trips-list">
            <div className="trip-list-item">
              <div className="trip-avatar">B</div>
              <div className="trip-info">
                <h4>Aventura Portenha</h4>
                <p>Buenos Aires · 03–09 set</p>
              </div>
              <StatusPill status="planejando" />
            </div>

            <div className="trip-list-item">
              <div className="trip-avatar">T</div>
              <div className="trip-info">
                <h4>Imersão no Japão</h4>
                <p>Tóquio · abr/2027</p>
              </div>
              <StatusPill status="rascunho" />
            </div>

            <div className="trip-list-item">
              <div className="trip-avatar">C</div>
              <div className="trip-info">
                <h4>Cidade do Cabo</h4>
                <p>Sem data definida</p>
              </div>
              <StatusPill status="sonho" />
            </div>
          </div>
        </aside>
      </section>

      {/* Bloco 3: Atividades */}
      <section className="home-activities">
        <h3>PRÓXIMAS ATIVIDADES</h3>
        <div className="activities-list">
          <div className="activity-item done">
            <CheckSquare className="activity-icon-done" size={24} />
            <div className="activity-details">
              <h4>Visita à Torre de Belém</h4>
              <p>Verão Europeu 2026 · 13/07 · 10:00</p>
            </div>
            <div className="activity-price">R$ 80</div>
            <StatusPill status="feito" />
          </div>

          <div className="activity-item">
            <Square className="activity-icon-pending" size={24} color="#A09E9C" />
            <div className="activity-details">
              <h4>Jantar no Bairro Alto</h4>
              <p>Verão Europeu 2026 · 13/07 · 20:30</p>
            </div>
            <div className="activity-price">R$ 220</div>
            <StatusPill status="pendente" />
          </div>

          <div className="activity-item">
            <Square className="activity-icon-pending" size={24} color="#A09E9C" />
            <div className="activity-details">
              <h4>Passeio em Sintra</h4>
              <p>Verão Europeu 2026 · 15/07 · 09:00</p>
            </div>
            <div className="activity-price">R$ 350</div>
            <StatusPill status="pendente" />
          </div>
        </div>
      </section>
    </main>
  );
}
