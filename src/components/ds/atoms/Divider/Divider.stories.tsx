import type { CSSProperties } from 'react';
import { DividerH, DividerV } from '.';

export default {
  title: '01-DS/Atoms/Divider',
  parameters: { layout: 'padded' },
};

const page = { padding: 32, backgroundColor: '#FAFAFA' };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#9E9E9E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 };
const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32 };
// ─── Divider H ───────────────────────────────────────────────────────────────

export const DividerHDefault = () => (
  <div style={page}>
    <p style={label}>DividerH — Default</p>
    <DividerH variant="default" />
  </div>
);
DividerHDefault.storyName = 'DividerH / Default';

export const DividerHStrong = () => (
  <div style={page}>
    <p style={label}>DividerH — Strong</p>
    <DividerH variant="strong" />
  </div>
);
DividerHStrong.storyName = 'DividerH / Strong';

export const DividerHAll = () => (
  <div style={page}>
    <p style={label}>Default — #E0E0E0</p>
    <DividerH variant="default" style={{ marginBottom: 32 }} />
    <p style={label}>Strong — #9E9E9E</p>
    <DividerH variant="strong" />
  </div>
);
DividerHAll.storyName = 'DividerH / Todas as variantes';

// ─── Divider V ───────────────────────────────────────────────────────────────

export const DividerVAll = () => (
  <div style={page}>
    <p style={label}>Variantes verticais</p>
    <div style={row}>
      <div style={{ textAlign: 'center' }}>
        <DividerV variant="default" size="default" />
        <p style={{ ...label, marginTop: 8 }}>Default</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DividerV variant="strong" size="default" />
        <p style={{ ...label, marginTop: 8 }}>Strong</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DividerV variant="default" size="sm" />
        <p style={{ ...label, marginTop: 8 }}>SM</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DividerV variant="strong" size="sm" />
        <p style={{ ...label, marginTop: 8 }}>Strong SM</p>
      </div>
    </div>
  </div>
);
DividerVAll.storyName = 'DividerV / Todas as variantes';
