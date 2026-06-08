import React, { useState, useId } from 'react';
import type { ReactNode, CSSProperties, ChangeEventHandler, InputHTMLAttributes } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { spacing }    from '@/styles/tokens/spacing';
import { opacity }    from '@/styles/tokens/opacity';
import { typography } from '@/styles/tokens/typography';

type RadioType = 'primary' | 'surface';
const colorMap: Record<RadioType, string> = { primary: colors.primary.main, surface: colors.surface.main };

function RadioCircle({ checked, color }: { checked: boolean; color: string }) {
  const ring = checked ? color : colors.surface.medium;
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, display: 'block' }}>
      <circle cx="10" cy="10" r="9" stroke={ring} strokeWidth="2" />
      {checked && <circle cx="10" cy="10" r="5" fill={color} />}
    </svg>
  );
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  type?: RadioType;
  checked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Radio({ type = 'primary', value, checked = false, disabled = false, onChange, children, name, style, ...props }: RadioProps) {
  const [hovered, setHovered] = useState(false);
  const color = colorMap[type] ?? colorMap.primary;

  return (
    <label onMouseEnter={() => !disabled && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? opacity.disable : hovered ? opacity['level-semiopaque'] : 1, userSelect: 'none', ...style }}>
      <input type="radio" value={value} checked={checked} disabled={disabled} onChange={onChange} name={name} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0 }} {...props} />
      <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <RadioCircle checked={checked} color={color} />
      </div>
      {children != null && <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>{children}</span>}
    </label>
  );
}

interface RadioGroupProps {
  label?: string;
  type?: RadioType;
  value?: string;
  onChange?: (value: string) => void;
  direction?: 'row' | 'column';
  disabled?: boolean;
  children?: ReactNode;
  name?: string;
  style?: CSSProperties;
}

export function RadioGroup({ label, type = 'primary', value, onChange, direction = 'row', disabled = false, children, name, style }: RadioGroupProps) {
  const generated = useId();
  const groupName = name ?? generated;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing['bt-3'], ...style }}>
      {label != null && <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>{label}:</span>}
      <div style={{ display: 'flex', flexDirection: direction === 'column' ? 'column' : 'row', gap: direction === 'column' ? spacing.xs : spacing.sm, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {React.Children.map(children, (child) =>
          child && React.isValidElement(child)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? React.cloneElement(child as React.ReactElement, { type: (child.props as any).type ?? type, name: groupName, checked: (child.props as any).value === value, disabled: disabled || (child.props as any).disabled, onChange: () => onChange?.((child.props as any).value) } as any)
            : null
        )}
      </div>
    </div>
  );
}
