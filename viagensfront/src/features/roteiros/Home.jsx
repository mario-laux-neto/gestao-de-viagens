import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StatusPill } from '../../components/StatusPill';
import { DatePicker } from '../../components/DatePicker';
import { CustomSelect } from '../../components/CustomSelect';
import './Home.css';

export function Home() {
  const { usuario, isAuthenticated } = useAuth();

  const [activeTripId, setActiveTripId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [nome, setNome] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [statusInput, setStatusInput] = useState('Planejando');
  const [errorMsg, setErrorMsg] = useState('');

  const [apiData, setApiData] = useState(null);
  const [destinos, setDestinos] = useState([]);
  const [selectedDestinoId, setSelectedDestinoId] = useState('');
  const [totalRoteirosList, setTotalRoteirosList] = useState([]);

  const today = new Date('2026-05-25');

  useEffect(() => {
    if (isAuthenticated) {
      carregarDadosDashboard();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isModalOpen) {
      carregarDestinos();
    }
  }, [isModalOpen]);

  const carregarDadosDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setApiData(response.data.data);

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
      console.error("Erro ao carregar dados do dashboard do back-end:", err);
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
      const data = response.data.data || [];
      setDestinos(data);
      if (data.length > 0) {
        setSelectedDestinoId(data[0].id.toString());
      }
    } catch (err) {
      console.error("Erro ao carregar destinos:", err);
    }
  };

  const handleSelectTrip = async (tripId) => {
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

    try {
      if (!nome || !selectedDestinoId || !dataIda || !dataVolta) {
        setErrorMsg('Preencha os campos obrigatórios.');
        return;
      }

      const ida = new Date(dataIda);
      const volta = new Date(dataVolta);
      if (volta < ida) {
        setErrorMsg('Erro: A data de volta não pode ser anterior à data de ida (RF-06).');
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

  if (!apiData) {
    return (
      <main className="home-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-soft)' }}>Carregando dados do painel...</p>
      </main>
    );
  }

  const activeTrip = apiData.proxima_viagem || null;

  const totalActivitiesCount = activeTrip?.activities?.length || 0;

  const completedActivitiesCount = activeTrip?.activities?.filter(a => a.feito).length || 0;

  const totalCustoPrevisto = activeTrip?.activities?.reduce((acc, a) => acc + (Number(a.custo) || 0), 0) || 0;

  const otherTrips = apiData.outros_roteiros || [];

  const displayedOtherTrips = isExpanded ? otherTrips : otherTrips.slice(0, 3);

  const welcomeNome = usuario?.nome || "Viajante";
  
  const activeRoteirosCount = totalRoteirosList.filter(t => t.status !== 'concluido' && t.status !== 'concluído').length;

  const criticalTripsCount = totalRoteirosList.filter(t => t.data_ida && getDaysRemaining(t.data_ida) !== null && getDaysRemaining(t.data_ida) < 60).length;

  return (
    <main className="home-container">
      <header className="page-h">
        <div>
          <div className="eyebrow">Boas-vindas de volta</div>
          <h1 className="page-title">Olá, {welcomeNome}.</h1>
          <p className="page-sub">
            Você tem {activeRoteirosCount} {activeRoteirosCount === 1 ? 'roteiro ativo' : 'roteiros ativos'} e {criticalTripsCount} {criticalTripsCount === 1 ? 'viagem' : 'viagens'} a menos de 60 dias.
          </p>
        </div>
        
        <button className="btn accent" onClick={() => setIsModalOpen(true)}>
          + Novo roteiro
        </button>
      </header>

      <section className="dash-grid" style={{ gridTemplateColumns: otherTrips.length > 0 ? '2fr 1fr' : '1fr' }}>
        {activeTrip ? (
          <div className="next-trip">
            <div>
              <div className="nt-label">
                {activeTrip.status === "sonho" || activeTrip.status === "Sonho" ? "Viagem dos Sonhos" : "Próxima viagem"}
              </div>
              <div className="nt-title">{activeTrip.nome}</div>
              <div className="nt-dest">
                {activeTrip.destino?.cidade || 'A definir'},{" "}
                {activeTrip.destino?.pais || 'A definir'} ·{" "}
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
        ) : (
          <div style={{
            background: 'var(--ink)',
            color: 'white',
            borderRadius: '10px',
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '20px', marginBottom: '8px' }}>Nenhum Roteiro Ativo</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13.5px', maxWidth: '380px', margin: '0 0 16px 0' }}>
              Crie um novo roteiro para planejar e controlar os custos de suas próximas viagens!
            </p>
            <button className="btn accent" onClick={() => setIsModalOpen(true)}>
              + Criar meu primeiro roteiro
            </button>
          </div>
        )}
        
        {otherTrips.length > 0 && (
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
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mr-letter">
                    {trip.destino?.cidade?.charAt(0).toUpperCase() || 'V'}
                  </div>
                  <div>
                    <div className="mr-title">{trip.nome}</div>
                    <div className="mr-sub">
                      {trip.destino?.cidade} ·{" "}
                      {getFormattedMiniDate(trip.data_ida)}
                    </div>
                  </div>
                  <div className="mr-side">
                    <span style={{ textTransform: 'capitalize' }}>{trip.status}</span>
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
          </div>
        )}
      </section>

      {activeTrip && (
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
      )}

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

                <div className="field">
                  <label>Selecionar Destino Vinculado *</label>
                  <select 
                    value={selectedDestinoId} 
                    onChange={(e) => setSelectedDestinoId(e.target.value)}
                    required
                  >
                    {destinos.length > 0 ? (
                      destinos.map(dest => (
                        <option key={dest.id} value={dest.id.toString()}>
                          {dest.cidade}, {dest.pais}
                        </option>
                      ))
                    ) : (
                      <option value="">Nenhum destino cadastrado - Crie um primeiro</option>
                    )}
                  </select>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Data de Ida *</label>
                    <DatePicker 
                      value={dataIda} 
                      onChange={setDataIda} 
                      placeholder="dd/mm/aaaa" 
                    />
                  </div>
                  <div className="field">
                    <label>Data de Volta *</label>
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
                    options={[
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
