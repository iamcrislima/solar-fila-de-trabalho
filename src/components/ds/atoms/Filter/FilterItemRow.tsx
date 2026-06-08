import { useState } from 'react';
import type { CSSProperties, ChangeEventHandler } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Checkbox }         from '../Checkbox';
import { FilterCountBadge } from './FilterCountBadge';
import { TruncatedText }    from '../TruncatedText';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// FilterItemRow — Figma node: 592:90655

interface FilterItemRowProps {
  label?: string;
  count?: number;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  expanded?: boolean;
  onToggle?: () => void;
  showExpander?: boolean;
  showCheckbox?: boolean;
  showCount?: boolean;
  style?: CSSProperties;
}

export function FilterItemRow({ label = 'Item', count, checked = false, onChange, expanded = false, onToggle, showExpander = true, showCheckbox = true, showCount = true, style }: FilterItemRowProps) {
  const [hovered, setHovered] = useState(false);
  const bg = hovered ? colors.surface.xxl : colors.surface.xxxl;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: bg, paddingLeft: 4, paddingRight: 8, paddingTop: 8, paddingBottom: 8, boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', flex: 1, gap: 4, alignItems: 'center', minWidth: 0 }}>
        {showExpander && (
          <button onClick={onToggle} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
            {expanded ? <ExpandLessIcon style={{ fontSize: 24, color: colors.surface.main }} /> : <ExpandMoreIcon style={{ fontSize: 24, color: colors.surface.main }} />}
          </button>
        )}
        {showCheckbox && <Checkbox type="surface" checked={checked} onChange={onChange} style={{ flexShrink: 0 }} />}
        <TruncatedText text={label} style={{ ...typography.styles.overline, color: colors.surface.dark, flex: 1 }}>{label}</TruncatedText>
      </div>
      {showCount && count !== undefined && <FilterCountBadge count={count} />}
    </div>
  );
}
