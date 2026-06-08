import React from 'react';
import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { spacing }    from '@/styles/tokens/spacing';
import { typography } from '@/styles/tokens/typography';

type ChipColor = 'primary' | 'warning' | 'success' | 'surface' | 'error' | 'support';
type ChipSize  = 'md' | 'sm' | 'xs';

const schemes: Record<ChipColor, { filled: { background: string; color: string; border: string }; outline: { background: string; color: string; border: string } }> = {
  primary: { filled: { background: colors.primary.main,  color: colors.surface.xxxl, border: 'none' }, outline: { background: 'transparent', color: colors.primary.main,  border: `1px solid ${colors.primary.main}` } },
  warning: { filled: { background: colors.warning.main,  color: colors.surface.xxxl, border: 'none' }, outline: { background: 'transparent', color: colors.warning.main,  border: `1px solid ${colors.warning.main}` } },
  success: { filled: { background: colors.success.main,  color: colors.surface.xxxl, border: 'none' }, outline: { background: 'transparent', color: colors.success.main,  border: `1px solid ${colors.success.main}` } },
  surface: { filled: { background: colors.surface.light, color: colors.surface.main,  border: 'none' }, outline: { background: 'transparent', color: colors.surface.main,  border: `1px solid ${colors.surface.main}` } },
  error:   { filled: { background: colors.error.main,    color: colors.surface.xxxl, border: 'none' }, outline: { background: 'transparent', color: colors.error.main,    border: `1px solid ${colors.error.main}` } },
  support: { filled: { background: colors.support.main,  color: colors.surface.xxxl, border: 'none' }, outline: { background: 'transparent', color: colors.support.main,  border: `1px solid ${colors.support.main}` } },
};

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  color?: ChipColor;
  outline?: boolean;
  size?: ChipSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Chip({ children, color = 'warning', outline = false, size = 'md', leadingIcon = null, trailingIcon = null, style, ...props }: ChipProps) {
  const scheme = schemes[color]?.[outline ? 'outline' : 'filled'] ?? schemes.warning.filled;
  const hasIcon = leadingIcon || trailingIcon;
  const isMd = size === 'md', isXs = size === 'xs';
  const textStyle = isMd ? typography.styles.body1 : isXs ? typography.styles.caption : typography.styles.body2;
  const iconSize  = isMd ? 24 : isXs ? 14 : 16;
  const pt = isMd ? spacing.xxs : isXs ? '1px' : spacing.xxxs;
  const pb = isMd && !hasIcon ? spacing.bt : isMd ? spacing.xxs : isXs ? '2px' : '3px';
  const pl = leadingIcon  ? spacing.xxs : isMd ? spacing['bt-2'] : isXs ? spacing.bt : spacing.xs;
  const pr = trailingIcon ? spacing.xxs : isMd ? spacing['bt-2'] : isXs ? spacing.bt : spacing.xs;
  const iconStyle: CSSProperties = { display: 'block', fontSize: iconSize, flexShrink: 0 };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs, borderRadius: borders.radius.pill, paddingTop: pt, paddingBottom: pb, paddingLeft: pl, paddingRight: pr, whiteSpace: 'nowrap', cursor: 'default', ...scheme, ...style }} {...props}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {leadingIcon && React.cloneElement(leadingIcon as React.ReactElement, { style: { ...iconStyle, color: scheme.color, ...((leadingIcon as any).props?.style) } } as any)}
      <span style={{ ...textStyle, color: scheme.color }}>{children}</span>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {trailingIcon && React.cloneElement(trailingIcon as React.ReactElement, { style: { ...iconStyle, color: scheme.color, ...((trailingIcon as any).props?.style) } } as any)}
    </div>
  );
}

interface NotificationChipProps extends HTMLAttributes<HTMLDivElement> { count?: number; }
export function NotificationChip({ count = 1, style, ...props }: NotificationChipProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: borders.radius.pill, backgroundColor: colors.error.main, color: colors.surface.xxxl, padding: `0 ${spacing.xxs}`, minWidth: 16, height: 16, ...style }} {...props}>
      <span style={{ ...typography.styles.topIcon, color: colors.surface.xxxl }}>{count}</span>
    </div>
  );
}
