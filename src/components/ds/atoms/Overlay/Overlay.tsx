import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface OverlayProps {
  open?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  backdropColor?: string;
  zIndex?: number;
  closeOnBackdrop?: boolean;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export function Overlay({
  open = false,
  onClose,
  children,
  backdropColor = 'rgba(0,0,0,0.5)',
  zIndex = 1200,
  closeOnBackdrop = true,
  style,
  contentStyle,
}: OverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open || typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div
      role="presentation"
      onClick={(event) => { if (closeOnBackdrop && event.target === event.currentTarget) onClose?.(); }}
      style={{ position: 'fixed', inset: 0, zIndex, background: backdropColor, display: 'flex', minWidth: 0, minHeight: 0, boxSizing: 'border-box', ...style }}
    >
      <div style={{ display: 'flex', minWidth: 0, minHeight: 0, ...contentStyle }}>{children}</div>
    </div>,
    document.body
  );
}
