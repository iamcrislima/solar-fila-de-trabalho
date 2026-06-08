import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { SideMenuHeader } from './SideMenuHeader';

// SideMenuSection — seção colapsável do painel lateral

interface SideMenuSectionProps {
  title?: string;
  prefixIcon?: ReactNode;
  titleColor?: string;
  theme?: 'default' | 'dark';
  defaultOpen?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export function SideMenuSection({ title, prefixIcon, titleColor, theme = 'default', defaultOpen = false, style, children }: SideMenuSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={style}>
      <SideMenuHeader title={title} prefixIcon={prefixIcon} titleColor={titleColor} theme={theme} open={open} onToggle={setOpen} />
      <div style={{ overflow: 'hidden', maxHeight: open ? 2000 : 0, transition: 'max-height 0.25s ease' }}>
        {children}
      </div>
    </div>
  );
}
