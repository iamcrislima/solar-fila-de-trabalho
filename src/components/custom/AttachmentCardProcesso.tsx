import React, { useRef, useState } from 'react';
import PushPinIcon  from '@mui/icons-material/PushPin';
import { Tooltip }  from '../ds/atoms/Tooltip/Tooltip';
import { colors }    from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { borders }   from '../../styles/tokens/borders';
import { spacing }   from '../../styles/tokens/spacing';
import { ICON_MAP, IconInsertDriveFile } from './attachmentCardIcons';

// ── Ícone de alerta compacto (15 × 13) ────────────────────────────────────────
const IconWarningSmall = ({ style, ...props }: { style?: React.CSSProperties; [k: string]: unknown }) => (
  <svg width="15" height="13" viewBox="0 0 22 19" fill="none" style={style} {...props}>
    <path d="M0 19H22L11 0L0 19ZM12 16H10V14H12V16ZM12 12H10V8H12V12Z" fill="currentColor" />
  </svg>
);

// ── Botão de ação 26 × 26 (grade da coluna direita) ───────────────────────────
function ActionBtn({
  iconKey, active = true, onClick, tooltip,
}: { iconKey: string; active?: boolean; onClick?: () => void; tooltip?: string }) {
  const [hovered, setHovered] = useState(false);
  const IconComp = (ICON_MAP as Record<string, React.ElementType>)[iconKey];
  if (!IconComp) return null;

  return (
    <Tooltip content={tooltip ?? ''}>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onClick?.(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           26,
          height:          26,
          border:          'none',
          borderRadius:    borders.radius.md,     // 4 px
          padding:         0,
          background:      hovered && active ? colors.surface.xl : 'transparent',
          cursor:          active && onClick ? 'pointer' : 'default',
          color:           active ? colors.surface.main : colors.surface.light,
          flexShrink:      0,
          transition:      'background-color 0.12s',
        }}
      >
        {/* width + height: escala SVGs customizados; fontSize: escala ícones MUI */}
        <IconComp style={{ width: 15, height: 15, fontSize: 15 }} />
      </button>
    </Tooltip>
  );
}

// ── Chip de marcador no rodapé do card ────────────────────────────────────────
// Segue o visual do HTML de referência (card-redesign_5.html):
//   tag-pi      → bg primary.xxl  / text primary.main
//   tag-red     → bg error.light  / text error.main
//   tag-green   → bg success.light / text success.main
//   tag-warning → bg warning.light / text warning.main
//   tag-outline → transparente, borda sutil, texto cinza
//   hex livre   → bg = cor, texto via fontColor ou branco
function CardTagChip({ chip }: { chip: unknown }) {
  const c       = (typeof chip === 'object' && chip !== null) ? (chip as Record<string, unknown>) : {};
  const label   = typeof chip === 'string' ? chip : String(c.label ?? '');
  const color   = typeof chip === 'string' ? undefined : (c.color as string | undefined);
  const iconKey = typeof chip === 'string' ? undefined : (c.iconKey as string | undefined);
  const IconComp = iconKey ? (ICON_MAP as Record<string, React.ElementType>)[iconKey] : null;

  let bg: string | undefined;
  let textColor: string;
  let border: string | undefined;

  if (color?.startsWith('#')) {
    bg        = color;
    textColor = (c.fontColor as string | undefined) ?? colors.surface.xxxl;
  } else {
    switch (color) {
      case 'primary':
        bg = colors.primary.xxl; textColor = colors.primary.main; break;
      case 'error':
        bg = colors.error.light; textColor = colors.error.main; break;
      case 'success':
        bg = colors.success.light; textColor = colors.success.main; break;
      case 'warning':
        bg = colors.warning.light; textColor = colors.warning.main; break;
      default:
        bg = undefined; textColor = colors.surface.main;
        border = '0.5px solid rgba(0,0,0,0.16)';
    }
  }

  return (
    <span style={{
      display:         'inline-flex',
      alignItems:      'center',
      gap:             3,
      fontSize:        11,
      fontFamily:      typography.fontFamily.primary,
      fontWeight:      typography.fontWeight.medium,
      padding:         '2px 7px',
      borderRadius:    borders.radius.md,       // 4 px
      backgroundColor: bg ?? 'transparent',
      color:           textColor,
      border:          border ?? 'none',
      whiteSpace:      'nowrap',
      lineHeight:      '14px',
      flexShrink:      0,
    }}>
      {IconComp && (
        <IconComp style={{ fontSize: 11, width: 11, height: 11, flexShrink: 0 }} />
      )}
      {label}
    </span>
  );
}

