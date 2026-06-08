import React from 'react';
import { size } from './size';

export default {
  title: '00-Tokens/Size',
  parameters: { layout: 'padded' },
};

const styles = {
  page:         { padding: 48, backgroundColor: '#FAFAFA', minHeight: '100vh' },
  sectionTitle: { fontFamily: "'Montserrat', sans-serif", fontSize: 34, fontWeight: 500, color: '#212121', marginBottom: 8 },
  sectionDesc:  { fontFamily: "'Montserrat', sans-serif", fontSize: 20, fontWeight: 600, color: '#212121', marginBottom: 40 },
  row:          { display: 'flex', flexDirection: 'column', gap: 8 },
  item:         { display: 'flex', alignItems: 'center', gap: 16 },
  barWrap:      { flex: 1, maxWidth: 1196 },
  bar:          { height: 40, backgroundColor: '#FFFFFF', border: '1px solid #9E9E9E', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 12 },
  barLabel:     { fontFamily: "'Open Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#616161' },
  meta:         { fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#9E9E9E', width: 300, flexShrink: 0 },
};

const tokens = [
  { name: 'Max',    key: 'max',     token: '$container-width-max'    },
  { name: 'Card',   key: 'card',    token: '$container-width-card'   },
  { name: 'Display',key: 'display', token: '$container-width-display'},
  { name: 'Modal',  key: 'modal',   token: '$container-width-modal'  },
  { name: 'XXXL',   key: 'xxxl',    token: '$container-width-xxxl'   },
  { name: 'XXL',    key: 'xxl',     token: '$container-width-xxl'    },
  { name: 'XL',     key: 'xl',      token: '$container-width-xl'     },
  { name: 'LG',     key: 'lg',      token: '$container-width-lg'     },
  { name: 'MD',     key: 'md',      token: '$container-width-md'     },
  { name: 'SM',     key: 'sm',      token: '$container-width-sm'     },
  { name: 'XS',     key: 'xs',      token: '$container-width-xs'     },
  { name: 'XXS',    key: 'xxs',     token: '$container-width-xxs'    },
  { name: 'XXXS',   key: 'xxxs',    token: '$container-width-xxxs'   },
  { name: 'MOBI',   key: 'mobi',    token: '$container-mobi-width'   },
  { name: 'NANO 4', key: 'nano4',   token: '$container-width-nano-4' },
  { name: 'NANO 3', key: 'nano3',   token: '$container-width-nano-3' },
  { name: 'NANO 2', key: 'nano2',   token: '$container-width-nano-2' },
  { name: 'NANO',   key: 'nano',    token: '$container-width-nano'   },
  { name: 'LINE',   key: 'line',    token: '$container-width-line'   },
  { name: 'ATM',    key: 'atm',     token: '$container-width-atm'    },
];

export const TamanhosDeContainer = () => (
  <div style={styles.page}>
    <p style={styles.sectionTitle}>Size</p>
    <p style={styles.sectionDesc}>
      Sugestão de tamanhos para aplicações em Desktops referenciados em 1360/1440px de largura.
      Para Mobile considere tanto o design responsivo quanto o adaptativo.
    </p>
    <div style={styles.row}>
      {tokens.map(({ name, key, token }) => {
        const value = size.container[key];
        return (
          <div key={key} style={styles.item}>
            <div style={styles.barWrap}>
              <div style={{ ...styles.bar, width: value }}>
                <span style={styles.barLabel}>{name}</span>
              </div>
            </div>
            <span style={styles.meta}>{token} / {value}</span>
          </div>
        );
      })}
    </div>
  </div>
);

TamanhosDeContainer.storyName = 'Tamanhos de container';
