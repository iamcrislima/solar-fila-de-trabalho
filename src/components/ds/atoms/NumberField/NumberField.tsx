import { useState } from 'react';
import AddOutlined    from '@mui/icons-material/AddOutlined';
import RemoveOutlined from '@mui/icons-material/RemoveOutlined';
import { colors }     from '../../../../styles/tokens/colors';
import { borders }    from '../../../../styles/tokens/borders';
import { spacing }    from '../../../../styles/tokens/spacing';
import { opacity }    from '../../../../styles/tokens/opacity';
import { typography } from '../../../../styles/tokens/typography';

// ─── Botão ícone (+/−) ────────────────────────────────────────────────────────

function IconBtn({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children?: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:    'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width:      24,
        height:     24,
        padding:    0,
        border:     'none',
        background: 'none',
        cursor:     disabled ? 'not-allowed' : 'pointer',
        opacity:    disabled ? opacity.disable : hovered ? opacity['level-semiopaque'] : 1,
        flexShrink: 0,
        color:      colors.secondary.dark,
      }}
    >
      {children}
    </button>
  );
}

// ─── NumberField ──────────────────────────────────────────────────────────────

/**
 * Campo numérico com botões + e −.
 *
 * @param {string}            props.label        — label acima do input (default "Qtde.")
 * @param {number}            props.value
 * @param {Function}          props.onChange      — (value: number) => void
 * @param {number}            props.min           — valor mínimo (default 0)
 * @param {number}            props.max           — valor máximo (default Infinity)
 * @param {number}            props.step          — passo de incremento (default 1)
 * @param {boolean}           props.disabled
 * @param {'horizontal'|'side'} props.layout      — horizontal: [−][input][+] | side: [input][+/−]
 * @param {number}            props.inputWidth    — largura do campo em px (default 88)
 */
export function NumberField({
  label      = 'Qtde.',
  value      = 0,
  onChange,
  min        = 0,
  max        = Infinity,
  step       = 1,
  disabled   = false,
  layout     = 'horizontal',
  inputWidth = 88,
  style,
}: { label?: string; value?: number; onChange?: (v: number) => void; min?: number; max?: number; step?: number; disabled?: boolean; layout?: string; inputWidth?: number; style?: React.CSSProperties }) {
  const atMin = value <= min;
  const atMax = value >= max;

  const decrement = () => { if (!atMin && !disabled) onChange?.(Math.max(min, value - step)); };
  const increment = () => { if (!atMax && !disabled) onChange?.(Math.min(max, value + step)); };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) onChange?.(Math.max(min, Math.min(max, parsed)));
  };

  // ── Campo (label + input) ──────────────────────────────────────────────────

  const fieldCol = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: inputWidth, flexShrink: 0 }}>
      {/* Label */}
      <div style={{ height: 23, display: 'flex', alignItems: 'flex-start' }}>
        <span style={{
          ...typography.styles.body2,
          color:      colors.secondary.dark,
          whiteSpace: 'nowrap',
        }}>
          {label}:
        </span>
      </div>

      {/* Input field */}
      <div style={{
        width:           '100%',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        paddingTop:      spacing.xs,
        paddingBottom:   spacing['bt-2'],
        paddingLeft:     spacing['bt-3'],
        paddingRight:    spacing['bt-3'],
        borderRadius:    borders.radius.md,
        border:          `1px solid ${colors.surface.medium}`,
        backgroundColor: disabled ? colors.surface.light : colors.surface.xxxl,
        boxSizing:       'border-box',
        opacity:         disabled ? opacity.disable : 1,
      }}>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInput}
          disabled={disabled}
          style={{
            flex:       '1 0 0',
            minWidth:   0,
            border:     'none',
            outline:    'none',
            background: 'transparent',
            padding:    0,
            margin:     0,
            ...typography.styles.body1,
            color:      colors.surface.main,
            lineHeight: '22px',
            textAlign:  'right',
          }}
        />
      </div>
    </div>
  );

  // ── Layout horizontal: [−] [field] [+] ────────────────────────────────────

  if (layout === 'horizontal') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: spacing.xxs, ...style }}>
        {/* Botão − alinhado ao fundo do campo (pula o label de 23px) */}
        <div style={{ paddingBottom: 9 }}>
          <IconBtn onClick={decrement} disabled={disabled || atMin}>
            <RemoveOutlined style={{ fontSize: 24 }} />
          </IconBtn>
        </div>

        {fieldCol}

        {/* Botão + alinhado ao fundo do campo */}
        <div style={{ paddingBottom: 9 }}>
          <IconBtn onClick={increment} disabled={disabled || atMax}>
            <AddOutlined style={{ fontSize: 24 }} />
          </IconBtn>
        </div>
      </div>
    );
  }

  // ── Layout side: [field] [+/− empilhados] ─────────────────────────────────

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: spacing.xxs, ...style }}>
      {fieldCol}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        <IconBtn onClick={increment} disabled={disabled || atMax}>
          <AddOutlined style={{ fontSize: 24 }} />
        </IconBtn>
        <IconBtn onClick={decrement} disabled={disabled || atMin}>
          <RemoveOutlined style={{ fontSize: 24 }} />
        </IconBtn>
      </div>
    </div>
  );
}
