import type { CSSProperties } from 'react';
import { colors } from '@/styles/tokens/colors';

export default {
  title: '00-Foundations/Colors',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:     CSSProperties = { padding: 32, backgroundColor: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40 };
const section:  CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const heading:  CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#212121', margin: 0, textTransform: 'uppercase', letterSpacing: 1 };
const swatches: CSSProperties = { display: 'flex', gap: 8, flexWrap: 'wrap' };

function Swatch({ token, hex }: { token: string; hex: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, minWidth: 100 }}>
      <div style={{ width: 80, height: 48, borderRadius: 6, backgroundColor: hex, border: '1px solid rgba(0,0,0,0.08)' }} />
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#616161' }}>{token}</span>
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' }}>{hex}</span>
    </div>
  );
}

// ─── Paleta ───────────────────────────────────────────────────────────────────

export const Paleta = () => (
  <div style={page}>

    <div style={section}>
      <p style={heading}>Primary</p>
      <div style={swatches}>
        <Swatch token="colors.primary.dark"   hex={colors.primary.dark} />
        <Swatch token="colors.primary.main"   hex={colors.primary.main} />
        <Swatch token="colors.primary.medium" hex={colors.primary.medium} />
        <Swatch token="colors.primary.light"  hex={colors.primary.light} />
        <Swatch token="colors.primary.xl"     hex={colors.primary.xl} />
        <Swatch token="colors.primary.xxl"    hex={colors.primary.xxl} />
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Secondary</p>
      <div style={swatches}>
        <Swatch token="colors.secondary.dark"   hex={colors.secondary.dark} />
        <Swatch token="colors.secondary.main"   hex={colors.secondary.main} />
        <Swatch token="colors.secondary.medium" hex={colors.secondary.medium} />
        <Swatch token="colors.secondary.light"  hex={colors.secondary.light} />
        <Swatch token="colors.secondary.xl"     hex={colors.secondary.xl} />
        <Swatch token="colors.secondary.xxl"    hex={colors.secondary.xxl} />
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Surface (escalas de cinza)</p>
      <div style={swatches}>
        <Swatch token="colors.surface.dark"   hex={colors.surface.dark} />
        <Swatch token="colors.surface.main"   hex={colors.surface.main} />
        <Swatch token="colors.surface.medium" hex={colors.surface.medium} />
        <Swatch token="colors.surface.light"  hex={colors.surface.light} />
        <Swatch token="colors.surface.xl"     hex={colors.surface.xl} />
        <Swatch token="colors.surface.xxl"    hex={colors.surface.xxl} />
        <Swatch token="colors.surface.xxxl"   hex={colors.surface.xxxl} />
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Surface DM (dark mode)</p>
      <div style={{ ...swatches, backgroundColor: '#111', padding: 12, borderRadius: 8 }}>
        <Swatch token="colors.surfaceDM.dark"   hex={colors.surfaceDM.dark} />
        <Swatch token="colors.surfaceDM.main"   hex={colors.surfaceDM.main} />
        <Swatch token="colors.surfaceDM.medium" hex={colors.surfaceDM.medium} />
        <Swatch token="colors.surfaceDM.light"  hex={colors.surfaceDM.light} />
        <Swatch token="colors.surfaceDM.xl"     hex={colors.surfaceDM.xl} />
        <Swatch token="colors.surfaceDM.xxl"    hex={colors.surfaceDM.xxl} />
        <Swatch token="colors.surfaceDM.xxxl"   hex={colors.surfaceDM.xxxl} />
      </div>
    </div>

    <div style={section}>
      <p style={heading}>Semânticas</p>
      <div style={swatches}>
        <Swatch token="colors.error.main"    hex={colors.error.main} />
        <Swatch token="colors.error.light"   hex={colors.error.light} />
        <Swatch token="colors.warning.main"  hex={colors.warning.main} />
        <Swatch token="colors.warning.light" hex={colors.warning.light} />
        <Swatch token="colors.success.main"  hex={colors.success.main} />
        <Swatch token="colors.success.light" hex={colors.success.light} />
        <Swatch token="colors.support.main"  hex={colors.support.main} />
      </div>
    </div>

  </div>
);
Paleta.storyName = 'Paleta completa';
