import React from 'react';

export function RoteiroConfirmModal({ aberto, roteiroNome, onFechar, onConfirmar }) {
    if (!aberto) return null;

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-box modal-confirm" onClick={e => e.stopPropagation()}>
                <h2>Excluir Roteiro</h2>
                <p className="confirm-text">
                    Tem certeza que deseja excluir o roteiro <strong>{roteiroNome}</strong>?
                    Esta ação não poderá ser desfeita e removerá os dados deste roteiro.
                </p>

                <div className="modal-actions">
                    <button type="button" className="btn-cancelar" onClick={onFechar}>
                        Cancelar
                    </button>
                    <button type="button" className="btn-perigo" onClick={onConfirmar}>
                        Excluir Roteiro
                    </button>
                </div>
            </div>
        </div>
    );
}
