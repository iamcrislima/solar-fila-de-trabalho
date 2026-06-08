import PushPinIcon      from '@mui/icons-material/PushPin';
import OpenInNewIcon    from '@mui/icons-material/OpenInNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Checkbox }     from '../ds/atoms/Checkbox';
import { InputRead }    from '../ds/atoms/InputRead';
import { Tooltip }      from '../ds/atoms/Tooltip/Tooltip';
import { IconButton }   from '../ds/atoms/Icon/IconButton';
import { colors }       from '../../styles/tokens/colors';
import { shadows }      from '../../styles/tokens/shadows';
import { typography }   from '../../styles/tokens/typography';
import { TagChipList }  from './TagChipList';
import { IconEtapas }   from './attachmentCardIcons';

// ─── AttachmentCardTarefa ─────────────────────────────────────────────────────
// Figma: Fila-de-trabalho-SolarBPM node 2025:22896 (Padrão) + 2071:7773 (Selecionado)
//
// Props de estado:
//   checked / onCheckedChange   — checkbox de seleção
//   pinned / onPinClick         — estado do pin
//   selected                    — borda azul primária
//   expanded / onExpandClick    — exibe segunda linha de campos (extraFields)
//   onClick                     — clique no card
//   bgColor                     — cor de fundo (default: colors.primary.xxl)
//
// Props de conteúdo:
//   taskName                    — texto primário em azul (nome da tarefa)
//   processNumber               — link sublinhado abaixo do nome
//   onOpenProcess               — clique no link/ícone do processo
//   fields        [{label,value}]      — até 4 campos na linha 1
//   extraFields   [{label,value}]      — até 4 campos na linha 2 (expanded)
//   chips         [(string|{label,color})] — tags na base

