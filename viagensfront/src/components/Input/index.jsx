import React from 'react';
import styles from './styles.module.css';

export function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className={styles.field}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input
        id={id}
        type={type}
        className={[styles.input, error ? styles.inputError : '', className].filter(Boolean).join(' ')}
        {...props}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}
