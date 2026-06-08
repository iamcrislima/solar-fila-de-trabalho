import type { CSSProperties } from 'react';
import { useState } from 'react';
import { InputGrid } from '.';

export default {
  title: '01-DS/Atoms/InputGrid',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Exatamente como no Figma — Default / Selected / Read Only</p>
      <div style={row}>
        <InputGrid placeholder="Select" />
        <InputGrid value="Selected" />
        <InputGrid value="Selected" readOnly />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Estados ──────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default — sem valor (placeholder)</p>
      <div style={row}>
        <InputGrid placeholder="Select" />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Selected — com valor</p>
      <div style={row}>
        <InputGrid value="Opção selecionada" />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Read Only — desabilitado</p>
      <div style={row}>
        <InputGrid value="Somente leitura" readOnly />
        <InputGrid placeholder="Select" readOnly />
      </div>
    </div>
  </div>
);
Estados.storyName = 'Estados';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const OPCOES = ['Opção A', 'Opção B', 'Opção C', 'Opção D'];
  const [value, setValue] = useState('');
  const idx = OPCOES.indexOf(value);

  const handleClick = () => {
    const next = OPCOES[(idx + 1) % OPCOES.length];
    setValue(next);
  };

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Clique para ciclar as opções</p>
        <div style={row}>
          <InputGrid value={value} placeholder="Select" onClick={handleClick} />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Valor: "{value || '(vazio)'}"
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Default</p>
        <InputGrid placeholder="Select" />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Selected</p>
        <InputGrid value="Selected" />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Read Only</p>
        <InputGrid value="Selected" readOnly />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
