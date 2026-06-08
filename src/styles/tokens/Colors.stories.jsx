import React from 'react';
import { colors } from './colors';

export default {
  title: '00-Tokens/Colors',
  parameters: { layout: 'padded' },
};

function Swatch({ name, hex, textColor = '#212121' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 160 }}>
      <div
        style={{
          backgroundColor: hex,
          width: 160,
          height: 80,
          borderRadius: 8,
          boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.24)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 8,
        }}
      >
        <span style={{ color: textColor, fontSize: 11, fontFamily: 'monospace' }}>{hex}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#212121' }}>{name}</span>
    </div>
  );
}

function Group({ title, swatches }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'sans-serif', fontSize: 20, marginBottom: 16, color: '#212121' }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {swatches.map((s) => (
          <Swatch key={s.name} {...s} />
        ))}
      </div>
    </div>
  );
}

export const AllColors = () => (
  <div style={{ padding: 24, backgroundColor: '#fafafa', minHeight: '100vh' }}>
    <Group
      title="Cor primária"
      swatches={[
        { name: 'Primary Dark',   hex: colors.primary.dark,   textColor: '#FAFAFA' },
        { name: 'Primary Main',   hex: colors.primary.main,   textColor: '#FAFAFA' },
        { name: 'Primary Medium', hex: colors.primary.medium, textColor: '#FAFAFA' },
        { name: 'Primary Light',  hex: colors.primary.light,  textColor: '#212121' },
        { name: 'Primary XL',     hex: colors.primary.xl,     textColor: '#212121' },
        { name: 'Primary XXL',    hex: colors.primary.xxl,    textColor: '#212121' },
      ]}
    />
    <Group
      title="Cor secundária"
      swatches={[
        { name: 'Secondary Dark',   hex: colors.secondary.dark,   textColor: '#FAFAFA' },
        { name: 'Secondary Main',   hex: colors.secondary.main,   textColor: '#FAFAFA' },
        { name: 'Secondary Medium', hex: colors.secondary.medium, textColor: '#FAFAFA' },
        { name: 'Secondary Light',  hex: colors.secondary.light,  textColor: '#212121' },
        { name: 'Secondary XL',     hex: colors.secondary.xl,     textColor: '#212121' },
        { name: 'Secondary XXL',    hex: colors.secondary.xxl,    textColor: '#212121' },
      ]}
    />
    <Group
      title="Cor de superfície"
      swatches={[
        { name: 'Surface Dark',   hex: colors.surface.dark,   textColor: '#FAFAFA' },
        { name: 'Surface Main',   hex: colors.surface.main,   textColor: '#FAFAFA' },
        { name: 'Surface Medium', hex: colors.surface.medium, textColor: '#FAFAFA' },
        { name: 'Surface Light',  hex: colors.surface.light,  textColor: '#212121' },
        { name: 'Surface XL',     hex: colors.surface.xl,     textColor: '#212121' },
        { name: 'Surface XXL',    hex: colors.surface.xxl,    textColor: '#212121' },
        { name: 'Surface XXXL',   hex: colors.surface.xxxl,   textColor: '#212121' },
      ]}
    />
    <Group
      title="Cores de apoio"
      swatches={[
        { name: 'Success Main',  hex: colors.success.main,  textColor: '#FAFAFA' },
        { name: 'Success Light', hex: colors.success.light, textColor: '#212121' },
        { name: 'Warning Main',  hex: colors.warning.main,  textColor: '#212121' },
        { name: 'Warning Light', hex: colors.warning.light, textColor: '#212121' },
        { name: 'Error Main',    hex: colors.error.main,    textColor: '#FAFAFA' },
        { name: 'Error Light',   hex: colors.error.light,   textColor: '#212121' },
      ]}
    />
    <Group
      title="Cores de suporte (especial)"
      swatches={[
        { name: 'Support Main', hex: colors.support.main, textColor: '#FAFAFA' },
      ]}
    />
    <Group
      title="Cor de Superfície Dark Mode"
      swatches={[
        { name: 'Surface DM Dark',   hex: colors.surfaceDM.dark,   textColor: '#FAFAFA' },
        { name: 'Surface DM Main',   hex: colors.surfaceDM.main,   textColor: '#FAFAFA' },
        { name: 'Surface DM Medium', hex: colors.surfaceDM.medium, textColor: '#FAFAFA' },
        { name: 'Surface DM Light',  hex: colors.surfaceDM.light,  textColor: '#FAFAFA' },
        { name: 'Surface DM XL',     hex: colors.surfaceDM.xl,     textColor: '#FAFAFA' },
        { name: 'Surface DM XXL',    hex: colors.surfaceDM.xxl,    textColor: '#212121' },
        { name: 'Surface DM XXXL',   hex: colors.surfaceDM.xxxl,   textColor: '#212121' },
      ]}
    />
  </div>
);

AllColors.storyName = 'Todas as cores';
