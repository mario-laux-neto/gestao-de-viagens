import React from 'react';

export function DestinoConfirmModal({ aberto, destinoNome, onFechar, onConfirmar }) {
    if (!aberto) return null;

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-box modal-confirm" onClick={e => e.stopPropagation()}>
                <h2>Excluir Destino</h2>
                <p className="confirm-text">
                    Tem certeza que deseja excluir o destino <strong>{destinoNome}</strong>?
                    Esta ação não poderá ser desfeita.
                </p>

                <div className="modal-actions">
                    <button type="button" className="btn-cancelar" onClick={onFechar}>
                        Cancelar
                    </button>
                    <button type="button" className="btn-perigo" onClick={onConfirmar}>
                        Excluir Destino
                    </button>
                </div>
            </div>
        </div>
    );
}
