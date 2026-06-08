import type { CSSProperties, ReactNode } from 'react';
import Done    from '@mui/icons-material/Done';
import Warning from '@mui/icons-material/Warning';
import Error   from '@mui/icons-material/Error';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { shadows }    from '@/styles/tokens/shadows';

const GREEN = colors.success.main;
const GREY  = colors.surface.medium;
const WHITE = colors.surface.xxxl;
const DARK  = colors.surface.dark;
const MID   = colors.surface.main;
const WARN  = colors.warning.main;
const ERR   = colors.error.main;
const OS    = typography.fontFamily.primary;

type StepState = 'todo' | 'doing' | 'done' | 'checked' | 'warning' | 'error';

function StepBubble({ state = 'todo', number = 1 }: { state?: StepState; number?: number }) {
  const isIcon = ['checked', 'warning', 'error'].includes(state);
  const bgMap: Record<StepState, string> = { todo: GREY, doing: WHITE, done: GREEN, checked: GREEN, warning: WARN, error: ERR };
  const bg = bgMap[state];
  const textColor = state === 'doing' ? GREEN : WHITE;
  const border = state === 'doing' ? `2px solid ${GREEN}` : 'none';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 980, backgroundColor: bg, border, padding: isIcon ? 5 : '6px 12px', flexShrink: 0, boxSizing: 'border-box' }}>
      {!isIcon && <span style={{ fontFamily: OS, fontWeight: 700, fontSize: 16, lineHeight: 1, color: textColor, whiteSpace: 'nowrap' }}>{number}</span>}
      {state === 'checked' && <Done    style={{ fontSize: 24, color: WHITE }} />}
      {state === 'warning'  && <Warning style={{ fontSize: 24, color: WHITE }} />}
      {state === 'error'    && <Error   style={{ fontSize: 24, color: WHITE }} />}
    </div>
  );
}

function HLine({ active = true, invisible = false }: { active?: boolean; invisible?: boolean }) {
  return <div style={{ flex: '1 0 0', height: 2, minWidth: 1, backgroundColor: active ? GREEN : GREY, opacity: invisible ? 0 : 1 }} />;
}

function VLine({ active = true, invisible = false }: { active?: boolean; invisible?: boolean }) {
  return <div style={{ flex: '1 0 0', width: 2, minHeight: 1, backgroundColor: active ? GREEN : GREY, opacity: invisible ? 0 : 1 }} />;
}

function DashCard({ children }: { children: ReactNode }) {
  return (
    <div style={{ backgroundColor: WHITE, borderRadius: 8, boxShadow: shadows.level1, display: 'inline-flex', flexDirection: 'column', marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '12px 16px', borderRadius: 8 }}>
        <div style={{ width: 8, alignSelf: 'stretch', flexShrink: 0, display: 'flex' }}>
          <div style={{ width: 8, flex: 1, backgroundColor: GREEN, borderRadius: 492 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>{children}</div>
      </div>
    </div>
  );
}

interface StepItem {
  label: string;
  description?: string;
  content?: ReactNode;
}

interface StepsProps {
  orientation?: 'h' | 'v' | 'v-dash';
  steps?: StepItem[];
  current?: number;
  stepStates?: Record<number, 'checked' | 'warning' | 'error'>;
  style?: CSSProperties;
}

export function Steps({ orientation = 'h', steps = [], current = 0, stepStates = {}, style }: StepsProps) {
  function getState(i: number): StepState {
    if (stepStates[i]) return stepStates[i];
    if (i < current) return 'done';
    if (i === current) return 'doing';
    return 'todo';
  }

  if (orientation === 'h') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', ...style }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: '1 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <HLine active={i <= current} invisible={i === 0} />
              <StepBubble state={getState(i)} number={i + 1} />
              <HLine active={i < current} invisible={i === steps.length - 1} />
            </div>
            <span style={{ fontFamily: OS, fontWeight: 600, fontSize: 14, lineHeight: 1, color: DARK, textAlign: 'center', whiteSpace: 'nowrap' }}>{step.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (orientation === 'v') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 114, maxHeight: 244 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 34, alignSelf: 'stretch', flexShrink: 0 }}>
              <StepBubble state={getState(i)} number={i + 1} />
              <VLine active={i < current} invisible={i === steps.length - 1} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 24 }}>
              <span style={{ fontFamily: OS, fontWeight: 600, fontSize: 14, lineHeight: 1, color: DARK, whiteSpace: 'nowrap' }}>{step.label}</span>
              {step.description && <span style={{ ...typography.styles.body1, color: DARK, whiteSpace: 'nowrap' }}>{step.description}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orientation === 'v-dash') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 114, maxHeight: 244 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 34, alignSelf: 'stretch', flexShrink: 0 }}>
              <StepBubble state={getState(i)} number={i + 1} />
              <VLine active={i < current} invisible={i === steps.length - 1} />
            </div>
            <DashCard>
              {step.content ?? <span style={{ fontFamily: OS, fontWeight: 600, fontSize: 14, lineHeight: 1, color: MID }}>{step.label}</span>}
            </DashCard>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
