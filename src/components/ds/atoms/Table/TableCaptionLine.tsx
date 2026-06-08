import type { ReactNode, CSSProperties } from 'react';
import { TableCaption } from './TableCaption';

// TableCaptionLine — Figma node: 580:40558

interface CaptionItem { type?: string; icon?: ReactNode; label?: string; color?: string; }
interface TableCaptionLineProps { items?: CaptionItem[]; style?: CSSProperties; }

export function TableCaptionLine({ items = [], style }: TableCaptionLineProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, ...style }}>
      {items.map((item, i) => (
        <TableCaption key={i} type={item.type as Parameters<typeof TableCaption>[0]["type"]} icon={item.icon} label={item.label} color={item.color} />
      ))}
    </div>
  );
}
