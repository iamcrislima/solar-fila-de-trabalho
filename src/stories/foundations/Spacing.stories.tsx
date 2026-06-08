import type { CSSProperties } from 'react';
import { spacing } from '@/styles/tokens/spacing';
import { layout }  from '@/styles/tokens/layout';
import { colors }  from '@/styles/tokens/colors';

export default {
  title: '00-Foundations/Spacing',
  parameters: { layout: 'padded' },
};

const page:    CSSProperties = { padding: 32, backgroundColor: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40 };
const section: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };
const heading: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#212121', margin: 0, textTransform: 'uppercase', letterSpacing: 1 };
const note:    CSSProperties = { fontFamily: 'monospace', fontSize: 11, color: colors.surface.medium };

function SpacingRow({ token, value }: { token: string; value: string }) {
  const px = parseInt(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 6 }}>
      <code style={{ ...note, width: 140, flexShrink: 0 }}>spacing.{token}</code>
      <div style={{ width: px, height: 16, backgroundColor: colors.primary.medium, borderRadius: 2, flexShrink: 0, minWidth: 2 }} />
      <code style={note}>{value}</code>
    </div>
  );
}

function LayoutRow({ token, value }: { token: string; value: string }) {
  const px = parseInt(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 6 }}>
      <code style={{ ...note, width: 200, flexShrink: 0 }}>layout.{token}</code>
      <div style={{ width: px, height: 16, backgroundColor: colors.support.main, borderRadius: 2, flexShrink: 0, minWidth: 2 }} />
      <code style={note}>{value}</code>
    </div>
  );
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

export const Tokens = () => (
  <div style={page}>
    <div style={section}>
      <p style={heading}>Spacing</p>
      {Object.entries(spacing).map(([k, v]) => <SpacingRow key={k} token={k} value={v} />)}
    </div>

    <div style={section}>
      <p style={heading}>Layout (compostos de spacing)</p>
      {Object.entries(layout).filter(([, v]) => typeof v === 'string').map(([k, v]) => (
        <LayoutRow key={k} token={k} value={v as string} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 6 }}>
        <code style={{ ...note, width: 200, flexShrink: 0 }}>layout.radius</code>
        <div style={{ width: 24, height: 24, border: `2px solid ${colors.primary.medium}`, borderRadius: layout.radius, flexShrink: 0 }} />
        <code style={note}>{layout.radius}px</code>
      </div>
    </div>
  </div>
);
Tokens.storyName = 'Spacing & Layout';
