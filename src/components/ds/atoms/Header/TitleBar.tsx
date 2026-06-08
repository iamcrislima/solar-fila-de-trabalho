import type { ReactNode, CSSProperties } from 'react';
import { colors } from '@/styles/tokens/colors';

// TitleBar — Figma node: 623:83949

interface TitleBarProps {
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  tabs?: ReactNode;
  style?: CSSProperties;
}

export function TitleBar({ breadcrumb, actions, tabs, style }: TitleBarProps) {
  return (
    <div style={{ backgroundColor: colors.surface.xxxl, width: '100%', boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px' }}>
        <div style={{ flex: 1 }}>{breadcrumb}</div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>
      {tabs && <div style={{ width: '100%' }}>{tabs}</div>}
    </div>
  );
}
