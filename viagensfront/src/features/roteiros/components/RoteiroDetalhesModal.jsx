import React from 'react';

export function RoteiroDetalhesModal({ aberto, roteiro, onFechar }) {
    if (!aberto || !roteiro) return null;

    const today = new Date('2026-05-25');

    function getDaysRemaining(dateString) {
        if (!dateString) return null;
        try {
            const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString.split(' ')[0];
            const targetDate = new Date(datePart + 'T00:00:00');
            const diffTime = targetDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch {
            return null;
        }
    }

    function getFormattedDateRange() {
        if (!roteiro.data_ida || !roteiro.data_volta) return 'A definir';
        try {
            const parseDate = (dStr) => {
                const datePart = dStr.includes('T') ? dStr.split('T')[0] : dStr.split(' ')[0];
                return new Date(datePart + 'T00:00:00');
            };
            const dateId = parseDate(roteiro.data_ida);
            const dateVol = parseDate(roteiro.data_volta);

            const diaIda = dateId.getDate().toString().padStart(2, '0');
            const mesIda = dateId.toLocaleDateString('pt-BR', { month: 'long' });
            const diaVolta = dateVol.getDate().toString().padStart(2, '0');
            const mesVolta = dateVol.toLocaleDateString('pt-BR', { month: 'long' });
            const anoVolta = dateVol.getFullYear();

            return `${diaIda} de ${mesIda} a ${diaVolta} de ${mesVolta} de ${anoVolta}`;
        } catch (e) {
            return 'Sem data';
        }
    }

    const diasRestantes = getDaysRemaining(roteiro.data_ida);
    const statusFormatado = (roteiro.status || 'planejando').toLowerCase();

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                <header className="modal-h" style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: '16px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-mute)', fontWeight: '700' }}>
                        Detalhes do Roteiro
                    </span>
                    <button className="modal-close" onClick={onFechar}>&times;</button>
                </header>

                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <span className={`status-pill ${statusFormatado}`} style={{ fontSize: '11px', padding: '4px 10px' }}>
                            {roteiro.status || 'Planejando'}
                        </span>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--ink)', marginTop: '10px', marginBottom: '6px' }}>
                            {roteiro.nome}
                        </h2>
                        <div style={{ fontSize: '15px', color: 'var(--ink-soft)', fontWeight: '500' }}>
                            📍 {roteiro.destino?.cidade || 'A definir'}, {roteiro.destino?.pais || ''}
                        </div>
                    </div>

                    <div style={{ background: 'var(--paper)', border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-mute)', fontWeight: '600' }}>Periodo da Viagem</span>
                            <div style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: '500', marginTop: '2px' }}>{getFormattedDateRange()}</div>
                        </div>

                        {diasRestantes !== null && (
                            <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: '8px', marginTop: '4px' }}>
                                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-mute)', fontWeight: '600' }}>Status do Cronograma</span>
                                <div style={{ fontSize: '14px', color: 'var(--ink)', marginTop: '2px' }}>
                                    {diasRestantes > 0 ? (
                                        <span>Faltam <strong>{diasRestantes}</strong> dias para o embarque!</span>
                                    ) : (
                                        <span style={{ color: 'var(--ok)', fontWeight: '600' }}>Viagem iniciada / concluída</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="modal-foot">
                    <button className="btn ghost sm" onClick={onFechar}>Fechar</button>
                </footer>
            </div>
        </div>
    );
}
