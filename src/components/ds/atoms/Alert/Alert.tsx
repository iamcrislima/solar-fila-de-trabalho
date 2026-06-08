
import type { CSSProperties } from 'react';
import Info        from '@mui/icons-material/Info';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Warning     from '@mui/icons-material/Warning';
import Error       from '@mui/icons-material/Error';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { Button }  from '../Button/Button';
import { colors }    from '@/styles/tokens/colors';
import { borders }   from '@/styles/tokens/borders';
import { typography } from '@/styles/tokens/typography';

const TYPE_MAP = {
  support: { bg: colors.surface.xl,    iconColor: colors.surface.main,  Icon: Info        },
  success: { bg: colors.success.light, iconColor: colors.success.main,  Icon: CheckCircle },
  warning: { bg: colors.warning.light, iconColor: colors.warning.main,  Icon: Warning     },
  error:   { bg: colors.error.light,   iconColor: colors.error.main,    Icon: Error       },
} as const;

interface AlertProps {
  type?: keyof typeof TYPE_MAP;
  layout?: 'h' | 'sm' | 'v';
  message?: string;
  messageStyle?: CSSProperties;
  showIcon?: boolean;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onClose?: () => void;
  style?: CSSProperties;
}

export function Alert({
  type = 'support', layout = 'h', message = '', messageStyle, showIcon = true,
  primaryLabel, onPrimary, secondaryLabel, onSecondary, onClose, style,
}: AlertProps) {
  const { bg, iconColor, Icon } = TYPE_MAP[type] ?? TYPE_MAP.support;

  if (layout === 'h') {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, backgroundColor: bg, width: '100%', maxWidth: 1024, boxSizing: 'border-box', ...style }}>
        {showIcon && <Icon style={{ fontSize: 32, color: iconColor, flexShrink: 0 }} />}
        <span style={{ ...typography.styles.body2, color: colors.surface.dark, flex: '1 0 0', minWidth: 0, ...messageStyle }}>{message}</span>
        {secondaryLabel && <Button type="secondary" variant="flat" onClick={onSecondary}>{secondaryLabel}</Button>}
        {primaryLabel && <Button type="secondary" variant="outline" onClick={onPrimary}>{primaryLabel}</Button>}
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
            <CloseOutlined style={{ fontSize: 32, color: colors.surface.dark }} />
          </button>
        )}
      </div>
    );
  }

  if (layout === 'sm') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, backgroundColor: bg, borderRadius: borders.radius.sm, ...style }}>
        <span style={{ ...typography.styles.body2, color: colors.surface.dark, whiteSpace: 'nowrap', ...messageStyle }}>{message}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, backgroundColor: bg, borderRadius: borders.radius.sm, maxWidth: 1024, ...style }}>
      {showIcon && <Icon style={{ fontSize: 32, color: iconColor, flexShrink: 0 }} />}
      <span style={{ ...typography.styles.body2, color: colors.surface.dark, textAlign: 'center', whiteSpace: 'nowrap', ...messageStyle }}>{message}</span>
    </div>
  );
}
