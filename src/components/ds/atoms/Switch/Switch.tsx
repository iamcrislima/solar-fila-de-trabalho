import { useState } from 'react';
import type { CSSProperties, ChangeEventHandler } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { spacing }    from '@/styles/tokens/spacing';
import { opacity }    from '@/styles/tokens/opacity';
import { typography } from '@/styles/tokens/typography';

interface SwitchProps {
  type?: 'primary' | 'surface';
  checked?: boolean;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onLabel?: string;
  offLabel?: string;
  showLabel?: boolean;
  noContainer?: boolean;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Switch({ type = 'primary', checked = false, disabled = false, onChange, onLabel = 'On', offLabel = 'Off', showLabel = true, noContainer = false, style, ...props }: SwitchProps) {
  const [hovered, setHovered] = useState(false);

  const activeColor = type === 'primary' ? colors.primary.main : colors.surface.main;
  const trackColor = checked ? activeColor : colors.surface.medium;
  const thumbColor = checked ? activeColor : colors.surface.xxxl;

  const containerStyle: CSSProperties = noContainer
    ? { display: 'inline-flex', alignItems: 'center', gap: spacing.xs, opacity: disabled ? opacity.disable : hovered ? opacity['level-semiopaque'] : 1, ...style }
    : { display: 'inline-flex', alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xs, paddingBottom: spacing.xs, paddingLeft: spacing.sm, paddingRight: spacing.sm, borderRadius: borders.radius.lg, backgroundColor: colors.surface.xl, opacity: disabled ? opacity.disable : hovered ? opacity['level-semiopaque'] : 1, ...style };

  return (
    <label
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...containerStyle, userSelect: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0 }} {...(props as Record<string, unknown>)} />
      <div style={{ position: 'relative', width: 37, height: 20, flexShrink: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <div style={{ position: 'absolute', top: 3, bottom: 3, left: 0, right: 1, borderRadius: borders.radius.pill, backgroundColor: trackColor, opacity: 0.40, transition: 'background-color 0.2s' }} />
        <div style={{ position: 'absolute', top: 0, left: checked ? 17 : 0, width: 20, height: 20, borderRadius: borders.radius.circular, backgroundColor: thumbColor, boxShadow: '0px 1px 3px rgba(0,0,0,0.24)', transition: 'left 0.2s ease, background-color 0.2s' }} />
      </div>
      {showLabel && <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>{checked ? onLabel : offLabel}</span>}
    </label>
  );
}
