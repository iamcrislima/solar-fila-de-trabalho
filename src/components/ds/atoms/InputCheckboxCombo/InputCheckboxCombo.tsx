import type { CSSProperties, ChangeEventHandler } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { colors }     from '@/styles/tokens/colors';
import { spacing }    from '@/styles/tokens/spacing';
import { typography } from '@/styles/tokens/typography';

interface CheckboxOption { label: string; checked?: boolean; onChange?: ChangeEventHandler<HTMLInputElement>; disabled?: boolean; }
interface InputCheckboxComboProps {
  label?: string;
  mandatory?: boolean;
  type?: 'primary' | 'surface';
  options?: CheckboxOption[];
  gap?: number;
  style?: CSSProperties;
}

export function InputCheckboxCombo({ label, mandatory = false, type = 'primary', options = [], gap = 16, style }: InputCheckboxComboProps) {
  const labelText = label != null ? `${label}${mandatory ? '*' : ''}:` : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['bt-3'], alignItems: 'flex-start', ...style }}>
      {labelText && <span style={{ ...typography.styles.body2, color: colors.surface.dark, whiteSpace: 'nowrap' }}>{labelText}</span>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap, alignItems: 'flex-start', width: '100%' }}>
        {options.map(({ label: optLabel, checked, onChange, disabled }, i) => (
          <Checkbox key={i} type={type} checked={checked} onChange={onChange} disabled={disabled}>{optLabel}</Checkbox>
        ))}
      </div>
    </div>
  );
}
