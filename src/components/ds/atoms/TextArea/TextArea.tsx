import React, { useState, useId } from 'react';
import { colors }     from '../../../../styles/tokens/colors';
import { borders }    from '../../../../styles/tokens/borders';
import { spacing }    from '../../../../styles/tokens/spacing';
import { opacity }    from '../../../../styles/tokens/opacity';
import { typography } from '../../../../styles/tokens/typography';

// ─── Placeholder CSS (não alcançável por inline styles) ───────────────────────

const STYLE_ID = 'sds-textarea-placeholder';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = [
    `.sds-ta::placeholder { color: rgba(97,97,97,0.40); }`,
    `.sds-ta-error::placeholder { color: rgba(183,28,28,0.40); }`,
  ].join('\n');
  document.head.appendChild(el);
}

// ─── Helper colors ────────────────────────────────────────────────────────────

const helperColors = {
  default: colors.surface.main,
  error:   colors.error.main,
  success: colors.success.main,
  warning: colors.warning.main,
};

// ─── TextArea ─────────────────────────────────────────────────────────────────

/**
 * Campo de texto multilinha. Mesma API visual do TextField, sem ícones.
 * Sem focus shadow — comportamento exato do Figma (só troca a cor da borda).
 *
 * @param {string}                                 props.label
 * @param {boolean}                                props.mandatory
 * @param {boolean}                                props.boldLabel
 * @param {React.ReactNode}                        props.labelIcon
 * @param {'default'|'error'|'readOnly'}           props.variant
 * @param {boolean}                                props.disabled
 * @param {string}                                 props.placeholder
 * @param {string}                                 props.helperText
 * @param {'default'|'error'|'success'|'warning'}  props.helperVariant
 * @param {number}                                 props.rows          — linhas iniciais (opcional)
 * @param {'none'|'vertical'|'both'}               props.resize
 * @param {React.CSSProperties}                    props.style         — container externo
 * @param {React.CSSProperties}                    props.textareaStyle — elemento <textarea>
 */
export function TextArea({
  label,
  mandatory     = false,
  boldLabel     = false,
  labelIcon     = null,
  variant       = 'default',
  disabled      = false,
  placeholder,
  value,
  defaultValue,
  onChange,
  helperText,
  helperVariant = 'default',
  rows,
  resize        = 'vertical',
  style,
  textareaStyle,
  ...props
}: { label?: string; mandatory?: boolean; boldLabel?: boolean; labelIcon?: unknown; variant?: string; disabled?: boolean; placeholder?: string; value?: string; defaultValue?: string; onChange?: React.ChangeEventHandler<HTMLTextAreaElement>; helperText?: string; helperVariant?: string; rows?: number; resize?: React.CSSProperties["resize"]; style?: React.CSSProperties; textareaStyle?: React.CSSProperties; [k: string]: unknown }) {
  const id       = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isError    = variant === 'error';
  const isReadOnly = variant === 'readOnly';

  // ── Estado visual ─────────────────────────────────────────────────────────
  // Nota: TextArea não tem focus box-shadow (diferente do TextField) — exato no Figma.

  const borderColor = (() => {
    if (disabled || isReadOnly) return colors.surface.medium;
    if (isError)                return colors.error.main;
    if (focused)                return colors.primary.medium;
    if (hovered)                return colors.surface.main;
    return colors.surface.medium;
  })();

  const bgColor      = isReadOnly ? colors.surface.light : colors.surface.xxxl;
  const fieldOpacity = disabled ? opacity.disable : 1;
  const textColor    = isError ? colors.error.main : colors.surface.main;
  const labelText    = label != null ? `${label}${mandatory ? '*' : ''}:` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs, opacity: fieldOpacity, ...style }}>

      {/* Label */}
      {labelText != null && (
        <label
          htmlFor={id}
          style={{
            display:    'inline-flex',
            alignItems: 'center',
            gap:        spacing.xxs,
            cursor:     disabled || isReadOnly ? 'default' : 'pointer',
          }}
        >
          <span style={{
            ...typography.styles.body2,
            fontWeight:  boldLabel ? typography.fontWeight.semibold : typography.fontWeight.regular,
            color:       colors.secondary.dark,
            whiteSpace:  'nowrap',
          }}>
            {labelText}
          </span>
          {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (labelIcon as React.ReactNode) && React.cloneElement(labelIcon as React.ReactElement<Record<string, unknown>>, { style: { display: "block", fontSize: 18, color: colors.surface.main, ...((labelIcon as any).props?.style) } } as any)
          }
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={isReadOnly}
        disabled={disabled}
        onChange={onChange}
        rows={rows}
        onMouseEnter={() => !disabled && !isReadOnly && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => !isReadOnly && setFocused(true)}
        onBlur={() => setFocused(false)}
        className={isError ? 'sds-ta-error' : 'sds-ta'}
        style={{
          display:         'block',
          width:           '100%',
          minHeight:        84,
          padding:         `${spacing['bt-2']} ${spacing['bt-3']}`,
          borderRadius:    borders.radius.md,
          border:          `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          boxSizing:       'border-box',
          resize,
          outline:         'none',
          ...typography.styles.body1,
          color:           textColor,
          cursor:          isReadOnly ? 'default' : 'text',
          transition:      'border-color 0.15s',
          ...textareaStyle,
        }}
        {...props}
      />

      {/* Helper text */}
      {helperText != null && (
        <span style={{
          ...typography.styles.caption,
          color:       helperColors[helperVariant as keyof typeof helperColors] ?? helperColors.default,
          paddingLeft: spacing.sm,
        }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
