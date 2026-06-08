import { useCallback, useRef, useState } from 'react';
import type { ElementType, CSSProperties, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { HintMain } from '../Hint';

interface TruncatedTextProps {
  as?: ElementType;
  children?: ReactNode;
  text?: string;
  hint?: string;
  delay?: number;
  style?: CSSProperties;
  hintStyle?: CSSProperties;
  [key: string]: unknown;
}

export function TruncatedText({ as: Component = 'span', children, text, hint, delay = 1000, style, hintStyle, ...props }: TruncatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hintPos, setHintPos] = useState<{ top: number; left: number } | null>(null);

  const fullText = hint ?? text ?? (typeof children === 'string' ? children : '');

  const handleMouseEnter = useCallback(() => {
    const el = textRef.current;
    if (!el || !fullText || el.scrollWidth <= el.clientWidth) return;
    timerRef.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setHintPos({ top: rect.bottom + 4, left: rect.left });
    }, delay);
  }, [delay, fullText]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHintPos(null);
  }, []);

  return (
    <>
      <Component
        ref={textRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...style }}
        {...props}
      >
        {children ?? text}
      </Component>
      {hintPos && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: hintPos.top, left: hintPos.left, zIndex: 10000, pointerEvents: 'none', whiteSpace: 'nowrap', ...hintStyle }}>
          <HintMain>{fullText}</HintMain>
        </div>,
        document.body
      )}
    </>
  );
}
