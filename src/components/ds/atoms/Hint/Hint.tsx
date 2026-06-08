import type { CSSProperties, ReactNode, HTMLAttributes } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { shadows }    from '@/styles/tokens/shadows';
import { borders }    from '@/styles/tokens/borders';
import { spacing }    from '@/styles/tokens/spacing';
import { size }       from '@/styles/tokens/size';
import { typography } from '@/styles/tokens/typography';

const base: CSSProperties = {
  display: 'flex', alignItems: 'flex-start',
  padding: `${spacing.xxxs} ${spacing.xs} ${spacing.bt}`,
  borderRadius: borders.radius.md, maxHeight: 56, overflow: 'visible',
};

const variantStyles: Record<string, CSSProperties> = {
  default: { backgroundColor: colors.surface.main, boxShadow: shadows.level1, color: colors.surface.xxxl, maxWidth: size.container.xxs, overflow: 'visible', whiteSpace: 'nowrap' },
  stroke:  { backgroundColor: colors.surface.main, boxShadow: shadows.level1, color: colors.surface.xxxl, border: `1px solid ${colors.surface.xxxl}`, maxWidth: size.container.xxs, overflow: 'visible', whiteSpace: 'nowrap' },
  light:   { backgroundColor: colors.surface.xxxl, boxShadow: shadows.level1, color: colors.surface.main, maxWidth: size.container.xxs, overflow: 'visible', whiteSpace: 'nowrap' },
};

interface HintMainProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stroke' | 'light';
  children?: ReactNode;
  style?: CSSProperties;
}

export function HintMain({ variant = 'default', children = 'Caption here', style, ...props }: HintMainProps) {
  const vs = variantStyles[variant] ?? variantStyles.default;
  return (
    <div style={{ ...base, ...vs, ...style }} {...props}>
      <p style={{ ...typography.styles.caption, flex: '1 0 0', minWidth: 0, color: vs.color as string, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

interface HintGiantProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function HintGiant({ label, children, style, ...props }: HintGiantProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxxs, alignItems: 'flex-start', padding: `${spacing.xxxs} ${spacing.xs} ${spacing.bt}`, borderRadius: borders.radius.md, backgroundColor: colors.surface.xxxl, boxShadow: shadows.level3, width: size.container.mobi, color: colors.surface.main, ...style }} {...props}>
      {label && <p style={{ ...typography.styles.caption, fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>{label}</p>}
      <p style={{ ...typography.styles.caption, margin: 0 }}>{children}</p>
    </div>
  );
}
