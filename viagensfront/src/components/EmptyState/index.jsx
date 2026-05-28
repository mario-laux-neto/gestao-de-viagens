import React from 'react';
import styles from './styles.module.css';

export function EmptyState({
  title = 'Nenhum registro encontrado',
  description = 'Não há itens cadastrados nesta seção até o momento.',
  icon,
  action, // Elemento de ação (ex: <Button>) opcional
  className = '',
  ...props
}) {
  return (
    <div className={[styles.emptyState, className].join(' ')} {...props}>
      <div className={styles.iconContainer}>
        {icon || (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
