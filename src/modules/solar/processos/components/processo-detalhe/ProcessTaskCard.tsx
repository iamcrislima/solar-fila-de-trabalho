import { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import type { Tarefa } from '../../../../../domain/processos/tarefas/models/tarefa.model';
import { TagChip } from '../../../../../components/custom/TagChip';

// ─── Chip pill color map ──────────────────────────────────────────────────────

const CHIP_PILL: Record<string, { bg: string; color: string; border: string }> = {
  error:   { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  warning: { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' },
  success: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  support: { bg: '#F5F3FF', color: '#5C5CFF', border: '#DDD6FE' },
  primary: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  surface: { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB' },
};

// ─── Helper components ────────────────────────────────────────────────────────

function ActionIconBtn({
  title,
  onClick,
  accent,
  children,
}: {
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
  accent?: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 30,
        height: 30,
        border: `1px solid ${hovered ? '#9CA3AF' : '#D1D5DB'}`,
        borderRadius: 6,
        background: hovered ? '#F3F4F6' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: accent ?? '#6B7280',
        padding: 0,
        flexShrink: 0,
        fontFamily: 'inherit',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function FieldCell({
  label,
  value,
}: {
  label?: string;
  value?: unknown;
}) {
  return (
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {label && (
        <span
          style={{
            fontSize: 10,
            color: '#9CA3AF',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: '#374151',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.4,
        }}
      >
        {(value as React.ReactNode) ?? '—'}
      </span>
    </div>
  );
}

// ─── ProcessTaskCard ──────────────────────────────────────────────────────────

export function ProcessTaskCard({
  card,
  chips = [] as unknown[],
  possuiFluxo = false,
  assigned = false,
  expanded = false,
  onToggle,
  onOpenTask,
  onToggleAssignment,
}: {
  card: Record<string, unknown>;
  chips?: unknown[];
  possuiFluxo?: boolean;
  assigned?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onOpenTask?: (c: unknown) => void;
  onToggleAssignment?: (c: unknown) => void;
}) {
  const [hovered, setHovered] = useState(false);

  // Badge detection: "Início agendado"
  const hasAgendamentoBadge =
    (card.tarefa as Tarefa)?.agendamento?.agendada === true;

  const fields = (card.fields as Array<Record<string, unknown>>) ?? [];
  const firstFour = fields.slice(0, 4);
  const nextFour = fields.slice(4, 8);

  // Regular chips — exclude the "Início agendado" system chip (already shown as explicit badge)
  const regularChips = (chips as Array<string | Record<string, unknown>>).filter((chip) => {
    if (typeof chip === 'string') return chip !== 'Início agendado';
    const c = chip as Record<string, unknown>;
    return c.id !== 'cat-sistema-inicio-agendado' && c.label !== 'Início agendado';
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 14px',
        border: `1px solid ${hovered ? '#93C5FD' : '#E5E7EB'}`,
        borderRadius: 8,
        background: '#fff',
        boxShadow: hovered
          ? '0 1px 4px rgba(24,95,165,0.07)'
          : '0 1px 2px rgba(0,0,0,0.04)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Body ── */}
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Title */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenTask?.(card);
          }}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#185FA5',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
            lineHeight: 1.4,
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'inherit',
          }}
        >
          {card.taskName as React.ReactNode}
        </button>

        {/* First 4 fields */}
        {firstFour.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(firstFour.length, 4)}, minmax(0, 1fr))`,
              gap: 8,
            }}
          >
            {firstFour.map((field, i) => (
              <FieldCell
                key={(field.id as string) ?? i}
                label={field.label as string}
                value={field.value}
              />
            ))}
          </div>
        )}

        {/* Expanded: fields 5-8 */}
        {nextFour.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(nextFour.length, 4)}, minmax(0, 1fr))`,
              gap: 8,
              maxHeight: expanded ? 64 : 0,
              opacity: expanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 180ms ease, opacity 160ms ease',
            }}
          >
            {nextFour.map((field, i) => (
              <FieldCell
                key={(field.id as string) ?? `exp-${i}`}
                label={field.label as string}
                value={field.value}
              />
            ))}
          </div>
        )}

        {/* Badge row */}
        {(hasAgendamentoBadge || regularChips.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            {hasAgendamentoBadge && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: CHIP_PILL.error.bg,
                  color: CHIP_PILL.error.color,
                  border: `1px solid ${CHIP_PILL.error.border}`,
                  borderRadius: 20,
                  padding: '2px 7px',
                  fontSize: 10,
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                <EventAvailableIcon style={{ fontSize: 11 }} />
                Início agendado
              </span>
            )}
            {regularChips.map((chip, index) => (
              <TagChip key={`${card.id as string}-${index}`} chip={chip} />
            ))}
          </div>
        )}
      </div>

      {/* ── Right action buttons ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, alignSelf: 'flex-start' }}>
        <ActionIconBtn
          title="Prazo"
          accent={possuiFluxo ? '#C2410C' : '#9CA3AF'}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
        >
          <AccessTimeIcon style={{ fontSize: 15 }} />
        </ActionIconBtn>
        <ActionIconBtn
          title={assigned ? 'Desatribuir' : 'Atribuir'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleAssignment?.(card);
          }}
        >
          <MoreVertIcon style={{ fontSize: 15 }} />
        </ActionIconBtn>
      </div>
    </div>
  );
}
