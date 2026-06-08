import React from 'react';
import type { ReactNode, CSSProperties } from 'react';
import CheckCircleIcon      from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ErrorOutlinedIcon    from '@mui/icons-material/ErrorOutlined';
import NotInterestedIcon    from '@mui/icons-material/NotInterested';
import CancelIcon           from '@mui/icons-material/Cancel';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// TableCaption — Figma node: 580:40547

type CaptionType = 'finalizado' | 'pendente' | 'construcao' | 'andamento' | 'cancelado' | 'reprovado';

const TYPES: Record<CaptionType, { Icon: React.ElementType; color: string }> = {
  finalizado: { Icon: CheckCircleIcon,      color: colors.success.main   },
  pendente:   { Icon: AccessTimeFilledIcon, color: colors.primary.medium },
  construcao: { Icon: ErrorOutlinedIcon,    color: colors.warning.main   },
  andamento:  { Icon: AccessTimeFilledIcon, color: colors.warning.main   },
  cancelado:  { Icon: NotInterestedIcon,    color: colors.error.main     },
  reprovado:  { Icon: CancelIcon,           color: colors.error.main     },
};

interface TableCaptionProps {
  type?: CaptionType;
  icon?: ReactNode;
  label?: string;
  color?: string;
  style?: CSSProperties;
}

export function TableCaption({ type, icon, label = '', color, style }: TableCaptionProps) {
  const preset = type ? TYPES[type] : null;
  const clr = color ?? preset?.color ?? colors.surface.main;
  const iconNode = icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? React.cloneElement(icon as React.ReactElement, { style: { fontSize: 24, color: clr, ...((icon as any).props?.style) } } as any)
    : preset
      ? <preset.Icon style={{ fontSize: 24, color: clr }} />
      : null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...style }}>
      {iconNode}
      <span style={{ ...typography.styles.caption, color: colors.surface.main }}>{label}</span>
    </div>
  );
}
