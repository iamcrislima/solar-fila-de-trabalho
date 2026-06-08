import React from 'react';
import { typography } from './typography';

export default {
  title: '00-Tokens/Typography',
  parameters: { layout: 'padded' },
};

const styles = {
  page: { padding: 24, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  section: { marginBottom: 48 },
  sectionTitle: { fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  row: { display: 'flex', alignItems: 'baseline', gap: 32, padding: '12px 0', borderBottom: '1px solid #E0E0E0' },
  meta: { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E', minWidth: 280, flexShrink: 0 },
};

function TypeRow({ label, style }) {
  return (
    <div style={styles.row}>
      <span style={styles.meta}>
        {style.fontSize} / {style.fontWeight} / lh {style.lineHeight}
      </span>
      <span style={style}>{label}</span>
    </div>
  );
}

export const EscalaTipografica = () => (
  <div style={styles.page}>
    <div style={styles.section}>
      <p style={styles.sectionTitle}>Display — Open Sans / Montserrat</p>
      <TypeRow label="Display 1 / Montserrat (Light)" style={typography.styles.display1} />
      <TypeRow label="Display 1 Strong / Open Sans (ExtraBold)" style={typography.styles.display1Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Display 2 — Montserrat</p>
      <TypeRow label="Display 2 / Montserrat (Regular)" style={typography.styles.display2} />
      <TypeRow label="Display 2 Strong / Montserrat (ExtraBold)" style={typography.styles.display2Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Display 3 — Montserrat</p>
      <TypeRow label="Display 3 / Montserrat (Medium)" style={typography.styles.display3} />
      <TypeRow label="Display 3 Strong / Montserrat (Black)" style={typography.styles.display3Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Display 4 — Montserrat</p>
      <TypeRow label="Display 4 / Montserrat (Medium)" style={typography.styles.display4} />
      <TypeRow label="Display 4 Strong / Montserrat (ExtraBold)" style={typography.styles.display4Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Title 1 — Montserrat</p>
      <TypeRow label="Title 1 / Montserrat (SemiBold)" style={typography.styles.title1} />
      <TypeRow label="Title 1 Strong / Montserrat (ExtraBold)" style={typography.styles.title1Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Title 2 — Montserrat</p>
      <TypeRow label="Title 2 / Montserrat (SemiBold)" style={typography.styles.title2} />
      <TypeRow label="Title 2 Strong / Montserrat (Bold)" style={typography.styles.title2Strong} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Subtitle — Montserrat</p>
      <TypeRow label="Subtitle 1 / Montserrat (SemiBold)" style={typography.styles.subtitle1} />
      <TypeRow label="Subtitle 2 / Montserrat (SemiBold)" style={typography.styles.subtitle2} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Body — Open Sans</p>
      <TypeRow label="Body 1 / Open Sans (Regular)" style={typography.styles.body1} />
      <TypeRow label="Body 2 / Open Sans (Regular)" style={typography.styles.body2} />
    </div>

    <div style={styles.section}>
      <p style={styles.sectionTitle}>Auxiliares</p>
      <TypeRow label="Button / Montserrat (Medium)" style={typography.styles.button} />
      <TypeRow label="Caption / Open Sans (Regular)" style={typography.styles.caption} />
      <TypeRow label="Overline / Montserrat (Regular)" style={typography.styles.overline} />
      <TypeRow label="Top Icon / Open Sans (Bold)" style={typography.styles.topIcon} />
    </div>
  </div>
);

EscalaTipografica.storyName = 'Escala tipográfica';
