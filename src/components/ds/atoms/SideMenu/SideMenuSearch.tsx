import type { CSSProperties } from 'react';
import SearchIcon    from '@mui/icons-material/Search';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { TruncatedText } from '../TruncatedText';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// SideMenuSearch — Figma node: 625:87655

type SideMenuSearchVariant = 'search' | 'section';
type SideMenuTheme = 'default' | 'dark';

const BG: Record<SideMenuSearchVariant, Record<SideMenuTheme, string>> = {
  search:  { default: colors.surface.xxxl,     dark: colors.surface.dark },
  section: { default: colors.primary.medium,   dark: colors.surface.dark },
};

const BORDER: Record<SideMenuSearchVariant, Record<SideMenuTheme, string>> = {
  search:  { default: colors.surface.xl, dark: colors.surfaceDM.medium },
  section: { default: 'none',            dark: 'none' },
};

interface SideMenuSearchProps {
  variant?: SideMenuSearchVariant;
  theme?: SideMenuTheme;
  label?: string;
  icon?: boolean;
  style?: CSSProperties;
}

export function SideMenuSearch({ variant = 'search', theme = 'default', label = 'Search', icon = true, style }: SideMenuSearchProps) {
  const isSearch  = variant === 'search';
  const isDark    = theme === 'dark';
  const bg        = BG[variant][theme];
  const border    = BORDER[variant][theme];
  const textColor = isSearch
    ? (isDark ? colors.surface.light : colors.surface.main)
    : colors.surface.xxxl;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSearch ? 'space-between' : 'center', gap: isSearch ? 0 : 8, width: 217, height: isSearch ? undefined : 72, boxSizing: 'border-box', padding: '6px 8px', backgroundColor: bg, border: border !== 'none' ? `1px solid ${border}` : 'none', ...style }}>
      <TruncatedText text={label} style={{ ...(isSearch ? typography.styles.body2 : typography.styles.subtitle2), flex: isSearch ? '1 0 0' : undefined, minWidth: isSearch ? 0 : undefined, color: textColor, opacity: isSearch ? 0.4 : 1 }}>
        {label}
      </TruncatedText>
      {isSearch && <SearchIcon style={{ fontSize: 24, color: textColor, opacity: 0.4, flexShrink: 0 }} />}
      {!isSearch && icon && <AutorenewIcon style={{ fontSize: 24, color: colors.surface.xxxl, flexShrink: 0 }} />}
    </div>
  );
}
