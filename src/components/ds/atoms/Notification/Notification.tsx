import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVert          from '@mui/icons-material/MoreVert';
import Visibility        from '@mui/icons-material/Visibility';
import { colors }        from '@/styles/tokens/colors';
import { borders }       from '@/styles/tokens/borders';
import { typography }    from '@/styles/tokens/typography';

const WHITE   = colors.surface.xxxl;
const DARK    = colors.surface.dark;
const XL      = colors.surface.xl;
const PRIMARY = colors.primary.main;

interface NotificationItemProps {
  icon?: ReactNode;
  message: string;
  timestamp?: string;
  onMenu?: () => void;
  style?: CSSProperties;
}

export function NotificationItem({ icon, message, timestamp, onMenu, style }: NotificationItemProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', paddingLeft: 8, paddingRight: 16, paddingTop: 16, paddingBottom: 16, width: '100%', boxSizing: 'border-box', backgroundColor: hovered ? XL : 'transparent', ...style }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
        <div style={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon ?? <NotificationsIcon style={{ fontSize: 24, color: DARK }} />}
        </div>
        <span style={{ ...typography.styles.overline, fontSize: 12, color: DARK, flex: '1 0 0', minWidth: 0, lineHeight: '18px' }}>{message}</span>
        <button onClick={onMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
          <MoreVert style={{ fontSize: 24, color: DARK }} />
        </button>
      </div>
      {timestamp && <span style={{ ...typography.styles.topIcon, color: DARK, whiteSpace: 'nowrap' }}>{timestamp}</span>}
    </div>
  );
}

interface NotificationItem {
  id?: string | number;
  message: string;
  timestamp?: string;
  icon?: ReactNode;
  onMenu?: () => void;
}

interface NotificationProps {
  title?: string;
  items?: NotificationItem[];
  headerActions?: ReactNode;
  onViewAll?: () => void;
  style?: CSSProperties;
}

export function Notification({ title = 'Notificações', items = [], headerActions, onViewAll, style }: NotificationProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 604, backgroundColor: WHITE, borderRadius: borders.radius.lg, boxShadow: '0px 16px 32px rgba(0,0,0,0.64)', padding: 16, boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, width: '100%' }}>
        <span style={{ ...typography.styles.subtitle1, color: DARK }}>{title}</span>
        {headerActions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{headerActions}</div>}
      </div>
      {items.map((item, i) => <NotificationItem key={item.id ?? i} icon={item.icon} message={item.message} timestamp={item.timestamp} onMenu={item.onMenu} />)}
      {onViewAll && (
        <button onClick={onViewAll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingTop: 6, paddingBottom: 6, paddingLeft: 8, paddingRight: 8, backgroundColor: PRIMARY, border: 'none', borderRadius: borders.radius.md, cursor: 'pointer', marginTop: 4 }}>
          <Visibility style={{ fontSize: 24, color: WHITE }} />
          <span style={{ ...typography.styles.button, color: WHITE }}>Ver todas</span>
        </button>
      )}
    </div>
  );
}
