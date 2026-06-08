import type { CSSProperties } from 'react';
import { IconButton } from '.';
import { Tooltip }   from '../../Tooltip/Tooltip';
import { colors }    from '@/styles/tokens/colors';
import InboxIcon        from '@mui/icons-material/Inbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon       from '@mui/icons-material/Search';
import SettingsIcon     from '@mui/icons-material/Settings';
import CloseIcon        from '@mui/icons-material/Close';
import EditIcon         from '@mui/icons-material/Edit';

export default {
  title: '01-DS/Atoms/IconButton',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page: CSSProperties  = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties   = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };

const icon18 = { fontSize: 18, color: colors.surface.main };
const icon24 = { fontSize: 24, color: colors.surface.main };

// ─── Estados ─────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Padrão (passe o mouse para ver o hover)</p>
      <div style={row}>
        <IconButton aria-label="Caixa de entrada" onClick={() => {}}>
          <InboxIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Notificações" onClick={() => {}}>
          <NotificationsIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Buscar" onClick={() => {}}>
          <SearchIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Configurações" onClick={() => {}}>
          <SettingsIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Fechar" onClick={() => {}}>
          <CloseIcon style={icon18} />
        </IconButton>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Disabled</p>
      <div style={row}>
        <IconButton aria-label="Caixa de entrada" disabled>
          <InboxIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Notificações" disabled>
          <NotificationsIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Editar" disabled>
          <EditIcon style={icon18} />
        </IconButton>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Com Tooltip (padrão do projeto)</p>
      <div style={row}>
        <Tooltip content="Caixa de entrada">
          <IconButton aria-label="Caixa de entrada" onClick={() => {}}>
            <InboxIcon style={icon18} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Notificações">
          <IconButton aria-label="Notificações" onClick={() => {}}>
            <NotificationsIcon style={icon18} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Configurações">
          <IconButton aria-label="Configurações" onClick={() => {}}>
            <SettingsIcon style={icon18} />
          </IconButton>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Tamanhos de ícone — 18px (Figma) vs 24px</p>
      <div style={row}>
        <IconButton aria-label="Inbox 18px" onClick={() => {}}>
          <InboxIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Inbox 24px" onClick={() => {}}>
          <InboxIcon style={icon24} />
        </IconButton>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Fundo claro (para uso sobre superfícies brancas)</p>
      <div style={{ ...row, backgroundColor: colors.surface.xxxl, padding: 16, borderRadius: 4 }}>
        <IconButton aria-label="Buscar" onClick={() => {}}>
          <SearchIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Editar" onClick={() => {}}>
          <EditIcon style={icon18} />
        </IconButton>
        <IconButton aria-label="Fechar" onClick={() => {}}>
          <CloseIcon style={icon18} />
        </IconButton>
      </div>
    </div>
  </div>
);
Estados.storyName = 'IconButton';
