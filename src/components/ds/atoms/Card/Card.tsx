import type { ReactNode, CSSProperties } from 'react';
import { colors }  from '@/styles/tokens/colors';
import { shadows } from '@/styles/tokens/shadows';

// Card — Figma node: 512:2605

interface CardProps {
  children?: ReactNode;
  style?: CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div style={{ backgroundColor: colors.surface.xxxl, borderRadius: 8, boxShadow: shadows.level2, padding: 24, width: '100%', boxSizing: 'border-box', overflow: 'visible', ...style }}>
      {children}
    </div>
  );
}
