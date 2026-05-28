import React from 'react';
import styles from './styles.module.css';

export function Card({
  title,
  subtitle,
  actions,
  children,
  footer,
  className = '',
  ...props
}) {
  return (
    <div className={[styles.card, className].join(' ')} {...props}>
      {(title || subtitle || actions) && (
        <div className={styles.header}>
          <div className={styles.titleArea}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
