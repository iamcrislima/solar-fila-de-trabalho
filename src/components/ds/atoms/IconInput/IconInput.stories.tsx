import type { CSSProperties } from 'react';
import { useState } from 'react';
import { IconInput } from '.';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';
import HomeOutlined             from '@mui/icons-material/HomeOutlined';
import SearchOutlined           from '@mui/icons-material/SearchOutlined';
import SettingsOutlined         from '@mui/icons-material/SettingsOutlined';
import PersonOutlined           from '@mui/icons-material/PersonOutlined';

export default {
  title: '01-DS/Atoms/IconInput',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default / Hover (passe o mouse) / Active</p>
      <div style={row}>
        <IconInput icon={<AddCircleOutlineOutlined />} label="ICO" />
        <IconInput icon={<AddCircleOutlineOutlined />} label="ICO" active />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Estados ──────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default</p>
      <div style={row}>
        <IconInput icon={<AddCircleOutlineOutlined />} label="Novo" />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Active</p>
      <div style={row}>
        <IconInput icon={<AddCircleOutlineOutlined />} label="Novo" active />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Hover (passe o mouse)</p>
      <div style={row}>
        <IconInput icon={<HomeOutlined />} label="Home" />
        <IconInput icon={<SearchOutlined />} label="Busca" />
      </div>
    </div>
  </div>
);
Estados.storyName = 'Estados';

// ─── Exemplos de ícones ───────────────────────────────────────────────────────

export const ExemplosDeIcones = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Diferentes ícones e labels</p>
      <div style={row}>
        <IconInput icon={<HomeOutlined />}             label="Home"     />
        <IconInput icon={<SearchOutlined />}           label="Busca"    />
        <IconInput icon={<AddCircleOutlineOutlined />} label="Novo"     />
        <IconInput icon={<PersonOutlined />}           label="Perfil"   active />
        <IconInput icon={<SettingsOutlined />}         label="Config"   />
      </div>
    </div>
  </div>
);
ExemplosDeIcones.storyName = 'Exemplos de ícones';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const ITEMS = [
    { icon: <HomeOutlined />,             label: 'Home'   },
    { icon: <SearchOutlined />,           label: 'Busca'  },
    { icon: <AddCircleOutlineOutlined />, label: 'Novo'   },
    { icon: <PersonOutlined />,           label: 'Perfil' },
    { icon: <SettingsOutlined />,         label: 'Config' },
  ];
  const [active, setActive] = useState(0);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Menu lateral — clique para ativar</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 54 }}>
          {ITEMS.map((item, i) => (
            <IconInput
              key={i}
              icon={item.icon}
              label={item.label}
              active={active === i}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Ativo: "{ITEMS[active].label}"
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Default</p>
        <IconInput icon={<AddCircleOutlineOutlined />} label="ICO" />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Active</p>
        <IconInput icon={<AddCircleOutlineOutlined />} label="ICO" active />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
