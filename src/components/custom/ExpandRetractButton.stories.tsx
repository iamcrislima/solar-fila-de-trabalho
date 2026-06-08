import type { CSSProperties } from 'react';
import { useState } from 'react';
import { ExpandRetractButton } from './ExpandRetractButton';
import { colors } from '@/styles/tokens/colors';

export default {
  title: '03-Custom/WorkQueue/ExpandRetractButton',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row:   CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };

// ─── Estados ─────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Expandir (expanded=false — ícone de grade compacta)</p>
      <div style={row}>
        <ExpandRetractButton expanded={false} label="Expandir/Retrair" onClick={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={label}>Retrair (expanded=true — ícone de grade expandida)</p>
      <div style={row}>
        <ExpandRetractButton expanded={true} label="Expandir/Retrair" onClick={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={label}>Estado active sobrepõe expanded</p>
      <div style={row}>
        <ExpandRetractButton expanded={false} active={true}  label="Ativo"   activeColor={colors.primary.main}  />
        <ExpandRetractButton expanded={false} active={false} label="Inativo" inactiveColor={colors.surface.medium} />
      </div>
    </div>

    <div style={group}>
      <p style={label}>Cores customizadas</p>
      <div style={row}>
        <ExpandRetractButton expanded={false} activeColor={colors.primary.main}   label="Cor primária" />
        <ExpandRetractButton expanded={true}  activeColor={colors.support.main}   label="Cor suporte" />
        <ExpandRetractButton expanded={false} activeColor={colors.success.main}   label="Cor sucesso" />
      </div>
    </div>
  </div>
);
Estados.storyName = 'Estados';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Toggle interativo — estado atual: {expanded ? 'expandido' : 'retraído'}</p>
        <div style={row}>
          <ExpandRetractButton
            expanded={expanded}
            label="Expandir/Retrair"
            onClick={() => setExpanded(v => !v)}
          />
        </div>
        <p style={{ fontFamily: "'Open Sans'", fontSize: 12, color: '#9E9E9E', margin: 0 }}>
          Passe o mouse sobre o botão para ver o tooltip.
        </p>
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';
