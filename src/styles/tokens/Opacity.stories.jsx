import React from 'react';
import { opacity } from './opacity';
import { colors } from './colors';

export default {
  title: '00-Tokens/Opacity',
  parameters: { layout: 'padded' },
};

const styles = {
  page:         { padding: 48, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 34, fontWeight: 500, color: '#212121', marginBottom: 8 },
  sectionDesc:  { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121', marginBottom: 48 },
  group:        { marginBottom: 48 },
  groupLabel:   { fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 },
  grid:         { display: 'flex', flexWrap: 'wrap', gap: 32 },
  item:         { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  swatch:       { width: 128, height: 128, borderRadius: 8, position: 'relative', overflow: 'hidden', backgroundColor: '#E0E0E0' },
  overlay:      { position: 'absolute', inset: 0, backgroundColor: colors.primary.dark },
  label:        { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121' },
  token:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
  value:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
};

const levelTokens = [
  { name: 'Semi-opaque', key: 'level-semiopaque', token: '$opac-level-semiopaque' },
  { name: 'Intense',     key: 'level-intense',    token: '$opac-level-intense'    },
  { name: 'Medium',      key: 'level-medium',     token: '$opac-level-medium'     },
  { name: 'Disable',     key: 'disable',          token: '$opac-disable'          },
];

const darkBgTokens = [
  { name: 'Dark-active',   key: 'bg-dark-active',   token: '$opac-bg-dark-active'   },
  { name: 'Dark-selected', key: 'bg-dark-selected',  token: '$opac-bg-dark-selected' },
  { name: 'Dark-hover',    key: 'bg-dark-hover',     token: '$opac-bg-dark-hover'    },
];

function OpacityItem({ name, tokenKey, token }) {
  const value = opacity[tokenKey];
  return (
    <div style={styles.item}>
      <div style={styles.swatch}>
        <div style={{ ...styles.overlay, opacity: value }} />
      </div>
      <span style={styles.label}>{name}</span>
      <span style={styles.token}>{token}</span>
      <span style={styles.value}>O: {value.toFixed(2)}</span>
    </div>
  );
}

export const NiveisDeOpacidade = () => (
  <div style={styles.page}>
    <p style={styles.sectionTitle}>Opacity</p>
    <p style={styles.sectionDesc}>Variáveis que permitem determinar o nível de opacidade de um elemento.</p>

    <div style={styles.group}>
      <p style={styles.groupLabel}>Níveis de opacidade</p>
      <div style={styles.grid}>
        {levelTokens.map(({ name, key, token }) => (
          <OpacityItem key={key} name={name} tokenKey={key} token={token} />
        ))}
      </div>
    </div>

    <div style={styles.group}>
      <p style={styles.groupLabel}>Background dark (estados)</p>
      <div style={styles.grid}>
        {darkBgTokens.map(({ name, key, token }) => (
          <OpacityItem key={key} name={name} tokenKey={key} token={token} />
        ))}
      </div>
    </div>
  </div>
);

NiveisDeOpacidade.storyName = 'Níveis de opacidade';
