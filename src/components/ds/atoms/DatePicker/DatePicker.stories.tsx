import type { CSSProperties } from 'react';
import { useState } from 'react';
import { DatePicker } from '.';

export default {
  title: '01-DS/Atoms/DatePicker',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default — fevereiro 2024, dia 15 selecionado</p>
      <div style={row}>
        <DatePicker variant="default" year={2024} month={1} selectedDay={15} />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Month Picker — apenas header</p>
      <div style={row}>
        <DatePicker variant="monthPicker" year={2024} month={1} />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const today = new Date();
  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth());
  const [selected, setSelected] = useState<number | null>(today.getDate());

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Interativo — navegue pelos meses e selecione um dia</p>
        <div style={row}>
          <DatePicker
            variant="default"
            year={year}
            month={month}
            selectedDay={selected}
            onDayClick={setSelected}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Selecionado: {selected != null
            ? `${String(selected).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`
            : 'nenhum'}
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Month Picker controlado ──────────────────────────────────────────────────

export const MonthPickerControlado = () => {
  const [year, setYear]   = useState(2024);
  const [month, setMonth] = useState(1);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Month Picker — navegue pelos meses</p>
        <div style={row}>
          <DatePicker
            variant="monthPicker"
            year={year}
            month={month}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
        </div>
      </div>
    </div>
  );
};
MonthPickerControlado.storyName = 'Month Picker (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Default</p>
        <DatePicker variant="default" year={2024} month={1} selectedDay={15} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Month Picker</p>
        <DatePicker variant="monthPicker" year={2024} month={1} />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
