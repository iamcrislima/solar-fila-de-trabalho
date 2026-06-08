import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import InfoIcon  from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, ModalDialog } from '../ds/atoms/Modal';
import { Button }       from '../ds/atoms/Button/Button';
import { DividerH }     from '../ds/atoms/Divider';
import { TruncatedText } from '../ds/atoms/TruncatedText';
import { DateInput } from '../app/DateInput';
import { isValidDateBR } from '../../domain/filtros/dateRange';
import { colors }       from '../../styles/tokens/colors';
import { typography }   from '../../styles/tokens/typography';
import { spacing }      from '../../styles/tokens/spacing';
import type { WorkQueueCard } from '../../modules/fila-trabalho/types';

interface AgendamentoConfig {
  textos: {
    tituloAgendar: string;
    tituloReagendar: string;
    alerta: string;
    mensagemDataPassada: string;
    colunas: Record<string, string>;
    campos: Record<string, string>;
    botoes: Record<string, string>;
    acoes: Record<string, string>;
    confirmacao: { titulo: string; mensagem: string };
  };
}

interface GridHeaderProps { children: ReactNode; width?: number; flex?: string; }

function GridHeader({ children, width, flex = 'initial' }: GridHeaderProps) {
  return (
    <div style={{
      flex,
      width,
      minWidth: 0,
      backgroundColor: colors.secondary.light,
      borderBottom:    `1px solid ${colors.secondary.medium}`,
      padding:         `${spacing.xs} ${spacing.xs} ${spacing.xs} ${spacing['bt-3']}`,
      boxSizing:       'border-box',
    }}>
      <span style={{ ...typography.styles.captionBold, color: colors.secondary.main }}>
        {children}
      </span>
    </div>
  );
}

interface GridCellProps { children: ReactNode; width?: number; flex?: string; center?: boolean; }

function GridCell({ children, width, flex = 'initial', center = false }: GridCellProps) {
  return (
    <div style={{
      flex,
      width,
      minWidth:        0,
      minHeight:       40,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  center ? 'center' : 'flex-start',
      gap:             spacing.xs,
      padding:         `0 ${spacing.xs}`,
      borderBottom:    `1px solid ${colors.secondary.light}`,
      backgroundColor: colors.surface.xxxl,
      boxSizing:       'border-box',
    }}>
      {children}
    </div>
  );
}

