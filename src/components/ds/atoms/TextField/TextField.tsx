import React, { useState, useId } from 'react';
import type { ReactNode, CSSProperties, ChangeEventHandler, InputHTMLAttributes } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { spacing }    from '@/styles/tokens/spacing';
import { opacity }    from '@/styles/tokens/opacity';
import { typography } from '@/styles/tokens/typography';

const STYLE_ID = 'sds-textfield-placeholder';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `.sds-tf-input::placeholder { color: rgba(97,97,97,0.40); }\n.sds-tf-input-error::placeholder { color: rgba(183,28,28,0.40); }`;
  document.head.appendChild(el);
}

const SHADOW_FOCUS = '0px 0px 0px 2px rgba(2,136,209,0.24)';
const SHADOW_ERROR = '0px 0px 0px 2px rgba(183,28,28,0.24)';
const helperColors: Record<string, string> = { default: colors.surface.main, error: colors.error.main, success: colors.success.main, warning: colors.warning.main };

type TextFieldVariant = 'default' | 'error' | 'readOnly';
type HelperVariant = 'default' | 'error' | 'success' | 'warning';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  mandatory?: boolean;
  boldLabel?: boolean;
  labelIcon?: ReactNode;
  variant?: TextFieldVariant;
  helperText?: string;
  helperVariant?: HelperVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

export function TextField({ label, mandatory = false, boldLabel = false, labelIcon = null, variant = 'default', disabled = false, placeholder, value, defaultValue, onChange, helperText, helperVariant = 'default', leadingIcon = null, trailingIcon = null, type = 'text', style, inputStyle, ...props }: TextFieldProps) {
  const id = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isError = variant === 'error';
  const isReadOnly = variant === 'readOnly';

  const borderColor = (() => {
    if (disabled || isReadOnly) return colors.surface.medium;
    if (isError) return colors.error.main;
    if (focused) return colors.primary.medium;
    if (hovered) return colors.surface.main;
    return colors.surface.medium;
  })();

  const boxShadow = (() => {
    if (disabled || isReadOnly) return 'none';
    if (isError && focused) return SHADOW_ERROR;
    if (focused) return SHADOW_FOCUS;
    return 'none';
  })();

  const fieldOpacity = disabled ? opacity.disable : 1;
  const bgColor = isReadOnly ? colors.surface.light : colors.surface.xxxl;
  const textColor = isError ? colors.error.main : colors.surface.main;
  const iconOpacity = (disabled || isReadOnly) ? 0.40 : 1;
  const labelText = label != null ? `${label}${mandatory ? '*' : ''}:` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs, opacity: fieldOpacity, ...style }}>
      {labelText != null && (
        <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs, cursor: disabled || isReadOnly ? 'default' : 'pointer' }}>
          <span style={{ ...typography.styles.body2, fontWeight: boldLabel ? typography.fontWeight.semibold : typography.fontWeight.regular, color: colors.secondary.dark, whiteSpace: 'nowrap' }}>{labelText}</span>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {labelIcon && React.cloneElement(labelIcon as React.ReactElement, { style: { display: 'block', fontSize: 18, color: colors.surface.main, ...((labelIcon as any).props?.style) } } as any)}
        </label>
      )}
      <div onMouseEnter={() => !disabled && !isReadOnly && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'flex', alignItems: 'center', paddingTop: spacing.xs, paddingBottom: spacing['bt-2'], paddingLeft: spacing['bt-3'], paddingRight: spacing['bt-3'], gap: spacing.xs, borderRadius: borders.radius.md, border: `1px solid ${borderColor}`, backgroundColor: bgColor, boxShadow, boxSizing: 'border-box', width: '100%' }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {leadingIcon && React.cloneElement(leadingIcon as React.ReactElement, { style: { display: 'block', fontSize: 24, color: colors.surface.medium, opacity: iconOpacity, flexShrink: 0, ...((leadingIcon as any).props?.style) } } as any)}
        <input id={id} type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} readOnly={isReadOnly} disabled={disabled} onChange={onChange} onFocus={() => !isReadOnly && setFocused(true)} onBlur={() => setFocused(false)} className={isError ? 'sds-tf-input-error' : 'sds-tf-input'} style={{ flex: '1 0 0', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', padding: 0, margin: 0, ...typography.styles.body1, color: textColor, cursor: isReadOnly ? 'default' : 'text', ...inputStyle }} {...props} />
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {trailingIcon && React.cloneElement(trailingIcon as React.ReactElement, { style: { display: 'block', fontSize: 24, color: colors.surface.medium, opacity: iconOpacity, flexShrink: 0, ...((trailingIcon as any).props?.style) } } as any)}
      </div>
      {helperText != null && <span style={{ ...typography.styles.caption, color: helperColors[helperVariant] ?? helperColors.default, paddingLeft: spacing.sm }}>{helperText}</span>}
    </div>
  );
}
