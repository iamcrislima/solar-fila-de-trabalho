import React from 'react';
import { borders } from './borders';

export default {
  title: '00-Tokens/Borders',
  parameters: { layout: 'padded' },
};

const styles = {
  page:         { padding: 24, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  section:      { marginBottom: 56 },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 34, fontWeight: 500, color: '#212121', marginBottom: 8 },
  sectionDesc:  { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121', marginBottom: 32 },
  grid:         { display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-end' },
  item:         { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  label:        { fontFamily: 'sans-serif', fontSize: 11, fontWeight: 700, color: '#212121' },
  token:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
  value:        { fontFamily: 'monospace', fontSize: 11, color: '#9E9E9E' },
  divider:      { border: 'none', borderTop: '1px solid #E0E0E0', margin: '40px 0' },
};

const SWATCH_SIZE = 100;

const radiusTokens = [
  { name: 'None',     key: 'none',     token: '$border-radius-none',     value: '0px'   },
  { name: 'SM',       key: 'sm',       token: '$border-radius-sm',       value: '2px'   },
  { name: 'MD',       key: 'md',       token: '$border-radius-md',       value: '4px'   },
  { name: 'LG',       key: 'lg',       token: '$border-radius-lg',       value: '8px'   },
  { name: 'XL',       key: 'xl',       token: '$border-radius-xl',       value: '12px'  },
  { name: 'XXL',      key: 'xxl',      token: '$border-radius-xxl',      value: '16px'  },
  { name: 'Pill',     key: 'pill',     token: '$border-radius-pill',     value: '492px' },
  { name: 'Circular', key: 'circular', token: '$border-radius-circular', value: '980px' },
];

const widthTokens = [
  { name: 'SM', key: 'sm', token: '$border-size-sm', value: '1px' },
  { name: 'MD', key: 'md', token: '$border-size-md', value: '2px' },
  { name: 'LG', key: 'lg', token: '$border-size-lg', value: '4px' },
  { name: 'XL', key: 'xl', token: '$border-size-xl', value: '8px' },
];

const dashedTokens = [
  { name: 'Dashed SM', key: 'sm', token: '$border-dashed-sm', value: '1px dash: 4 gap: 2' },
  { name: 'Dashed MD', key: 'md', token: '$border-dashed-md', value: '2px dash: 8 gap: 4' },
];

export const Bordas = () => (
  <div style={styles.page}>

    {/* Border Radius */}
    <div style={styles.section}>
      <p style={styles.sectionTitle}>Border Radius</p>
      <p style={styles.sectionDesc}>Variáveis que definem as bordas de formas e elementos.</p>
      <div style={styles.grid}>
        {radiusTokens.map(({ name, key, token, value }) => (
          <div key={key} style={styles.item}>
            <div style={{
              width:           SWATCH_SIZE,
              height:          SWATCH_SIZE,
              backgroundColor: '#006064',
              borderRadius:    borders.radius[key],
            }} />
            <span style={styles.label}>{name}</span>
            <span style={styles.token}>{token}</span>
            <span style={styles.value}>{value}</span>
          </div>
        ))}
      </div>
    </div>

    <hr style={styles.divider} />

    {/* Border Width */}
    <div style={styles.section}>
      <p style={styles.sectionTitle}>Border Width</p>
      <p style={styles.sectionDesc}>Variáveis usadas para especificar a espessura de borda dos elementos.</p>
      <div style={styles.grid}>
        {widthTokens.map(({ name, key, token, value }) => (
          <div key={key} style={styles.item}>
            <div style={{
              width:        SWATCH_SIZE,
              height:       SWATCH_SIZE,
              border:       `${borders.width[key]} solid #212121`,
              borderRadius: borders.radius.lg,
              backgroundColor: '#FAFAFA',
            }} />
            <span style={styles.label}>{name}</span>
            <span style={styles.token}>{token}</span>
            <span style={styles.value}>{value}</span>
          </div>
        ))}

        {dashedTokens.map(({ name, key, token, value }) => {
          const { width, dash, gap } = borders.dashed[key];
          return (
            <div key={key} style={styles.item}>
              <div style={{
                width:        SWATCH_SIZE,
                height:       SWATCH_SIZE,
                border:       `${width} dashed #212121`,
                borderRadius: borders.radius.lg,
                backgroundColor: '#FAFAFA',
                backgroundImage: `repeating-linear-gradient(90deg, #212121 0, #212121 ${dash}px, transparent ${dash}px, transparent ${dash + gap}px)`,
              }} />
              <span style={styles.label}>{name}</span>
              <span style={styles.token}>{token}</span>
              <span style={styles.value}>{value}</span>
            </div>
          );
        })}
      </div>
    </div>

  </div>
);

Bordas.storyName = 'Borders';
