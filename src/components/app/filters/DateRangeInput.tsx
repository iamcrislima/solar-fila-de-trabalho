import { DateInput } from '../DateInput';
import type { CSSProperties } from 'react';
import type { DateRange } from '@/domain/filtros/dateRange';
import { typography }    from '../../../styles/tokens/typography';
import { colors }        from '../../../styles/tokens/colors';

interface DateRangeInputProps {
  label?: string;
  value?: DateRange | null;
  onChange: (value: DateRange) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export function DateRangeInput({ label, value, onChange, disabled, style }: DateRangeInputProps) {
  const v = value ?? { from: null, to: null };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 0 0', minWidth: 0, ...style }}>
      <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <DateInput
          value={v.from}
          onChange={val => onChange({ ...v, from: val })}
          disabled={disabled}
          style={{ flex: '1 0 0', minWidth: 0 }}
        />
        <span style={{ ...typography.styles.body2, color: colors.secondary.dark, flexShrink: 0 }}>
          até
        </span>
        <DateInput
          value={v.to}
          onChange={val => onChange({ ...v, to: val })}
          disabled={disabled}
          style={{ flex: '1 0 0', minWidth: 0 }}
        />
      </div>
    </div>
  );
}
