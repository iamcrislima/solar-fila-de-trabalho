import type { CSSProperties, ReactNode } from 'react';
import { IconInput } from '../IconInput/IconInput';
import { colors }  from '@/styles/tokens/colors';
import { borders } from '@/styles/tokens/borders';
import { spacing } from '@/styles/tokens/spacing';

interface IconBoxItem { icon?: ReactNode; label?: string; active?: boolean; onClick?: () => void; }
interface InputIconBoxProps { items?: IconBoxItem[]; style?: CSSProperties; }

export function InputIconBox({ items = [], style }: InputIconBoxProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start', gap: spacing['bt-3'], padding: spacing.xs, width: 400, backgroundColor: colors.surface.xxxl, border: `1px solid ${colors.surface.medium}`, borderRadius: borders.radius.md, boxSizing: 'border-box', ...style }}>
      {items.map(({ icon, label, active, onClick }) => (
        <IconInput key={label ?? String(active)} icon={icon} label={label} active={active} onClick={onClick} />
      ))}
    </div>
  );
}
