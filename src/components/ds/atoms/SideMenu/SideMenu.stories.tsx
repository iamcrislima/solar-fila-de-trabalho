import type { CSSProperties } from 'react';
import { useState } from 'react';
import HomeIcon      from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon    from '@mui/icons-material/People';
import BarChartIcon  from '@mui/icons-material/BarChart';
import SettingsIcon  from '@mui/icons-material/Settings';
import FolderIcon    from '@mui/icons-material/Folder';
import {
  SideMenuSearch,
  SideMenuIconItem,
  SideMenuIconFixed,
  SideMenuHeader,
  SideMenuItem,
  SideMenuIconBar,
} from '.';

export default {
  title: '01-DS/Atoms/SideMenu',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const row: CSSProperties = { display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };
const ICON_ITEMS = [
  { icon: <HomeIcon />,       label: 'HOME' },
  { icon: <AssignmentIcon />, label: 'PROC' },
  { icon: <PeopleIcon />,     label: 'PEOP' },
  { icon: <BarChartIcon />,   label: 'REL' },
  { icon: <SettingsIcon />,   label: 'CFG' },
  { icon: <FolderIcon />,     label: 'DOC' },
];

// ─── SideMenuSearch ───────────────────────────────────────────────────────────

export const Search = () => (
  <div style={page}>
    <div>
      <p style={label}>Search — Light / Dark</p>
      <div style={row}>
        <div style={col}>
          <SideMenuSearch variant="search" theme="default" label="Search" />
          <SideMenuSearch variant="search" theme="dark"    label="Search" />
        </div>
        <div style={col}>
          <SideMenuSearch variant="section" theme="default" label="Section" />
          <SideMenuSearch variant="section" theme="dark"    label="Section" />
        </div>
        <div style={col}>
          <SideMenuSearch variant="section" theme="default" label="Section" icon={false} />
          <SideMenuSearch variant="section" theme="dark"    label="Section" icon={false} />
        </div>
      </div>
    </div>
  </div>
);
Search.storyName = 'Search / Section Header';

// ─── SideMenuIconItem ─────────────────────────────────────────────────────────

export const IconItem = () => (
  <div style={{ ...page, backgroundColor: '#616161' }}>
    <div>
      <p style={{ ...label, color: '#E0E0E0' }}>Icon Item — estados × temas</p>
      <div style={row}>
        {(['default', 'light', 'dark'] as const).map(theme => (
          <div key={theme} style={{ backgroundColor: theme === 'default' ? '#00838F' : theme === 'light' ? '#F5F5F5' : '#212121' }}>
            <p style={{ ...label, color: theme === 'light' ? '#616161' : '#E0E0E0', padding: '8px 4px 4px' }}>{theme}</p>
            {(['default', 'hover', 'ghost'] as const).map(state => (
              <SideMenuIconItem
                key={state}
                icon={<HomeIcon style={{ fontSize: 24, color: theme === 'light' ? '#616161' : '#F5F5F5' }} />}
                label="HOME"
                state={state}
                theme={theme}
              />
            ))}
            <SideMenuIconItem fav state="default" theme={theme} />
            <SideMenuIconItem fav state="hover"   theme={theme} />
            <SideMenuIconItem fav state="ghost"   theme={theme} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
IconItem.storyName = 'Icon Item';

// ─── SideMenuIconFixed ────────────────────────────────────────────────────────

export const IconFixed = () => (
  <div style={page}>
    <div>
      <p style={label}>Icon Fixed — 3 temas</p>
      <div style={row}>
        <SideMenuIconFixed theme="default" />
        <SideMenuIconFixed theme="light" />
        <SideMenuIconFixed theme="dark" />
      </div>
    </div>
  </div>
);
IconFixed.storyName = 'Icon Fixed (FAV/BUSCA/FILA)';

// ─── SideMenuHeader ───────────────────────────────────────────────────────────

export const Header = () => (
  <div style={page}>
    <div>
      <p style={label}>Header — colapsado / expandido × Light / Dark</p>
      <div style={col}>
        <SideMenuHeader title="Menu" theme="default" defaultOpen={false} />
        <SideMenuHeader title="Menu" theme="default" defaultOpen={true} />
        <SideMenuHeader title="Menu" theme="dark"    defaultOpen={false} />
        <SideMenuHeader title="Menu" theme="dark"    defaultOpen={true} />
      </div>
    </div>
  </div>
);
Header.storyName = 'Section Header';

// ─── SideMenuItem ─────────────────────────────────────────────────────────────

export const MenuItemStory = () => (
  <div style={page}>
    <div>
      <p style={label}>Menu Item — estados × temas</p>
      <div style={row}>
        <div style={col}>
          <p style={label}>Light</p>
          {(['default', 'hover', 'active'] as const).map(state => (
            <SideMenuItem key={state} label={`Item (${state})`} state={state} theme="default" />
          ))}
          <SideMenuItem label="Item favorito"       state="default" theme="default" fav />
          <SideMenuItem label="Com badge"           state="default" theme="default" count={42} />
          <SideMenuItem label="Com checkbox"        state="default" theme="default" showFavIcon={false} showCheckbox />
        </div>
        <div style={col}>
          <p style={label}>Dark</p>
          {(['default', 'hover', 'active'] as const).map(state => (
            <SideMenuItem key={state} label={`Item (${state})`} state={state} theme="dark" />
          ))}
          <SideMenuItem label="Item favorito"       state="default" theme="dark" fav />
          <SideMenuItem label="Com badge"           state="default" theme="dark" count={1115} />
          <SideMenuItem label="Com checkbox"        state="default" theme="dark" showFavIcon={false} showCheckbox />
        </div>
      </div>
    </div>
  </div>
);
MenuItemStory.storyName = 'Menu Item';

// ─── SideMenuIconBar ──────────────────────────────────────────────────────────

export const IconBar = () => (
  <div style={{ ...page, backgroundColor: '#9E9E9E' }}>
    <div>
      <p style={{ ...label, color: '#F5F5F5' }}>Icon Bar — 3 temas</p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', height: 480 }}>
        <SideMenuIconBar theme="default" items={ICON_ITEMS} style={{ height: '100%' }} />
        <SideMenuIconBar theme="light"   items={ICON_ITEMS} style={{ height: '100%' }} />
        <SideMenuIconBar theme="dark"    items={ICON_ITEMS} style={{ height: '100%' }} />
      </div>
    </div>
  </div>
);
IconBar.storyName = 'Icon Bar (completa)';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [open, setOpen] = useState(true);
  const [favs, setFavs] = useState<Record<number, boolean>>({ 0: false, 1: true, 2: false });

  const toggleFav = (i: number) => setFavs(prev => ({ ...prev, [i]: !prev[i] }));

  const ITEMS = [
    { label: 'Processos em andamento', count: 12 },
    { label: 'Minha fila de trabalho',  count: 5 },
    { label: 'Documentos pendentes' },
    { label: 'Relatórios' },
  ];

  return (
    <div style={page}>
      <div>
        <p style={label}>Sidebar expandida — Interativa</p>
        <div style={{ display: 'flex', width: 270, flexDirection: 'column', backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden' }}>
          <SideMenuSearch variant="search" label="Buscar módulo..." />
          <SideMenuHeader title="Módulos" open={open} onToggle={setOpen} />
          {open && ITEMS.map((item, i) => (
            <SideMenuItem
              key={i}
              label={item.label}
              count={item.count}
              fav={favs[i] ?? false}
              onFavToggle={() => toggleFav(i)}
              state="default"
            />
          ))}
          <SideMenuHeader title="Configurações" />
        </div>
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div>
      <p style={label}>SideMenuSearch</p>
      <div style={row}>
        <SideMenuSearch variant="search"  theme="default" />
        <SideMenuSearch variant="search"  theme="dark" />
        <SideMenuSearch variant="section" theme="default" label="Módulos" />
        <SideMenuSearch variant="section" theme="dark"    label="Módulos" />
      </div>
    </div>
    <div>
      <p style={label}>SideMenuHeader</p>
      <div style={col}>
        <SideMenuHeader title="Processos" theme="default" />
        <SideMenuHeader title="Processos" theme="dark" />
      </div>
    </div>
    <div>
      <p style={label}>SideMenuItem</p>
      <div style={col}>
        <SideMenuItem label="Processo padrão"  state="default" />
        <SideMenuItem label="Hover state"      state="hover" />
        <SideMenuItem label="Ativo"            state="active" />
        <SideMenuItem label="Favorito"         fav />
        <SideMenuItem label="Com badge"        count={99} />
      </div>
    </div>
    <div>
      <p style={label}>SideMenuIconFixed</p>
      <div style={row}>
        <SideMenuIconFixed theme="default" />
        <SideMenuIconFixed theme="light" />
        <SideMenuIconFixed theme="dark" />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
