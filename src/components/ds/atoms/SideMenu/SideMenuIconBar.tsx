import type { ReactElement, CSSProperties } from 'react';
import { SideMenuIconFixed } from './SideMenuIconFixed';
import { SideMenuIconItem }  from './SideMenuIconItem';
import { colors }            from '@/styles/tokens/colors';

// SideMenuIconBar — Figma node: 625:94628

type SideMenuTheme = 'default' | 'light' | 'dark';

const BG: Record<SideMenuTheme, string> = {
  default: colors.primary.main,
  light:   colors.surface.xl,
  dark:    colors.surface.dark,
};

interface SideMenuBarItem {
  icon?: ReactElement;
  label: string;
  fav?: boolean;
  state?: 'default' | 'hover' | 'ghost';
  onClick?: () => void;
}

interface SideMenuIconBarProps {
  items?: SideMenuBarItem[];
  theme?: SideMenuTheme;
  style?: CSSProperties;
}

export function SideMenuIconBar({ items = [], theme = 'default', style }: SideMenuIconBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 54, minHeight: '100%', backgroundColor: BG[theme] ?? colors.primary.main, overflow: 'hidden', ...style }}>
      <SideMenuIconFixed theme={theme} />
      {items.map((item) => (
        <SideMenuIconItem key={item.label} icon={item.icon} label={item.label} fav={item.fav} state={item.state ?? 'default'} theme={theme} onClick={item.onClick} />
      ))}
    </div>
  );
}
