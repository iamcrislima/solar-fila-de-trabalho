import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { HintMain } from '../Hint/Hint';

// Tooltip — componente único de hint do projeto.
// Use este componente em qualquer lugar que exija um tooltip/hint visual.
// Nunca crie helpers privados de tooltip (WithTooltip, FlowIndicator, TooltipIcon etc.) — use Tooltip.

const VIEWPORT_MARGIN = 12;

interface TooltipProps {
  content: ReactNode;
  delay?: number;
  children: ReactNode;
}

interface PortalProps {
  content: ReactNode;
  centerX: number;
  top: number;
}

// Subcomponente com acesso ao DOM do tooltip para medir largura real antes do paint.
// useLayoutEffect é síncrono antes do browser paint — sem flash visível.
function TooltipPortal({ content, centerX, top }: PortalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(centerX);

  useLayoutEffect(() => {
    if (ref.current) {
      const w = ref.current.offsetWidth;
      setLeft(
        Math.min(
          Math.max(centerX, VIEWPORT_MARGIN + w / 2),
          window.innerWidth - VIEWPORT_MARGIN - w / 2,
        )
      );
    }
  }, [centerX, content]);

  return ReactDOM.createPortal(
    <div
      ref={ref}
      style={{
        position:      'fixed',
        top,
        left,
        transform:     'translateX(-50%)',
        zIndex:        10000,
        pointerEvents: 'none',
        whiteSpace:    'nowrap',
      }}
    >
      <HintMain>{content}</HintMain>
    </div>,
    document.body
  );
}

export function Tooltip({ content, delay = 750, children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  const show = () => {
    // Cancela timer anterior antes de criar novo — evita "timer vazado"
    // quando show() é chamado rapidamente duas vezes (ex.: onMouseEnter + onFocus no clique)
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
    setOpen(false);
  };

  if (!content) return <>{children}</>;

  const rect = open && wrapperRef.current
    ? wrapperRef.current.getBoundingClientRect()
    : null;

  const centerX = rect ? rect.left + rect.width / 2 : 0;
  const top = rect ? Math.min(rect.bottom + 4, window.innerHeight - VIEWPORT_MARGIN) : 0;

  return (
    <span
      ref={wrapperRef}
      style={{ display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onMouseDown={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {rect && <TooltipPortal content={content} centerX={centerX} top={top} />}
    </span>
  );
}
