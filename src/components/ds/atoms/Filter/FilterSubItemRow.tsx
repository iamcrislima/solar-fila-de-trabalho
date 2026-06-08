import { useState } from 'react';
import type { CSSProperties, ChangeEventHandler } from 'react';
import { Checkbox }         from '../Checkbox';
import { FilterCountBadge } from './FilterCountBadge';
import { TruncatedText }    from '../TruncatedText';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// FilterSubItemRow — Figma node: 595:78659

interface FilterSubItemRowProps {
  label?: string;
  count?: number;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  showCheckbox?: boolean;
  showCount?: boolean;
  style?: CSSProperties;
}

export function FilterSubItemRow({ label = 'Sub Item', count, checked = false, onChange, showCheckbox = true, showCount = true, style }: FilterSubItemRowProps) {
  const [hovered, setHovered] = useState(false);
  const bg = hovered ? colors.surface.xxl : colors.surface.xxxl;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: bg, paddingLeft: 4, paddingRight: 8, paddingTop: 8, paddingBottom: 8, boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', flex: 1, gap: 4, alignItems: 'center', minWidth: 0 }}>
        {showCheckbox && <Checkbox type="surface" checked={checked} onChange={onChange} style={{ flexShrink: 0 }} />}
        <TruncatedText text={label} style={{ ...typography.styles.overline, color: colors.surface.dark, flex: 1 }}>{label}</TruncatedText>
      </div>
      {showCount && count !== undefined && <FilterCountBadge count={count} />}
    </div>
  );
}
