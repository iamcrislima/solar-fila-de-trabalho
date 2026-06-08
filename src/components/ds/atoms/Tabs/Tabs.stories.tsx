import type { CSSProperties } from 'react';
import { useState } from 'react';
import Visibility    from '@mui/icons-material/Visibility';
import Description   from '@mui/icons-material/Description';
import Settings      from '@mui/icons-material/Settings';
import BarChart      from '@mui/icons-material/BarChart';
import { Tabs } from '.';

export default {
  title: '01-DS/Atoms/Tabs',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' };
const TABS_TEXT = [
  { label: 'Tab' },
  { label: 'Tab' },
  { label: 'Tab' },
];

const TABS_ICON = [
  { label: 'Visão Geral',   icon: <Visibility />   },
  { label: 'Documentos',    icon: <Description />  },
  { label: 'Configurações', icon: <Settings />      },
  { label: 'Relatórios',    icon: <BarChart />      },
];

const TABS_MANY = [
  { label: 'Geral' },
  { label: 'Dados' },
  { label: 'Histórico' },
  { label: 'Documentos' },
  { label: 'Financeiro' },
];

// ─── Horizontal ───────────────────────────────────────────────────────────────

export const Horizontal = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Só texto — 3 abas</p>
      <Tabs orientation="h" tabs={TABS_TEXT} defaultActive={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Só texto — 5 abas</p>
      <Tabs orientation="h" tabs={TABS_MANY} defaultActive={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Com ícone</p>
      <Tabs orientation="h" tabs={TABS_ICON} defaultActive={0} />
    </div>
  </div>
);
Horizontal.storyName = 'Horizontal (Tab H)';

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical = () => (
  <div style={page}>
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <div style={group}>
        <p style={sectionLabel}>Só texto</p>
        <Tabs orientation="v" tabs={TABS_TEXT} defaultActive={0} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Com ícone</p>
        <Tabs orientation="v" tabs={TABS_ICON} defaultActive={0} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>5 abas</p>
        <Tabs orientation="v" tabs={TABS_MANY} defaultActive={2} />
      </div>
    </div>
  </div>
);
Vertical.storyName = 'Vertical (Tab V)';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [activeH, setActiveH] = useState(0);
  const [activeV, setActiveV] = useState(0);

  const panels = ['Conteúdo da aba Geral', 'Conteúdo da aba Dados', 'Conteúdo da aba Histórico', 'Conteúdo da aba Documentos', 'Conteúdo da aba Financeiro'];

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Horizontal com painel</p>
        <Tabs orientation="h" tabs={TABS_MANY} active={activeH} onChange={setActiveH} />
        <div style={{ padding: 24, border: '1px solid #E0E0E0', borderRadius: 4, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#616161' }}>
          {panels[activeH]}
        </div>
      </div>

      <div style={group}>
        <p style={sectionLabel}>Vertical com painel</p>
        <div style={{ display: 'flex', gap: 0 }}>
          <Tabs orientation="v" tabs={TABS_MANY} active={activeV} onChange={setActiveV} />
          <div style={{ padding: 24, border: '1px solid #E0E0E0', borderRadius: 4, flex: 1, fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#616161' }}>
            {panels[activeV]}
          </div>
        </div>
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>H — texto</p>
      <Tabs orientation="h" tabs={TABS_TEXT} defaultActive={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>H — ícone + texto</p>
      <Tabs orientation="h" tabs={TABS_ICON} defaultActive={1} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>V — texto</p>
      <Tabs orientation="v" tabs={TABS_TEXT} defaultActive={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>V — ícone + texto</p>
      <Tabs orientation="v" tabs={TABS_ICON} defaultActive={2} />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
