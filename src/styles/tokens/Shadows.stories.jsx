import React from 'react';
import { shadows } from './shadows';

export default {
  title: '00-Tokens/Shadows',
  parameters: { layout: 'padded' },
};

const styles = {
  page:         { padding: 48, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 34, fontWeight: 500, color: '#212121', marginBottom: 8 },
  sectionDesc:  { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121', marginBottom: 48 },
  grid:         { display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-end' },
  item:         { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  label:        { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121' },
  token:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
  meta:         { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
};

const tokens = [
  {
    name:  'Level A',
    key:   'levelA',
    token: '$shadow-level-A',
    meta:  ['X: 0', 'Y: 0', 'B: 0', 'Spread: 2', 'O: 0.24', '#000000'],
  },
  {
    name:  'Level 1',
    key:   'level1',
    token: '$shadow-level-1',
    meta:  ['X: 0', 'Y: 2', 'B: 4', 'O: 0.24', '#000000'],
  },
  {
    name:  'Level 2',
    key:   'level2',
    token: '$shadow-level-2',
    meta:  ['X: 0', 'Y: 4', 'B: 8', 'O: 0.32', '#000000'],
  },
  {
    name:  'Level 3',
    key:   'level3',
    token: '$shadow-level-3',
    meta:  ['X: 0', 'Y: 8', 'B: 24', 'O: 0.40', '#000000'],
  },
  {
    name:  'Level 4',
    key:   'level4',
    token: '$shadow-level-4',
    meta:  ['X: 0', 'Y: 16', 'B: 32', 'O: 0.64', '#000000'],
  },
];

export const NiveisDeSombra = () => (
  <div style={styles.page}>
    <p style={styles.sectionTitle}>Shadow</p>
    <p style={styles.sectionDesc}>Variáveis que definem os níveis de sombra em profundidade (z-index).</p>
    <div style={styles.grid}>
      {tokens.map(({ name, key, token, meta }) => (
        <div key={key} style={styles.item}>
          <div style={{
            width:           160,
            height:          160,
            backgroundColor: '#FFFFFF',
            borderRadius:    8,
            boxShadow:       shadows[key],
          }} />
          <span style={styles.label}>{name}</span>
          <span style={styles.token}>{token}</span>
          {meta.map((line) => (
            <span key={line} style={styles.meta}>{line}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

NiveisDeSombra.storyName = 'Níveis de sombra';
