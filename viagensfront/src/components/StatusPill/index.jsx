import React from 'react';
import './styles.css';

export function StatusPill({ status }) {
  const normStatus = typeof status === 'string' ? status.toLowerCase() : '';
  
  const config = {
    feito: { className: 'success', text: 'Feito' },
    pendente: { className: 'pending', text: 'Pendente' },
    planejando: { className: 'warning', text: 'Planejando' },
    confirmado: { className: 'success', text: 'Confirmado' },
    rascunho: { className: 'neutral', text: 'Rascunho' },
    sonho: { className: 'neutral', text: 'Sonho' }
  };

  const currentConfig = config[normStatus] || { className: 'neutral', text: status || 'Desconhecido' };

  return (
    <span className={`status-pill ${currentConfig.className}`}>
      {currentConfig.text}
    </span>
  );
}
