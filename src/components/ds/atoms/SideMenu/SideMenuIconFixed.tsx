import type { CSSProperties } from 'react';
import StarIcon    from '@mui/icons-material/Star';
import SearchIcon  from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// SideMenuIconFixed — Figma node: 4330:159312

type SideMenuTheme = 'default' | 'light' | 'dark';

const BG: Record<SideMenuTheme, string>         = { default: colors.primary.main, light: colors.surface.xl, dark: colors.surface.dark };
const ICON_COLOR: Record<SideMenuTheme, string>  = { default: colors.surface.xl,   light: colors.surface.medium, dark: colors.surface.medium };
const LABEL_COLOR: Record<SideMenuTheme, string> = { default: colors.surface.xl,   light: colors.surface.medium, dark: colors.surface.medium };
const DIVIDER_COLOR: Record<SideMenuTheme, string> = { default: colors.surface.xl, light: colors.surface.medium, dark: colors.surface.medium };

interface FixedItemProps { muiIcon: React.ReactNode; label: string; theme: SideMenuTheme; hasDivider?: boolean; }
import React from 'react';

function FixedItem({ muiIcon, label, theme, hasDivider }: FixedItemProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 54, boxSizing: 'border-box', paddingLeft: 16, paddingRight: 14, paddingTop: 6, paddingBottom: hasDivider ? 12 : 6, borderBottom: hasDivider ? `1px solid ${DIVIDER_COLOR[theme]}` : 'none' }}>
      {muiIcon}
      <span style={{ ...typography.styles.topIcon, color: LABEL_COLOR[theme], whiteSpace: 'nowrap', marginTop: 2 }}>{label}</span>
    </div>
  );
}

interface SideMenuIconFixedProps { theme?: SideMenuTheme; style?: CSSProperties; }

export function SideMenuIconFixed({ theme = 'default', style }: SideMenuIconFixedProps) {
  const iconColor = ICON_COLOR[theme];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: BG[theme], ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
        <FixedItem muiIcon={<StarIcon style={{ fontSize: 24, color: colors.warning.main }} />} label="FAV" theme={theme} />
        <FixedItem muiIcon={<SearchIcon style={{ fontSize: 24, color: iconColor }} />} label="BUSCA" theme={theme} />
        <FixedItem muiIcon={<ListAltIcon style={{ fontSize: 24, color: iconColor }} />} label="FILA" theme={theme} hasDivider />
      </div>
    </div>
  );
}
