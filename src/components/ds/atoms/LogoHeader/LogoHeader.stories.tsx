import type { CSSProperties } from 'react';
import { LogoHeader } from './LogoHeader';

export default {
  title: '01-DS/Atoms/LogoHeader',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' };
const card  = { backgroundColor: '#FFFFFF', padding: '24px 16px 32px', borderRadius: 4 };
const cardDark = { backgroundColor: '#212121', padding: '24px 16px 32px', borderRadius: 4 };

const ALL_VARIANTS = [
  'Default', 'DM', 'Default Icon', 'DM Icon', 'Icon',
  'Solar BPM', 'Solar BPM DM',
  'Obras.gov', 'Obras.gov DM',
  'GPD', 'GPD DM',
  'GPLA', 'GPLA DM',
  'SAFF', 'SAFF DM',
  'SAJ DEF', 'SAJ DEF DM',
  'SAJ MIN', 'SAJ MIN DM',
  'SAJ PRO', 'SAJ PRO DM',
  'SAJ TRI', 'SAJ TRI DM',
  'SIDER', 'SIDER DM',
  'Placeholder', 'Placeholder DM',
  'Placeholder Icon', 'Placeholder DM Icon',
];

export const LogoHeaderStory = () => (
  <div style={page}>

    <div style={card}>
      <p style={label}>Softplan — Default &amp; Icon</p>
      <div style={row}>
        <LogoHeader variant="Default" />
        <LogoHeader variant="DM" />
        <LogoHeader variant="Default Icon" />
        <LogoHeader variant="DM Icon" />
        <LogoHeader variant="Icon" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>Solar BPM</p>
      <div style={row}>
        <LogoHeader variant="Solar BPM" />
        <LogoHeader variant="Solar BPM DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>Obras.gov</p>
      <div style={row}>
        <LogoHeader variant="Obras.gov" />
        <LogoHeader variant="Obras.gov DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>GPD / GPLA</p>
      <div style={row}>
        <LogoHeader variant="GPD" />
        <LogoHeader variant="GPD DM" />
        <LogoHeader variant="GPLA" />
        <LogoHeader variant="GPLA DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>SAFF / SIDER</p>
      <div style={row}>
        <LogoHeader variant="SAFF" />
        <LogoHeader variant="SAFF DM" />
        <LogoHeader variant="SIDER" />
        <LogoHeader variant="SIDER DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>SAJ</p>
      <div style={row}>
        <LogoHeader variant="SAJ DEF" />
        <LogoHeader variant="SAJ DEF DM" />
        <LogoHeader variant="SAJ MIN" />
        <LogoHeader variant="SAJ MIN DM" />
        <LogoHeader variant="SAJ PRO" />
        <LogoHeader variant="SAJ PRO DM" />
        <LogoHeader variant="SAJ TRI" />
        <LogoHeader variant="SAJ TRI DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>Placeholder — com texto</p>
      <div style={row}>
        <LogoHeader variant="Placeholder" />
        <LogoHeader variant="Placeholder DM" />
      </div>
    </div>

    <div style={card}>
      <p style={label}>Placeholder — ícone</p>
      <div style={row}>
        <LogoHeader variant="Placeholder Icon" />
        <LogoHeader variant="Placeholder DM Icon" />
      </div>
    </div>

    <div style={cardDark}>
      <p style={{ ...label, color: '#9E9E9E' }}>Todos os variantes em fundo escuro</p>
      <div style={row}>
        {ALL_VARIANTS.map(v => (
          <LogoHeader key={v} variant={v} />
        ))}
      </div>
    </div>

  </div>
);
LogoHeaderStory.storyName = 'LogoHeader';
