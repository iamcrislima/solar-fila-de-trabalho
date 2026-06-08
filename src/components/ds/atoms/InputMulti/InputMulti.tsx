import { useState } from 'react';
import SearchOutlined        from '@mui/icons-material/SearchOutlined';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import EventOutlined         from '@mui/icons-material/EventOutlined';
import { colors }     from '../../../../styles/tokens/colors';
import { borders }    from '../../../../styles/tokens/borders';
import { spacing }    from '../../../../styles/tokens/spacing';
import { opacity }    from '../../../../styles/tokens/opacity';
import { typography } from '../../../../styles/tokens/typography';
import { size as sizeTokens } from '../../../../styles/tokens/size';

// ─── Placeholder CSS ──────────────────────────────────────────────────────────

const STYLE_ID = 'sds-inputmulti-placeholder';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `.sds-im::placeholder { color: rgba(97,97,97,0.40); }`;
  document.head.appendChild(el);
}

// ─── Mapa de tamanhos (Figma → px) ───────────────────────────────────────────

const WIDTHS = {
  xl:      parseInt(sizeTokens.container.display),  // 1024
  lg:      parseInt(sizeTokens.container.xl),        // 764
  default: parseInt(sizeTokens.container.xs),        // 504
  md:      parseInt(sizeTokens.container.xs),        // 504
  sm:      parseInt(sizeTokens.container.nano3),     // 244
  xs:      parseInt(sizeTokens.container.nano2),     // 179
  xxs:     parseInt(sizeTokens.container.nano),      // 114
  xxxs:    64,
};

// ─── Ícone trailing ───────────────────────────────────────────────────────────

const ICON_COMPONENTS = {
  search:   SearchOutlined,
  arrow:    ArrowDropDownOutlined,
  calendar: EventOutlined,
};

// ─── Focus shadow (mesmo do TextField) ───────────────────────────────────────

const SHADOW_FOCUS = '0px 0px 0px 2px rgba(2,136,209,0.24)';

// ─── Campo individual ─────────────────────────────────────────────────────────

function Field({ placeholder, value, onChange, icon, disabled, width, style }: { placeholder?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; icon?: string; disabled?: boolean; width?: number; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const borderColor = disabled      ? colors.surface.medium
                    : focused       ? colors.primary.medium
                    : hovered       ? colors.surface.main
                    :                 colors.surface.medium;

  const IconComponent = icon ? (ICON_COMPONENTS as Record<string, React.ElementType>)[icon] : null;

  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        width:           width ?? '100%',
        paddingTop:      spacing.xs,
        paddingBottom:   spacing['bt-2'],
        paddingLeft:     spacing['bt-3'],
        paddingRight:    spacing['bt-3'],
        borderRadius:    borders.radius.md,
        border:          `1px solid ${borderColor}`,
        backgroundColor: colors.surface.xxxl,
        boxSizing:       'border-box',
        opacity:         disabled ? opacity.disable : 1,
        boxShadow:       focused ? SHADOW_FOCUS : 'none',
        transition:      'border-color 0.15s, box-shadow 0.15s',
        flexShrink:      0,
        ...style,
      }}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="sds-im"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex:       '1 0 0',
          minWidth:   0,
          border:     'none',
          outline:    'none',
          background: 'transparent',
          padding:    0,
          margin:     0,
          paddingTop: 2,
          ...typography.styles.body1,
          color:      colors.surface.dark,
          lineHeight: '22px',
        }}
      />
      {IconComponent && (
        <IconComponent style={{ fontSize: 24, color: colors.surface.medium, flexShrink: 0 }} />
      )}
    </div>
  );
}

// ─── InputMulti ───────────────────────────────────────────────────────────────

