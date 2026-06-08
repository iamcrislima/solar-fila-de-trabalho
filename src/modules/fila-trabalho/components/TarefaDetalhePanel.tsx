import ArrowBackIcon      from '@mui/icons-material/ArrowBack';
import SellIcon           from '@mui/icons-material/Sell';
import AssignmentAddIcon  from '@mui/icons-material/AssignmentAdd';
import CallReceivedIcon   from '@mui/icons-material/CallReceived';
import ArrowOutwardIcon   from '@mui/icons-material/ArrowOutward';
import CancelIcon         from '@mui/icons-material/Cancel';
import WatchLaterIcon     from '@mui/icons-material/WatchLater';
import EditIcon           from '@mui/icons-material/Edit';
import NotInterestedIcon  from '@mui/icons-material/NotInterested';
import { Button }         from '../../../components/ds/atoms/Button/Button';
import { TruncatedText }  from '../../../components/ds/atoms/TruncatedText';
import { colors }         from '../../../styles/tokens/colors';
import { shadows }        from '../../../styles/tokens/shadows';
import { typography }     from '../../../styles/tokens/typography';
import { layout }         from '../../../styles/tokens/layout';
import { ButtonHint }     from '../../../components/custom/ButtonHint';
import { TagChipList }    from '../../../components/custom/TagChipList';

interface TarefaDetealhePanelProps { tarefa?: Record<string, unknown>; chips?: unknown[]; onClose?: () => void; actionLabels?: Record<string, string>; actionStates?: Record<string, unknown>; categoriasAction?: React.ReactNode; closing?: boolean; showBackButton?: boolean; }
export function TarefaDetalhePanel({
  tarefa,
  chips = [],
  onClose,
  actionLabels = {},
  actionStates = {},
  categoriasAction = null,
  closing = false,
  showBackButton = true,
}: TarefaDetealhePanelProps) {
  if (!tarefa) return null;

  return (
    <div style={{
      flex: '1 1 0',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.surface.xxxl,
      borderRadius: 8,
      boxShadow: shadows.level1,
      padding: `${layout.containerPaddingY} ${layout.containerPaddingX}`,
      boxSizing: 'border-box',
      minHeight: 0,
      overflow: 'hidden',
      opacity: closing ? 0 : 1,
      transform: closing ? 'translateX(16px)' : 'translateX(0)',
      pointerEvents: closing ? 'none' : 'auto',
      transition: 'opacity 180ms ease, transform 180ms ease',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
            {showBackButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Voltar"
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <ArrowBackIcon style={{ fontSize: 24, color: colors.surface.main }} />
              </button>
            )}
            <TruncatedText text={`Tarefa: ${tarefa.processNumber}`} style={{
              ...typography.styles.subtitle1,
              color: colors.surface.dark,
              flex: '0 1 auto',
            }}>
              Tarefa: {tarefa.processNumber as React.ReactNode}
            </TruncatedText>
          </div>
        </div>

        {chips.length > 0 && (
          <div style={{ minWidth: 0, maxWidth: '100%' }}>
            <TagChipList chips={chips} overflowDisclosure="popover" overflowVariant="full" />
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        padding: '16px 0',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 280px', minWidth: 0, maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
          {['Dados básicos', 'Dados de criação', 'Dados de finalização'].map((label, index) => {
            const active = index === 2;
            return (
              <button
                key={label}
                type="button"
                style={{
                  border: 'none',
                  borderBottom: active ? `2px solid ${colors.primary.main}` : '2px solid transparent',
                  background: 'transparent',
                  padding: '8px 24px 12px',
                  cursor: 'pointer',
                  color: active ? colors.primary.main : colors.surface.main,
                  ...typography.styles.subtitle2,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, flex: '1 1 280px', flexWrap: 'wrap' }}>
          {(categoriasAction as React.ReactNode) ?? <ButtonHint icon={<SellIcon />} hint={actionLabels.categorias ?? 'Categorias'} />}
          <ButtonHint icon={<AssignmentAddIcon />} hint="Criar tarefa" disabled={!actionStates.criarTarefa} />
          <ButtonHint icon={<CallReceivedIcon />}  hint={actionLabels.atribuir    ?? 'Atribuir'}    disabled={!actionStates.atribuir} />
          <ButtonHint icon={<ArrowOutwardIcon />}  hint={actionLabels.desatribuir ?? 'Desatribuir'} disabled={!actionStates.desatribuir} />
          <ButtonHint icon={<CancelIcon />}        hint={actionLabels.rejeitar    ?? 'Rejeitar'}    disabled={!actionStates.rejeitar} />
          <ButtonHint icon={<WatchLaterIcon />}    hint={actionLabels.agendar     ?? 'Agendar'}     disabled={!actionStates.agendar} />
          <ButtonHint icon={<EditIcon />}          hint="Editar"   disabled={!actionStates.editar} />
          <ButtonHint icon={<NotInterestedIcon />} hint="Cancelar" disabled={!actionStates.cancelar} />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
        <label style={{ ...typography.styles.body2, color: colors.surface.dark }}>
          Descrição da finalização da tarefa (parecer)<span style={{ color: colors.error.main }}>*</span>:
        </label>
        <textarea
          style={{
            width: '100%',
            minHeight: 84,
            resize: 'vertical',
            border: `1px solid ${colors.surface.medium}`,
            borderRadius: 4,
            outline: 'none',
            padding: 8,
            boxSizing: 'border-box',
            ...typography.styles.body2,
            color: colors.surface.dark,
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 8, flexShrink: 0 }}>
        <Button type="primary" variant="filled">
          Finalizar tarefa
        </Button>
      </div>
    </div>
  );
}
