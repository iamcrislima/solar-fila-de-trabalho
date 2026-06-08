import { useEffect, useState } from 'react';
import type { ReactNode, ReactElement, CSSProperties } from 'react';
import React from 'react';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { TruncatedText } from '../TruncatedText';
import { typography } from '@/styles/tokens/typography';

// HeaderBar — Figma node: 623:85644

type HeaderTheme = 'default' | 'dark' | 'primary' | 'primary-dark' | 'secondary' | 'secondary-dark';

const THEMES: Record<HeaderTheme, { bg: string; icon: string; text: string }> = {
  'default':        { bg: '#FFFFFF',  icon: '#616161', text: '#616161' },
  'dark':           { bg: '#212121',  icon: '#E0E0E0', text: '#E0E0E0' },
  'primary':        { bg: '#00838F',  icon: '#FFFFFF',  text: '#FFFFFF'  },
  'primary-dark':   { bg: '#006064',  icon: '#FFFFFF',  text: '#FFFFFF'  },
  'secondary':      { bg: '#E0E0E0',  icon: '#616161', text: '#616161' },
  'secondary-dark': { bg: '#616161',  icon: '#FFFFFF',  text: '#FFFFFF'  },
};

interface HeaderBarProps {
  theme?: HeaderTheme;
  logo?: ReactNode;
  systemName?: string;
  onMenuToggle?: () => void;
  iconItems?: ReactElement[];
  userSlot?: ReactNode;
  style?: CSSProperties;
}

export function HeaderBar({
  theme      = 'default',
  logo,
  systemName = 'System Name',
  onMenuToggle,
  iconItems  = [],
  userSlot,
  style,
}: HeaderBarProps) {
  const t = THEMES[theme] ?? THEMES.default;
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [viewportWidth, setViewportWidth] = useState(getWidth);
  const compactHeader = viewportWidth <= 1100;

  useEffect(() => {
    const handleResize = () => setViewportWidth(getWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box', backgroundColor: t.bg, paddingLeft: 16, paddingRight: compactHeader ? 12 : 40, gap: 12, overflow: 'hidden', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: compactHeader ? 8 : 20, minWidth: 0, flex: '1 1 auto' }}>
        <button onClick={onMenuToggle} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: compactHeader ? 4 : 8, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <MenuOpenIcon style={{ fontSize: 24, color: t.icon }} />
        </button>
        {logo && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{logo}</span>}
        <TruncatedText text={systemName} style={{ ...typography.styles.title1, color: t.text, flex: '1 1 auto' }}>
          {systemName}
        </TruncatedText>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
        {iconItems.map((item, i) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.cloneElement(item, { key: i, iconColor: t.icon, labelColor: t.text, compact: compactHeader } as any)
        )}
        {userSlot && (
          <div style={{ marginLeft: 8 }}>
            {React.isValidElement(userSlot)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? React.cloneElement(userSlot as ReactElement, { iconColor: t.icon, textColor: t.text } as any)
              : userSlot}
          </div>
        )}
      </div>
    </div>
  );
}
