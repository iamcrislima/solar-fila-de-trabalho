import { useState } from 'react';
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined';
import { TruncatedText } from '../TruncatedText';
import { colors }     from '../../../../styles/tokens/colors';
import { borders }    from '../../../../styles/tokens/borders';
import { spacing }    from '../../../../styles/tokens/spacing';
import { shadows }    from '../../../../styles/tokens/shadows';
import { typography } from '../../../../styles/tokens/typography';

// ─── Checkbox visual interno ──────────────────────────────────────────────────

function ItemCheckbox({ checked }: { checked?: boolean }) {
  return (
    <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
      <div style={{
        position:        'absolute',
        inset:           '12.5%',
        border:          `2px solid ${checked ? colors.primary.main : colors.surface.medium}`,
        borderRadius:    borders.radius.sm,
        backgroundColor: checked ? colors.primary.main : 'transparent',
        boxSizing:       'border-box',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}>
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

// ─── DropdownMenuItem ─────────────────────────────────────────────────────────

/**
 * Item individual de um dropdown menu.
 *
 * @param {string}  props.label         — texto do item (default "Item")
 * @param {boolean} props.showCheckbox  — exibe checkbox à esquerda
 * @param {boolean} props.checked       — estado do checkbox
 * @param {boolean} props.trailingIcon  — exibe ícone open_in_new à direita
 * @param {boolean} props.active        — fundo ativo (#E0F7FA)
 * @param {boolean} props.disabled
 * @param {Function} props.onClick
 */
export function DropdownMenuItem({
  label        = 'Item',
  showCheckbox = false,
  checked      = false,
  trailingIcon = false,
  active       = false,
  disabled     = false,
  onClick,
  style,
}: { label?: string; showCheckbox?: boolean; checked?: boolean; trailingIcon?: boolean; active?: boolean; disabled?: boolean; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);

  const bg = active   ? colors.primary.xxl
            : hovered  ? colors.surface.xl
            :             colors.surface.xxxl;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             spacing.xs,
        width:           '100%',
        minWidth:        145,
        height:          30,
        paddingTop:      2,
        paddingBottom:   spacing.xxs,
        paddingLeft:     spacing.xs,
        paddingRight:    spacing.xxs,
        boxSizing:       'border-box',
        backgroundColor: bg,
        border:          'none',
        cursor:          disabled ? 'not-allowed' : 'pointer',
        textAlign:       'left',
        opacity:         disabled ? 0.40 : 1,
        flexShrink:      0,
        ...style,
      }}
    >
      {showCheckbox && <ItemCheckbox checked={checked} />}

      <TruncatedText text={label} style={{
        flex:         '1 0 0',
        minWidth:     0,
        ...typography.styles.body2,
        color:        colors.surface.dark,
      }}>
        {label}
      </TruncatedText>

      {trailingIcon && (
        <OpenInNewOutlined style={{ fontSize: 24, color: colors.surface.medium, flexShrink: 0 }} />
      )}
    </button>
  );
}

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

/**
 * Painel do dropdown com lista de itens.
 *
 * @param {'default'|'sm'}  props.size     — Default=504px | SM=244px
 * @param {React.ReactNode} props.children — DropdownMenuItem(s)
 */
export function DropdownMenu({
  size     = 'default',
  children,
  style,
}: { size?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  const width = size === 'sm' ? 244 : 504;

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'stretch',
      width,
      boxShadow:     shadows.level2,
      backgroundColor: colors.surface.xxxl,
      ...style,
    }}>
      {children}
    </div>
  );
}
