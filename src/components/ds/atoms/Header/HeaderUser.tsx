import type { ReactNode, CSSProperties } from 'react';
import PersonIcon        from '@mui/icons-material/Person';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import LogoutIcon        from '@mui/icons-material/Logout';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// HeaderUser — Figma node: 621:83244

interface HeaderUserProps {
  orgLogo?: ReactNode;
  userName?: string;
  userCode?: string;
  onProfile?: () => void;
  onLogout?: () => void;
  iconColor?: string;
  textColor?: string;
  style?: CSSProperties;
}

export function HeaderUser({
  orgLogo,
  userName  = 'Nome do Usuário',
  userCode  = 'CODXXXX',
  onProfile,
  onLogout,
  iconColor = colors.surface.main,
  textColor = colors.surface.dark,
  style,
}: HeaderUserProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <PersonIcon style={{ fontSize: 24, color: iconColor, flexShrink: 0 }} />
      {orgLogo && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{orgLogo}</span>}
      <button onClick={onProfile} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: onProfile ? 'pointer' : 'default', padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ ...typography.styles.caption, color: textColor, whiteSpace: 'nowrap' }}>Bem-vindo:</span>
          <span style={{ ...typography.styles.subtitle2, color: textColor, whiteSpace: 'nowrap' }}>{userName}</span>
          <span style={{ ...typography.styles.caption, color: textColor, whiteSpace: 'nowrap' }}>{userCode}</span>
        </div>
        <ArrowDropDownIcon style={{ fontSize: 20, color: iconColor, flexShrink: 0 }} />
      </button>
      <div style={{ width: 1, height: 40, backgroundColor: colors.surface.light, flexShrink: 0 }} />
      <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 8px' }}>
        <span style={{ ...typography.styles.subtitle2, color: textColor }}>Sair</span>
        <LogoutIcon style={{ fontSize: 20, color: iconColor }} />
      </button>
    </div>
  );
}
