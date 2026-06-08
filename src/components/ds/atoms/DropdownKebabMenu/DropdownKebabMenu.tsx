import { useState } from 'react';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import EditOutlined       from '@mui/icons-material/EditOutlined';
import DeleteOutlined     from '@mui/icons-material/DeleteOutlined';
import LockOutlined       from '@mui/icons-material/LockOutlined';
import SendOutlined       from '@mui/icons-material/SendOutlined';
import { colors }         from '../../../../styles/tokens/colors';
import { shadows }        from '../../../../styles/tokens/shadows';
import { typography }     from '../../../../styles/tokens/typography';

// ─── Ícones e labels padrão por ação ─────────────────────────────────────────

const ACTION_ICONS = {
  view:   VisibilityOutlined,
  edit:   EditOutlined,
  delete: DeleteOutlined,
  lock:   LockOutlined,
  send:   SendOutlined,
};

const ACTION_LABELS = {
  view:   'View',
  edit:   'Edit',
  delete: 'Delete',
  lock:   'Lock',
  send:   'Send',
};

// ─── DropdownKebabItem ────────────────────────────────────────────────────────

/**
 * Item isolado do menu Kebab — Figma nodes: 623:86456 (surface) e 623:86533 (primary).
 *
 * @param {'primary'|'surface'} props.type   — Primary: texto #00838F, hover #E0F7FA
 *                                             Surface: texto #212121, hover #F5F5F5
 * @param {string}              props.action — 'view'|'edit'|'delete'|'lock'|'send'
 *                                             Omitido → item só-texto (Default), padding maior
 * @param {string}              props.label  — sobrescreve o label padrão da ação
 */
export function DropdownKebabItem({ action, label, type = 'primary', onClick, style }: { action?: string; label?: string; type?: "primary"|"secondary"; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  const textColor = type === 'primary' ? colors.primary.main : colors.surface.dark;
  const hoverBg   = type === 'primary' ? colors.primary.xxl  : colors.surface.xl;
  const bg        = hovered ? hoverBg : colors.surface.xxxl;

  const Icon         = action ? ACTION_ICONS[action as keyof typeof ACTION_ICONS] : null;
  const displayLabel = label ?? (action ? ACTION_LABELS[action as keyof typeof ACTION_LABELS] : 'Item');

  const hasIcon = Boolean(Icon);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             hasIcon ? 12 : 0,
        width:           147,
        paddingTop:      hasIcon ? 4 : 6,
        paddingBottom:   hasIcon ? 4 : 6,
        paddingLeft:     8,
        paddingRight:    40,
        boxSizing:       'border-box',
        backgroundColor: bg,
        border:          'none',
        cursor:          'pointer',
        flexShrink:      0,
        transition:      'background-color 0.1s',
        ...(style as object),
      }}
    >
      {Icon && <Icon style={{ fontSize: 24, color: textColor, flexShrink: 0 }} />}
      <span style={{
        ...typography.styles.body2,
        color:      textColor,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {displayLabel}
      </span>
    </button>
  );
}

// ─── DropdownKebabMenu ────────────────────────────────────────────────────────

/**
 * Menu Kebab composto por DropdownKebabItem.
 *
 * @param {'primary'|'surface'}  props.type    — tema aplicado a todos os itens
 * @param {Array}                props.actions — [{ action?, label?, onClick? }]
 *   action omitido → item Default (só-texto)
 */
interface DropdownKebabMenuProps { type?: "primary" | "secondary"; actions?: Array<{ action?: string; label?: string; onClick?: () => void }>; style?: unknown; }
export function DropdownKebabMenu({
  type    = 'primary',
  actions = [
    { action: 'view' },
    { action: 'edit' },
    { action: 'delete' },
    { action: 'lock' },
    { action: 'send' },
  ],
  style,
}: DropdownKebabMenuProps) {
  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'flex-start',
      backgroundColor: colors.surface.xxxl,
      boxShadow:       shadows.level2,
      ...(style as object),
    }}>
      {actions.map(({ action, label, onClick }, i) => (
        <DropdownKebabItem
          key={`${action ?? 'default'}-${i}`}
          action={action}
          label={label}
          type={type}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
