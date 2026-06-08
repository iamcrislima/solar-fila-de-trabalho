import type { CSSProperties } from 'react';
import CheckCircle   from '@mui/icons-material/CheckCircle';
import Warning       from '@mui/icons-material/Warning';
import Error         from '@mui/icons-material/Error';
import Info          from '@mui/icons-material/Info';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { colors }    from '@/styles/tokens/colors';
import { borders }   from '@/styles/tokens/borders';
import { shadows }   from '@/styles/tokens/shadows';
import { typography } from '@/styles/tokens/typography';

const STYLE_MAP = {
  success: {
    dark:  { bg: colors.success.main,  text: colors.surface.xxxl, iconColor: colors.surface.xxxl, borderColor: colors.surface.xxxl },
    light: { bg: colors.success.light, text: colors.surface.dark,  iconColor: colors.success.main, borderColor: colors.surface.main },
  },
  warning: {
    dark:  { bg: colors.warning.main,  text: colors.surface.xxxl, iconColor: colors.surface.xxxl, borderColor: colors.surface.xxxl },
    light: { bg: colors.warning.light, text: colors.surface.dark,  iconColor: colors.warning.main, borderColor: colors.surface.main },
  },
  error: {
    dark:  { bg: colors.error.main,    text: colors.surface.xxxl, iconColor: colors.surface.xxxl, borderColor: colors.surface.xxxl },
    light: { bg: colors.error.light,   text: colors.surface.dark,  iconColor: colors.error.main,   borderColor: colors.surface.main },
  },
  support: {
    dark:  { bg: colors.support.main,  text: colors.surface.xxxl, iconColor: colors.surface.xxxl, borderColor: colors.surface.xxxl },
    light: { bg: colors.surface.xxxl,  text: colors.surface.dark,  iconColor: colors.surface.main, borderColor: colors.surface.main },
  },
} as const;

const ICON_MAP = { success: CheckCircle, warning: Warning, error: Error, support: Info } as const;

interface SnackbarProps {
  type?: keyof typeof STYLE_MAP;
  tone?: 'dark' | 'light';
  size?: 'default' | 'lg';
  message?: string;
  showIcon?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  style?: CSSProperties;
}

export function Snackbar({ type = 'success', tone = 'dark', size = 'default', message = '', showIcon = true, actionLabel, onAction, onClose, style }: SnackbarProps) {
  const { bg, text, iconColor, borderColor } = (STYLE_MAP[type] ?? STYLE_MAP.success)[tone] ?? STYLE_MAP.success.dark;
  const Icon = ICON_MAP[type] ?? Info;
  const width = size === 'lg' ? 1072 : 626;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 18, paddingTop: 16, paddingBottom: 20, paddingLeft: 12, paddingRight: 12, width, boxSizing: 'border-box', backgroundColor: bg, borderRadius: borders.radius.xxl, boxShadow: shadows.level3, ...style }}>
      {showIcon && <Icon style={{ fontSize: 32, color: iconColor, flexShrink: 0 }} />}
      <span style={{ ...typography.styles.body2, color: text, flex: '1 0 0', minWidth: 0 }}>{message}</span>
      {actionLabel && (
        <button onClick={onAction} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6, paddingBottom: 6, paddingLeft: 16, paddingRight: 16, border: `1px solid ${borderColor}`, borderRadius: borders.radius.md, backgroundColor: 'transparent', cursor: 'pointer', flexShrink: 0 }}>
          <span style={{ ...typography.styles.button, color: text, whiteSpace: 'nowrap' }}>{actionLabel}</span>
        </button>
      )}
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
          <CloseOutlined style={{ fontSize: 24, color: text }} />
        </button>
      )}
    </div>
  );
}
