import React, { useState, useEffect } from 'react';

export function DestinoModal({ aberto, destino, onFechar, onSalvar, salvando }) {
    const [form, setForm] = useState({ cidade: '', pais: '', descricao: '' });

    useEffect(() => {
        if (destino) {
            setForm({
                cidade: destino.cidade || '',
                pais: destino.pais || '',
                descricao: destino.descricao || ''
            });
        } else {
            setForm({ cidade: '', pais: '', descricao: '' });
        }
    }, [destino, aberto]);

    if (!aberto) return null;

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSalvar(form);
    }

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h2>{destino ? 'Editar Destino' : 'Novo Destino'}</h2>

                <form onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label htmlFor="cidade">Cidade *</label>
                        <input
                            id="cidade"
                            name="cidade"
                            type="text"
                            value={form.cidade}
                            onChange={handleChange}
                            placeholder="Ex: Paris"
                            required
                        />
                    </div>

                    <div className="modal-field">
                        <label htmlFor="pais">País *</label>
                        <input
                            id="pais"
                            name="pais"
                            type="text"
                            value={form.pais}
                            onChange={handleChange}
                            placeholder="Ex: França"
                            required
                        />
                    </div>

                    <div className="modal-field">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Fale um pouco sobre o destino..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancelar" onClick={onFechar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-salvar" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
