import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../Button';
import { DividerH } from '../Divider';
import { colors } from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { shadows } from '@/styles/tokens/shadows';
import { layout } from '@/styles/tokens/layout';
import { borders } from '@/styles/tokens/borders';

// ModalDialog - Figma node: 588:90566

interface ModalDialogProps {
  open?: boolean;
  title?: ReactNode;
  message?: ReactNode;
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  backdropColor?: string;
  style?: CSSProperties;
}

export function ModalDialog({
  open = false,
  title = 'Confirmação',
  message = '',
  children,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
  backdropColor = 'rgba(0,0,0,0.5)',
  style,
}: ModalDialogProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        backgroundColor: backdropColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface.xxxl,
          borderRadius: borders.radius.lg,
          boxShadow: shadows.level3,
          padding: layout.containerPaddingX,
          width: 504,
          maxWidth: '95vw',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div style={{ paddingBottom: layout.sectionGap }}>
          <span style={{ ...typography.styles.subtitle1, color: colors.surface.dark }}>
            {title}
          </span>
        </div>
        <div
          style={{
            padding: `${layout.sectionGap} 0`,
            width: '100%',
            boxSizing: 'border-box',
            ...typography.styles.body2,
            color: colors.surface.dark,
          }}
        >
          {children ?? <p style={{ margin: 0, width: '100%' }}>{message}</p>}
        </div>
        <div>
          <DividerH style={{ padding: `${layout.blockGap} 0` }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: layout.blockGap,
              paddingTop: layout.sectionGap,
              flexWrap: 'wrap',
            }}
          >
            <Button variant="flat" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="filled" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
