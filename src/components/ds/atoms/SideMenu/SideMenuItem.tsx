import { useState } from 'react';
import type { CSSProperties } from 'react';
import Star       from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import { colors }    from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { spacing }   from '@/styles/tokens/spacing';

// SideMenuItem — Figma node: 625:87673

type SideMenuItemState = 'default' | 'hover' | 'active';
type SideMenuTheme = 'default' | 'dark';

const BG: Record<SideMenuTheme, Record<SideMenuItemState, string>> = {
  default: { default: 'transparent',           hover: colors.primary.xxl, active: colors.primary.xxl },
  dark:    { default: colors.surfaceDM.medium, hover: colors.surfaceDM.main, active: colors.surfaceDM.light },
};

interface SideMenuItemProps {
  label?: string;
  state?: SideMenuItemState;
  theme?: SideMenuTheme;
  fav?: boolean;
  showFavIcon?: boolean;
  showCheckbox?: boolean;
  count?: number;
  onFavToggle?: (fav: boolean) => void;
  onClick?: () => void;
  style?: CSSProperties;
}

export function SideMenuItem({
  label        = 'Item',
  state        = 'default',
  theme        = 'default',
  fav          = false,
  showFavIcon  = true,
  showCheckbox = false,
  count,
  onFavToggle,
  onClick,
  style,
}: SideMenuItemProps) {
  const [hovered, setHovered] = useState(false);
  const isDark = theme === 'dark';
  const effectiveState: SideMenuItemState = hovered && state !== 'active' ? 'hover' : state;
  const bg = BG[theme]?.[effectiveState] ?? 'transparent';
  const textColor = isDark ? colors.surface.xxxl : colors.surface.main;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 216, boxSizing: 'border-box', paddingTop: spacing.xxs, paddingBottom: spacing.xs, paddingLeft: spacing.bt, paddingRight: spacing.xs, backgroundColor: bg, cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: '1 0 0', minWidth: 0 }}>
        {showFavIcon && (
          <button onClick={(e) => { e.stopPropagation(); onFavToggle?.(!fav); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex' }}>
            {fav ? <Star style={{ fontSize: 24, color: colors.warning.main }} /> : <StarBorder style={{ fontSize: 24, color: textColor, opacity: 0.4 }} />}
          </button>
        )}
        {showCheckbox && (
          <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 16, height: 16, border: `2px solid ${colors.surface.medium}`, borderRadius: 2 }} />
          </div>
        )}
        <div style={{ paddingLeft: spacing.xs, paddingTop: 5, paddingBottom: spacing.xxs, minWidth: 0, flex: 1 }}>
          <span style={{ ...typography.styles.overline, color: textColor, display: 'block', whiteSpace: 'normal', wordBreak: 'break-word' }}>
            {label}
          </span>
        </div>
      </div>
      {count != null && (
        <div style={{ backgroundColor: colors.surface.main, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 1, paddingBottom: 2, paddingLeft: 2, paddingRight: 3, borderRadius: 492, flexShrink: 0 }}>
          <span style={{ ...typography.styles.captionBold, color: colors.surface.xxxl, whiteSpace: 'nowrap' }}>{count}</span>
        </div>
      )}
    </div>
  );
}
