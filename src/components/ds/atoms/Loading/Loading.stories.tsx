import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Loading } from '.';

export default {
  title: '01-DS/Atoms/Loading',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' };
// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Barra indeterminada</p>
      <Loading variant="bar" label="Carregando" />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Circular</p>
      <Loading variant="circular" label="Carregando" />
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Barra determinada (com value) ───────────────────────────────────────────

export const Determinado = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>0%</p>
      <Loading variant="bar" label="Iniciando…" value={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>40%</p>
      <Loading variant="bar" label="Carregando" value={40} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>75%</p>
      <Loading variant="bar" label="Quase lá…" value={75} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>100%</p>
      <Loading variant="bar" label="Concluído" value={100} />
    </div>
  </div>
);
Determinado.storyName = 'Barra determinada';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [value, setValue] = useState(30);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Arraste o slider para alterar o progresso</p>
        <input
          type="range" min={0} max={100} value={value}
          onChange={e => setValue(Number(e.target.value))}
          style={{ width: 504 }}
        />
        <Loading variant="bar" label={`${value}% carregado`} value={value} />
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Bar — indeterminado</p>
      <Loading variant="bar" label="Carregando" />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Bar — determinado 60%</p>
      <Loading variant="bar" label="Carregando" value={60} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Circular</p>
      <Loading variant="circular" label="Carregando" />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
