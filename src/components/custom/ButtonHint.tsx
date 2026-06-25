import React, { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { IconPrinter } from '@tabler/icons-react';
import { Tooltip } from '../ds/atoms/Tooltip/Tooltip';
import { colors } from '@/styles/tokens/colors';
import { borders } from '@/styles/tokens/borders';

interface ButtonHintProps {
  icon?: ReactNode;
  hint?: string;
  /** Quando fornecido, renderiza ícone + texto (estilo G1 da toolbar). */
  label?: string;
  /**
   * 'default' → cinza (padrão)
   * 'blue'    → tbtn-blue: ícone e texto azul, hover azul claro
   * 'red'     → tbtn-red:  ícone e texto vermelho, hover vermelho claro
   */
  variant?: 'default' | 'blue' | 'red';
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

type IconEl = React.ReactElement<{ style?: CSSProperties; size?: number; stroke?: number }>;

export function ButtonHint({ icon, hint = 'Caption here', label, variant = 'default', onClick, disabled = false, style }: ButtonHintProps) {
  const [hovered, setHovered] = useState(false);
  const isActive = hovered && !disabled;

  /* ── Cores por variante ── */
  const accentColor =
    variant === 'blue' ? colors.primary.main :
    variant === 'red'  ? colors.error.main   :
    colors.secondary.main;

  const hoverBg =
    variant === 'blue' ? 'rgba(0,89,219,0.09)'   :
    variant === 'red'  ? 'rgba(183,28,28,0.09)'  :
    colors.secondary.xl;

  const hasLabel = !!label;
  const iconSize  = hasLabel ? 15 : 20;
  const baseIconStyle: CSSProperties = { color: accentColor };
  const iconEl = icon
    ? React.cloneElement(icon as IconEl, { size: iconSize, style: { ...baseIconStyle, ...(icon as IconEl).props?.style } })
    : <IconPrinter size={iconSize} style={baseIconStyle} />;

  const commonBtn: CSSProperties = {
    border:          'none',
    borderRadius:    borders.radius.lg,
    backgroundColor: isActive ? hoverBg : 'transparent',
    cursor:          disabled ? 'not-allowed' : 'pointer',
    transition:      'background-color 0.12s, color 0.12s',
    flexShrink:      0,
    fontFamily:      'inherit',
  };

  return (
    <div style={{ display: 'inline-flex', opacity: disabled ? 0.4 : 1, ...style }}>
      <Tooltip content={hint}>
        <button
          onClick={disabled ? undefined : onClick}
          aria-label={hint}
          aria-disabled={disabled}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={hasLabel ? {
            /* ── Labelled (G1 toolbar) ── */
            ...commonBtn,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            5,
            padding:        '5px 8px',
            height:         30,
            boxSizing:      'border-box',
          } : {
            /* ── Icon-only (padrão) ── */
            ...commonBtn,
            padding:        0,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            width:          32,
            height:         32,
          }}
        >
          {iconEl}
          {hasLabel && (
            <span style={{
              fontSize:   12,
              fontWeight: 500,
              color:      accentColor,
              whiteSpace: 'nowrap',
              lineHeight: '20px',
              letterSpacing: '-0.01em',
            }}>
              {label}
            </span>
          )}
        </button>
      </Tooltip>
    </div>
  );
}
