import type { CSSProperties } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { shadows }    from '@/styles/tokens/shadows';
import { typography } from '@/styles/tokens/typography';

const CLOCK_SIZE = 256, CENTER = 128, OUTER_R = 102, INNER_R = 74, CELL_SIZE = 48;

function clockPos(posIndex: number, totalPositions: number, radius: number) {
  const angle = (posIndex / totalPositions) * 2 * Math.PI - Math.PI / 2;
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

interface HourPickerProps {
  variant?: 'begin' | 'end';
  value?: number;
  displayTime?: string;
  onChange?: (value: number) => void;
  style?: CSSProperties;
}

export function HourPicker({ variant = 'begin', value = 0, displayTime, onChange, style }: HourPickerProps) {
  const isBegin = variant === 'begin';

  const numbers = isBegin
    ? Array.from({ length: 24 }, (_, h) => {
        const isInner = h >= 12;
        return { value: h, label: String(h), ...clockPos(isInner ? h - 12 : h, 12, isInner ? INNER_R : OUTER_R), isInner };
      })
    : Array.from({ length: 12 }, (_, i) => ({
        value: i * 5, label: String(i * 5).padStart(2, '0'), ...clockPos(i, 12, OUTER_R), isInner: false,
      }));

  const timeText = displayTime ?? (isBegin ? `${String(value).padStart(2, '0')}:00` : `20:${String(value).padStart(2, '0')}`);
  const selNum = numbers.find((n) => n.value === value);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 24, paddingBottom: 24, backgroundColor: colors.surface.xxxl, borderRadius: borders.radius.lg, boxShadow: shadows.level2, overflow: 'hidden', ...style }}>
      <div style={{ width: '100%', backgroundColor: colors.primary.medium, paddingTop: 4, paddingBottom: 4, paddingLeft: 12, paddingRight: 12, display: 'flex', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
        <span style={{ ...typography.styles.display2, color: colors.surface.xxxl, whiteSpace: 'nowrap' }}>{timeText}</span>
      </div>
      <div style={{ position: 'relative', width: CLOCK_SIZE, height: CLOCK_SIZE, backgroundColor: colors.surface.xl, borderRadius: 500, flexShrink: 0, marginLeft: 24, marginRight: 24 }}>
        {selNum && (
          <svg width={CLOCK_SIZE} height={CLOCK_SIZE} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
            <line x1={CENTER} y1={CENTER} x2={selNum.x} y2={selNum.y} stroke={colors.primary.medium} strokeWidth={1.5} />
            <circle cx={CENTER} cy={CENTER} r={4} fill={colors.primary.medium} />
          </svg>
        )}
        {numbers.map(({ value: v, label, x, y, isInner }) => {
          const isSelected = v === value;
          const fontWeight = (isBegin && !isInner) ? typography.fontWeight.regular : typography.fontWeight.bold;
          return (
            <div key={v} onClick={() => onChange?.(v)} style={{ position: 'absolute', left: x - CELL_SIZE / 2, top: y - CELL_SIZE / 2, width: CELL_SIZE, height: CELL_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: isSelected ? colors.primary.light : 'transparent', cursor: onChange ? 'pointer' : 'default', zIndex: isSelected ? 1 : 0 }}>
              <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.md, fontWeight, color: colors.surface.main, textAlign: 'center', userSelect: 'none' }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
