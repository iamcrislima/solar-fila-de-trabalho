import type { CSSProperties } from 'react';
import { typography } from '@/styles/tokens/typography';
import { colors }     from '@/styles/tokens/colors';

export default {
  title: '00-Foundations/Typography',
  parameters: { layout: 'padded' },
};

const page:    CSSProperties = { padding: 32, backgroundColor: '#FAFAFA', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40 };
const section: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const heading: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: '#212121', margin: 0, textTransform: 'uppercase', letterSpacing: 1 };
const note:    CSSProperties = { fontFamily: 'monospace', fontSize: 11, color: colors.surface.medium };
const sample = 'O sistema SolarBPM oferece uma visão completa.';
const sampleShort = 'Licenciamento Ambiental';

// ─── Estilos tipográficos ─────────────────────────────────────────────────────

export const Estilos = () => (
  <div style={page}>

    <div style={section}>
      <p style={heading}>Display</p>
      {(['display1', 'display1Strong', 'display2', 'display2Strong', 'display3', 'display3Strong', 'display4', 'display4Strong'] as const).map(k => (
        <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 8 }}>
          <code style={{ ...note, width: 160, flexShrink: 0 }}>{k}</code>
          <span style={{ ...typography.styles[k], color: colors.surface.dark }}>Aa</span>
          <span style={note}>{typography.styles[k].fontFamily.split(',')[0]} · {typography.styles[k].fontSize} · w{typography.styles[k].fontWeight}</span>
        </div>
      ))}
    </div>

    <div style={section}>
      <p style={heading}>Títulos</p>
      {(['title1', 'title1Strong', 'title2', 'title2Strong'] as const).map(k => (
        <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 8 }}>
          <code style={{ ...note, width: 160, flexShrink: 0 }}>{k}</code>
          <span style={{ ...typography.styles[k], color: colors.surface.dark }}>{sampleShort}</span>
          <span style={note}>{typography.styles[k].fontFamily.split(',')[0]} · {typography.styles[k].fontSize} · w{typography.styles[k].fontWeight}</span>
        </div>
      ))}
    </div>

    <div style={section}>
      <p style={heading}>Subtítulos</p>
      {(['subtitle1', 'subtitle2'] as const).map(k => (
        <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 8 }}>
          <code style={{ ...note, width: 160, flexShrink: 0 }}>{k}</code>
          <span style={{ ...typography.styles[k], color: colors.surface.dark }}>{sampleShort}</span>
          <span style={note}>{typography.styles[k].fontFamily.split(',')[0]} · {typography.styles[k].fontSize} · w{typography.styles[k].fontWeight}</span>
        </div>
      ))}
    </div>

    <div style={section}>
      <p style={heading}>Body</p>
      {(['body1', 'body1Bold', 'body1Link', 'body2', 'body2Bold', 'body2Link'] as const).map(k => (
        <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 8 }}>
          <code style={{ ...note, width: 160, flexShrink: 0 }}>{k}</code>
          <span style={{ ...typography.styles[k], color: colors.surface.dark }}>{sample}</span>
          <span style={note}>{typography.styles[k].fontFamily.split(',')[0]} · {typography.styles[k].fontSize} · w{typography.styles[k].fontWeight}</span>
        </div>
      ))}
    </div>

    <div style={section}>
      <p style={heading}>Auxiliares</p>
      {(['button', 'buttonSemiBold', 'caption', 'captionBold', 'captionLink', 'overline', 'overlineBold', 'overlineUpper', 'topIcon'] as const).map(k => (
        <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #F0F0F0', paddingBottom: 8 }}>
          <code style={{ ...note, width: 160, flexShrink: 0 }}>{k}</code>
          <span style={{ ...typography.styles[k], color: colors.surface.dark }}>{sampleShort}</span>
          <span style={note}>{typography.styles[k].fontFamily.split(',')[0]} · {typography.styles[k].fontSize} · w{typography.styles[k].fontWeight}</span>
        </div>
      ))}
    </div>

    <div style={section}>
      <p style={heading}>Font families</p>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div>
          <p style={note}>typography.fontFamily.primary</p>
          <p style={{ fontFamily: typography.fontFamily.primary, fontSize: 24, color: colors.surface.dark, margin: '4px 0 0' }}>Open Sans — Aa Bb Cc 123</p>
        </div>
        <div>
          <p style={note}>typography.fontFamily.secondary</p>
          <p style={{ fontFamily: typography.fontFamily.secondary, fontSize: 24, color: colors.surface.dark, margin: '4px 0 0' }}>Montserrat — Aa Bb Cc 123</p>
        </div>
      </div>
    </div>

  </div>
);
Estilos.storyName = 'Estilos tipográficos';
