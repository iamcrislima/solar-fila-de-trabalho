import React from 'react';
import { spacing } from './spacing';

export default {
  title: '00-Tokens/Spacing',
  parameters: { layout: 'padded' },
};

const styles = {
  page:         { padding: 24, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  section:      { marginBottom: 48 },
  sectionTitle: { fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  grid:         { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end' },
  item:         { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 },
  label:        { fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700, color: '#212121' },
  token:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
  value:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
};

const tokens = [
  { name: 'Giant',  key: 'giant',  token: '$spacing-giant',  px: '160px', rem: '10rem' },
  { name: 'Huge',   key: 'huge',   token: '$spacing-huge',   px: '128px', rem: '8rem'  },
  { name: 'XXXL',   key: 'xxxl',   token: '$spacing-xxxl',   px: '80px',  rem: '5rem'  },
  { name: 'XXL',    key: 'xxl',    token: '$spacing-xxl',    px: '64px',  rem: '4rem'  },
  { name: 'XL',     key: 'xl',     token: '$spacing-xl',     px: '40px',  rem: '2.5rem'},
  { name: 'LG',     key: 'lg',     token: '$spacing-lg',     px: '32px',  rem: '2rem'  },
  { name: 'MD',     key: 'md',     token: '$spacing-md',     px: '24px',  rem: '1.5rem'},
  { name: 'SM',     key: 'sm',     token: '$spacing-sm',     px: '16px',  rem: '1rem'  },
  { name: 'BT 3',   key: 'bt-3',   token: '$spacing-bt-3',   px: '12px',  rem: '0.75rem'},
  { name: 'BT 2',   key: 'bt-2',   token: '$spacing-bt-2',   px: '10px',  rem: '0.625rem'},
  { name: 'XS',     key: 'xs',     token: '$spacing-xs',     px: '8px',   rem: '0.5rem'},
  { name: 'BT',     key: 'bt',     token: '$spacing-bt',     px: '6px',   rem: '0.375rem'},
  { name: 'XXS',    key: 'xxs',    token: '$spacing-xxs',    px: '4px',   rem: '0.25rem'},
  { name: 'XXXS',   key: 'xxxs',   token: '$spacing-xxxs',   px: '2px',   rem: '0.125rem'},
];

export const EscalaDeEspacamento = () => (
  <div style={styles.page}>
    <div style={styles.section}>
      <p style={styles.sectionTitle}>Spacing — escala completa</p>
      <div style={styles.grid}>
        {tokens.map(({ name, key, token, px, rem }) => (
          <div key={key} style={styles.item}>
            <div style={{
              width:           spacing[key],
              height:          spacing[key],
              backgroundColor: '#006064',
              minWidth:        '2px',
              minHeight:       '2px',
            }} />
            <span style={styles.label}>{name}</span>
            <span style={styles.token}>{token}</span>
            <span style={styles.value}>{px} ({rem})</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

EscalaDeEspacamento.storyName = 'Escala de espaçamento';
