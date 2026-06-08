import type { CSSProperties } from 'react';
import { useState } from 'react';
import { InputOrdering } from '.';

export default {
  title: '01-DS/Atoms/InputOrdering',
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
      <p style={sectionLabel}>Exatamente como no Figma</p>
      <div style={row}>
        <InputOrdering label="Ordenar por:" value="Data decrescente" />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Exemplos de uso ──────────────────────────────────────────────────────────

export const ExemplosDeUso = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Variações de label e valor</p>
      <div style={row}>
        <InputOrdering label="Ordenar por:" value="Data decrescente" />
        <InputOrdering label="Ordenar por:" value="Nome (A → Z)" />
        <InputOrdering label="Ordenar por:" value="Valor crescente" />
        <InputOrdering label="Filtrar por:" value="Todos os status" />
      </div>
    </div>
  </div>
);
ExemplosDeUso.storyName = 'Exemplos de uso';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const OPCOES = ['Data decrescente', 'Data crescente', 'Nome (A → Z)', 'Nome (Z → A)', 'Valor crescente'];
  const [idx, setIdx] = useState(0);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Clique para alternar a ordenação</p>
        <div style={row}>
          <InputOrdering
            label="Ordenar por:"
            value={OPCOES[idx]}
            onClick={() => setIdx(i => (i + 1) % OPCOES.length)}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Selecionado: "{OPCOES[idx]}"
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
      <InputOrdering label="Ordenar por:" value="Data decrescente" />
      <InputOrdering label="Ordenar por:" value="Nome (A → Z)" />
      <InputOrdering label="Filtrar:" value="Status ativo" />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
