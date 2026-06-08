import { useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { colors }     from '@/styles/tokens/colors';
import { shadows }    from '@/styles/tokens/shadows';
import { typography } from '@/styles/tokens/typography';
import { layout }     from '@/styles/tokens/layout';
import { spacing }    from '@/styles/tokens/spacing';
import { borders }    from '@/styles/tokens/borders';

// Modal — Figma node: 652:88179

type ModalSize = 'sm' | 'md' | 'lg';
const WIDTH: Record<ModalSize, number> = { sm: 504, md: 764, lg: 959 };
const SHADOW: Record<ModalSize, string> = { sm: shadows.level3, md: shadows.level3, lg: shadows.level4 };

interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  title?: ReactNode;
  showTooltip?: boolean;
  showClose?: boolean;
  size?: ModalSize;
  children?: ReactNode;
  footer?: ReactNode;
  leftFooter?: ReactNode;
  footerGap?: CSSProperties['gap'];
  backdropColor?: string;
  style?: CSSProperties;
}

export function Modal({
  open       = false,
  onClose,
  title,
  showTooltip: _showTooltip = false,
  showClose   = true,
  size        = 'md',
  children,
  footer,
  leftFooter,
  footerGap,
  backdropColor = 'rgba(0,0,0,0.5)',
  style,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const hasFooter = leftFooter || footer;
  // Strip overflow/padding from caller style — controlled internally for sticky footer and border-radius.
  const STRIPPED_KEYS = new Set(['overflow', 'overflowY', 'overflowX', 'padding', 'gap']);
  const outerStyle = Object.fromEntries(
    Object.entries(style ?? {}).filter(([k]) => !STRIPPED_KEYS.has(k))
  ) as CSSProperties;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1300, backgroundColor: backdropColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', backgroundColor: colors.surface.xxxl, borderRadius: borders.radius.lg, boxShadow: SHADOW[size] ?? shadows.level3, width: WIDTH[size] ?? WIDTH.md, maxWidth: '95vw', maxHeight: '90vh', boxSizing: 'border-box', ...outerStyle, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Scrollable content area */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: layout.containerPaddingX, display: 'flex', flexDirection: 'column', gap: layout.blockGap, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ ...typography.styles.subtitle1, color: colors.surface.dark }}>{title}</span>
            {showClose && (
              <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <CloseIcon style={{ fontSize: 24, color: colors.surface.main }} />
              </button>
            )}
          </div>
          <div>{children}</div>
        </div>
        {/* Sticky footer — always visible, never scrolls */}
        {hasFooter && (
          <div style={{ flexShrink: 0, borderTop: `1px solid ${colors.surface.light}`, backgroundColor: colors.surface.xxxl, padding: `${spacing.sm} ${layout.containerPaddingX} ${layout.containerPaddingX}`, boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: layout.blockGap, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: footerGap ?? layout.actionGap, alignItems: 'center' }}>{leftFooter}</div>
              <div style={{ display: 'flex', gap: footerGap ?? layout.actionGap, alignItems: 'center', flexWrap: 'wrap' }}>{footer}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
