import React from 'react';

export function RoteiroCard({ roteiro, onEditar, onExcluir, onClickCard }) {
    const today = new Date('2026-05-25'); // Data base padrão do projeto

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
            const dateIda = parseDate(roteiro.data_ida);
            const dateVolta = parseDate(roteiro.data_volta);

            const diaIda = dateIda.getDate().toString().padStart(2, '0');
            const mesIda = dateIda.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
            const diaVolta = dateVolta.getDate().toString().padStart(2, '0');
            const mesVolta = dateVolta.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
            const anoVolta = dateVolta.getFullYear();

            return `${diaIda} de ${mesIda} a ${diaVolta} de ${mesVolta} de ${anoVolta}`;
        } catch (e) {
            return 'Sem data';
        }
    }

    const diasRestantes = getDaysRemaining(roteiro.data_ida);
    const statusFormatado = (roteiro.status || 'planejando').toLowerCase();

    return (
        <div className="roteiro-card" onClick={() => onClickCard(roteiro)} style={{ cursor: 'pointer' }}>
            <div className="roteiro-card-header">
                <div>
                    <div className="roteiro-card-title">{roteiro.nome}</div>
                    <div className="roteiro-card-destination">
                        📍 {roteiro.destino?.cidade || 'A definir'}, {roteiro.destino?.pais || ''}
                    </div>
                    <div className="roteiro-card-dates">
                        📅 {getFormattedDateRange()}
                    </div>
                    {diasRestantes !== null && (
                        <div style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                            {diasRestantes > 0 ? (
                                <span>Faltam <strong>{diasRestantes}</strong> dias</span>
                            ) : (
                                <span style={{ color: 'var(--ok)' }}>Viagem iniciada/concluída</span>
                            )}
                        </div>
                    )}
                </div>
                <span className={`status-pill ${statusFormatado}`}>
                    {roteiro.status || 'Planejando'}
                </span>
            </div>

            <div className="roteiro-card-footer">
                <div className="roteiro-card-actions">
                    <button
                        className="btn-icon edit"
                        onClick={(e) => {
                            e.stopPropagation(); // Evita abrir os detalhes
                            onEditar(roteiro);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="btn-icon delete"
                        onClick={(e) => {
                            e.stopPropagation(); // Evita abrir os detalhes
                            onExcluir(roteiro.id);
                        }}
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}
