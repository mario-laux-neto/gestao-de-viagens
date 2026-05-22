import React from 'react';
import './styles.css';

// O componente recebe um "status" (feito, pendente, planejamento, rascunho, sonho)
export function StatusPill({ status }) {
  // Mapa para traduzir o status em classes CSS e textos bonitos
  const config = {
    feito: { className: 'success', text: 'FEITO' },
    pendente: { className: 'pending', text: 'PENDENTE' },
    planejando: { className: 'warning', text: 'Planejando' },
    rascunho: { className: 'neutral', text: 'Rascunho' },
    sonho: { className: 'neutral', text: 'Sonho' }
  };

  const currentConfig = config[status] || config.neutral;

  return (
    <span className={`status-pill ${currentConfig.className}`}>
      {currentConfig.text}
    </span>
  );
}
