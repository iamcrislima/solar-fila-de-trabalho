import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { TruncatedText } from '../TruncatedText';
import { colors }    from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { spacing }   from '@/styles/tokens/spacing';

// SideMenuHeader — Figma node: 623:87468

type SideMenuTheme = 'default' | 'dark';

interface SideMenuHeaderProps {
  title?: string;
  prefixIcon?: ReactNode;
  theme?: SideMenuTheme;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  titleColor?: string;
  style?: CSSProperties;
}

export function SideMenuHeader({
  title       = 'Menu',
  prefixIcon,
  theme       = 'default',
  defaultOpen = false,
  open,
  onToggle,
  titleColor,
  style,
}: SideMenuHeaderProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [hovered, setHovered]     = useState(false);
  const isOpen  = open !== undefined ? open : innerOpen;
  const isDark  = theme === 'dark';
  const bg      = isDark ? colors.surfaceDM.dark : colors.surface.xl;
  const color   = titleColor ?? (isDark ? colors.surface.light : colors.surface.main);

  const handleToggle = () => {
    if (onToggle) onToggle(!isOpen);
    else setInnerOpen((v) => !v);
  };

  return (
    <div
      onClick={handleToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: prefixIcon ? 0 : undefined, width: 216, minWidth: 193, boxSizing: 'border-box', padding: `${spacing.bt} ${spacing.xs}`, backgroundColor: bg, filter: hovered ? 'brightness(0.93)' : 'none', cursor: 'pointer', transition: 'filter 0.12s', ...style }}
    >
      {prefixIcon && (
        <div style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: spacing.xs }}>
          {prefixIcon}
        </div>
      )}
      <TruncatedText text={title} style={{ ...typography.styles.subtitle2, flex: '1 0 0', minWidth: 0, color }}>
        {title}
      </TruncatedText>
      {isOpen ? <ExpandLessIcon style={{ fontSize: 24, color, flexShrink: 0 }} /> : <ExpandMoreIcon style={{ fontSize: 24, color, flexShrink: 0 }} />}
    </div>
  );
}
