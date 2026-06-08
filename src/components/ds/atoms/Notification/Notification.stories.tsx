import type { CSSProperties, ReactNode } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Undo              from '@mui/icons-material/Undo';
import Article           from '@mui/icons-material/Article';
import ManageAccounts    from '@mui/icons-material/ManageAccounts';
import Tune              from '@mui/icons-material/Tune';
import { Notification, NotificationItem } from '.';

export default {
  title: '01-DS/Atoms/Notification',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const MSG = 'Lorem ipsum dolor sit amet consectetur. Molestie faucibus dolor fringilla non a nec facilisis commodo pellentesque. Ipsum risus tempor massa dictum purus mattis. Purus ut neque adipiscing aliquam viverra scelerisque.';

const ITEMS = [
  { id: 1, message: MSG, timestamp: 'Há 1 semana' },
  { id: 2, message: MSG, timestamp: 'Há 2 semanas' },
  { id: 3, message: MSG, timestamp: 'Há 3 semanas' },
  { id: 4, message: 'Novo documento anexado ao processo #4821. Acesse para revisar.', timestamp: 'Há 1 mês' },
  { id: 5, message: 'Aprovação pendente: contrato #9231 aguarda sua assinatura.', timestamp: 'Há 1 mês' },
];

// ── Botões de ação do header ──────────────────────────────────────────────────
function IconBtn({ children }: { children: ReactNode }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #616161', borderRadius: 4, padding: '6px 8px',
      background: '#fff', cursor: 'pointer',
    }}>
      {children}
    </button>
  );
}

const HeaderActions = (
  <>
    <IconBtn><NotificationsIcon style={{ fontSize: 24, color: '#616161' }} /></IconBtn>
    <IconBtn><Undo              style={{ fontSize: 24, color: '#616161' }} /></IconBtn>
    <IconBtn><Article           style={{ fontSize: 24, color: '#616161' }} /></IconBtn>
    <IconBtn><ManageAccounts    style={{ fontSize: 24, color: '#616161' }} /></IconBtn>
    <IconBtn><Tune              style={{ fontSize: 24, color: '#616161' }} /></IconBtn>
  </>
);

// ─── Item individual ──────────────────────────────────────────────────────────

export const ItemNotification = () => (
  <div style={page}>
    <div>
      <p style={sectionLabel}>Item — Default e Hover</p>
      <div style={{ backgroundColor: '#fff', width: 572, borderRadius: 4 }}>
        <NotificationItem message={MSG} timestamp="Há 1 semana" />
        <NotificationItem message="Aprovação pendente no processo #1234." timestamp="Há 2 dias" />
      </div>
    </div>
  </div>
);
ItemNotification.storyName = 'Item Notification';

// ─── Painel completo ──────────────────────────────────────────────────────────

export const PainelCompleto = () => (
  <div style={page}>
    <div>
      <p style={sectionLabel}>Notification Box — 5 itens</p>
      <Notification
        title="Notificações"
        items={ITEMS}
        headerActions={HeaderActions}
        onViewAll={() => alert('Ver todas')}
      />
    </div>
  </div>
);
PainelCompleto.storyName = 'Painel completo';

// ─── Sem botão "Ver todas" ────────────────────────────────────────────────────

export const SemVerTodas = () => (
  <div style={page}>
    <div>
      <p style={sectionLabel}>Sem botão Ver todas</p>
      <Notification
        title="Notificações"
        items={ITEMS.slice(0, 3)}
        headerActions={HeaderActions}
      />
    </div>
  </div>
);
SemVerTodas.storyName = 'Sem "Ver todas"';

// ─── Painel vazio ─────────────────────────────────────────────────────────────

export const PainelVazio = () => (
  <div style={page}>
    <div>
      <p style={sectionLabel}>Sem notificações</p>
      <Notification
        title="Notificações"
        items={[]}
        headerActions={HeaderActions}
        onViewAll={() => {}}
      />
    </div>
  </div>
);
PainelVazio.storyName = 'Painel vazio';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div>
      <p style={sectionLabel}>Item individual</p>
      <div style={{ backgroundColor: '#fff', width: 572, borderRadius: 4 }}>
        <NotificationItem message={MSG} timestamp="Há 1 semana" />
      </div>
    </div>
    <div>
      <p style={sectionLabel}>Painel completo</p>
      <Notification
        title="Notificações"
        items={ITEMS}
        headerActions={HeaderActions}
        onViewAll={() => {}}
      />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