export function TarefaAgendamentoModal({
  open,
  mode = 'agendar',
  tarefas = [],
  agendamentoMap,
  config,
  onClose,
  onSave,
  onRemoveScheduling,
}: {
  open: boolean;
  mode?: string;
  tarefas?: WorkQueueCard[];
  agendamentoMap?: Map<string, string>;
  config: AgendamentoConfig;
  onClose: () => void;
  onSave?: (ids: string[], dates: Record<string, string>) => void;
  onRemoveScheduling?: (ids: string[]) => void;
}) {
  const cfg = config;
  const isReagendar = mode === 'reagendar';
  const [items, setItems] = useState<WorkQueueCard[]>([]);
  const [singleDate, setSingleDate] = useState('');
  const [singleDateBlurred, setSingleDateBlurred] = useState(false);
  const [dateById, setDateById] = useState<Record<string, string>>({});
  const [blurredIds, setBlurredIds] = useState<Set<string>>(new Set());
  const [showErrors, setShowErrors] = useState(false);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setItems([...tarefas]);
    setSingleDate('');
    setSingleDateBlurred(false);
    setDateById(Object.fromEntries(tarefas.map(t => [t.id, agendamentoMap?.get(t.id) ?? ''])));
    setBlurredIds(new Set());
    setShowErrors(false);
    setConfirmRemoveOpen(false);
  }, [open, tarefas, agendamentoMap]);

  const handleRemoveItem = (id: string) => {
    const next = items.filter(item => item.id !== id);
    setItems(next);
    if (next.length === 0) onClose?.();
  };

  const isPastDateBR = (dateBR: string) => {
    if (!dateBR || !isValidDateBR(dateBR)) return false;
    const [d, m, y] = dateBR.split('/').map(Number);
    const input = new Date(y, m - 1, d);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return input < today;
  };

  const isDateOk = (d: string) => d.trim() !== '' && isValidDateBR(d) && !isPastDateBR(d);

  const isValid = isReagendar
    ? items.length > 0 && items.every(item => isDateOk(dateById[item.id] ?? ''))
    : items.length > 0 && isDateOk(singleDate);

  const handleSave = () => {
    if (!isValid) { setShowErrors(true); return; }
    const dates = isReagendar
      ? Object.fromEntries(items.map(item => [item.id, dateById[item.id]]))
      : Object.fromEntries(items.map(item => [item.id, singleDate]));
    onSave?.(items.map(item => item.id), dates);
  };

  const title = isReagendar ? cfg.textos.tituloReagendar : cfg.textos.tituloAgendar;
  const width = isReagendar ? 760 : 640;

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={title}
        backdropColor="rgba(0,0,0,0.64)"
        style={{ width: `min(${width}px, 95vw)`, overflowY: 'auto', maxHeight: '90vh' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <div style={{
            display:         'flex',
            alignItems:      'flex-start',
            gap:             spacing['bt-3'],
            padding:         `${spacing.xs} ${spacing['bt-3']}`,
            backgroundColor: colors.secondary.xl,
            boxSizing:       'border-box',
          }}>
            <InfoIcon style={{ fontSize: 32, color: colors.secondary.main, flexShrink: 0 }} />
            <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>
              {cfg.textos.alerta}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', minWidth: isReagendar ? 520 : 360 }}>
              <GridHeader flex="1 0 0">{cfg.textos.colunas.tarefa}</GridHeader>
              {isReagendar && <GridHeader width={170}>{cfg.textos.colunas.dataInicio}*</GridHeader>}
              <GridHeader width={72}>{cfg.textos.colunas.acoes}</GridHeader>
            </div>
            {items.map(item => {
              const d = dateById[item.id] ?? '';
              const itemBlurred  = blurredIds.has(item.id);
              const isPastItem   = isValidDateBR(d) && isPastDateBR(d);
              const invalidDate  = (showErrors && !isDateOk(d)) || (itemBlurred && isPastItem);
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'stretch', width: '100%', minWidth: isReagendar ? 520 : 360 }}>
                  <GridCell flex="1 0 0">
                    <TruncatedText text={item.processNumber} style={{ ...typography.styles.body2, color: colors.secondary.main }}>
                      {item.processNumber}
                    </TruncatedText>
                  </GridCell>
                  {isReagendar && (
                    <GridCell width={170}>
                      <DateInput
                        value={dateById[item.id] ?? ''}
                        onChange={val => setDateById(prev => ({ ...prev, [item.id]: val ?? '' }))}
                        onBlur={() => setBlurredIds(prev => new Set(prev).add(item.id))}
                        invalid={invalidDate}
                        errorMessage={isPastItem ? cfg.textos.mensagemDataPassada : undefined}
                        style={{ width: 150 }}
                      />
                    </GridCell>
                  )}
                  <GridCell width={72} center>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                      aria-label={cfg.textos.acoes.removerItem}
                    >
                      <DeleteIcon style={{ fontSize: 24, color: colors.secondary.main }} />
                    </button>
                  </GridCell>
                </div>
              );
            })}
          </div>

          {!isReagendar && (
            <DateInput
              label={cfg.textos.campos.dataInicio}
              value={singleDate}
              onChange={val => setSingleDate(val ?? '')}
              onBlur={() => setSingleDateBlurred(true)}
              invalid={(showErrors && !isDateOk(singleDate)) || (singleDateBlurred && isValidDateBR(singleDate) && isPastDateBR(singleDate))}
              errorMessage={isValidDateBR(singleDate) && isPastDateBR(singleDate) ? cfg.textos.mensagemDataPassada : undefined}
              style={{ maxWidth: 250 }}
            />
          )}

          <DividerH />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap' }}>
            <span />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs, flexWrap: 'wrap' }}>
              {isReagendar && (
                <Button type="primary" variant="flat" onClick={() => setConfirmRemoveOpen(true)}>
                  {cfg.textos.botoes.removerAgendamento}
                </Button>
              )}
              <Button type="primary" variant="outline" onClick={onClose}>
                {cfg.textos.botoes.cancelar}
              </Button>
              <Button type="primary" variant="filled" onClick={handleSave}>
                {cfg.textos.botoes.salvar}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ModalDialog
        open={confirmRemoveOpen}
        title={cfg.textos.confirmacao.titulo}
        message={cfg.textos.confirmacao.mensagem}
        cancelLabel={cfg.textos.botoes.cancelar}
        confirmLabel={cfg.textos.botoes.confirmar}
        backdropColor="rgba(0,0,0,0.64)"
        onCancel={() => setConfirmRemoveOpen(false)}
        onConfirm={() => {
          onRemoveScheduling?.(items.map(item => item.id));
          setConfirmRemoveOpen(false);
        }}
      />
    </>
  );
}
