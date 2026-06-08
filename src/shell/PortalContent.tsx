import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { borders } from '@/styles/tokens/borders';
import { colors } from '@/styles/tokens/colors';
import { layout } from '@/styles/tokens/layout';
import { shadows } from '@/styles/tokens/shadows';
import { spacing } from '@/styles/tokens/spacing';

interface PortalContentProps {
  children: ReactNode;
  frameStyle?: CSSProperties;
  style?: CSSProperties;
  /** Quando true, muda overflow para visible para permitir que botões absolutos (ex.: "Voltar") extrapolem a borda do frame sem serem cortados. */
  overlayOpen?: boolean;
}

function useViewportWidth(): number {
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export function PortalContent({ children, frameStyle, style, overlayOpen = false }: PortalContentProps) {
  const viewportWidth = useViewportWidth();
  const isNarrow = viewportWidth <= 1180;

  return (
    <main
      style={{
        flex: 1,
        minHeight: 0,
        backgroundColor: colors.surface.light,
        padding: isNarrow ? spacing['bt-3'] : layout.pagePadding,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: overlayOpen ? 'visible' : 'hidden',
        ...style,
      }}
    >
      <section
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.surface.xxxl,
          borderRadius: borders.radius.lg,
          boxShadow: shadows.level1,
          padding: isNarrow
            ? `${spacing['bt-3']} ${spacing.sm}`
            : `${layout.containerPaddingY} ${layout.containerPaddingX}`,
          boxSizing: 'border-box',
          overflow: overlayOpen ? 'visible' : 'hidden',
          position: 'relative',
          ...frameStyle,
        }}
      >
        {children}
      </section>
    </main>
  );
}