// ── AttachmentCardProcesso ─────────────────────────────────────────────────────
// Referência visual: card-redesign_5.html
//
// Grid 32px | 1fr | auto
//   col-select  — checkbox + pin
//   col-main    — número/classe · linha de campos (fields / extraFields expandido)
//   col-actions — grade 2×2 (≤4 ícones) ou 2×3 (5–6 ícones) + notif row opcional
//   card-tags   — row 2, span all cols, só renderiza se houver chips
//
// Props de estado:
//   checked / onCheckedChange   — checkbox de seleção em massa
//   pinned  / onPinClick        — fixar processo no topo da lista
//   selected                    — anel azul de foco (processo aberto no painel)
//   expanded                    — exibe extraFields abaixo de fields
//   onClick                     — clique no card (abre detalhe / expande)
//   bgColor                     — override de cor de fundo (ex.: processo atrasado)
//
// Props de conteúdo:
//   processNumber               — "SolarBPM 000001/2026" (texto azul, clicável)
//   processClass                — "Solicitação de férias" (cinza, truncado)
//   onOpenProcess               — abre detalhe do processo
//   fields      [{label,value}] — até 4 campos meta visíveis sempre
//   extraFields [{label,value}] — até 4 campos meta extras (requer expanded=true)
//   chips       [string|obj]    — marcadores/tags na base do card
//
// Props de personalização de campo:
//   fieldGap, labelFontSize, labelFontWeight, valueFontSize, valueFontWeight
//
// Props de status (coluna direita):
//   statusActions [{iconKey,active,onClick?,tooltip?}]
//     — todos os iconKeys exceto 'assignment' e 'warning' vão para a grade
//     — 'assignment' → badge de documentos (amarelo)
//     — 'warning'    → ícone de alerta (amarelo)
//   documentCount  — número no badge de documentos
//   alertActive    — exibe ícone de alerta
//   onLembretesClick — callback ao clicar no alerta

