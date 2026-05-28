import React from 'react';
import styles from './styles.module.css';

export function Button({
  children,
  variant = 'primary', // 'primary', 'ghost', 'link', 'accent'
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const buttonClass = [
    styles.btn,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.loaderContent}>
          <span className={styles.spinner} aria-hidden="true"></span>
          <span>Aguarde...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
