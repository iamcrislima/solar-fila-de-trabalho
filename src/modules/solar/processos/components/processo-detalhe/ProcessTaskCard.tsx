import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import CancelIcon from '@mui/icons-material/Cancel';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { InputRead } from '../../../../../components/ds/atoms/InputRead';
import { Tooltip } from '../../../../../components/ds/atoms/Tooltip/Tooltip';
import { colors } from '../../../../../styles/tokens/colors';
import { shadows } from '../../../../../styles/tokens/shadows';
import { typography } from '../../../../../styles/tokens/typography';
import { TagChip } from '../../../../../components/custom/TagChip';
import { ButtonHint } from '../../../../../components/custom/ButtonHint';
import { IconEtapas } from '../../../../../components/custom/attachmentCardIcons';
import { TAREFA_SITUACAO, getTarefaSituacaoConfig } from '../../../../../domain/processos/tarefas/config/tarefaSituacao.config';

const SITUACAO_UI = {
  [TAREFA_SITUACAO.FINALIZADA]: { icon: CheckCircleIcon, color: colors.success.main },
  [TAREFA_SITUACAO.EM_ABERTO]: { icon: WatchLaterIcon, color: colors.warning.main },
  [TAREFA_SITUACAO.CANCELADA]: { icon: NotInterestedIcon, color: colors.error.main },
  [TAREFA_SITUACAO.REJEITADA]: { icon: CancelIcon, color: colors.error.main },
};

export function ProcessTaskCard({
  card,
  chips = [] as unknown[],
  possuiFluxo = false,
  assigned = false,
  expanded = false,
  onToggle,
  onOpenTask,
  onToggleAssignment,
}: { card: Record<string, unknown>; chips?: unknown[]; possuiFluxo?: boolean; assigned?: boolean; expanded?: boolean; onToggle?: () => void; onOpenTask?: (c: unknown) => void; onToggleAssignment?: (c: unknown) => void }) {
  const situacao = getTarefaSituacaoConfig(card.situacao as string);
  const situacaoUi = (SITUACAO_UI as Record<string, { icon: React.ElementType; color: string }>)[card.situacao as string] ?? SITUACAO_UI[TAREFA_SITUACAO.EM_ABERTO];
  const StatusIcon = situacaoUi.icon;
  const isEmAberto = card.situacao === TAREFA_SITUACAO.EM_ABERTO;
  const assignmentActionLabel = assigned ? 'Desatribuir' : 'Atribuir';
  const AssignmentActionIcon = assigned ? ArrowOutwardIcon : CallReceivedIcon;
  const assignmentActionDisabled = !isEmAberto || !onToggleAssignment;
  const flowTooltip = possuiFluxo ? 'Possui fluxo' : 'Não possui fluxo';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggle?.()}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle?.();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: 8,
        border: 'none',
        borderRadius: 8,
        background: assigned ? colors.surface.xxxl : colors.primary.xxl,
        boxShadow: shadows.level1,
        cursor: onToggle ? 'pointer' : 'default',
        textAlign: 'left',
        boxSizing: 'border-box',
        transition: 'background-color 160ms ease, box-shadow 160ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <ButtonHint
          icon={<AssignmentActionIcon />}
          hint={assignmentActionLabel}
          disabled={assignmentActionDisabled}
          onClick={() => {
            if (assignmentActionDisabled) return;
            onToggleAssignment?.(card);
          }}
          style={{ backgroundColor: colors.surface.xxxl }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 0', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <div style={{
            width: 'clamp(180px, 24vw, 255px)',
            minWidth: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                onOpenTask?.(card);
              }}
              style={{
              ...typography.styles.subtitle2,
              color: colors.primary.main,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              maxWidth: '100%',
            }}>
              {card.taskName as React.ReactNode}
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
            gap: 4,
            flex: '1 1 0',
            minWidth: 0,
          }}>
            {(card.fields as Array<{ id?: string; label?: string; value?: string }>).slice(0, 4).map((field) => (
              <InputRead
                key={field.id}
                label={field.label}
                value={field.value}
                style={{ minWidth: 0 }}
              />
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          width: '100%',
          maxHeight: expanded ? 96 : 0,
          opacity: expanded ? 1 : 0,
          transform: expanded ? 'translateY(0)' : 'translateY(-2px)',
          overflow: 'hidden',
          transition: 'max-height 180ms ease, opacity 160ms ease, transform 160ms ease',
        }}>
          <div style={{
            width: 'clamp(180px, 24vw, 255px)',
            minWidth: 0,
            flexShrink: 0,
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))',
            gap: 4,
            flex: '1 1 0',
            minWidth: 0,
            visibility: expanded ? 'visible' : 'hidden',
          }}>
            {(card.fields as Array<{ id?: string; label?: string; value?: string }>).slice(4, 8).map((field) => (
              <InputRead
                key={field.id}
                label={field.label}
                value={field.value}
                style={{ minWidth: 0 }}
              />
            ))}
          </div>
        </div>

        {chips.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            flexWrap: 'wrap',
            overflow: 'visible',
            maxWidth: '100%',
          }}>
            {(chips as Array<string | Record<string, unknown>>).map((chip, index) => <TagChip key={`${card.id}-${index}`} chip={chip} />)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <Tooltip content={situacao.tooltip}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: situacaoUi.color, flexShrink: 0 }}>
            <StatusIcon style={{ fontSize: 24 }} />
          </span>
        </Tooltip>
        <Tooltip content={flowTooltip}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, color: colors.surface.main, opacity: possuiFluxo ? 1 : 0.2, flexShrink: 0 }}>
            <IconEtapas style={{ fontSize: 24 }} />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

