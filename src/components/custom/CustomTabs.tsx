import { useState } from 'react';
import type { CSSProperties } from 'react';
import { typography } from '@/styles/tokens/typography';
import { colors }     from '@/styles/tokens/colors';

// CustomTabs — tabs com peso de fonte distinto no estado ativo
//
// Ativa:   fontWeight 700  |  cor escura (secondary.dark)  |  sublinhado escuro
// Inativa: fontWeight 400  |  cor sutil  (surface.medium)  |  sem sublinhado
//
// Nota: não modifica o componente DS Tabs (atoms/Tabs/Tabs.tsx),
// que só suporta mudança de cor, não de peso de fonte.

interface TabItem { label: string; }

interface CustomTabsProps {
  tabs?:         TabItem[];
  active?:       number;
  onChange?:     (index: number) => void;
  style?:        CSSProperties;
}

export function CustomTabs({
  tabs       = [],
  active:     activeProp,
  onChange,
  style,
}: CustomTabsProps) {
  const [internal, setInternal] = useState(0);
  const isControlled = activeProp !== undefined;
  const active       = isControlled ? activeProp! : internal;

  function handleSelect(i: number) {
    if (!isControlled) setInternal(i);
    onChange?.(i);
  }

  return (
    <div style={{
      display:     'flex',
      flexDirection: 'row',
      alignItems:  'flex-start',
      maxWidth:    '100%',
      overflowX:   'auto',
      overflowY:   'hidden',
      ...style,
    }}>
      {tabs.map((tab, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              display:       'flex',
              alignItems:    'center',
              paddingTop:    8,
              paddingBottom: 12,
              paddingLeft:   24,
              paddingRight:  24,
              border:        'none',
              background:    'none',
              cursor:        'pointer',
              flexShrink:    0,
              borderBottom:  isActive
                ? `2px solid ${colors.secondary.dark}`
                : '2px solid transparent',
            }}
          >
            <span style={{
              ...typography.styles.subtitle2,
              fontWeight:  isActive ? 700 : 400,
              color:       isActive ? colors.secondary.dark : colors.surface.medium,
              whiteSpace:  'nowrap',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
