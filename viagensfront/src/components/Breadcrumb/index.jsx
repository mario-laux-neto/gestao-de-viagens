import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export function Breadcrumb({
  items = [], // Array de objetos { label: string, path: string }
  className = '',
  ...props
}) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={[styles.nav, className].join(' ')} aria-label="Breadcrumb" {...props}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  {item.path ? (
                    <Link to={item.path} className={styles.link}>
                      {item.label}
                    </Link>
                  ) : (
                    <span className={styles.link}>{item.label}</span>
                  )}
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
