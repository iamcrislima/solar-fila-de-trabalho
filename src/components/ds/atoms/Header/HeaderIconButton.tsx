import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { colors }    from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// HeaderIconButton — Figma node: 619:121722

interface HeaderIconButtonProps {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  iconColor?: string;
  labelColor?: string;
  compact?: boolean;
  style?: CSSProperties;
}

export function HeaderIconButton({
  icon,
  label,
  onClick,
  iconColor  = colors.surface.main,
  labelColor = colors.surface.main,
  compact    = false,
  style,
}: HeaderIconButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 0 : 4, padding: compact ? '8px 6px' : '16px 12px 7px', border: 'none', background: hovered ? colors.surface.xl : 'transparent', cursor: 'pointer', boxSizing: 'border-box', borderRadius: 4, transition: 'background 0.12s', ...style }}
    >
      <span style={{ display: 'flex', alignItems: 'center', color: iconColor, fontSize: 24 }}>{icon}</span>
      {label && !compact && (
        <span style={{ ...typography.styles.topIcon, color: labelColor, whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
    </button>
  );
}
