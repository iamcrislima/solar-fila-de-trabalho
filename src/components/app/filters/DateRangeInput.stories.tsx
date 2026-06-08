import type { CSSProperties } from 'react';
import { useState } from 'react';
import { DateRangeInput } from './DateRangeInput';
import type { DateRange } from '@/domain/filtros/dateRange';

export default {
  title: '02-App/DateRangeInput',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const note:  CSSProperties = { fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#9E9E9E', margin: 0 };

const empty: DateRange = { from: null, to: null };

// ─── Estado padrão ────────────────────────────────────────────────────────────

export const Padrao = () => {
  const [value, setValue] = useState<DateRange>(empty);
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Padrão — vazio</p>
        <div style={{ width: 280 }}>
          <DateRangeInput label="Intervalo de datas" value={value} onChange={setValue} />
        </div>
        <p style={note}>Valor: from={value.from ?? '—'} · to={value.to ?? '—'}</p>
      </div>
    </div>
  );
};
Padrao.storyName = 'Padrão';

// ─── Com valor ────────────────────────────────────────────────────────────────

export const ComValor = () => {
  const [value, setValue] = useState<DateRange>({ from: '01/01/2024', to: '31/12/2024' });
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Com valor inicial preenchido</p>
        <div style={{ width: 280 }}>
          <DateRangeInput label="Data de entrada" value={value} onChange={setValue} />
        </div>
        <p style={note}>Valor: from={value.from ?? '—'} · to={value.to ?? '—'}</p>
      </div>
    </div>
  );
};
ComValor.storyName = 'Com valor';

// ─── Estados ─────────────────────────────────────────────────────────────────

export const Estados = () => {
  const [v1, setV1] = useState<DateRange>(empty);
  const [v2, setV2] = useState<DateRange>({ from: '01/06/2024', to: '30/06/2024' });
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Enabled — vazio</p>
        <div style={{ width: 280 }}>
          <DateRangeInput label="Data de prazo" value={v1} onChange={setV1} />
        </div>
      </div>
      <div style={group}>
        <p style={label}>Enabled — com valor</p>
        <div style={{ width: 280 }}>
          <DateRangeInput label="Data de entrada" value={v2} onChange={setV2} />
        </div>
      </div>
      <div style={group}>
        <p style={label}>Disabled</p>
        <div style={{ width: 280 }}>
          <DateRangeInput label="Data de criação" value={{ from: '01/01/2024', to: '31/12/2024' }} onChange={() => {}} disabled />
        </div>
      </div>
    </div>
  );
};
Estados.storyName = 'Estados';
