import type { CSSProperties } from 'react';
import { useState } from 'react';
import { InputIconBox } from '.';
import AddCircleOutlineOutlined  from '@mui/icons-material/AddCircleOutlineOutlined';
import HomeOutlined              from '@mui/icons-material/HomeOutlined';
import SearchOutlined            from '@mui/icons-material/SearchOutlined';
import SettingsOutlined          from '@mui/icons-material/SettingsOutlined';
import PersonOutlined            from '@mui/icons-material/PersonOutlined';
import EditOutlined              from '@mui/icons-material/EditOutlined';
import DeleteOutlined            from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlined        from '@mui/icons-material/VisibilityOutlined';
import FilterListOutlined        from '@mui/icons-material/FilterListOutlined';
import StarOutlined              from '@mui/icons-material/StarOutlined';
import FolderOutlined            from '@mui/icons-material/FolderOutlined';
import DownloadOutlined          from '@mui/icons-material/DownloadOutlined';
import UploadOutlined            from '@mui/icons-material/UploadOutlined';
import PrintOutlined             from '@mui/icons-material/PrintOutlined';
import ShareOutlined             from '@mui/icons-material/ShareOutlined';
import NotificationsOutlined     from '@mui/icons-material/NotificationsOutlined';
import LockOutlined              from '@mui/icons-material/LockOutlined';
import CheckCircleOutlined       from '@mui/icons-material/CheckCircleOutlined';
import WarningOutlined           from '@mui/icons-material/WarningOutlined';
import InfoOutlined              from '@mui/icons-material/InfoOutlined';
import CalendarTodayOutlined     from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlined        from '@mui/icons-material/AccessTimeOutlined';
import AttachFileOutlined        from '@mui/icons-material/AttachFileOutlined';
import LinkOutlined              from '@mui/icons-material/LinkOutlined';

export default {
  title: '01-DS/Atoms/InputIconBox',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── 24 ícones — exatamente como no Figma ────────────────────────────────────

const ITEMS_24 = [
  { icon: <AddCircleOutlineOutlined />,  label: 'ICO' },
  { icon: <HomeOutlined />,             label: 'ICO' },
  { icon: <SearchOutlined />,           label: 'ICO' },
  { icon: <SettingsOutlined />,         label: 'ICO' },
  { icon: <PersonOutlined />,           label: 'ICO' },
  { icon: <EditOutlined />,             label: 'ICO' },
  { icon: <DeleteOutlined />,           label: 'ICO' },
  { icon: <VisibilityOutlined />,       label: 'ICO' },
  { icon: <FilterListOutlined />,       label: 'ICO' },
  { icon: <StarOutlined />,             label: 'ICO' },
  { icon: <FolderOutlined />,           label: 'ICO' },
  { icon: <DownloadOutlined />,         label: 'ICO' },
  { icon: <UploadOutlined />,           label: 'ICO' },
  { icon: <PrintOutlined />,            label: 'ICO' },
  { icon: <ShareOutlined />,            label: 'ICO' },
  { icon: <NotificationsOutlined />,    label: 'ICO' },
  { icon: <LockOutlined />,             label: 'ICO' },
  { icon: <CheckCircleOutlined />,      label: 'ICO' },
  { icon: <WarningOutlined />,          label: 'ICO' },
  { icon: <InfoOutlined />,             label: 'ICO' },
  { icon: <CalendarTodayOutlined />,    label: 'ICO' },
  { icon: <AccessTimeOutlined />,       label: 'ICO' },
  { icon: <AttachFileOutlined />,       label: 'ICO' },
  { icon: <LinkOutlined />,             label: 'ICO' },
];

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Exatamente como no Figma — 24 ícones</p>
      <InputIconBox items={ITEMS_24} />
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Com labels ───────────────────────────────────────────────────────────────

export const ComLabels = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Com labels descritivos</p>
      <InputIconBox items={[
        { icon: <HomeOutlined />,         label: 'Home'    },
        { icon: <SearchOutlined />,       label: 'Busca'   },
        { icon: <EditOutlined />,         label: 'Editar'  },
        { icon: <DeleteOutlined />,       label: 'Excluir' },
        { icon: <SettingsOutlined />,     label: 'Config'  },
        { icon: <PersonOutlined />,       label: 'Perfil'  },
        { icon: <FolderOutlined />,       label: 'Pasta'   },
        { icon: <DownloadOutlined />,     label: 'Baixar'  },
        { icon: <ShareOutlined />,        label: 'Comp.'   },
        { icon: <NotificationsOutlined />,label: 'Alertas' },
      ]} />
    </div>
  </div>
);
ComLabels.storyName = 'Com labels';

// ─── Controlado — seleção única ───────────────────────────────────────────────

export const Controlado = () => {
  const ITEMS = [
    { icon: <HomeOutlined />,         label: 'Home'    },
    { icon: <SearchOutlined />,       label: 'Busca'   },
    { icon: <EditOutlined />,         label: 'Editar'  },
    { icon: <DeleteOutlined />,       label: 'Excluir' },
    { icon: <SettingsOutlined />,     label: 'Config'  },
    { icon: <PersonOutlined />,       label: 'Perfil'  },
    { icon: <FolderOutlined />,       label: 'Pasta'   },
    { icon: <DownloadOutlined />,     label: 'Baixar'  },
    { icon: <PrintOutlined />,        label: 'Imprimir'},
    { icon: <ShareOutlined />,        label: 'Comp.'   },
    { icon: <NotificationsOutlined />,label: 'Alertas' },
    { icon: <LockOutlined />,         label: 'Bloquear'},
  ];
  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Clique para selecionar um ícone</p>
        <InputIconBox
          items={ITEMS.map((item, i) => ({
            ...item,
            active: active === i,
            onClick: () => setActive(active === i ? null : i),
          }))}
        />
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Selecionado: {active !== null ? `"${ITEMS[active].label}" (índice ${active})` : 'nenhum'}
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';