export function AttachmentCardTarefa({
  checked          = false,
  onCheckedChange,
  pinned           = false,
  onPinClick,
  selected         = false,
  compact          = false,
  expanded         = false,
  onExpandClick,
  onClick,
  bgColor,

  taskName         = 'Nome da tarefa',
  processNumber    = 'Número do processo',
  onOpenProcess,

  fields        = [] as Array<{ label?: string; value?: unknown }>,
  extraFields   = [] as Array<{ label?: string; value?: unknown }>,
  chips         = [] as unknown[],
  possuiFluxo   = false,
  fieldGap,
  labelFontSize,
  labelFontWeight,
  valueFontSize,
  valueFontWeight,

  style,
}: { checked?: boolean; onCheckedChange?: React.ChangeEventHandler<HTMLInputElement>; pinned?: boolean; onPinClick?: () => void; selected?: boolean; compact?: boolean; expanded?: boolean; onExpandClick?: () => void; onClick?: () => void; bgColor?: string; taskName?: string; processNumber?: string; onOpenProcess?: () => void; fields?: Array<{ label?: string; value?: unknown }>; extraFields?: Array<{ label?: string; value?: unknown }>; chips?: unknown[]; possuiFluxo?: boolean; fieldGap?: number; labelFontSize?: number; labelFontWeight?: number; valueFontSize?: number; valueFontWeight?: number; style?: React.CSSProperties }) {
  const bg = bgColor ?? colors.primary.xxl;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      style={{
        display:         'flex',
        flexDirection:   'row',
        alignItems:      'center',
        gap:             8,
        padding:         8,
        width:           '100%',
        boxSizing:       'border-box',
        borderRadius:    8,
        backgroundColor: bg,
        boxShadow:       shadows.level1,
        border:          selected ? `2px solid ${colors.primary.main}` : '2px solid transparent',
        cursor:          onClick ? 'pointer' : 'default',
        minHeight:       compact ? 94 : undefined,
        transition:      'background-color 180ms ease, border-color 180ms ease, min-height 180ms ease, padding 180ms ease',
        ...style,
      }}
    >
      {/* ── Coluna esquerda: Checkbox + Pin ── */}
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}>
        <Checkbox
          type="primary"
          checked={checked}
          onChange={onCheckedChange}
        />
        <Tooltip content="Fixar">
          <IconButton
            onClick={e => { e.stopPropagation(); onPinClick?.(); }}
            aria-label="Fixar"
          >
            <PushPinIcon style={{ fontSize: 24, color: pinned ? colors.error.main : colors.surface.main }} />
          </IconButton>
        </Tooltip>
      </div>

      {/* ── Coluna central: dados da tarefa ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0, gap: 4 }}>
        {/* Linha superior: header + divider + campos */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, width: '100%' }}>

          {/* Header: nome da tarefa + link do processo */}
          <div style={{
            width: compact ? '100%' : 'clamp(180px, 22vw, 255px)',
            flexShrink: compact ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <Tooltip content={taskName}>
              <span
                style={{ ...typography.styles.subtitle2, color: colors.primary.main, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
              >
                {taskName}
              </span>
            </Tooltip>
            <button
              onClick={e => { e.stopPropagation(); onOpenProcess?.(); }}
              style={{
                border:     'none',
                background: 'transparent',
                padding:    0,
                cursor:     'pointer',
                display:    'flex',
                alignItems: 'center',
                gap:        4,
              }}
            >
              <span style={{ ...typography.styles.captionLink, color: colors.primary.main, whiteSpace: 'nowrap', textDecoration: 'underline' }}>
                {processNumber}
              </span>
              <OpenInNewIcon style={{ fontSize: 20, color: colors.primary.main }} />
            </button>
          </div>

          {/* Divider vertical com botão expandir */}
          {!compact && (
          <div style={{ padding: '0 24px 0 16px', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
            <div style={{ width: 1, height: '100%', backgroundColor: colors.surface.light }} />
            <Tooltip content="Abrir tarefa">
              <button
                onClick={e => { e.stopPropagation(); onExpandClick?.(); }}
                style={{
                  position:        'absolute',
                  left:            '50%',
                  top:             '50%',
                  transform:       'translate(-50%, -50%)',
                  transition:      'transform 180ms ease',
                  border:          'none',
                  borderRadius:    '50%',
                  backgroundColor: colors.primary.main,
                  color:           colors.surface.xxxl,
                  width:           20,
                  height:          20,
                  padding:         0,
                  cursor:          'pointer',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  flexShrink:      0,
                }}
              >
                <ChevronRightIcon style={{ fontSize: 16 }} />
              </button>
            </Tooltip>
          </div>
          )}

          {/* Campos de leitura */}
          {!compact && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: '1 0 0', minWidth: 0, gap: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%', flexWrap: 'wrap' }}>
              {fields.slice(0, 4).map((f, i) => (
                <InputRead
                  key={i}
                  label={f.label as string}
                  value={f.value as string}
                  labelFontSize={labelFontSize}
                  labelFontWeight={labelFontWeight}
                  valueFontSize={valueFontSize}
                  valueFontWeight={valueFontWeight}
                  style={{ flex: '1 1 150px', minWidth: 0, ...(fieldGap !== undefined && { gap: fieldGap }) }}
                />
              ))}
            </div>
            <div style={{
              maxHeight: extraFields.length > 0 && expanded ? 96 : 0,
              opacity: extraFields.length > 0 && expanded ? 1 : 0,
              transform: extraFields.length > 0 && expanded ? 'translateY(0)' : 'translateY(-4px)',
              overflow: 'hidden',
              transition: 'max-height 180ms ease, opacity 160ms ease, transform 160ms ease',
            }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%', flexWrap: 'wrap' }}>
                {extraFields.slice(0, 4).map((f, i) => (
                  <InputRead
                    key={i}
                    label={f.label as string}
                    value={f.value as string}
                    labelFontSize={labelFontSize}
                    labelFontWeight={labelFontWeight}
                    valueFontSize={valueFontSize}
                    valueFontWeight={valueFontWeight}
                    style={{ flex: '1 1 150px', minWidth: 0, ...(fieldGap !== undefined && { gap: fieldGap }) }}
                  />
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Chips na base */}
        {chips.length > 0 && (
          <TagChipList chips={chips} compact={compact} />
        )}
      </div>

      {/* ── Coluna direita: indicadores ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0 }}>
        <Tooltip content={possuiFluxo ? 'Possui fluxo' : 'Não possui fluxo'}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: colors.surface.main, opacity: possuiFluxo ? 1 : 0.2, flexShrink: 0 }}>
            <IconEtapas style={{ fontSize: 24 }} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
