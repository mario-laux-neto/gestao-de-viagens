import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StatusPill } from '../../components/StatusPill';
import { DatePicker } from '../../components/DatePicker';
import { CustomSelect } from '../../components/CustomSelect';
import './Home.css';

export function Home() {
  const { usuario, isAuthenticated, login, logout } = useAuth();

  const mockUsuario = { nome: "Maria" };
  const [mockTrips, setMockTrips] = useState([
    {
      id: 1,
      nome: "Verão Europeu 2026",
      cidade: "Lisboa",
      pais: "Portugal",
      data_ida: "2026-07-26",
      data_volta: "2026-08-05",
      status: "Confirmado",
      avatar: "L",
      activities: [
        { id: 11, nome: "Visita à Torre de Belém", horario: "27/07 · 10:00", custo: 80, feito: true },
        { id: 12, nome: "Jantar no Bairro Alto", horario: "27/07 · 20:30", custo: 220, feito: false },
        { id: 13, nome: "Passeio em Sintra", horario: "29/07 · 09:00", custo: 350, feito: false },
        { id: 14, nome: "Passeio de Elétrico 28", horario: "28/07 · 11:30", custo: 25, feito: false },
        { id: 15, nome: "Almoço de Bacalhau", horario: "28/07 · 13:00", custo: 120, feito: true },
        { id: 16, nome: "Visita ao Castelo de S. Jorge", horario: "30/07 · 15:00", custo: 90, feito: false },
        { id: 17, nome: "Show de Fado em Alfama", horario: "30/07 · 21:00", custo: 180, feito: false },
        { id: 18, nome: "Hospedagem em Lisboa", horario: "26/07 a 05/08", custo: 1115, feito: false }
      ]
    },
    {
      id: 2,
      nome: "Aventura Portenha",
      cidade: "Buenos Aires",
      pais: "Argentina",
      data_ida: "2026-09-03",
      data_volta: "2026-09-09",
      status: "Planejando",
      avatar: "B",
      activities: [
        { id: 21, nome: "Show de Tango no Carlos Gardel", horario: "04/09 · 20:00", custo: 320, feito: false },
        { id: 22, nome: "Jantar na Parrilla Don Julio", horario: "05/09 · 21:00", custo: 450, feito: false },
        { id: 23, nome: "Visita ao Caminito e La Boca", horario: "05/09 · 11:00", custo: 0, feito: false },
        { id: 24, nome: "Café no Tortoni", horario: "06/09 · 16:30", custo: 70, feito: false },
        { id: 25, nome: "Livraria El Ateneo", horario: "07/09 · 14:00", custo: 0, feito: false }
      ]
    },
    {
      id: 3,
      nome: "Imersão no Japão",
      cidade: "Tóquio",
      pais: "Japão",
      data_ida: "2027-03-31",
      data_volta: "2027-04-15",
      status: "Rascunho",
      avatar: "T",
      activities: [
        { id: 31, nome: "Visita ao Templo Senso-ji", horario: "02/04 · 09:00", custo: 0, feito: false },
        { id: 32, nome: "Jantar de Sushi em Ginza", horario: "02/04 · 20:00", custo: 600, feito: false },
        { id: 33, nome: "Mirante Shibuya Sky", horario: "03/04 · 18:00", custo: 120, feito: false },
        { id: 34, nome: "Passeio em Akihabara", horario: "04/04 · 13:00", custo: 150, feito: false }
      ]
    },
    {
      id: 4,
      nome: "Cidade do Cabo",
      cidade: "Cidade do Cabo",
      pais: "África do Sul",
      data_ida: "",
      data_volta: "",
      status: "Sonho",
      avatar: "C",
      activities: [
        { id: 41, nome: "Subida da Table Mountain", horario: "A definir", custo: 180, feito: false },
        { id: 42, nome: "Passeio pelos Pinguins de Boulders Beach", horario: "A definir", custo: 90, feito: false }
      ]
    },
    {
      id: 5,
      nome: "Safari na África",
      cidade: "Joanesburgo",
      pais: "África do Sul",
      data_ida: "2026-11-15",
      data_volta: "2026-11-25",
      status: "Sonho",
      avatar: "J",
      activities: [
        { id: 51, nome: "Safari de Jeep no Kruger", horario: "16/11 · 06:00", custo: 500, feito: false },
        { id: 52, nome: "Jantar sob as estrelas", horario: "18/11 · 20:00", custo: 200, feito: false }
      ]
    },
    {
      id: 6,
      nome: "Natal em Gramado",
      cidade: "Gramado",
      pais: "Brasil",
      data_ida: "2026-12-20",
      data_volta: "2026-12-26",
      status: "Rascunho",
      avatar: "G",
      activities: [
        { id: 61, nome: "Espetáculo do Lago", horario: "21/12 · 21:00", custo: 150, feito: false },
        { id: 62, nome: "Almoço de Fondue", horario: "22/12 · 13:00", custo: 200, feito: false }
      ]
    }
  ]);

  const [activeTripId, setActiveTripId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [pais, setPais] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [statusInput, setStatusInput] = useState('Planejando');
  const [errorMsg, setErrorMsg] = useState('');

  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [destinos, setDestinos] = useState([]);
  const [selectedDestinoId, setSelectedDestinoId] = useState('');
  const [totalRoteirosList, setTotalRoteirosList] = useState([]);

  const today = new Date('2026-05-25');

  useEffect(() => {
    if (isAuthenticated) {
      carregarDadosDashboard();
    } else {
      setIsOfflineMode(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isModalOpen && !isOfflineMode) {
      carregarDestinos();
    }
  }, [isModalOpen, isOfflineMode]);

  useEffect(() => {
    if (!isOfflineMode && statusInput === 'Sonho') {
      setStatusInput('Planejando');
    }
  }, [isOfflineMode, statusInput]);

  const carregarDadosDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setApiData(response.data.data);
      setIsOfflineMode(false);

      try {
        const roteirosResponse = await api.get('/roteiros');
        setTotalRoteirosList(roteirosResponse.data.data || []);
      } catch (roteiroErr) {
        console.error("Erro ao carregar lista completa de roteiros:", roteiroErr);
      }

      if (response.data.data.proxima_viagem) {
        carregarDetalhesRoteiro(response.data.data.proxima_viagem.id);
      }
    } catch (err) {
      console.log("Servidor Offline ou Sem Autenticação. Rodando em Modo de Demonstração Interativo.");
      setIsOfflineMode(true);
    }
  };

  const carregarDetalhesRoteiro = async (roteiroId) => {
    try {
      const response = await api.get(`/roteiros/${roteiroId}`);
      setApiData(prev => {
        if (!prev) return null;
        const targetTrip = response.data.data;
        return {
          ...prev,
          proxima_viagem: {
            ...prev.proxima_viagem,
            ...targetTrip,
            activities: targetTrip.atividades || targetTrip.Atividades || targetTrip.activities || []
          }
        };
      });
      setActiveTripId(roteiroId);
    } catch (err) {
      console.error("Erro ao carregar detalhes do roteiro:", err);
    }
  };

  const carregarDestinos = async () => {
    try {
      const response = await api.get('/destinos');
      setDestinos(response.data.data || []);
      if (response.data.data && response.data.data.length > 0) {
        setSelectedDestinoId(response.data.data[0].id);
      }
    } catch (err) {
      console.error("Erro ao carregar destinos:", err);
    }
  };

  const handleSelectTrip = async (tripId) => {
    if (isOfflineMode) {
      setActiveTripId(tripId);
      return;
    }

    try {
      const response = await api.get(`/roteiros/${tripId}`);
      const targetTrip = response.data.data;
      setApiData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          proxima_viagem: {
            ...targetTrip,
            activities: targetTrip.atividades || targetTrip.Atividades || targetTrip.activities || []
          },
          outros_roteiros: prev.outros_roteiros
            .map(t => {
              if (t.id === targetTrip.id) {
                return prev.proxima_viagem;
              }
              return t;
            })
            .filter(Boolean)
        };
      });
      setActiveTripId(tripId);
    } catch (err) {
      console.error("Erro ao alternar roteiro ativo:", err);
    }
  };

  const handleToggleActivity = async (activityId) => {
    if (isOfflineMode) {
      setMockTrips(prevTrips =>
        prevTrips.map(trip => {
          if (trip.id === activeTripId) {
            return {
              ...trip,
              activities: trip.activities.map(act => {
                if (act.id === activityId) {
                  return { ...act, feito: !act.feito };
                }
                return act;
              })
            };
          }
          return trip;
        })
      );
      return;
    }

    try {
      await api.patch(`/atividades/${activityId}/toggle`);
      setApiData(prev => {
        if (!prev || !prev.proxima_viagem) return prev;
        const updatedActivities = prev.proxima_viagem.activities.map(act => {
          if (act.id === activityId) {
            return { ...act, feito: !act.feito };
          }
          return act;
        });
        const completedCount = updatedActivities.filter(a => a.feito).length;

        return {
          ...prev,
          proxima_viagem: {
            ...prev.proxima_viagem,
            activities: updatedActivities,
            atividades_concluidas: completedCount
          }
        };
      });
    } catch (err) {
      console.error("Erro ao alternar status da atividade:", err);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isOfflineMode) {
      if (!nome || !cidade || !pais) {
        setErrorMsg('Por favor, preencha os campos de Nome, Cidade e País.');
        return;
      }

      if (dataIda && dataVolta) {
        const ida = new Date(dataIda);
        const volta = new Date(dataVolta);
        if (volta < ida) {
          setErrorMsg('Erro: A data de volta não pode ser anterior à data de ida (RF-06).');
          return;
        }
      }

      const newId = mockTrips.length + 1;
      const newTrip = {
        id: newId,
        nome,
        cidade,
        pais,
        data_ida: dataIda,
        data_volta: dataVolta,
        status: statusInput,
        avatar: cidade.charAt(0).toUpperCase() || 'V',
        activities: [
          { id: newId * 100 + 1, nome: `Check-in no hotel em ${cidade}`, horario: "Dia 1 · 14:00", custo: 0, feito: false },
          { id: newId * 100 + 2, nome: `Passeio guiado pelo centro histórico`, horario: "Dia 2 · 10:00", custo: 150, feito: false }
        ]
      };

      setMockTrips(prev => [...prev, newTrip]);
      setActiveTripId(newId);
      setIsModalOpen(false);

      setNome('');
      setCidade('');
      setPais('');
      setDataIda('');
      setDataVolta('');
      setStatusInput('Planejando');
      return;
    }

    try {
      if (!nome || !selectedDestinoId || !dataIda || !dataVolta) {
        setErrorMsg('Preencha os campos obrigatórios.');
        return;
      }

      const ida = new Date(dataIda);
      const volta = new Date(dataVolta);
      if (volta < ida) {
        setErrorMsg('Erro: A data de volta não pode ser anterior à data de ida.');
        return;
      }

      await api.post('/roteiros', {
        nome,
        destino_id: parseInt(selectedDestinoId),
        data_ida: dataIda,
        data_volta: dataVolta,
        status: statusInput.toLowerCase()
      });

      carregarDadosDashboard();
      setIsModalOpen(false);

      setNome('');
      setDataIda('');
      setDataVolta('');
      setStatusInput('Planejando');
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Erro ao criar roteiro no back-end.');
    }
  };

  function getDaysRemaining(dateString) {
    if (!dateString) return null;
    try {
      const datePart = dateString.includes('T') ? dateString.split('T')[0] : dateString.split(' ')[0];
      const targetDate = new Date(datePart + 'T00:00:00');
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  }

  function getFormattedDateRange(trip) {
    if (!trip || !trip.data_ida || !trip.data_volta) return 'A definir';
    try {
      const parseDate = (dStr) => {
        if (!dStr) return null;
        const datePart = dStr.includes('T') ? dStr.split('T')[0] : dStr.split(' ')[0];
        return new Date(datePart + 'T00:00:00');
      };
      const dateIda = parseDate(trip.data_ida);
      const dateVolta = parseDate(trip.data_volta);
      if (!dateIda || isNaN(dateIda.getTime()) || !dateVolta || isNaN(dateVolta.getTime())) {
        return 'A definir';
      }
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

  function getFormattedMiniDate(dStr) {
    if (!dStr) return 'Sem data';
    try {
      const datePart = dStr.includes('T') ? dStr.split('T')[0] : dStr.split(' ')[0];
      const dateObj = new Date(datePart + 'T00:00:00');
      if (isNaN(dateObj.getTime())) return 'Sem data';
      return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    } catch {
      return 'Sem data';
    }
  }

  const activeTrip = isOfflineMode 
    ? (mockTrips.find(t => t.id === activeTripId) || mockTrips[0])
    : (apiData?.proxima_viagem || {
        id: 0,
        nome: "Nenhum roteiro",
        destino: { cidade: "A definir", pais: "A definir" },
        activities: []
      });

  const totalActivitiesCount = isOfflineMode 
    ? activeTrip.activities.length 
    : (activeTrip.activities?.length || 0);

  const completedActivitiesCount = isOfflineMode
    ? activeTrip.activities.filter(a => a.feito).length
    : (activeTrip.activities?.filter(a => a.feito).length || 0);

  const totalCustoPrevisto = isOfflineMode
    ? activeTrip.activities.reduce((acc, a) => acc + (Number(a.custo) || 0), 0)
    : (activeTrip.activities?.reduce((acc, a) => acc + (Number(a.custo) || 0), 0) || 0);

  const otherTrips = isOfflineMode
    ? mockTrips.filter(t => t.id !== activeTripId)
    : (apiData?.outros_roteiros || []);

  const displayedOtherTrips = isExpanded ? otherTrips : otherTrips.slice(0, 3);

  const welcomeNome = isOfflineMode ? (usuario?.nome || mockUsuario.nome) : (usuario?.nome || "Viajante");
  
  const activeRoteirosCount = isOfflineMode
    ? mockTrips.filter(t => t.status !== "Sonho" && t.status !== "Concluído").length
    : totalRoteirosList.filter(t => t.status !== 'concluido').length;

  const criticalTripsCount = isOfflineMode
    ? mockTrips.filter(t => t.data_ida && getDaysRemaining(t.data_ida) < 60).length
    : totalRoteirosList.filter(t => t.data_ida && getDaysRemaining(t.data_ida) < 60).length;

  return (
    <main className="home-container">
      <header className="page-h">
        <div>
          <div className="eyebrow">Bem-vinda de volta</div>
          <h1 className="page-title">Olá, {welcomeNome}.</h1>
          <p className="page-sub">
            Você tem {activeRoteirosCount} {activeRoteirosCount === 1 ? 'roteiro ativo' : 'roteiros ativos'} e {criticalTripsCount} {criticalTripsCount === 1 ? 'viagem' : 'viagens'} a menos de 60 dias.
          </p>
        </div>
        
        <button className="btn accent" onClick={() => setIsModalOpen(true)}>
          + Novo roteiro
        </button>
      </header>

      <section className="dash-grid">
        <div className="next-trip">
          <div>
            <div className="nt-label">
              {activeTrip.status === "sonho" || activeTrip.status === "Sonho" ? "Viagem dos Sonhos" : "Próxima viagem"}
            </div>
            <div className="nt-title">{activeTrip.nome}</div>
            <div className="nt-dest">
              {isOfflineMode ? activeTrip.cidade : activeTrip.destino?.cidade},{" "}
              {isOfflineMode ? activeTrip.pais : activeTrip.destino?.pais} ·{" "}
              {getFormattedDateRange(activeTrip)}
            </div>
            
            {activeTrip.data_ida && getDaysRemaining(activeTrip.data_ida) !== null && (
              <div className="countdown">
                faltam <b>{getDaysRemaining(activeTrip.data_ida)}</b> dias
              </div>
            )}
            
            {!activeTrip.data_ida && (
              <div className="countdown">
                sem <b>data</b> definida
              </div>
            )}
          </div>
          
          <div className="nt-stats">
            <div className="nt-stat">
              <div className="lbl">Atividades</div>
              <div className="val">{totalActivitiesCount}</div>
            </div>
            <div className="nt-stat">
              <div className="lbl">Concluídas</div>
              <div className="val">{completedActivitiesCount} / {totalActivitiesCount}</div>
            </div>
            <div className="nt-stat highlight">
              <div className="lbl">Custo previsto</div>
              <div className="val">R$ {totalCustoPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="eyebrow" style={{ marginBottom: '10px' }}>
            Outros roteiros
          </div>
          
          <div className="side-list">
            {displayedOtherTrips.map(trip => (
              <div 
                key={trip.id} 
                className={`mini-row ${trip.id === activeTripId ? 'active' : ''}`}
                onClick={() => handleSelectTrip(trip.id)}
                title="Clique para ver os detalhes desta viagem"
              >
                <div className="mr-letter">
                  {isOfflineMode ? trip.avatar : (trip.destino?.cidade?.charAt(0).toUpperCase() || 'V')}
                </div>
                <div>
                  <div className="mr-title">{trip.nome}</div>
                  <div className="mr-sub">
                    {isOfflineMode ? trip.cidade : trip.destino?.cidade} ·{" "}
                    {getFormattedMiniDate(trip.data_ida)}
                  </div>
                </div>
                <div className="mr-side">
                  {trip.status}
                </div>
              </div>
            ))}
          </div>

          {otherTrips.length > 3 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-toggle-list"
              title={isExpanded ? "Mostrar menos roteiros" : "Ver todos os roteiros disponíveis"}
            >
              {isExpanded ? '− Ver menos' : `+ Ver todos (${otherTrips.length} roteiros)`}
            </button>
          )}

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--accent-soft)',
            borderRadius: '8px',
            border: '1px dashed var(--accent)',
            fontSize: '13px'
          }}>
            <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '8px' }}>
              Conexão com Banco (Supabase)
            </strong>
            {isOfflineMode ? (
              <div>
                <p style={{ fontSize: '12px', marginBottom: '10px', color: 'var(--ink-soft)', lineHeight: '1.4' }}>
                  Rodando no modo de simulação offline. Conecte ao seu servidor back-end de teste:
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={async () => {
                      try {
                        await login('viajante@viagens.com', 'viajante123');
                        carregarDadosDashboard();
                      } catch {
                        alert('Não foi possível conectar. Certifique-se de que o servidor back-end esteja rodando na porta 3000 (npm run dev no viagensback).');
                      }
                    }}
                    className="btn accent sm"
                  >
                    Entrar como Viajante
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        await login('admin@viagens.com', 'admin123');
                        carregarDadosDashboard();
                      } catch {
                        alert('Não foi possível conectar. Certifique-se de que o servidor back-end esteja rodando na porta 3000 (npm run dev no viagensback).');
                      }
                    }}
                    className="btn ghost sm"
                  >
                    Entrar como Admin
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', marginBottom: '10px', color: 'var(--ok)', fontWeight: '600' }}>
                  ✓ Conectado reativamente ao Supabase como {usuario?.email}!
                </p>
                <button 
                  onClick={() => {
                    logout();
                    setIsOfflineMode(true);
                    setApiData(null);
                  }}
                  className="btn ghost sm"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  Voltar ao Modo Simulação
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ marginTop: '22px' }}>
        <div className="eyebrow" style={{ marginBottom: '10px' }}>Próximas atividades</div>
        
        {totalActivitiesCount > 0 ? (
          <div className="atividade-list">
            {activeTrip.activities.map(act => (
              <div 
                key={act.id} 
                className="atividade-row" 
                onClick={() => handleToggleActivity(act.id)}
                style={{ cursor: 'pointer' }}
                title="Clique para marcar/desmarcar a atividade"
              >
                <div className={`check ${act.feito ? 'done' : ''}`}></div>
                <div>
                  <div className={`a-name ${act.feito ? 'done' : ''}`}>{act.nome}</div>
                  <div className="a-meta">{activeTrip.nome} · {act.horario}</div>
                </div>
                <span className={`a-cost ${act.custo === 0 ? 'free' : ''}`}>
                  {act.custo === 0 ? 'Grátis' : `R$ ${Number(act.custo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <StatusPill status={act.feito ? 'feito' : 'pendente'} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'white',
            border: '1.5px dashed var(--line)',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--ink-mute)'
          }}>
            Nenhuma atividade cadastrada para este roteiro. Clique em Destinos ou Roteiros para adicionar atividades.
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-h">
              <h3>Novo Roteiro</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Fechar">
                &times;
              </button>
            </header>

            <form onSubmit={handleCreateTrip}>
              <div className="modal-body">
                {errorMsg && <div className="field-error" style={{ marginBottom: '12px' }}>{errorMsg}</div>}
                
                <div className="field">
                  <label>Nome do Roteiro *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Verão Europeu 2026, Férias em Família..." 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required 
                  />
                </div>

                {isOfflineMode ? (
                  <div className="field-row">
                    <div className="field">
                      <label>Cidade de Destino *</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Paris" 
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="field">
                      <label>País *</label>
                      <input 
                        type="text" 
                        placeholder="Ex: França" 
                        value={pais}
                        onChange={(e) => setPais(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="field">
                    <label>Selecionar Destino Vinculado *</label>
                    <select 
                      value={selectedDestinoId} 
                      onChange={(e) => setSelectedDestinoId(e.target.value)}
                      required
                    >
                      {destinos.length > 0 ? (
                        destinos.map(dest => (
                          <option key={dest.id} value={dest.id}>
                            {dest.cidade}, {dest.pais}
                          </option>
                        ))
                      ) : (
                        <option value="">Nenhum destino cadastrado - Crie um primeiro</option>
                      )}
                    </select>
                  </div>
                )}

                <div className="field-row">
                  <div className="field">
                    <label>Data de Ida {!isOfflineMode && '*'}</label>
                    <DatePicker 
                      value={dataIda} 
                      onChange={setDataIda} 
                      placeholder="dd/mm/aaaa" 
                    />
                  </div>
                  <div className="field">
                    <label>Data de Volta {!isOfflineMode && '*'}</label>
                    <DatePicker 
                      value={dataVolta} 
                      onChange={setDataVolta} 
                      placeholder="dd/mm/aaaa" 
                      align="right"
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Status Inicial</label>
                  <CustomSelect 
                    value={statusInput} 
                    onChange={setStatusInput} 
                    options={isOfflineMode ? [
                      { value: 'Planejando', label: 'Planejando' },
                      { value: 'Confirmado', label: 'Confirmado' },
                      { value: 'Rascunho', label: 'Rascunho' },
                      { value: 'Sonho', label: 'Sonho (Sem Data)' }
                    ] : [
                      { value: 'Planejando', label: 'Planejando' },
                      { value: 'Confirmado', label: 'Confirmado' },
                      { value: 'Rascunho', label: 'Rascunho' }
                    ]} 
                  />
                </div>
              </div>

              <footer className="modal-foot">
                <button type="button" className="btn ghost sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn accent sm">
                  Criar Roteiro
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
