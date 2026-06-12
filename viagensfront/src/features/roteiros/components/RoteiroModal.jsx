import React, { useState, useEffect } from 'react';
import { DatePicker } from '../../../components/DatePicker';
import { CustomSelect } from '../../../components/CustomSelect';

export function RoteiroModal({ aberto, roteiro, destinos, onFechar, onSalvar, salvando }) {
    const [form, setForm] = useState({
        nome: '',
        destino_id: '',
        data_ida: '',
        data_volta: '',
        status: 'planejando'
    });
    const [errorMsg, setErrorMsg] = useState('');

    // Preenche o formulário ao abrir para edição ou zera se for novo
    useEffect(() => {
        if (roteiro) {
            setForm({
                nome: roteiro.nome || '',
                destino_id: roteiro.destino_id ? roteiro.destino_id.toString() : '',
                data_ida: roteiro.data_ida ? roteiro.data_ida.split('T')[0] : '',
                data_volta: roteiro.data_volta ? roteiro.data_volta.split('T')[0] : '',
                status: roteiro.status || 'planejando'
            });
        } else {
            setForm({
                nome: '',
                destino_id: destinos.length > 0 ? destinos[0].id.toString() : '',
                data_ida: '',
                data_volta: '',
                status: 'planejando'
            });
        }
        setErrorMsg('');
    }, [roteiro, aberto, destinos]);

    if (!aberto) return null;

    function handleChange(name, value) {
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg('');

        if (!form.nome || !form.destino_id || !form.data_ida || !form.data_volta) {
            setErrorMsg('Preencha os campos obrigatórios.');
            return;
        }

        const ida = new Date(form.data_ida);
        const volta = new Date(form.data_volta);
        if (volta < ida) {
            setErrorMsg('A data de volta não pode ser anterior à data de ida.');
            return;
        }

        onSalvar(form);
    }

    const destinoOptions = destinos.map(dest => ({
        value: dest.id.toString(),
        label: `${dest.nome || dest.cidade}, ${dest.pais || ''}`
    }));

    const statusOptions = [
        { value: 'planejando', label: 'Planejando' },
        { value: 'confirmado', label: 'Confirmado' },
        { value: 'rascunho', label: 'Rascunho' },
        { value: 'concluido', label: 'Concluído' }
    ];

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <header className="modal-h">
                    <h3>{roteiro ? 'Editar Roteiro' : 'Novo Roteiro'}</h3>
                    <button className="modal-close" onClick={onFechar} aria-label="Fechar">
                        &times;
                    </button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {errorMsg && <div className="field-error" style={{ marginBottom: '12px' }}>{errorMsg}</div>}

                        <div className="field">
                            <label>Nome do Roteiro *</label>
                            <input
                                type="text"
                                value={form.nome}
                                onChange={e => handleChange('nome', e.target.value)}
                                placeholder="Ex: Férias de Verão, Viagem Romântica..."
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Selecionar Destino Vinculado *</label>
                            {destinoOptions.length > 0 ? (
                                <CustomSelect
                                    value={form.destino_id}
                                    onChange={val => handleChange('destino_id', val)}
                                    options={destinoOptions}
                                />
                            ) : (
                                <div style={{ fontSize: '13px', color: 'var(--ink-mute)', padding: '10px 0' }}>
                                    Nenhum destino cadastrado. Crie um destino primeiro.
                                </div>
                            )}
                        </div>

                        <div className="modal-field-row">
                            <div className="field">
                                <label>Data de Ida *</label>
                                <DatePicker
                                    value={form.data_ida}
                                    onChange={val => handleChange('data_ida', val)}
                                    placeholder="dd/mm/aaaa"
                                />
                            </div>
                            <div className="field">
                                <label>Data de Volta *</label>
                                <DatePicker
                                    value={form.data_volta}
                                    onChange={val => handleChange('data_volta', val)}
                                    placeholder="dd/mm/aaaa"
                                    align="right"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label>Status</label>
                            <CustomSelect
                                value={form.status}
                                onChange={val => handleChange('status', val)}
                                options={statusOptions}
                            />
                        </div>
                    </div>

                    <footer className="modal-foot">
                        <button type="button" className="btn ghost sm" onClick={onFechar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn accent sm" disabled={salvando}>
                            {salvando ? 'Salvando...' : 'Salvar'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
