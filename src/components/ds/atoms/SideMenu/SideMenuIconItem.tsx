import { useState } from 'react';
import type { ReactElement, CSSProperties } from 'react';
import StarIcon from '@mui/icons-material/Star';
import { colors }    from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { spacing }   from '@/styles/tokens/spacing';
import { borders }   from '@/styles/tokens/borders';

// SideMenuIconItem — Figma node: 623:87549

type SideMenuItemState = 'default' | 'hover' | 'ghost';
type SideMenuTheme = 'default' | 'light' | 'dark';

const BORDER_COLOR: Record<SideMenuTheme, string> = {
  default: colors.surface.xxxl,
  light:   colors.surface.main,
  dark:    colors.surface.light,
};

const LABEL_COLOR: Record<SideMenuTheme, Record<SideMenuItemState, string>> = {
  default: { default: colors.surface.xl,     hover: colors.surface.xxxl, ghost: colors.surface.xxxl },
  light:   { default: colors.surface.medium, hover: colors.surface.main, ghost: colors.surface.main },
  dark:    { default: colors.surface.medium, hover: colors.surface.light, ghost: colors.surface.light },
};

interface SideMenuIconItemProps {
  icon?: ReactElement;
  label?: string;
  fav?: boolean;
  state?: SideMenuItemState;
  theme?: SideMenuTheme;
  onClick?: () => void;
  style?: CSSProperties;
}

export function SideMenuIconItem({
  icon,
  label   = 'ICO',
  fav     = false,
  state   = 'default',
  theme   = 'default',
  onClick,
  style,
}: SideMenuIconItemProps) {
  const [hovered, setHovered] = useState(false);

  const effectiveState: SideMenuItemState = hovered && state !== 'ghost' ? 'hover' : state;
  const isHover = effectiveState === 'hover';
  const isGhost = state === 'ghost';
  const labelColor = LABEL_COLOR[theme]?.[effectiveState] ?? colors.surface.xl;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 54, boxSizing: 'border-box', paddingLeft: isHover ? 12 : 16, paddingRight: 14, paddingTop: spacing.bt, paddingBottom: spacing.bt, opacity: isGhost ? 0.4 : 1, borderLeft: isHover ? `${borders.width.lg} solid ${BORDER_COLOR[theme]}` : `${borders.width.lg} solid transparent`, cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {fav
        ? <StarIcon style={{ fontSize: 24, color: colors.warning.main }} />
        : (icon ?? <div style={{ width: 24, height: 24 }} />)
      }
      <span style={{ ...typography.styles.topIcon, color: fav ? colors.warning.main : labelColor, whiteSpace: 'nowrap', marginTop: spacing.xxxs }}>
        {fav ? 'FAV' : label}
      </span>
    </div>
  );
}
