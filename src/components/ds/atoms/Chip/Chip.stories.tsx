import type { CSSProperties } from 'react';
import { Chip, NotificationChip } from '.';
import CheckCircleOutlined    from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlined   from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlined   from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlined           from '@mui/icons-material/InfoOutlined';
import CloseOutlined          from '@mui/icons-material/CloseOutlined';

export default {
  title: '01-DS/Atoms/Chip',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const row: CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
// ─── Filled ──────────────────────────────────────────────────────────────────

export const Filled = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Filled — md</p>
      <div style={row}>
        <Chip color="warning">Warning</Chip>
        <Chip color="success">Success</Chip>
        <Chip color="surface">Surface</Chip>
        <Chip color="error">Error</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Filled — sm</p>
      <div style={row}>
        <Chip color="warning" size="sm">Warning</Chip>
        <Chip color="success" size="sm">Success</Chip>
        <Chip color="surface" size="sm">Surface</Chip>
        <Chip color="error"   size="sm">Error</Chip>
      </div>
    </div>
  </div>
);
Filled.storyName = 'Chip / Filled';

// ─── Outline ─────────────────────────────────────────────────────────────────

export const Outline = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Outline — md</p>
      <div style={row}>
        <Chip color="warning" outline>Warning</Chip>
        <Chip color="success" outline>Success</Chip>
        <Chip color="surface" outline>Surface</Chip>
        <Chip color="error"   outline>Error</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Outline — sm</p>
      <div style={row}>
        <Chip color="warning" outline size="sm">Warning</Chip>
        <Chip color="success" outline size="sm">Success</Chip>
        <Chip color="surface" outline size="sm">Surface</Chip>
        <Chip color="error"   outline size="sm">Error</Chip>
      </div>
    </div>
  </div>
);
Outline.storyName = 'Chip / Outline';

// ─── Com ícones ──────────────────────────────────────────────────────────────

export const ComIcones = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Leading icon — md</p>
      <div style={row}>
        <Chip color="warning" leadingIcon={<WarningAmberOutlined />}>Warning</Chip>
        <Chip color="success" leadingIcon={<CheckCircleOutlined />}>Success</Chip>
        <Chip color="error"   leadingIcon={<ErrorOutlineOutlined />}>Error</Chip>
        <Chip color="surface" leadingIcon={<InfoOutlined />}>Surface</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Trailing icon — md</p>
      <div style={row}>
        <Chip color="warning" trailingIcon={<CloseOutlined />}>Warning</Chip>
        <Chip color="success" trailingIcon={<CloseOutlined />}>Success</Chip>
        <Chip color="error"   trailingIcon={<CloseOutlined />}>Error</Chip>
        <Chip color="surface" trailingIcon={<CloseOutlined />}>Surface</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Leading + Trailing — md</p>
      <div style={row}>
        <Chip color="warning" leadingIcon={<WarningAmberOutlined />} trailingIcon={<CloseOutlined />}>Warning</Chip>
        <Chip color="success" leadingIcon={<CheckCircleOutlined />}  trailingIcon={<CloseOutlined />}>Success</Chip>
        <Chip color="error"   leadingIcon={<ErrorOutlineOutlined />} trailingIcon={<CloseOutlined />}>Error</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Leading icon — sm</p>
      <div style={row}>
        <Chip color="warning" size="sm" leadingIcon={<WarningAmberOutlined />}>Warning</Chip>
        <Chip color="success" size="sm" leadingIcon={<CheckCircleOutlined />}>Success</Chip>
        <Chip color="error"   size="sm" leadingIcon={<ErrorOutlineOutlined />}>Error</Chip>
        <Chip color="surface" size="sm" leadingIcon={<InfoOutlined />}>Surface</Chip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Outline + Leading icon — md</p>
      <div style={row}>
        <Chip color="warning" outline leadingIcon={<WarningAmberOutlined />}>Warning</Chip>
        <Chip color="success" outline leadingIcon={<CheckCircleOutlined />}>Success</Chip>
        <Chip color="error"   outline leadingIcon={<ErrorOutlineOutlined />}>Error</Chip>
      </div>
    </div>
  </div>
);
ComIcones.storyName = 'Chip / Com ícones';

// ─── NotificationChip ────────────────────────────────────────────────────────

export const Notification = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Notification Chip</p>
      <div style={row}>
        <NotificationChip count={1} />
        <NotificationChip count={9} />
        <NotificationChip count={99} />
        <NotificationChip count={100} />
      </div>
    </div>
  </div>
);
Notification.storyName = 'NotificationChip';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Filled md</p>
      <div style={row}>
        <Chip color="warning">Warning</Chip>
        <Chip color="success">Success</Chip>
        <Chip color="surface">Surface</Chip>
        <Chip color="error">Error</Chip>
      </div>
    </div>
    <div style={group}>
      <p style={label}>Filled sm</p>
      <div style={row}>
        <Chip color="warning" size="sm">Warning</Chip>
        <Chip color="success" size="sm">Success</Chip>
        <Chip color="surface" size="sm">Surface</Chip>
        <Chip color="error"   size="sm">Error</Chip>
      </div>
    </div>
    <div style={group}>
      <p style={label}>Outline md</p>
      <div style={row}>
        <Chip color="warning" outline>Warning</Chip>
        <Chip color="success" outline>Success</Chip>
        <Chip color="surface" outline>Surface</Chip>
        <Chip color="error"   outline>Error</Chip>
      </div>
    </div>
    <div style={group}>
      <p style={label}>Com ícone (leading)</p>
      <div style={row}>
        <Chip color="warning" leadingIcon={<WarningAmberOutlined />}>Warning</Chip>
        <Chip color="success" leadingIcon={<CheckCircleOutlined />}>Success</Chip>
        <Chip color="error"   leadingIcon={<ErrorOutlineOutlined />}>Error</Chip>
      </div>
    </div>
    <div style={group}>
      <p style={label}>NotificationChip</p>
      <div style={row}>
        <NotificationChip count={1} />
        <NotificationChip count={9} />
        <NotificationChip count={99} />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
