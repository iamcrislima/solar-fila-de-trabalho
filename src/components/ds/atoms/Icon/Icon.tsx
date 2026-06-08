import type { ElementType, CSSProperties } from 'react';

const sizeMap: Record<string, number> = {
  xs: 16, sm: 20, md: 24, lg: 32, xl: 40,
};

interface IconProps {
  component?: ElementType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Icon({ component: IconComponent, size = 'md', color, style, ...props }: IconProps) {
  if (!IconComponent) return null;
  const px = sizeMap[size] ?? sizeMap.md;
  return (
    <IconComponent
      style={{ fontSize: px, color, display: 'block', ...style }}
      {...props}
    />
  );
}
