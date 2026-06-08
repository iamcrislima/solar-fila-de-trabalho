import type { CSSProperties } from 'react';
import { useState } from 'react';
import { HourPicker } from '.';

export default {
  title: '01-DS/Atoms/HourPicker',
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
      <p style={sectionLabel}>Begin — horas 0-23 (20 selecionado) / End — minutos (35 selecionado)</p>
      <div style={row}>
        <HourPicker variant="begin" value={20} displayTime="20:00" />
        <HourPicker variant="end"   value={35} displayTime="20:35" />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Controlado — Begin ───────────────────────────────────────────────────────

export const ControlladoBegin = () => {
  const [hour, setHour] = useState(20);
  const [min]           = useState(0);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Clique para selecionar a hora (0-23)</p>
        <div style={row}>
          <HourPicker
            variant="begin"
            value={hour}
            displayTime={`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`}
            onChange={setHour}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Hora selecionada: {String(hour).padStart(2, '0')}h
        </p>
      </div>
    </div>
  );
};
ControlladoBegin.storyName = 'Begin — horas (interativo)';

// ─── Controlado — End ─────────────────────────────────────────────────────────

export const ControlladoEnd = () => {
  const [min, setMin] = useState(35);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Clique para selecionar o minuto (00, 05, ..., 55)</p>
        <div style={row}>
          <HourPicker
            variant="end"
            value={min}
            displayTime={`20:${String(min).padStart(2, '0')}`}
            onChange={setMin}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Minuto selecionado: {String(min).padStart(2, '0')}min
        </p>
      </div>
    </div>
  );
};
ControlladoEnd.storyName = 'End — minutos (interativo)';

// ─── Fluxo completo Begin + End ───────────────────────────────────────────────

export const FluxoCompleto = () => {
  const [step, setStep]  = useState('begin'); // 'begin' | 'end'
  const [hour, setHour]  = useState(20);
  const [min, setMin]    = useState(0);

  const handleHour = (h: number) => { setHour(h); setStep('end'); };
  const handleMin  = (m: number) => { setMin(m);  setStep('begin'); };

  const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>
          Selecione a hora → depois o minuto (passo atual: {step === 'begin' ? 'hora' : 'minuto'})
        </p>
        <div style={row}>
          {step === 'begin'
            ? <HourPicker variant="begin" value={hour} displayTime={time} onChange={handleHour} />
            : <HourPicker variant="end"   value={min}  displayTime={time} onChange={handleMin}  />
          }
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Horário: {time}
        </p>
      </div>
    </div>
  );
};
FluxoCompleto.storyName = 'Fluxo completo (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Begin (24h)</p>
        <HourPicker variant="begin" value={20} displayTime="20:00" />
      </div>
      <div style={group}>
        <p style={sectionLabel}>End (minutos)</p>
        <HourPicker variant="end" value={35} displayTime="20:35" />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