/**
 * Campo de input multi-propósito com suporte a diferentes tamanhos,
 * ícone trailing e modo double (dois inputs side-by-side com texto ponte).
 *
 * @param {string}                            props.label           — label acima do campo
 * @param {boolean}                           props.mandatory       — adiciona * ao label
 * @param {string}                            props.placeholder     — placeholder (modo simples)
 * @param {string}                            props.value           — valor controlado (modo simples)
 * @param {Function}                          props.onChange        — handler (modo simples)
 * @param {'search'|'arrow'|'calendar'|null}  props.icon            — ícone trailing (default 'search')
 * @param {'xl'|'lg'|'default'|'md'|'sm'|'xs'|'xxs'|'xxxs'|number} props.size — largura do campo
 * @param {boolean}                           props.double          — modo double (dois campos)
 * @param {string}                            props.bridgeText      — texto entre os campos ('até' | '/')
 * @param {string}                            props.startPlaceholder
 * @param {string}                            props.endPlaceholder
 * @param {string}                            props.startValue
 * @param {string}                            props.endValue
 * @param {Function}                          props.onStartChange
 * @param {Function}                          props.onEndChange
 * @param {'search'|'arrow'|'calendar'|null}  props.startIcon       — ícone do campo esquerdo
 * @param {'search'|'arrow'|'calendar'|null}  props.endIcon         — ícone do campo direito
 * @param {boolean}                           props.disabled
 */
export function InputMulti({
  label,
  mandatory       = false,
  placeholder     = 'Placeholder',
  value,
  onChange,
  icon            = 'search',
  size            = 'default',
  double          = false,
  bridgeText      = 'até',
  startPlaceholder,
  endPlaceholder,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startIcon       = 'calendar',
  endIcon         = 'calendar',
  disabled        = false,
  style,
}: { label?: string; mandatory?: boolean; placeholder?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; icon?: string; size?: string | number; double?: boolean; bridgeText?: string; startPlaceholder?: string; endPlaceholder?: string; startValue?: string; endValue?: string; onStartChange?: React.ChangeEventHandler<HTMLInputElement>; onEndChange?: React.ChangeEventHandler<HTMLInputElement>; startIcon?: string; endIcon?: string; disabled?: boolean; style?: React.CSSProperties }) {
  const fieldWidth = typeof size === 'number' ? size : (WIDTHS as Record<string, number>)[size as string] ?? (WIDTHS as Record<string, number>).default;
  const labelText  = label != null ? `${label}${mandatory ? '*' : ''}:` : null;

  const labelEl = labelText && (
    <span style={{
      ...typography.styles.body2,
      color:      colors.surface.dark,
      whiteSpace: 'nowrap',
    }}>
      {labelText}
    </span>
  );

  // ── Modo simples ────────────────────────────────────────────────────────────

  if (!double) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs, ...style }}>
        {labelEl}
        <Field
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          icon={icon}
          disabled={disabled}
          width={fieldWidth}
        />
      </div>
    );
  }

  // ── Modo double ─────────────────────────────────────────────────────────────
  // paddingBottom: 11 → centra o texto ponte (body2 ≈ 20px) dentro da altura do campo (42px)

  const halfWidth = typeof size === 'number' ? Math.floor(size / 2) : WIDTHS.xs;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end', ...style }}>

      {/* Campo esquerdo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs, paddingRight: 4, flexShrink: 0 }}>
        {labelEl}
        <Field
          placeholder={startPlaceholder ?? placeholder}
          value={startValue}
          onChange={onStartChange}
          icon={startIcon}
          disabled={disabled}
          width={halfWidth}
        />
      </div>

      {/* Ponte */}
      <div style={{ paddingBottom: 11, paddingLeft: 4, paddingRight: 4, flexShrink: 0 }}>
        <span style={{
          ...typography.styles.body2,
          color:      colors.surface.dark,
          whiteSpace: 'nowrap',
        }}>
          {bridgeText}
        </span>
      </div>

      {/* Campo direito */}
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 4, flexShrink: 0 }}>
        <Field
          placeholder={endPlaceholder ?? placeholder}
          value={endValue}
          onChange={onEndChange}
          icon={endIcon}
          disabled={disabled}
          width={halfWidth}
        />
      </div>

    </div>
  );
}
