import React from 'react';
import styles from './styles.module.css';

export function StatusTag({
  status,
  variant, // 'success' | 'warning' | 'neutral' | 'info' | 'pending'
  children,
  className = '',
  ...props
}) {
  const normStatus = typeof status === 'string' ? status.toLowerCase() : '';
  
  // Mapeamento automático de status para variantes semânticas do Organiza Viagens
  const statusMap = {
    feito: { variant: 'success', text: 'Feito' },
    confirmado: { variant: 'success', text: 'Confirmado' },
    planejando: { variant: 'warning', text: 'Planejando' },
    pendente: { variant: 'pending', text: 'Pendente' },
    rascunho: { variant: 'neutral', text: 'Rascunho' },
    sonho: { variant: 'neutral', text: 'Sonho' },
  };

  const currentConfig = statusMap[normStatus] || { 
    variant: variant || 'neutral', 
    text: children || status 
  };
  
  const tagVariant = currentConfig.variant;
  const tagText = currentConfig.text;

  return (
    <span
      className={[
        styles.tag,
        styles[tagVariant] || styles.neutral,
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {tagText}
    </span>
  );
}
