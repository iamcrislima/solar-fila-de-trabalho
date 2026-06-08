import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

const DEFAULT_ACTIVE   = colors.primary.main;
const DEFAULT_INACTIVE = colors.surface.main;

interface TabItem { label: string; icon?: ReactNode; }

interface TabsProps {
  orientation?: 'h' | 'v';
  tabs?: TabItem[];
  active?: number;
  defaultActive?: number;
  onChange?: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  style?: CSSProperties;
}

export function Tabs({ orientation = 'h', tabs = [], active: activeProp, defaultActive = 0, onChange, activeColor, inactiveColor, style }: TabsProps) {
  const ACTIVE   = activeColor   ?? DEFAULT_ACTIVE;
  const INACTIVE = inactiveColor ?? DEFAULT_INACTIVE;
  const [internal, setInternal] = useState(defaultActive);
  const isControlled = activeProp !== undefined;
  const active = isControlled ? activeProp! : internal;
  const isH = orientation === 'h';

  function handleSelect(i: number) {
    if (!isControlled) setInternal(i);
    onChange?.(i);
  }

  return (
    <div style={{ display: 'flex', flexDirection: isH ? 'row' : 'column', alignItems: 'flex-start', ...(isH ? { maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden' } : {}), ...style }}>
      {tabs.map((tab, i) => {
        const isActive = i === active;
        const hasIcon  = !!tab.icon;
        return (
          <button key={i} onClick={() => handleSelect(i)} style={{ display: 'flex', alignItems: 'center', gap: hasIcon ? 8 : 0, paddingTop: hasIcon ? (isH ? 5 : 2.5) : (isH ? 8 : 6), paddingBottom: hasIcon ? (isH ? 8 : 8.5) : (isH ? 12 : 12), paddingLeft: hasIcon ? 12 : (isH ? 24 : 12), paddingRight: 24, border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0, ...(isH ? { borderBottom: isActive ? `2px solid ${ACTIVE}` : '2px solid transparent' } : { borderRight: `2px solid ${isActive ? ACTIVE : INACTIVE}` }) }}>
            {hasIcon && <span style={{ fontSize: 24, display: 'flex', alignItems: 'center', color: isActive ? ACTIVE : INACTIVE }}>{tab.icon}</span>}
            <span style={{ ...typography.styles.subtitle2, color: isActive ? ACTIVE : INACTIVE, whiteSpace: 'nowrap' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