export function AttachmentCardProcesso({
  checked          = false,
  onCheckedChange,
  pinned           = false,
  onPinClick,
  selected         = false,
  expanded: _expanded = false,
  onClick,
  bgColor,

  processNumber    = 'Número do processo',
  processClass     = 'Classificação do processo',
  onOpenProcess,

  fields      = [] as Array<{ label?: string; value?: unknown }>,
  extraFields = [] as Array<{ label?: string; value?: unknown }>,
  chips       = [] as unknown[],
  fieldGap,
  labelFontSize,
  labelFontWeight,
  valueFontSize,
  valueFontWeight,

  statusActions = [] as unknown[],
  documentCount = 0,
  alertActive   = false,
  onLembretesClick,

  style,
}: {
  checked?: boolean;
  onCheckedChange?: React.ChangeEventHandler<HTMLInputElement>;
  pinned?: boolean;
  onPinClick?: () => void;
  selected?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  bgColor?: string;
  processNumber?: string;
  processClass?: string;
  onOpenProcess?: () => void;
  fields?: Array<{ label?: string; value?: unknown }>;
  extraFields?: Array<{ label?: string; value?: unknown }>;
  chips?: unknown[];
  fieldGap?: number;
  labelFontSize?: number;
  labelFontWeight?: number;
  valueFontSize?: number;
  valueFontWeight?: number;
  statusActions?: unknown[];
  documentCount?: number;
  alertActive?: boolean;
  onLembretesClick?: () => void;
  style?: React.CSSProperties;
}) {
  // focused só fica true quando o foco vem do teclado (focus-visible).
  // Cliques via ponteiro NÃO devem acionar o outline.
  const pointerDownRef = useRef(false);
  const [focused,     setFocused]     = useState(false);
  const [pinHovered,  setPinHovered]  = useState(false);

  // ── Ações especiais ───────────────────────────────────────────────────────
  const typedActions     = statusActions as Array<Record<string, unknown>>;
  const assignmentAction = typedActions.find(a => a.iconKey === 'assignment');
  const warningAction    = typedActions.find(a => a.iconKey === 'warning');
  const prazosTooltip    = (assignmentAction?.tooltip as string)  ?? 'Tarefas pendentes';
  const alertasTooltip   = (warningAction?.tooltip as string)     ?? 'Lembretes';
  const assignmentActive = assignmentAction
    ? (assignmentAction.active as boolean)
    : documentCount > 0;
  const warningActive    = warningAction
    ? (warningAction.active as boolean)
    : alertActive;

  // ── Ações regulares (grade de ícones) ────────────────────────────────────
  const regularActions = typedActions.filter(
    a => a.iconKey !== 'assignment' && a.iconKey !== 'warning',
  );
  // Grade fixa 4 colunas × auto-linhas — nunca ultrapassa 2 linhas com ≤ 8 ícones
  const hasNotifRow = documentCount > 0 || warningActive;

  // ── Estilos de campo (overridáveis via props) ─────────────────────────────
  const metaGap         = fieldGap      ?? 24;
  const metaLabelSize   = labelFontSize ?? 10;
  const metaLabelWeight = labelFontWeight ?? typography.fontWeight.medium;
  const metaValueSize   = valueFontSize ?? 12;
  const metaValueWeight = valueFontWeight ?? typography.fontWeight.regular;

  const bg = bgColor ?? colors.surface.xxxl;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const renderMetaItems = (items: Array<{ label?: string; value?: unknown }>) =>
    items.slice(0, 4).map((f, i) => {
      const raw     = f.value as string | null | undefined;
      const val     = raw != null ? String(raw) : '';
      const isEmpty = val.trim() === '' || val === '—';
      return (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontFamily:    typography.fontFamily.primary,
            fontSize:      metaLabelSize,
            fontWeight:    metaLabelWeight,
            color:         colors.surface.medium,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.03em',
            whiteSpace:    'nowrap',
            lineHeight:    '13px',
          }}>
            {f.label}
          </span>
          <span style={{
            fontFamily: typography.fontFamily.primary,
            fontSize:   metaValueSize,
            fontWeight: metaValueWeight,
            color:      isEmpty ? colors.surface.light : colors.secondary.dark,
            whiteSpace: 'nowrap',
            lineHeight: '16px',
          }}>
            {isEmpty ? '—' : val}
          </span>
        </div>
      );
    });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onPointerDown={() => { pointerDownRef.current = true; }}
      onFocus={() => {
        if (!pointerDownRef.current) setFocused(true);
        pointerDownRef.current = false;
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); }
      }}
      style={{
        backgroundColor: selected ? '#EEF5FD' : bg,
        border:          selected ? '1px solid #85B7EB' : '0.5px solid rgba(0,0,0,0.13)',
        ...(pinned ? { borderLeft: '3px solid #534AB7' } : {}),
        borderRadius:    borders.radius.xl,       // 12 px
        overflow:        'hidden',
        boxShadow:       selected ? '0 0 0 2px rgba(24,95,165,0.12)' : 'none',
        outline:         focused  ? `3px solid ${colors.primary.main}` : 'none',
        outlineOffset:   2,
        cursor:          onClick ? 'pointer' : 'default',
        width:           '100%',
        boxSizing:       'border-box',
        fontSize:        13,
        ...style,
      }}
    >
      {/* ── Layout principal: 3 colunas ─────────────────────────────────── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '32px 1fr auto',
        alignItems:          'stretch',
      }}>

        {/* ── col-select: checkbox + pin ─────────────────────────────────── */}
        <div style={{
          gridRow:       1,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          paddingTop:    14,       // alinha checkbox ao centro óptico do título
          gap:           7,
        }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onCheckedChange}
            style={{
              width:       14,
              height:      14,
              cursor:      'pointer',
              accentColor: colors.primary.main,
              flexShrink:  0,
              margin:      0,
            }}
          />
          <Tooltip content={pinned ? 'Desfixar' : 'Fixar'}>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onPinClick?.(); }}
              onMouseEnter={() => setPinHovered(true)}
              onMouseLeave={() => setPinHovered(false)}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     'none',
                border:         'none',
                padding:        0,
                cursor:         'pointer',
                color:          pinned || pinHovered ? '#534AB7' : '#C8C6BE',
                lineHeight:     1,
                transition:     'color 0.12s',
              }}
            >
              <PushPinIcon style={{ fontSize: 14 }} />
            </button>
          </Tooltip>
        </div>

        {/* ── col-main: número/classe + campos ──────────────────────────── */}
        <div style={{
          gridRow:       1,
          padding:       `${spacing['bt-3']} 20px ${spacing['bt-3']} ${spacing.xxs}`,
          display:       'flex',
          flexDirection: 'column',
          gap:           7,
          minWidth:      0,
        }}>
          {/* proc-id: "Número · Classificação" */}
          <div style={{
            display:    'flex',
            alignItems: 'baseline',
            minWidth:   0,
            lineHeight: '1.45',
          }}>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onOpenProcess?.(); }}
              style={{
                fontFamily: typography.fontFamily.primary,
                fontSize:   13,
                fontWeight: typography.fontWeight.semibold,
                color:      colors.primary.main,
                background: 'none',
                border:     'none',
                padding:    0,
                cursor:     onOpenProcess ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                lineHeight: 'inherit',
              }}
            >
              {processNumber}
            </button>
            <span style={{
              fontSize:   12,
              color:      colors.surface.light,
              margin:     `0 ${spacing.bt}`,  // 0 6 px
              flexShrink: 0,
            }}>
              ·
            </span>
            <span style={{
              fontFamily:   typography.fontFamily.primary,
              fontSize:     12,
              color:        colors.surface.main,
              whiteSpace:   'nowrap',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              minWidth:     0,
            }}>
              {processClass}
            </span>
          </div>

          {/* meta-row: campos principais (esq.) + campos extras (dir., só se couber) */}
          <div style={{
            display:    'flex',
            alignItems: 'flex-start',
            gap:        metaGap,
            overflow:   'hidden',
            flexWrap:   'nowrap',
            minWidth:   0,
          }}>
            {renderMetaItems(fields)}
            {extraFields.length > 0 && (
              <>
                <div style={{ flex: 1, minWidth: 24 }} />
                <div style={{ width: 1, height: 34, backgroundColor: 'rgba(0,0,0,0.10)', flexShrink: 0, alignSelf: 'center' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: metaGap, flexShrink: 0 }}>
                  {renderMetaItems(extraFields)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── col-actions: grade NxN + notif row ────────────────────────── */}
        <div style={{
          gridRow:        1,
          backgroundColor: selected ? '#DCE9F7' : colors.surface.xl,
          borderLeft:     '0.5px solid rgba(0,0,0,0.07)',
          padding:        `0 ${spacing['bt-3']}`,   // 0 12 px
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          alignItems:     'center',
          gap:            spacing.xxs,              // 4 px
        }}>
          {/* Grade de botões: 2×2 ou 2×3 */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(4, 26px)',
            gridAutoRows:        '26px',
            gap:                 2,
            alignItems:          'center',
            justifyItems:        'center',
          }}>
            {regularActions.map((action, i) => (
              <ActionBtn
                key={i}
                iconKey={action.iconKey as string}
                active={action.active as boolean}
                onClick={action.onClick as (() => void) | undefined}
                tooltip={action.tooltip as string | undefined}
              />
            ))}
          </div>

          {/* Linha de notificações (badge de docs + alerta) */}
          {hasNotifRow && (
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            spacing.xxs,   // 4 px
            }}>
              {documentCount > 0 && (
                <Tooltip content={prazosTooltip}>
                  <div
                    role={assignmentAction?.onClick ? 'button' : undefined}
                    tabIndex={assignmentAction?.onClick ? 0 : undefined}
                    onClick={assignmentAction?.onClick
                      ? e => { e.stopPropagation(); (assignmentAction.onClick as () => void)(); }
                      : undefined}
                    onKeyDown={assignmentAction?.onClick ? e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        (assignmentAction.onClick as () => void)();
                      }
                    } : undefined}
                    style={{
                      display:         'inline-flex',
                      alignItems:      'center',
                      gap:             3,
                      fontSize:        11,
                      fontFamily:      typography.fontFamily.primary,
                      fontWeight:      typography.fontWeight.medium,
                      color:           colors.warning.main,
                      backgroundColor: colors.warning.light,
                      padding:         `2px ${spacing.bt}`,  // 2 px 6 px
                      borderRadius:    borders.radius.md,     // 4 px
                      cursor:          assignmentActive && assignmentAction?.onClick
                        ? 'pointer'
                        : 'default',
                      opacity:         assignmentActive ? 1 : 0.5,
                      lineHeight:      '14px',
                    }}
                  >
                    <IconInsertDriveFile style={{ width: 11, height: 11, fontSize: 11, flexShrink: 0 }} />
                    {documentCount}
                  </div>
                </Tooltip>
              )}
              {warningActive && (
                <Tooltip content={alertasTooltip}>
                  <div
                    onClick={onLembretesClick
                      ? e => { e.stopPropagation(); onLembretesClick(); }
                      : undefined}
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      color:      colors.warning.main,
                      cursor:     onLembretesClick ? 'pointer' : 'default',
                    }}
                  >
                    <IconWarningSmall />
                  </div>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* ── card-tags: marcadores (row 2, span 3 cols, opcional) ──────── */}
        {(chips as unknown[]).length > 0 && (
          <div style={{
            gridColumn:  '1 / -1',
            gridRow:     2,
            borderTop:   '0.5px solid rgba(0,0,0,0.07)',
            padding:     `${spacing.bt} ${spacing['bt-2']} 7px`,  // 6 px 10 px 7 px
            display:     'flex',
            alignItems:  'center',
            gap:         5,
            flexWrap:    'wrap',
          }}>
            {(chips as unknown[]).map((chip, i) => (
              <CardTagChip key={i} chip={chip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
