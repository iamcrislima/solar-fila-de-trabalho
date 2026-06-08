import type { CSSProperties } from 'react';
import { useState } from 'react';
import { IconHint }   from '.';
import { IconButton } from '../IconButton';
import { colors }     from '@/styles/tokens/colors';
import InboxIcon          from '@mui/icons-material/Inbox';
import NotificationsIcon  from '@mui/icons-material/Notifications';
import SearchIcon         from '@mui/icons-material/Search';
import SettingsIcon       from '@mui/icons-material/Settings';

export default {
  title: '01-DS/Atoms/IconHint',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row:   CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };

const icon18 = { fontSize: 18, color: colors.surface.main };

// ─── Estados ─────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>

    <div style={group}>
      <p style={label}>Estado=Padrão — sem badge</p>
      <div style={row}>
        <IconHint>
          <InboxIcon style={icon18} />
        </IconHint>
        <IconHint>
          <NotificationsIcon style={icon18} />
        </IconHint>
        <IconHint>
          <SearchIcon style={icon18} />
        </IconHint>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Estado=Hint — badge visível</p>
      <div style={{ ...row, paddingBottom: 24 }}>
        <IconHint hint="Caixa de entrada" showHint>
          <InboxIcon style={icon18} />
        </IconHint>
        <IconHint hint="Notificações" showHint>
          <NotificationsIcon style={icon18} />
        </IconHint>
        <IconHint hint="Buscar" showHint>
          <SearchIcon style={icon18} />
        </IconHint>
        <IconHint hint="Configurações" showHint>
          <SettingsIcon style={icon18} />
        </IconHint>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Composição com IconButton (padrão do projeto)</p>
      <div style={{ ...row, paddingBottom: 24 }}>
        <IconButton aria-label="Caixa de entrada" onClick={() => {}}>
          <IconHint hint="Caixa de entrada" showHint>
            <InboxIcon style={icon18} />
          </IconHint>
        </IconButton>
        <IconButton aria-label="Notificações" onClick={() => {}}>
          <IconHint hint="Notificações" showHint>
            <NotificationsIcon style={icon18} />
          </IconHint>
        </IconButton>
        <IconButton aria-label="Buscar" onClick={() => {}}>
          <IconHint hint="Buscar">
            <SearchIcon style={icon18} />
          </IconHint>
        </IconButton>
      </div>
    </div>

  </div>
);
Estados.storyName = 'IconHint';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>showHint controlado por estado externo</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={() => setShow(v => !v)} style={{ padding: '4px 12px', cursor: 'pointer' }}>
            {show ? 'Ocultar hint' : 'Mostrar hint'}
          </button>
          <div style={{ paddingBottom: 24 }}>
            <IconButton aria-label="Notificações" onClick={() => {}}>
              <IconHint hint="Você tem mensagens" showHint={show}>
                <NotificationsIcon style={icon18} />
              </IconHint>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';
