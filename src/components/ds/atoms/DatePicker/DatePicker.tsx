import type { CSSProperties } from 'react';
import ChevronLeftOutlined  from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { shadows }    from '@/styles/tokens/shadows';
import { spacing }    from '@/styles/tokens/spacing';
import { typography } from '@/styles/tokens/typography';

const WEEKDAYS = ['Do', '2ª', '3ª', '4ª', '5ª', '6ª', 'Sá'];
const MONTHS_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const CELL = 44, CELL_SM = 32, COLS = 7;

interface DatePickerProps {
  variant?: 'default' | 'monthPicker';
  year?: number;
  month?: number;
  selectedDay?: number | null;
  onDayClick?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  compact?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  style?: CSSProperties;
}

export function DatePicker({ variant = 'default', year = new Date().getFullYear(), month = new Date().getMonth(), selectedDay = null, onDayClick, onPrevMonth, onNextMonth, compact = false, disablePast = false, disableFuture = false, style }: DatePickerProps) {
  const isDefault = variant === 'default';
  const cell = compact ? CELL_SM : CELL;
  const today = new Date();
  const [todayYear, todayMonth, todayDay] = [today.getFullYear(), today.getMonth(), today.getDate()];
  const padH = compact ? 16 : spacing.xl, padT = compact ? 10 : spacing.md;
  const padB = compact ? (isDefault ? 14 : 10) : (isDefault ? spacing.xl : spacing.md);
  const rowGap = compact ? (isDefault ? 4 : 0) : (isDefault ? spacing.lg : 0);
  const hdrGap = compact ? 28 : 49;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: rowGap, paddingTop: padT, paddingBottom: padB, paddingLeft: padH, paddingRight: padH, backgroundColor: colors.surface.xxxl, borderRadius: borders.radius.md, boxShadow: shadows.level2, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: hdrGap, flexShrink: 0 }}>
        <button onClick={onPrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><ChevronLeftOutlined style={{ fontSize: 24, color: colors.surface.dark }} /></button>
        <span style={{ ...typography.styles.title2, color: colors.surface.dark, whiteSpace: 'nowrap' }}>{`${MONTHS_PT[month]} de ${year}`}</span>
        <button onClick={onNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><ChevronRightOutlined style={{ fontSize: 24, color: colors.surface.dark }} /></button>
      </div>
      {isDefault && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${cell}px)`, width: COLS * cell, flexShrink: 0 }}>
            {WEEKDAYS.map((d) => <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 22 }}><span style={{ ...typography.styles.body1, color: colors.surface.main }}>{d}</span></div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${cell}px)`, gridAutoRows: `${cell}px`, width: COLS * cell, flexShrink: 0 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const isSelected = day === selectedDay;
              const isToday = day === todayDay && month === todayMonth && year === todayYear;
              const cellDate = new Date(year, month, day);
              const todayDate = new Date(todayYear, todayMonth, todayDay);
              const isDisabled = (disablePast && cellDate < todayDate) || (disableFuture && cellDate > todayDate);
              return (
                <div key={day} onClick={() => !isDisabled && onDayClick?.(day)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isDisabled ? 'not-allowed' : (onDayClick ? 'pointer' : 'default'), opacity: isDisabled ? 0.3 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: cell, height: cell, borderRadius: '50%', backgroundColor: isSelected ? colors.primary.light : 'transparent', outline: isToday && !isSelected ? `2px solid ${colors.primary.main}` : 'none', outlineOffset: '-2px' }}>
                    <span style={{ fontFamily: typography.fontFamily.primary, fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: isSelected ? colors.surface.xxxl : (isToday ? colors.primary.main : colors.surface.main), textAlign: 'center' }}>{day}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
