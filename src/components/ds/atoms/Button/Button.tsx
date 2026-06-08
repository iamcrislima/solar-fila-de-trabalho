import { useState } from 'react';
import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from 'react';
import React from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { spacing }    from '@/styles/tokens/spacing';
import { opacity }    from '@/styles/tokens/opacity';
import { typography } from '@/styles/tokens/typography';

type ButtonType = 'primary' | 'secondary';
type ButtonVariant = 'filled' | 'outline' | 'flat' | 'dark';

interface ColorScheme {
  backgroundColor: string;
  color: string;
  border: string;
  opacity: number;
}

const schemes: Record<ButtonType, Record<ButtonVariant, Record<string, ColorScheme>>> = {
  primary: {
    filled:  { normal: { backgroundColor: colors.primary.main,   color: colors.surface.xxxl,   border: 'none', opacity: 1 }, hover: { backgroundColor: colors.primary.main,   color: colors.surface.xxxl,   border: 'none', opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: colors.surface.light,  color: colors.surface.medium, border: 'none', opacity: 1 } },
    outline: { normal: { backgroundColor: 'transparent',          color: colors.primary.main,   border: `1px solid ${colors.primary.main}`, opacity: 1 }, hover: { backgroundColor: colors.primary.xxl,    color: colors.primary.main,   border: `1px solid ${colors.primary.main}`, opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: `1px solid ${colors.surface.medium}`, opacity: opacity['level-medium'] } },
    flat:    { normal: { backgroundColor: 'transparent',          color: colors.primary.main,   border: 'none', opacity: 1 }, hover: { backgroundColor: colors.primary.xxl,    color: colors.primary.main,   border: 'none', opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: 'none', opacity: opacity['level-medium'] } },
    dark:    { normal: { backgroundColor: 'transparent',          color: colors.primary.light,  border: `1px solid ${colors.primary.light}`, opacity: 1 }, hover: { backgroundColor: 'transparent', color: colors.primary.light, border: `1px solid ${colors.primary.light}`, opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: `1px solid ${colors.surface.medium}`, opacity: opacity['level-medium'] } },
  },
  secondary: {
    filled:  { normal: { backgroundColor: colors.secondary.main, color: colors.surface.xxxl,   border: 'none', opacity: 1 }, hover: { backgroundColor: colors.secondary.main, color: colors.surface.xxxl,   border: 'none', opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: colors.surface.light, color: colors.surface.medium, border: 'none', opacity: 1 } },
    outline: { normal: { backgroundColor: 'transparent',          color: colors.secondary.main, border: `1px solid ${colors.secondary.main}`, opacity: 1 }, hover: { backgroundColor: colors.secondary.xxl,  color: colors.secondary.main, border: `1px solid ${colors.secondary.main}`, opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: `1px solid ${colors.surface.medium}`, opacity: opacity['level-medium'] } },
    flat:    { normal: { backgroundColor: 'transparent',          color: colors.secondary.main, border: 'none', opacity: 1 }, hover: { backgroundColor: colors.secondary.xxl,  color: colors.secondary.main, border: 'none', opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: 'none', opacity: opacity['level-medium'] } },
    dark:    { normal: { backgroundColor: 'transparent',          color: colors.secondary.light,border: `1px solid ${colors.secondary.light}`, opacity: 1 }, hover: { backgroundColor: 'transparent', color: colors.secondary.light, border: `1px solid ${colors.secondary.light}`, opacity: opacity['level-semiopaque'] }, disabled: { backgroundColor: 'transparent', color: colors.surface.medium, border: `1px solid ${colors.surface.medium}`, opacity: opacity['level-medium'] } },
  },
};

const iconStyle: CSSProperties = { display: 'block', fontSize: 24, flexShrink: 0 };

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  variant?: ButtonVariant;
  disabled?: boolean;
  leadingIcon?: ReactElement | null;
  trailingIcon?: ReactElement | null;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

type ReactElement = React.ReactElement;

export function Button({ type = 'primary', variant = 'filled', disabled = false, leadingIcon = null, trailingIcon = null, children, onClick, style, ...props }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const stateKey = disabled ? 'disabled' : hovered ? 'hover' : 'normal';
  const scheme = schemes[type]?.[variant]?.[stateKey] ?? schemes.primary.filled.normal;
  const { opacity: op, color, ...rest } = scheme;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', alignItems: 'center', padding: `${spacing.bt} ${spacing.xs}`, borderRadius: borders.radius.md, cursor: disabled ? 'not-allowed' : 'pointer', opacity: op, outline: 'none', boxSizing: 'border-box', color, ...rest, ...style }}
      {...props}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {leadingIcon && React.cloneElement(leadingIcon, { style: { ...iconStyle, color, ...((leadingIcon.props as any)?.style) } } as any)}
      {children != null && (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `3px ${spacing.xs} 4px` }}>
          <span style={{ ...typography.styles.buttonSemiBold, color, whiteSpace: 'nowrap' }}>{children}</span>
        </span>
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {trailingIcon && React.cloneElement(trailingIcon, { style: { ...iconStyle, color, ...((trailingIcon.props as any)?.style) } } as any)}
    </button>
  );
}

interface FloatingButtonProps {
  type?: ButtonType;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function FloatingButton({ type = 'primary', children, onClick, style, ...props }: FloatingButtonProps) {
  const [hovered, setHovered] = useState(false);
  const bg = type === 'primary' ? colors.primary.dark : colors.secondary.dark;
  const shadow = hovered ? '0px 4px 4px 0px rgba(0,0,0,0.32)' : '0px 8px 12px 0px rgba(0,0,0,0.40)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs, padding: spacing.xs, borderRadius: borders.radius.circular, backgroundColor: bg, boxShadow: shadow, border: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box', ...style }}
      {...(props as Record<string, unknown>)}
    >
      {React.Children.map(children, (child) =>
        child && React.isValidElement(child)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? React.cloneElement(child as ReactElement, { style: { display: 'block', fontSize: 24, color: colors.surface.xxxl, ...((child.props as any)?.style) } } as any)
          : null
      )}
    </button>
  );
}

interface ButtonGroupProps {
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function ButtonGroup({ leftActions, rightActions, style, ...props }: ButtonGroupProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.xxs, width: '100%', ...style }} {...(props as Record<string, unknown>)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>{leftActions}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>{rightActions}</div>
    </div>
  );
}
