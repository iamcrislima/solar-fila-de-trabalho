import type { CSSProperties, HTMLAttributes } from 'react';
import { colors } from '@/styles/tokens/colors';

const colorMap: Record<string, string> = {
  default: colors.surface.light,
  strong:  colors.surface.medium,
};

interface DividerHProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong';
  style?: CSSProperties;
}

export function DividerH({ variant = 'default', style, ...props }: DividerHProps) {
  const color = colorMap[variant] ?? colorMap.default;
  return (
    <div style={{ padding: '4px 0', width: '100%', ...style }} {...props}>
      <div style={{ height: 1, backgroundColor: color }} />
    </div>
  );
}

interface DividerVProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong';
  size?: 'default' | 'sm';
  style?: CSSProperties;
}

export function DividerV({ variant = 'default', size = 'default', style, ...props }: DividerVProps) {
  const color = colorMap[variant] ?? colorMap.default;
  const height = size === 'sm' ? 24 : 68;
  return (
    <div
      style={{ padding: '0 8px', height, display: 'inline-flex', alignItems: 'stretch', ...style }}
      {...props}
    >
      <div style={{ width: 1, height: '100%', backgroundColor: color }} />
    </div>
  );
}
