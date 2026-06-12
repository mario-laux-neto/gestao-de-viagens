import React from 'react';

export function DestinoCard({ destino, onEditar, onExcluir, onClickCard }) {
    return (
        <div className="destino-card" onClick={() => onClickCard(destino)}>
            <div className="destino-card-nome">{destino.cidade}</div>
            {destino.pais && (
                <div className="destino-card-pais">📍 {destino.pais}</div>
            )}
            {destino.descricao && (
                <div className="destino-card-descricao">{destino.descricao}</div>
            )}
            <div className="destino-card-acoes">
                <button
                    className="btn-editar"
                    onClick={(e) => {
                        e.stopPropagation(); // Impede abrir o modal de detalhes
                        onEditar(destino);
                    }}
                >
                    Editar
                </button>
                <button
                    className="btn-excluir"
                    onClick={(e) => {
                        e.stopPropagation(); // Impede abrir o modal de detalhes
                        onExcluir(destino.id);
                    }}
                >
                    Excluir
                </button>
            </div>
        </div>
    );
}
