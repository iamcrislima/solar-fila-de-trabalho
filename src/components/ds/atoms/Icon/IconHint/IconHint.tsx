import type { ReactNode } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { shadows }    from '@/styles/tokens/shadows';
import { typography } from '@/styles/tokens/typography';

// Figma: HMN6YiGdi3p6ZW0khUxzyW node 3707-6341
// Ícone com badge-label opcional abaixo (Estado=Padrão / Estado=Hint).
// Para behavior de hover e click, envolva com <IconButton>.

interface IconHintProps {
  children: ReactNode;
  hint?: string;
  showHint?: boolean;
}

export function IconHint({ children, hint, showHint = false }: IconHintProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 3 }}>
        {children}
      </div>

      {showHint && hint && (
        <div
          style={{
            position:        'absolute',
            top:             24,
            left:            0,
            padding:         '2px 8px 4px',
            backgroundColor: colors.surface.main,
            borderRadius:    borders.radius.md,
            boxShadow:       shadows.level1,
            whiteSpace:      'nowrap',
            zIndex:          1,
          }}
        >
          <span
            style={{
              ...typography.styles.caption,
              color: colors.surface.xxxl,
              display: 'block',
            }}
          >
            {hint}
          </span>
        </div>
      )}
    </div>
  );
}
