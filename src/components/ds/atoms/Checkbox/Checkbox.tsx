import { useState } from 'react';
import type { ReactNode, CSSProperties, ChangeEventHandler } from 'react';
import { colors }        from '@/styles/tokens/colors';
import { borders }       from '@/styles/tokens/borders';
import { spacing }       from '@/styles/tokens/spacing';
import { opacity }       from '@/styles/tokens/opacity';
import { typography }    from '@/styles/tokens/typography';
import { colorsSolarBPM } from '@/styles/tokens/solarbpm/colors';

const CheckMark = () => (
  <svg viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '67%', height: '52%', display: 'block', flexShrink: 0 }}>
    <path d="M1 4L4.5 7.5L11 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashMark = () => (
  <svg viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '67%', height: '11%', display: 'block', flexShrink: 0 }}>
    <path d="M1 1H11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

type CheckboxType = 'primary' | 'surface' | 'solarbpm';

const colorMap: Record<CheckboxType, string> = {
  primary:  colors.primary.main,
  surface:  colors.surface.main,
  solarbpm: colorsSolarBPM.primary.main,
};

interface CheckboxProps {
  type?: CheckboxType;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Checkbox({ type = 'primary', checked = false, indeterminate = false, disabled = false, onChange, children, style, ...props }: CheckboxProps) {
  const [hovered, setHovered] = useState(false);
  const color = colorMap[type] ?? colorMap.primary;
  const isFilled = checked || indeterminate;

  return (
    <label
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? opacity.disable : 1, userSelect: 'none', ...style }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0 }} {...(props as Record<string, unknown>)} />
      <div style={{ width: spacing.md, height: spacing.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: borders.radius.sm, backgroundColor: isFilled ? color : 'transparent', border: `${borders.width.md} solid ${isFilled ? color : colors.surface.main}`, opacity: hovered && !disabled ? opacity['level-semiopaque'] : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', transition: 'background-color 0.12s, border-color 0.12s, opacity 0.12s' }}>
          {indeterminate ? <DashMark /> : checked ? <CheckMark /> : null}
        </div>
      </div>
      {children != null && <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>{children}</span>}
    </label>
  );
}
