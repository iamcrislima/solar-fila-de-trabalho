import type { CSSProperties, ReactNode } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

if (typeof document !== 'undefined' && !document.getElementById('sds-loading-style')) {
  const s = document.createElement('style');
  s.id = 'sds-loading-style';
  s.textContent = `
    @keyframes sds-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes sds-bar-slide {
      0%   { left: -50%; width: 45%; }
      70%  { left: 80%;  width: 45%; }
      100% { left: 110%; width: 45%; }
    }
  `;
  document.head.appendChild(s);
}

interface LoadingProps {
  variant?: 'bar' | 'circular';
  label?: string;
  value?: number;
  style?: CSSProperties;
}

export function Loading({ variant = 'bar', label = 'Carregando', value, style }: LoadingProps) {
  const isBar = variant === 'bar';
  const isDeterminate = isBar && value != null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, width: isBar ? 504 : undefined, ...style }}>
      {isBar && <Label>{label}</Label>}
      {isBar && (
        <div style={{ position: 'relative', width: '100%', height: 6, backgroundColor: colors.surface.medium, overflow: 'hidden' }}>
          {isDeterminate
            ? <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: `${Math.min(100, Math.max(0, value!))}%`, backgroundColor: colors.primary.main, transition: 'width 0.3s ease' }} />
            : <div style={{ position: 'absolute', top: 0, bottom: 0, backgroundColor: colors.primary.main, animation: 'sds-bar-slide 1.6s ease-in-out infinite' }} />
          }
        </div>
      )}
      {!isBar && (
        <div style={{ width: 151, height: 151, borderRadius: '50%', border: `13px solid ${colors.surface.medium}`, borderBottomColor: 'transparent', animation: 'sds-spin 1s linear infinite', flexShrink: 0, borderTopColor: colors.primary.main, borderLeftColor: colors.primary.main, borderRightColor: colors.primary.main }} />
      )}
      {!isBar && <Label>{label}</Label>}
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...typography.styles.title2, color: colors.surface.dark, textAlign: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>
      {children}
    </span>
  );
}
