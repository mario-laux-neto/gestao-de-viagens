import React from 'react';

export function DestinoDetalhesModal({ aberto, destino, onFechar }) {
    if (!aberto || !destino) return null;

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-box" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-mute)', fontWeight: '700' }}>
                        Detalhes do Destino
                    </span>
                    <button className="modal-close" onClick={onFechar}>&times;</button>
                </div>

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--ink)', marginBottom: '4px' }}>
                    {destino.cidade}
                </h2>
                <div style={{ fontSize: '14px', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
                    📍 {destino.pais}
                </div>

                <div style={{ background: 'var(--paper)', border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-mute)', fontWeight: '700', marginBottom: '8px' }}>
                        Sobre o Destino
                    </div>
                    <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {destino.descricao || 'Nenhuma descrição adicionada para este destino.'}
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn-cancelar" onClick={onFechar}>Fechar</button>
                </div>
            </div>
        </div>
    );
}
