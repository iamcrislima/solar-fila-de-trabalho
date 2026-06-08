import React, { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { typography } from '@/styles/tokens/typography';

interface IconInputProps { icon?: ReactNode; label?: string; active?: boolean; onClick?: () => void; style?: CSSProperties; }

export function IconInput({ icon, label = 'ICO', active = false, onClick, style }: IconInputProps) {
  const [hovered, setHovered] = useState(false);
  const bg = active ? colors.primary.medium : hovered ? colors.surface.light : colors.surface.xl;
  const textColor = active ? colors.surface.xxxl : colors.surface.main;
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 54, paddingTop: 8, paddingBottom: 8, backgroundColor: bg, borderRadius: borders.radius.lg, border: 'none', cursor: 'pointer', transition: 'background-color 0.15s', ...style }}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {icon && React.cloneElement(icon as React.ReactElement, { style: { fontSize: 24, color: textColor, ...((icon as any).props?.style || {}) } } as any)}
      <span style={{ ...typography.styles.topIcon, color: textColor, userSelect: 'none' }}>{label}</span>
    </button>
  );
}
