import type { CSSProperties } from 'react';
import { TruncatedText } from './TruncatedText';
import { colors }        from '@/styles/tokens/colors';
import { typography }    from '@/styles/tokens/typography';

export default {
  title: '01-DS/Atoms/TruncatedText',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const note:  CSSProperties = { fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#9E9E9E', margin: 0 };

const box = (width: number | string): CSSProperties => ({
  width,
  border: '1px dashed #E0E0E0',
  borderRadius: 4,
  padding: '4px 8px',
  boxSizing: 'border-box',
  backgroundColor: colors.surface.xxxl,
});

// ─── Estático (Figma) ─────────────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Truncamento por largura — passe o mouse para ver o hint</p>
      <p style={note}>O hint só aparece quando o texto está realmente truncado (scrollWidth {'>'} clientWidth).</p>

      {([120, 200, 320, 500] as const).map(w => (
        <div key={w} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ ...typography.styles.caption, color: colors.surface.medium, width: 40, flexShrink: 0 }}>{w}px</span>
          <div style={box(w)}>
            <TruncatedText
              text="Processo de Licenciamento Ambiental nº 2024/000123-SEMA"
              style={{ ...typography.styles.body2, color: colors.surface.dark }}
            />
          </div>
        </div>
      ))}
    </div>

    <div style={group}>
      <p style={label}>Texto que cabe — hint não dispara</p>
      <div style={box(400)}>
        <TruncatedText
          text="Texto curto"
          style={{ ...typography.styles.body2, color: colors.surface.dark }}
        />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Como elemento ────────────────────────────────────────────────────────────

export const ComoElemento = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Como diferentes elementos HTML</p>
      <p style={note}>Prop `as` define o elemento renderizado. Padrão: span.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(['span', 'p', 'h3', 'button', 'div'] as const).map(el => (
          <div key={el} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <code style={{ fontFamily: 'monospace', fontSize: 12, color: colors.surface.medium, width: 56, flexShrink: 0 }}>{`<${el}>`}</code>
            <div style={box(240)}>
              <TruncatedText
                as={el}
                text="Texto truncado com ellipsis aqui"
                style={{ ...typography.styles.body2, color: colors.surface.dark, all: 'unset', display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
ComoElemento.storyName = 'Como elemento (prop `as`)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Cenários reais de uso</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ ...note, marginBottom: 4 }}>Número de processo (240px)</p>
          <div style={box(240)}>
            <TruncatedText text="2024/001234-SEMA/PA" style={{ ...typography.styles.subtitle2, color: colors.primary.main }} />
          </div>
        </div>

        <div>
          <p style={{ ...note, marginBottom: 4 }}>Nome de usuário (180px)</p>
          <div style={box(180)}>
            <TruncatedText text="Maria Aparecida de Souza Ferreira" style={{ ...typography.styles.body2, color: colors.surface.dark }} />
          </div>
        </div>

        <div>
          <p style={{ ...note, marginBottom: 4 }}>Classificação do processo (320px)</p>
          <div style={box(320)}>
            <TruncatedText text="Licenciamento Ambiental — Atividade Industrial de Grande Porte — Fase de Instalação" style={{ ...typography.styles.body2, color: colors.surface.dark }} />
          </div>
        </div>

        <div>
          <p style={{ ...note, marginBottom: 4 }}>Com hint customizado</p>
          <div style={box(200)}>
            <TruncatedText
              text="Texto com hint diferente"
              hint="Este é o hint completo, independente do texto exibido"
              style={{ ...typography.styles.body2, color: colors.surface.dark }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
