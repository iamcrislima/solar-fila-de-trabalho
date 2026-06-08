import type { CSSProperties } from 'react';
import { useState } from 'react';
import { NumberField } from '.';

export default {
  title: '01-DS/Atoms/NumberField',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estados estáticos ────────────────────────────────────────────────────────

export const EstadosEstaticos = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default (value=0, min=0 → botão − desabilitado)</p>
      <div style={row}>
        <NumberField value={0} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Com valor intermediário</p>
      <div style={row}>
        <NumberField value={5} min={0} max={10} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>No máximo (botão + desabilitado)</p>
      <div style={row}>
        <NumberField value={10} min={0} max={10} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Disabled</p>
      <div style={row}>
        <NumberField value={3} disabled onChange={() => {}} />
      </div>
    </div>
  </div>
);
EstadosEstaticos.storyName = 'Estados estáticos (Figma)';

// ─── Layouts ──────────────────────────────────────────────────────────────────

export const Layouts = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Horizontal (padrão): [−] [input] [+]</p>
      <div style={row}>
        <NumberField value={3} min={0} max={10} layout="horizontal" onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Side: [input] [+/− empilhados]</p>
      <div style={row}>
        <NumberField value={3} min={0} max={10} layout="side" onChange={() => {}} />
      </div>
    </div>
  </div>
);
Layouts.storyName = 'Layouts';

// ─── Label customizado ────────────────────────────────────────────────────────

export const LabelCustomizado = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Labels customizados</p>
      <div style={row}>
        <NumberField label="Qtde."      value={1} onChange={() => {}} />
        <NumberField label="Páginas"    value={5} onChange={() => {}} />
        <NumberField label="Repetições" value={3} onChange={() => {}} inputWidth={104} />
      </div>
    </div>
  </div>
);
LabelCustomizado.storyName = 'Labels customizados';

// ─── Step customizado ─────────────────────────────────────────────────────────

export const StepCustomizado = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>step=1 (padrão)</p>
      <div style={row}>
        <NumberField value={0} step={1} min={0} max={100} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>step=5</p>
      <div style={row}>
        <NumberField value={0} step={5} min={0} max={100} label="Passo 5" onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>step=10</p>
      <div style={row}>
        <NumberField value={0} step={10} min={0} max={100} label="Passo 10" onChange={() => {}} />
      </div>
    </div>
  </div>
);
StepCustomizado.storyName = 'Step customizado';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [qty,   setQty]   = useState(0);
  const [pages, setPages] = useState(1);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado — interativo</p>
        <div style={row}>
          <NumberField
            label="Qtde."
            value={qty}
            min={0}
            max={99}
            onChange={setQty}
          />
          <NumberField
            label="Páginas"
            value={pages}
            min={1}
            max={50}
            layout="side"
            onChange={setPages}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Qtde.: {qty} | Páginas: {pages}
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Horizontal</p>
      <div style={row}>
        <NumberField value={0}  min={0} max={10} onChange={() => {}} />
        <NumberField value={5}  min={0} max={10} onChange={() => {}} />
        <NumberField value={10} min={0} max={10} onChange={() => {}} />
        <NumberField value={3}  disabled          onChange={() => {}} />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Side</p>
      <div style={row}>
        <NumberField value={0}  min={0} max={10} layout="side" onChange={() => {}} />
        <NumberField value={5}  min={0} max={10} layout="side" onChange={() => {}} />
        <NumberField value={10} min={0} max={10} layout="side" onChange={() => {}} />
        <NumberField value={3}  disabled          layout="side" onChange={() => {}} />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
