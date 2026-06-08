import type { CSSProperties } from 'react';
import { shadows } from '@/styles/tokens/shadows';
import { borders } from '@/styles/tokens/borders';
import { opacity } from '@/styles/tokens/opacity';
import { colors }  from '@/styles/tokens/colors';

export default {
  title: '00-Foundations/Shadows & Borders',
  parameters: { layout: 'padded' },
};

const page:    CSSProperties = { padding: 32, backgroundColor: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const section: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const heading: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#212121', margin: 0, textTransform: 'uppercase', letterSpacing: 1 };
const note:    CSSProperties = { fontFamily: 'monospace', fontSize: 11, color: colors.surface.medium };
const row:     CSSProperties = { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' };

// ─── Tokens ───────────────────────────────────────────────────────────────────

export const Tokens = () => (
  <div style={page}>

    <div style={section}>
      <p style={heading}>Shadows</p>
      <div style={row}>
        {Object.entries(shadows).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 80, height: 56, backgroundColor: colors.surface.xxxl, borderRadius: 8, boxShadow: v }} />
            <code style={note}>shadows.{k}</code>
          </div>
        ))}
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Border Radius</p>
      <div style={row}>
        {Object.entries(borders.radius).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 64, height: 48, backgroundColor: colors.primary.xxl, border: `2px solid ${colors.primary.main}`, borderRadius: v }} />
            <code style={note}>radius.{k}</code>
            <code style={note}>{v}</code>
          </div>
        ))}
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Border Width</p>
      <div style={row}>
        {Object.entries(borders.width).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 80, height: 48, backgroundColor: colors.surface.xxxl, border: `${v} solid ${colors.primary.main}` }} />
            <code style={note}>width.{k}</code>
            <code style={note}>{v}</code>
          </div>
        ))}
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Opacity</p>
      <div style={row}>
        {Object.entries(opacity).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 56, height: 40, backgroundColor: colors.primary.main, opacity: v, borderRadius: 4 }} />
            <code style={note}>opacity</code>
            <code style={note}>'{k}'</code>
            <code style={note}>{v}</code>
          </div>
        ))}
      </div>
    </div>

  </div>
);
Tokens.storyName = 'Shadows, Borders & Opacity';
