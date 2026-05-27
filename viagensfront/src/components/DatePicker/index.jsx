import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

export function DatePicker({ value, onChange, placeholder = 'Selecione uma data', align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 25));
  const containerRef = useRef(null);

  const getActiveDate = () => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return null;
  };

  const activeDate = getActiveDate();

  useEffect(() => {
    if (activeDate) {
      setCurrentDate(new Date(activeDate.getFullYear(), activeDate.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatInputValue = () => {
    if (!activeDate) return '';
    const day = activeDate.getDate().toString().padStart(2, '0');
    const month = (activeDate.getMonth() + 1).toString().padStart(2, '0');
    const year = activeDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selectedDate = new Date(year, month, day);
    const yStr = selectedDate.getFullYear();
    const mStr = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const dStr = selectedDate.getDate().toString().padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date(2026, 4, 25);
    const yStr = today.getFullYear();
    const mStr = (today.getMonth() + 1).toString().padStart(2, '0');
    const dStr = today.getDate().toString().padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
  };

  const renderCells = () => {
    const cells = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      cells.push(
        <button key={`prev-${day}`} type="button" className="day-cell sibling" disabled>
          {day}
        </button>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = activeDate &&
        activeDate.getDate() === day &&
        activeDate.getMonth() === month &&
        activeDate.getFullYear() === year;

      const isToday = day === 25 && month === 4 && year === 2026;

      cells.push(
        <button
          key={`day-${day}`}
          type="button"
          className={`day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleSelectDay(day)}
        >
          {day}
        </button>
      );
    }

    const totalRendered = cells.length;
    const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
    for (let day = 1; day <= remaining; day++) {
      cells.push(
        <button key={`next-${day}`} type="button" className="day-cell sibling" disabled>
          {day}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className="custom-datepicker" ref={containerRef}>
      <div className="dp-input-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <input
          type="text"
          readOnly
          placeholder={placeholder}
          value={formatInputValue()}
          className="dp-field-input"
        />
        <span className="dp-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={`dp-dropdown-card ${align === 'right' ? 'right-align' : ''}`}>
          <header className="dp-header">
            <button type="button" className="dp-nav-btn" onClick={handlePrevMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="dp-month-title">
              {monthNames[month]} de {year}
            </div>
            <button type="button" className="dp-nav-btn" onClick={handleNextMonth}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </header>

          <div className="dp-weekdays">
            <span>D</span>
            <span>S</span>
            <span>T</span>
            <span>Q</span>
            <span>Q</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="dp-days-grid">
            {renderCells()}
          </div>

          <footer className="dp-footer">
            <button type="button" className="dp-action-btn" onClick={handleClear}>
              Limpar
            </button>
            <button type="button" className="dp-action-btn today-btn" onClick={handleToday}>
              Hoje
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
