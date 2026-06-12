import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { DestinoCard } from '../components/DestinoCard';
import { DestinoModal } from '../components/DestinoModal';
import { DestinoConfirmModal } from '../components/DestinoConfirmModal';
import { DestinoDetalhesModal } from '../components/DestinoDetalhesModal';
import { toast } from 'react-hot-toast';
import '../Destinos.css';

export function Destinos() {
    const [destinos, setDestinos] = useState([]);
    const [busca, setBusca] = useState('');

    // Controle de Modais
    const [modalAberto, setModalAberto] = useState(false);
    const [destinoEditando, setDestinoEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);

    const [confirmAberto, setConfirmAberto] = useState(false);
    const [destinoParaExcluir, setDestinoParaExcluir] = useState(null);

    // Estado do modal de detalhes
    const [destinoVisualizando, setDestinoVisualizando] = useState(null);

    // Carrega os destinos do backend
    useEffect(() => {
        carregarDestinos();
    }, []);

    async function carregarDestinos() {
        try {
            const response = await api.get('/destinos');
            setDestinos(response.data.data || []);
        } catch (err) {
            console.error('Erro ao carregar destinos:', err);
            toast.error('Erro ao carregar destinos.');

            setDestinos([
                { id: 1, cidade: 'Paris', pais: 'França', descricao: 'A cidade luz e capital da moda, cultura e gastronomia.' },
                { id: 2, cidade: 'Nova York', pais: 'Estados Unidos', descricao: 'A cidade que nunca dorme, com a Estátua da Liberdade e a Times Square.' }
            ]);
        }
    }

    const destinosFiltrados = destinos.filter(d =>
        (d.cidade || '').toLowerCase().includes(busca.toLowerCase()) ||
        (d.pais || '').toLowerCase().includes(busca.toLowerCase())
    );

    function abrirNovo() {
        setDestinoEditando(null);
        setModalAberto(true);
    }

    function abrirEditar(destino) {
        setDestinoEditando(destino);
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setDestinoEditando(null);
    }

    async function salvarDestino(form) {
        setSalvando(true);
        try {
            if (destinoEditando) {
                await api.put(`/destinos/${destinoEditando.id}`, form);
                toast.success('Destino atualizado com sucesso!');
            } else {
                await api.post('/destinos', form);
                toast.success('Destino cadastrado com sucesso!');
            }
            fecharModal();
            carregarDestinos();
        } catch (err) {
            console.error('Erro ao salvar destino:', err);
            toast.error('Erro ao salvar destino.');

            if (destinoEditando) {
                setDestinos(prev =>
                    prev.map(d => d.id === destinoEditando.id ? { ...d, ...form } : d)
                );
            } else {
                const novoDestino = { ...form, id: Date.now() };
                setDestinos(prev => [...prev, novoDestino]);
            }
            fecharModal();
        } finally {
            setSalvando(false);
        }
    }

    function prepararExclusao(id) {
        const destino = destinos.find(d => d.id === id);
        setDestinoParaExcluir(destino);
        setConfirmAberto(true);
    }

    function fecharConfirm() {
        setConfirmAberto(false);
        setDestinoParaExcluir(null);
    }

    async function confirmarExclusao() {
        if (!destinoParaExcluir) return;
        try {
            await api.delete(`/destinos/${destinoParaExcluir.id}`);
            toast.success('Destino excluído com sucesso!');
            carregarDestinos();
        } catch (err) {
            console.error('Erro ao excluir destino:', err);
            toast.error('Erro ao excluir destino do servidor.');
            setDestinos(prev => prev.filter(d => d.id !== destinoParaExcluir.id));
        } finally {
            fecharConfirm();
        }
    }

    return (
        <div className="destinos-page">
            <div className="destinos-header">
                <h1>Destinos</h1>
                <button className="btn-novo-destino" onClick={abrirNovo}>
                    + Novo Destino
                </button>
            </div>

            <div className="destinos-search">
                <input
                    type="text"
                    placeholder="Buscar por nome ou país..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            {destinosFiltrados.length === 0 ? (
                <div className="destinos-empty">
                    <p>Nenhum destino encontrado.</p>
                    <p>Clique em <strong>+ Novo Destino</strong> para começar.</p>
                </div>
            ) : (
                <div className="destinos-grid">
                    {destinosFiltrados.map(destino => (
                        <DestinoCard
                            key={destino.id}
                            destino={destino}
                            onEditar={abrirEditar}
                            onExcluir={prepararExclusao}
                            onClickCard={setDestinoVisualizando} // Abre detalhes ao clicar
                        />
                    ))}
                </div>
            )}

            {/* Modal de Criação / Edição */}
            <DestinoModal
                aberto={modalAberto}
                destino={destinoEditando}
                onFechar={fecharModal}
                onSalvar={salvarDestino}
                salvando={salvando}
            />

            {/* Modal de Confirmação de Exclusão */}
            <DestinoConfirmModal
                aberto={confirmAberto}
                destinoNome={destinoParaExcluir?.cidade || ''}
                onFechar={fecharConfirm}
                onConfirmar={confirmarExclusao}
            />

            {/* Modal de Detalhes (Leitura) */}
            <DestinoDetalhesModal
                aberto={!!destinoVisualizando}
                destino={destinoVisualizando}
                onFechar={() => setDestinoVisualizando(null)}
            />
        </div>
    );
}
