import type { ReactNode, CSSProperties } from 'react';
import { DividerH } from '../Divider';

// CardFooter — Figma node: 1094:130712

interface CardFooterProps {
  showDivider?: boolean;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  style?: CSSProperties;
}

export function CardFooter({ showDivider = true, leftActions, rightActions, style }: CardFooterProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', ...style }}>
      {showDivider && <DividerH style={{ padding: '16px 0 8px' }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{leftActions}</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{rightActions}</div>
      </div>
    </div>
  );
}
