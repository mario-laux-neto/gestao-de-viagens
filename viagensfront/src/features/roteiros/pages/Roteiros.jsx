import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { RoteiroCard } from '../components/RoteiroCard';
import { RoteiroModal } from '../components/RoteiroModal';
import { RoteiroConfirmModal } from '../components/RoteiroConfirmModal';
import { RoteiroDetalhesModal } from '../components/RoteiroDetalhesModal';
import { toast } from 'react-hot-toast';
import '../Roteiros.css';

export function Roteiros() {
    const [roteiros, setRoteiros] = useState([]);
    const [destinos, setDestinos] = useState([]);

    // Filtros
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('todos');
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusRef = useRef(null);

    // Controle de Modais (Criar/Editar)
    const [modalAberto, setModalAberto] = useState(false);
    const [roteiroEditando, setRoteiroEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);

    // Controle de Modais (Excluir)
    const [confirmAberto, setConfirmAberto] = useState(false);
    const [roteiroParaExcluir, setRoteiroParaExcluir] = useState(null);

    // Estado do modal de detalhes
    const [roteiroVisualizando, setRoteiroVisualizando] = useState(null);

    // Carrega roteiros e destinos do backend
    useEffect(() => {
        carregarDados();
    }, []);

    // Fecha o dropdown ao clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setIsStatusOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function carregarDados() {
        try {
            const [roteirosRes, destinosRes] = await Promise.all([
                api.get('/roteiros'),
                api.get('/destinos')
            ]);

            setRoteiros(roteirosRes.data.data || []);
            setDestinos(destinosRes.data.data || []);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            toast.error('Erro ao carregar roteiros ou destinos.');

            setDestinos([
                { id: 1, nome: 'Paris', cidade: 'Paris', pais: 'França' },
                { id: 2, nome: 'Nova York', cidade: 'Nova York', pais: 'Estados Unidos' }
            ]);
            setRoteiros([
                { id: 1, nome: 'Minha Eurotrip', destino_id: 1, data_ida: '2026-07-15', data_volta: '2026-08-01', status: 'planejando', destino: { cidade: 'Paris', pais: 'França' } }
            ]);
        }
    }

    // Filtragem dinâmica segura contra valores nulos ou indefinidos
    const roteirosFiltrados = roteiros.filter(r => {
        const correspondeBusca =
            (r.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
            (r.destino?.cidade || '').toLowerCase().includes(busca.toLowerCase()) ||
            (r.destino?.pais || '').toLowerCase().includes(busca.toLowerCase());

        const correspondeStatus =
            filtroStatus === 'todos' ||
            (r.status || '').toLowerCase() === filtroStatus.toLowerCase();

        return correspondeBusca && correspondeStatus;
    });


    function abrirNovo() {
        setRoteiroEditando(null);
        setModalAberto(true);
    }

    function abrirEditar(roteiro) {
        setRoteiroEditando(roteiro);
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setRoteiroEditando(null);
    }

    async function salvarRoteiro(form) {
        setSalvando(true);
        try {
            const payload = {
                nome: form.nome,
                destino_id: parseInt(form.destino_id),
                data_ida: form.data_ida,
                data_volta: form.data_volta,
                status: form.status.toLowerCase()
            };

            if (roteiroEditando) {
                await api.put(`/roteiros/${roteiroEditando.id}`, payload);
                toast.success('Roteiro updated com sucesso!');
            } else {
                await api.post('/roteiros', payload);
                toast.success('Roteiro criado com sucesso!');
            }

            fecharModal();
            carregarDados();
        } catch (err) {
            console.error('Erro ao salvar roteiro:', err);
            toast.error('Erro ao salvar roteiro.');

            if (roteiroEditando) {
                const dest = destinos.find(d => d.id.toString() === form.destino_id.toString());
                setRoteiros(prev =>
                    prev.map(r => r.id === roteiroEditando.id ? { ...r, ...form, destino: { cidade: dest?.cidade || dest?.nome, pais: dest?.pais } } : r)
                );
            } else {
                const dest = destinos.find(d => d.id.toString() === form.destino_id.toString());
                const novo = {
                    ...form,
                    id: Date.now(),
                    destino: { cidade: dest?.cidade || dest?.nome, pais: dest?.pais }
                };
                setRoteiros(prev => [...prev, novo]);
            }
            fecharModal();
        } finally {
            setSalvando(false);
        }
    }

    function prepararExclusao(id) {
        const roteiro = roteiros.find(r => r.id === id);
        setRoteiroParaExcluir(roteiro);
        setConfirmAberto(true);
    }

    function fecharConfirm() {
        setConfirmAberto(false);
        setRoteiroParaExcluir(null);
    }

    async function confirmarExclusao() {
        if (!roteiroParaExcluir) return;
        try {
            await api.delete(`/roteiros/${roteiroParaExcluir.id}`);
            toast.success('Roteiro excluído com sucesso!');
            carregarDados();
        } catch (err) {
            console.error('Erro ao excluir roteiro:', err);
            toast.error('Erro ao excluir roteiro do servidor.');
            setRoteiros(prev => prev.filter(r => r.id !== roteiroParaExcluir.id));
        } finally {
            fecharConfirm();
        }
    }

    const statusOptions = [
        { value: 'todos', label: 'Status: todos' },
        { value: 'planejando', label: 'Planejando' },
        { value: 'confirmado', label: 'Confirmado' },
        { value: 'rascunho', label: 'Rascunho' },
        { value: 'concluido', label: 'Concluído' }
    ];

    return (
        <div className="roteiros-page">
            <div className="roteiros-header">
                <h1>Roteiros</h1>
                <button className="btn accent" onClick={abrirNovo}>
                    + Novo Roteiro
                </button>
            </div>

            <div className="roteiros-toolbar">
                <input
                    type="text"
                    placeholder="Buscar por roteiro ou destino..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />

                <div className="dropdown-container" ref={statusRef}>
                    <button
                        className={`select-pill ${filtroStatus !== 'todos' ? 'active' : ''}`}
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                    >
                        {statusOptions.find(o => o.value === filtroStatus)?.label || 'Status: todos'} ▾
                    </button>

                    {isStatusOpen && (
                        <ul className="dropdown-menu">
                            {statusOptions.map(opt => (
                                <li
                                    key={opt.value}
                                    className={`dropdown-item ${opt.value === filtroStatus ? 'selected' : ''}`}
                                    onClick={() => {
                                        setFiltroStatus(opt.value);
                                        setIsStatusOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {roteirosFiltrados.length === 0 ? (
                <div className="roteiros-empty">
                    <p>Nenhum roteiro encontrado.</p>
                    <p>Clique em <strong>+ Novo Roteiro</strong> para começar a planejar suas viagens!</p>
                </div>
            ) : (
                <div className="roteiros-grid">
                    {roteirosFiltrados.map(roteiro => (
                        <RoteiroCard
                            key={roteiro.id}
                            roteiro={roteiro}
                            onEditar={abrirEditar}
                            onExcluir={prepararExclusao}
                            onClickCard={setRoteiroVisualizando} // Abre detalhes ao clicar
                        />
                    ))}
                </div>
            )}

            {/* Modal de Criação / Edição */}
            <RoteiroModal
                aberto={modalAberto}
                roteiro={roteiroEditando}
                destinos={destinos}
                onFechar={fecharModal}
                onSalvar={salvarRoteiro}
                salvando={salvando}
            />

            {/* Modal de Confirmação de Exclusão */}
            <RoteiroConfirmModal
                aberto={confirmAberto}
                roteiroNome={roteiroParaExcluir?.nome || ''}
                onFechar={fecharConfirm}
                onConfirmar={confirmarExclusao}
            />

            {/* Modal de Detalhes (Leitura) */}
            <RoteiroDetalhesModal
                aberto={!!roteiroVisualizando}
                roteiro={roteiroVisualizando}
                onFechar={() => setRoteiroVisualizando(null)}
            />
        </div>
    );
}
