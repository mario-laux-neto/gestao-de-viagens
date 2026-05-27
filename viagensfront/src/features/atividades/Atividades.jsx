import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { StatusPill } from '../../components/StatusPill';
import { DatePicker } from '../../components/DatePicker';
import { CustomSelect } from '../../components/CustomSelect';
import { toast } from 'react-hot-toast';
import './Atividades.css';

export function Atividades() {
  const { usuario, isAuthenticated } = useAuth();

  // Data States
  const [atividades, setAtividades] = useState([]);
  const [roteiros, setRoteiros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoteiroId, setSelectedRoteiroId] = useState(''); // "" for all
  const [selectedStatus, setSelectedStatus] = useState('todos'); // "todos", "pendente", "feito"
  const [selectedDateFilter, setSelectedDateFilter] = useState('qualquer'); // "qualquer", "hoje", "esta_semana", "este_mes", "futuras"

  // Dropdown Menu Toggles
  const [isRoteiroOpen, setIsRoteiroOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  
  // Row Actions state (which row has active ⋯ dropdown)
  const [activeActionRowId, setActiveActionRowId] = useState(null);

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editActivityId, setEditActivityId] = useState(null);
  const [formError, setFormError] = useState('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [formState, setFormState] = useState({
    nome: '',
    roteiro_id: '',
    data: '',
    hora: '12:00',
    custo: '0',
    feito: false
  });

  // Refs for closing dropdowns when clicking outside
  const roteiroRef = useRef(null);
  const statusRef = useRef(null);
  const dateRef = useRef(null);
  const actionMenuRef = useRef(null);
  const timePickerRef = useRef(null);

  // Locked date for "today" to calculate countdowns, matching Home.jsx
  const today = useMemo(() => new Date('2026-05-25'), []);

  useEffect(() => {
    if (isAuthenticated) {
      carregarDados();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (roteiroRef.current && !roteiroRef.current.contains(event.target)) {
        setIsRoteiroOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveActionRowId(null);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setIsTimePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [atividadesRes, roteirosRes] = await Promise.all([
        api.get('/atividades'),
        api.get('/roteiros')
      ]);
      setAtividades(atividadesRes.data.data || []);
      const activeRoteiros = roteirosRes.data.data || [];
      setRoteiros(activeRoteiros);
      
      // Auto-select first active roteiro for the form default if available
      if (activeRoteiros.length > 0) {
        setFormState(prev => ({ ...prev, roteiro_id: activeRoteiros[0].id.toString() }));
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      toast.error('Erro ao carregar atividades do servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle checklist checkbox
  const handleToggleDone = async (activityId, e) => {
    e.stopPropagation(); // Avoid triggering any other click
    try {
      await api.patch(`/atividades/${activityId}/toggle`);
      setAtividades(prev =>
        prev.map(a => (a.id === activityId ? { ...a, feito: !a.feito } : a))
      );
      toast.success('Status da atividade atualizado!');
    } catch (err) {
      console.error('Erro ao alternar status:', err);
      toast.error('Erro ao atualizar status da atividade.');
    }
  };

  // Handle delete operation
  const handleDeleteActivity = async (activityId) => {
    setActiveActionRowId(null);
    if (window.confirm('Tem certeza que deseja excluir esta atividade?')) {
      try {
        await api.delete(`/atividades/${activityId}`);
        setAtividades(prev => prev.filter(a => a.id !== activityId));
        toast.success('Atividade excluída com sucesso!');
      } catch (err) {
        console.error('Erro ao excluir atividade:', err);
        toast.error('Erro ao excluir atividade.');
      }
    }
  };

  // Open modal for creation
  const handleOpenCreateModal = () => {
    setFormError('');
    setIsEditMode(false);
    setEditActivityId(null);
    setIsTimePickerOpen(false); // Reset custom clock picker dropdown state
    setFormState({
      nome: '',
      roteiro_id: roteiros.length > 0 ? roteiros[0].id.toString() : '',
      data: '',
      hora: '',
      custo: '0',
      feito: false
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (activity) => {
    setActiveActionRowId(null);
    setFormError('');
    setIsEditMode(true);
    setEditActivityId(activity.id);
    setIsTimePickerOpen(false); // Reset custom clock picker dropdown state

    // Extract date and time from ISO string
    let dateStr = '2026-05-25';
    let timeStr = '12:00';
    if (activity.horario) {
      try {
        const parts = activity.horario.split('T');
        dateStr = parts[0];
        if (parts[1]) {
          timeStr = parts[1].substring(0, 5); // get HH:MM
        }
      } catch (e) {
        console.error('Erro ao extrair data/hora:', e);
      }
    }

    setFormState({
      nome: activity.nome || '',
      roteiro_id: activity.roteiro_id ? activity.roteiro_id.toString() : '',
      data: dateStr,
      hora: timeStr,
      custo: activity.custo ? Number(activity.custo).toString() : '0',
      feito: !!activity.feito
    });
    setIsModalOpen(true);
  };

  // Submit modal form (create or edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const { nome, roteiro_id, data, hora, custo, feito } = formState;

    if (!nome.trim()) {
      setFormError('Nome da atividade é obrigatório.');
      return;
    }
    if (!roteiro_id) {
      setFormError('Selecione um roteiro.');
      return;
    }
    if (!data || !hora) {
      setFormError('Data e horário são obrigatórios.');
      return;
    }

    // Validate manually typed Time matches HH:MM format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(hora.trim())) {
      setFormError('Horário inválido. Por favor, utilize o formato HH:MM (ex: 14:30).');
      return;
    }

    // Combine Date and Time
    let parsedHorario;
    try {
      parsedHorario = new Date(`${data}T${hora}:00`);
      if (isNaN(parsedHorario.getTime())) {
        setFormError('Data ou horário inválido.');
        return;
      }
    } catch {
      setFormError('Erro ao processar data e horário.');
      return;
    }

    // Clean cost value
    const cleanCusto = parseFloat(custo.toString().replace(',', '.')) || 0;
    if (cleanCusto < 0) {
      setFormError('O custo não pode ser negativo.');
      return;
    }

    const payload = {
      nome: nome.trim(),
      roteiro_id: parseInt(roteiro_id),
      horario: parsedHorario.toISOString(),
      custo: cleanCusto,
      feito: !!feito
    };

    try {
      if (isEditMode) {
        const res = await api.put(`/atividades/${editActivityId}`, payload);
        
        // Format date from YYYY-MM-DD to DD/MM
        let diaFormatado = 'Data';
        try {
          const parts = data.split('-');
          if (parts.length === 3) {
            diaFormatado = `${parts[2]}/${parts[1]}`;
          }
        } catch {}

        toast.custom((t) => (
          <div className={`custom-toast-wrapper ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
            <div className="eyebrow" style={{ marginBottom: '8px' }}>
              Informação · neutro
            </div>
            <div className="toast info">
              <div className="toast-ico">i</div>
              <div className="toast-body">
                <div className="toast-title">Atividade reagendada</div>
                <div className="toast-msg">
                  "{nome.trim()}" foi movida para {diaFormatado} às {hora}.
                </div>
              </div>
              <button className="toast-close" onClick={() => toast.dismiss(t.id)}>✕</button>
            </div>
          </div>
        ), { duration: 4500 });

        // Update local list
        setAtividades(prev =>
          prev.map(a => (a.id === editActivityId ? { ...a, ...payload, roteiro: roteiros.find(r => r.id === payload.roteiro_id) } : a))
        );
      } else {
        const res = await api.post('/atividades', payload);
        toast.success('Atividade cadastrada com sucesso!');
        // Refresh full list to get relations correct
        const reloadRes = await api.get('/atividades');
        setAtividades(reloadRes.data.data || []);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar atividade:', err);
      setFormError(err.response?.data?.error?.message || 'Erro ao salvar atividade no servidor.');
    }
  };

  // Helper date parsing/formatting
  const getDaysRemaining = (dateString) => {
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
  };

  const matchesDateFilter = (isoString, filterValue) => {
    if (filterValue === 'qualquer') return true;
    if (!isoString) return false;

    try {
      const actDate = new Date(isoString.split('T')[0] + 'T00:00:00');
      if (isNaN(actDate.getTime())) return false;

      const dToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dAct = new Date(actDate.getFullYear(), actDate.getMonth(), actDate.getDate());

      if (filterValue === 'hoje') {
        return dToday.getTime() === dAct.getTime();
      }

      if (filterValue === 'esta_semana') {
        const diff = (dAct - dToday) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }

      if (filterValue === 'este_mes') {
        return dToday.getFullYear() === dAct.getFullYear() && dToday.getMonth() === dAct.getMonth();
      }

      if (filterValue === 'futuras') {
        return dAct >= dToday;
      }
    } catch {
      return false;
    }
    return true;
  };

  const formatActivityDate = (isoString) => {
    if (!isoString) return '';
    try {
      const parts = isoString.split('T');
      const datePart = parts[0];
      const timePart = parts[1] ? parts[1].substring(0, 5) : '00:00';

      const dParts = datePart.split('-');
      if (dParts.length === 3) {
        return `${dParts[2]}/${dParts[1]}/${dParts[0]} · ${timePart}`;
      }
      return `${datePart} · ${timePart}`;
    } catch {
      return '';
    }
  };

  // Filter activities dynamically based on search, status, roteiro, and dates
  const filteredAtividades = useMemo(() => {
    return atividades.filter(act => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nomeMatch = act.nome?.toLowerCase().includes(query);
        const localMatch = act.local?.toLowerCase().includes(query);
        if (!nomeMatch && !localMatch) return false;
      }

      // 2. Roteiro Selection Filter
      if (selectedRoteiroId && act.roteiro_id?.toString() !== selectedRoteiroId) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== 'todos') {
        const isFeito = selectedStatus === 'feito';
        if (!!act.feito !== isFeito) return false;
      }

      // 4. Date Range Filter
      if (!matchesDateFilter(act.horario, selectedDateFilter)) {
        return false;
      }

      return true;
    });
  }, [atividades, searchQuery, selectedRoteiroId, selectedStatus, selectedDateFilter]);

  // Statistics calculations dynamically based on CURRENT ACTIVE FILTERS
  const stats = useMemo(() => {
    const total = filteredAtividades.length;
    const completed = filteredAtividades.filter(a => a.feito).length;
    const totalCost = filteredAtividades.reduce((acc, a) => acc + (Number(a.custo) || 0), 0);

    // Find the next upcoming pending activity
    const pendingActivitiesSorted = [...filteredAtividades]
      .filter(a => !a.feito && a.horario)
      .sort((a, b) => new Date(a.horario) - new Date(b.horario));

    const nextActivity = pendingActivitiesSorted[0] || null;
    let nextCountdownText = 'Nenhuma';
    let nextName = 'Sem pendências';

    if (nextActivity) {
      nextName = nextActivity.nome;
      const days = getDaysRemaining(nextActivity.horario);
      if (days === 0) {
        nextCountdownText = 'hoje';
      } else if (days === 1) {
        nextCountdownText = 'amanhã';
      } else if (days && days > 1) {
        nextCountdownText = `em ${days} dias`;
      } else if (days && days < 0) {
        nextCountdownText = 'atrasada';
      } else {
        nextCountdownText = 'em breve';
      }
    }

    const progressWidth = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      totalCost,
      nextName,
      nextCountdownText,
      progressWidth
    };
  }, [filteredAtividades, today]);

  // Roteiro select dropdown options
  const roteiroOptions = useMemo(() => {
    return [
      { value: '', label: 'Roteiro: todos' },
      ...roteiros.map(r => ({
        value: r.id.toString(),
        label: r.nome
      }))
    ];
  }, [roteiros]);

  // Roteiro options for the Form (T-09), including destination name for high visual fidelity
  const formRoteiroOptions = useMemo(() => {
    return roteiros.map(r => ({
      value: r.id.toString(),
      label: `${r.nome} (${r.destino?.cidade || ''})`
    }));
  }, [roteiros]);

  // Date select options
  const dateOptions = [
    { value: 'qualquer', label: 'Data: qualquer' },
    { value: 'hoje', label: 'Hoje' },
    { value: 'esta_semana', label: 'Esta semana' },
    { value: 'este_mes', label: 'Este mês' },
    { value: 'futuras', label: 'Futuras' }
  ];

  // Status select options
  const statusOptions = [
    { value: 'todos', label: 'Status: todos' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'feito', label: 'Feito' }
  ];

  if (isLoading) {
    return (
      <main className="atividades-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink-soft)' }}>Carregando listagem de atividades...</p>
      </main>
    );
  }

  return (
    <main className="atividades-container">
      {/* Page Header */}
      <header className="page-h">
        <div>
          <div className="eyebrow">Execução</div>
          <h1 className="page-title">Atividades</h1>
          <p className="page-sub">Visão consolidada de todas as atividades dos seus roteiros.</p>
        </div>
        <button className="btn accent" onClick={handleOpenCreateModal}>
          + Nova atividade
        </button>
      </header>

      {/* Summary Cards Panel */}
      <section className="summary-cards">
        <div className="summary-card">
          <div className="lbl">Total</div>
          <div className="val">{stats.total}</div>
        </div>
        <div className="summary-card">
          <div className="lbl">Concluídas</div>
          <div className="val">
            {stats.completed} / {stats.total}
          </div>
          <div className="progress">
            <div className="bar" style={{ width: `${stats.progressWidth}%` }}></div>
          </div>
        </div>
        <div className="summary-card">
          <div className="lbl">Custo total</div>
          <div className="val">
            R$ {stats.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="summary-card">
          <div className="lbl">Próxima</div>
          <div className="val" style={{ fontSize: '17px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={stats.nextName}>
            {stats.nextName}
          </div>
          {stats.nextCountdownText !== 'Nenhuma' && (
            <div className="delta">{stats.nextCountdownText}</div>
          )}
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="toolbar">
        {/* Roteiro Filter */}
        <div className="dropdown-container" ref={roteiroRef}>
          <button
            className={`select-pill ${selectedRoteiroId ? 'active' : ''}`}
            onClick={() => setIsRoteiroOpen(!isRoteiroOpen)}
          >
            {roteiroOptions.find(o => o.value === selectedRoteiroId)?.label || 'Roteiro: todos'} ▾
          </button>
          {isRoteiroOpen && (
            <ul className="dropdown-menu">
              {roteiroOptions.map(opt => (
                <li
                  key={opt.value}
                  className={`dropdown-item ${opt.value === selectedRoteiroId ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedRoteiroId(opt.value);
                    setIsRoteiroOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status Filter */}
        <div className="dropdown-container" ref={statusRef}>
          <button
            className={`select-pill ${selectedStatus !== 'todos' ? 'active' : ''}`}
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            {statusOptions.find(o => o.value === selectedStatus)?.label || 'Status: todos'} ▾
          </button>
          {isStatusOpen && (
            <ul className="dropdown-menu">
              {statusOptions.map(opt => (
                <li
                  key={opt.value}
                  className={`dropdown-item ${opt.value === selectedStatus ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedStatus(opt.value);
                    setIsStatusOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Filter */}
        <div className="dropdown-container" ref={dateRef}>
          <button
            className={`select-pill ${selectedDateFilter !== 'qualquer' ? 'active' : ''}`}
            onClick={() => setIsDateOpen(!isDateOpen)}
          >
            {dateOptions.find(o => o.value === selectedDateFilter)?.label || 'Data: qualquer'} ▾
          </button>
          {isDateOpen && (
            <ul className="dropdown-menu">
              {dateOptions.map(opt => (
                <li
                  key={opt.value}
                  className={`dropdown-item ${opt.value === selectedDateFilter ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDateFilter(opt.value);
                    setIsDateOpen(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Text Search Input */}
        <div className="search" style={{ marginLeft: 'auto' }}>
          <input
            type="text"
            placeholder="Buscar atividade…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Activity List Container */}
      {filteredAtividades.length > 0 ? (
        <section className="atividade-list">
          {filteredAtividades.map(act => {
            const isFeito = !!act.feito;
            const costConfig = act.custo === 0 || !act.custo
              ? { className: 'a-cost free', text: 'Grátis' }
              : { className: 'a-cost', text: `R$ ${Number(act.custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` };
            
            return (
              <div key={act.id} className="atividade-row">
                {/* Custom Checklist Checkbox */}
                <div
                  className={`check ${isFeito ? 'done' : ''}`}
                  onClick={(e) => handleToggleDone(act.id, e)}
                  title={isFeito ? 'Marcar como pendente' : 'Marcar como concluída'}
                ></div>

                {/* Name and Meta */}
                <div style={{ cursor: 'pointer' }} onClick={() => handleOpenEditModal(act)}>
                  <div className={`a-name ${isFeito ? 'done' : ''}`}>{act.nome}</div>
                  <div className="a-meta">
                    {act.roteiro?.nome || 'Sem Roteiro'} · {formatActivityDate(act.horario)}
                  </div>
                </div>

                {/* Cost */}
                <span className={costConfig.className}>
                  {costConfig.text}
                </span>

                {/* Status Pill */}
                <StatusPill status={isFeito ? 'feito' : 'pendente'} />

                {/* Row Option Menu (⋯) */}
                <div className="action-menu-container" ref={activeActionRowId === act.id ? actionMenuRef : null}>
                  <button
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveActionRowId(activeActionRowId === act.id ? null : act.id);
                    }}
                  >
                    ⋯
                  </button>
                  {activeActionRowId === act.id && (
                    <div className="action-dropdown">
                      <button type="button" onClick={() => handleOpenEditModal(act)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteActivity(act.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="empty-state">
          Nenhuma atividade encontrada com os filtros selecionados. Clique em <b>+ Nova atividade</b> para adicionar uma nova!
        </section>
      )}

      {/* Creation/Editing Modal Form (T-09) */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-h">
              <h3>{isEditMode ? 'Editar atividade' : 'Nova atividade'}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Fechar">
                &times;
              </button>
            </header>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {formError && <div className="field-error" style={{ marginBottom: '14px' }}>{formError}</div>}

                {/* Activity Name */}
                <div className="field">
                  <label>Nome da atividade *</label>
                  <input
                    type="text"
                    placeholder="Ex: Passeio na Torre Eiffel, Visita ao Museu..."
                    value={formState.nome}
                    onChange={(e) => setFormState(prev => ({ ...prev, nome: e.target.value }))}
                    maxLength={120}
                    required
                  />
                </div>

                {/* Associated Roteiro */}
                <div className="field">
                  <label>Roteiro *</label>
                  <CustomSelect
                    key={isModalOpen ? `cs-${editActivityId || 'new'}` : 'cs-closed'}
                    value={formState.roteiro_id}
                    onChange={(val) => setFormState(prev => ({ ...prev, roteiro_id: val }))}
                    options={formRoteiroOptions}
                  />
                </div>

                {/* Date and Time selectors side-by-side */}
                <div className="field-row">
                  <div className="field">
                    <label>Data *</label>
                    <DatePicker
                      key={isModalOpen ? `dp-${editActivityId || 'new'}` : 'dp-closed'}
                      value={formState.data}
                      onChange={(val) => setFormState(prev => ({ ...prev, data: val }))}
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                  <div className="field">
                    <label>Horário *</label>
                    <div className="custom-timepicker" ref={timePickerRef}>
                      <div className="time-input-wrapper" onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}>
                        <input
                          type="text"
                          className="time-field-input"
                          placeholder="12:00"
                          value={formState.hora}
                          onChange={(e) => setFormState(prev => ({ ...prev, hora: e.target.value }))}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsTimePickerOpen(true);
                          }}
                        />
                        <span className="time-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                          </svg>
                        </span>
                      </div>

                      {isTimePickerOpen && (
                        <div className="tp-dropdown-card">
                          <div className="tp-columns">
                            <div className="tp-column">
                              <div className="tp-header-label">Hora</div>
                              <div className="tp-list">
                                {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => {
                                  const isSelected = formState.hora.split(':')[0] === h;
                                  return (
                                    <button
                                      type="button"
                                      key={h}
                                      className={`tp-item ${isSelected ? 'selected' : ''}`}
                                      onClick={() => setFormState(prev => ({ ...prev, hora: `${h}:${prev.hora.split(':')[1] || '00'}` }))}
                                    >
                                      {h}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="tp-column">
                              <div className="tp-header-label">Min</div>
                              <div className="tp-list">
                                {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')).map(m => {
                                  const isSelected = formState.hora.split(':')[1] === m;
                                  return (
                                    <button
                                      type="button"
                                      key={m}
                                      className={`tp-item ${isSelected ? 'selected' : ''}`}
                                      onClick={() => {
                                        setFormState(prev => ({ ...prev, hora: `${prev.hora.split(':')[0] || '12'}:${m}` }));
                                        setIsTimePickerOpen(false);
                                      }}
                                    >
                                      {m}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cost and Feito checkbox side-by-side */}
                <div className="field-row" style={{ marginTop: '4px' }}>
                  <div className="field">
                    <label>Custo (R$)</label>
                    <input
                      type="text"
                      placeholder="0,00"
                      value={formState.custo}
                      onChange={(e) => setFormState(prev => ({ ...prev, custo: e.target.value }))}
                    />
                  </div>
                  <div className="field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', paddingTop: '18px' }}>
                    <label className="checkbox-row" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', textTransform: 'none', fontWeight: '500', color: 'var(--ink)' }}>
                      <input
                        type="checkbox"
                        checked={formState.feito}
                        onChange={(e) => setFormState(prev => ({ ...prev, feito: e.target.checked }))}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Marcar como já feita
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <footer className="modal-foot">
                <button type="button" className="btn ghost sm" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn accent sm">
                  Salvar atividade
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
