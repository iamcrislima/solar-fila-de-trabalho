import { useState, useEffect, cloneElement } from 'react';
import type { ChangeEvent, CSSProperties, ReactElement } from 'react';
import DeleteIcon        from '@mui/icons-material/Delete';
import { Modal }              from '../ds/atoms/Modal';
import { Button }             from '../ds/atoms/Button/Button';
import { DividerH }           from '../ds/atoms/Divider';
import { Radio, RadioGroup }  from '../ds/atoms/Radio/Radio';
import { TruncatedText }      from '../ds/atoms/TruncatedText';
import { DateInput }          from '../app/DateInput';
import { parseDateBR, formatDateBR, isValidDateBR } from '../../domain/filtros/dateRange';
import { colors }             from '../../styles/tokens/colors';
import { typography }         from '../../styles/tokens/typography';
import { spacing }            from '../../styles/tokens/spacing';
import { borders }            from '../../styles/tokens/borders';
import type { WorkQueueCard } from '../../modules/fila-trabalho/types';

interface PrazoModalConfig {
  textos: {
    tituloAgendar: string;
    tituloReagendar: string;
    mensagemObrigatorio: string;
    colunas: Record<string, string>;
    campos: Record<string, string>;
    opcoes: Record<string, string>;
    botoes: Record<string, string>;
  };
}

interface PrazoRow { dataRef: string; numDias: string; fimPrazo: string; }

function calcFimPrazo(dataRefStr: string, numDiasStr: string): string {
  if (!isValidDateBR(dataRefStr)) return '';
  const dias = parseInt(numDiasStr, 10);
  if (isNaN(dias) || dias < 0) return '';
  const p = parseDateBR(dataRefStr);
  if (!p) return '';
  const d = new Date(p.year, p.month, p.day);
  d.setDate(d.getDate() + dias);
  return formatDateBR(d.getFullYear(), d.getMonth(), d.getDate());
}

function isBefore(dateStr: string, refDate: Date): boolean {
  if (!isValidDateBR(dateStr)) return false;
  const p = parseDateBR(dateStr);
  if (!p) return false;
  return new Date(p.year, p.month, p.day) < refDate;
}

const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };

// ─── FieldInput ───────────────────────────────────────────────────────────────

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  trailingIcon?: ReactElement<{ style?: CSSProperties }>;
  invalid?: boolean;
  style?: CSSProperties;
}

function FieldInput({ label, value, onChange, type = 'text', min, trailingIcon, invalid = false, style }: FieldInputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs, ...style }}>
      <span style={{
        ...typography.styles.body2,
        color: invalid ? colors.error.main : colors.secondary.main,
      }}>
        {label}:
      </span>
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={onChange}
          type={type}
          min={min}
          placeholder={type === 'number' ? '0' : 'dd/mm/aaaa'}
          style={{
            width:           '100%',
            ...typography.styles.body2,
            color:           colors.secondary.main,
            border:          `1px solid ${invalid ? colors.error.main : colors.secondary.medium}`,
            borderRadius:    borders.radius.md,
            paddingTop:      spacing.xs,
            paddingBottom:   spacing['bt-2'],
            paddingLeft:     spacing['bt-3'],
            paddingRight:    trailingIcon ? '36px' : spacing['bt-3'],
            backgroundColor: colors.surface.xxxl,
            outline:         'none',
            boxSizing:       'border-box',
          }}
        />
        {trailingIcon && cloneElement(trailingIcon, {
          style: {
            position:      'absolute',
            right:         8,
            top:           '50%',
            transform:     'translateY(-50%)',
            fontSize:      20,
            color:         invalid ? colors.error.main : colors.secondary.main,
            pointerEvents: 'none',
          },
        })}
      </div>
    </div>
  );
}

// ─── PrazoModal ───────────────────────────────────────────────────────────────

export function PrazoModal({
  open,
  onClose,
  onSave,
  mode,
  processos,
  config,
  prazoVigenteMap,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (ids: string[], option: string, fimPrazoByItem: Map<string, string>) => void;
  mode?: string;
  processos?: WorkQueueCard[];
  config: PrazoModalConfig;
  prazoVigenteMap?: Map<string, string>;
}) {
  const cfg         = config;
  const isReagendar = mode === 'reagendar';

  const [items,          setItems]          = useState<WorkQueueCard[]>([]);
  const [option,         setOption]         = useState('stay');
  const [dataRef,        setDataRef]        = useState('');
  const [dataRefTouched, setDataRefTouched] = useState(false);
  const [numDias,        setNumDias]        = useState('');
  const [fimPrazo,       setFimPrazo]       = useState('');
  const [itemFields,     setItemFields]     = useState<Record<string, PrazoRow>>({});
  const [showErrors,     setShowErrors]     = useState(false);

  useEffect(() => {
    if (open) {
      const procs = processos ?? [];
      setItems([...procs]);
      setOption(isReagendar ? 'return' : 'stay');
      setDataRef('');
      setDataRefTouched(false);
      setNumDias('');
      setFimPrazo((procs[0] && prazoVigenteMap?.get(procs[0].id)) || '');
      setShowErrors(false);
      const fields: Record<string, PrazoRow> = {};
      procs.forEach(p => {
        const vigente = isReagendar ? (prazoVigenteMap?.get(p.id) ?? '') : '';
        fields[p.id] = { dataRef: '', numDias: '', fimPrazo: vigente };
      });
      setItemFields(fields);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    if (next.length === 0) onClose();
  };

  const updateItemField = (id: string, key: keyof PrazoRow, val: string) =>
    setItemFields(prev => {
      const row: PrazoRow = { ...(prev[id] ?? { dataRef: '', numDias: '', fimPrazo: '' }), [key]: val };
      const calc = calcFimPrazo(
        key === 'dataRef' ? val : row.dataRef,
        key === 'numDias' ? val : row.numDias,
      );
      if (calc) row.fimPrazo = calc;
      return { ...prev, [id]: row };
    });

  useEffect(() => {
    if (isReagendar) return;
    const calc = calcFimPrazo(dataRef, numDias);
    if (calc) setFimPrazo(calc);
  }, [dataRef, numDias, isReagendar]);

  const dataRefInvalida  = dataRef.length  === 10 && (!isValidDateBR(dataRef)  || isBefore(dataRef,  today()));
  const fimPrazoInvalido = fimPrazo.length === 10 && (!isValidDateBR(fimPrazo) || isBefore(fimPrazo, today()));

  const rowDataRefInvalida  = (id: string) => { const dr = itemFields[id]?.dataRef  ?? ''; return dr.length  === 10 && (!isValidDateBR(dr) || isBefore(dr,  today())); };
  const rowFimPrazoInvalido = (id: string) => { const fp = itemFields[id]?.fimPrazo ?? ''; return fp.length  === 10 && (!isValidDateBR(fp) || isBefore(fp, today())); };

  const isValid = isReagendar
    ? items.every(p => {
        const fp = itemFields[p.id]?.fimPrazo?.trim();
        return fp && !rowDataRefInvalida(p.id) && !rowFimPrazoInvalido(p.id);
      })
    : fimPrazo.trim() !== '' && !dataRefInvalida && !fimPrazoInvalido;

  const msgDataRef  = (dr: string) => dr.length === 10 && isValidDateBR(dr) && isBefore(dr, today()) ? 'Deve ser igual ou maior que a data atual.' : 'Data inválida';
  const msgFimPrazo = (fp: string) => fp.length === 10 && isValidDateBR(fp) && isBefore(fp, today()) ? 'Deve ser igual ou maior que a data atual.' : 'Data inválida';

  const handleSave = () => {
    if (!isValid) { setShowErrors(true); return; }
    const fimPrazoByItem = new Map<string, string>();
    if (isReagendar) {
      items.forEach(i => { fimPrazoByItem.set(i.id, itemFields[i.id]?.fimPrazo ?? ''); });
    } else {
      items.forEach(i => { fimPrazoByItem.set(i.id, fimPrazo); });
    }
    onSave?.(items.map(i => i.id), option, fimPrazoByItem);
  };

  const title = isReagendar ? cfg.textos.tituloReagendar : cfg.textos.tituloAgendar;
  const width = isReagendar ? 820 : 640;

  const thCellStyle: CSSProperties = {
    ...typography.styles.captionBold,
    color:      colors.secondary.main,
    padding:    `${spacing.xs} ${spacing['bt-3']}`,
    boxSizing:  'border-box',
    flexShrink: 0,
  };

  return (
    <Modal open={open} onClose={onClose} title={title} style={{ width: `min(${width}px, 95vw)`, maxHeight: '90vh', overflowY: 'auto' }}>

      {/* ── Tabela ─────────────────────────────────────────────────────────── */}
      <div style={{ border: `1px solid ${colors.secondary.light}`, borderRadius: borders.radius.md, overflowX: 'auto', overflowY: 'hidden' }}>

        {/* Cabeçalho */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          backgroundColor: colors.secondary.light,
          borderBottom:    `1px solid ${colors.secondary.medium}`,
          minWidth:        isReagendar ? 620 : 360,
        }}>
          <div style={{ flex: '1 0 0', ...thCellStyle }}>{cfg.textos.colunas.processoDocumento}</div>
          {isReagendar && (
            <>
              <div style={{ width: 130, ...thCellStyle }}>{cfg.textos.colunas.dataReferencia}</div>
              <div style={{ width: 90,  ...thCellStyle }}>{cfg.textos.colunas.numDias}</div>
              <div style={{ width: 130, ...thCellStyle, color: showErrors ? colors.error.main : colors.secondary.main }}>
                {cfg.textos.colunas.fimPrazo}
              </div>
            </>
          )}
          <div style={{ width: 48, flexShrink: 0 }} />
        </div>

        {/* Linhas de dados */}
        {items.map((proc, idx) => {
          const id        = proc.id;
          const drInvalid = rowDataRefInvalida(id);
          const fpInvalid = rowFimPrazoInvalido(id) || (showErrors && !itemFields[id]?.fimPrazo?.trim());
          return (
            <div key={id} style={{
              display:         'flex',
              alignItems:      'center',
              backgroundColor: colors.surface.xxxl,
              borderBottom:    idx < items.length - 1 ? `1px solid ${colors.secondary.light}` : 'none',
              minHeight:       40,
              minWidth:        isReagendar ? 620 : 360,
            }}>

              {/* Processo/Documento */}
              <div style={{
                flex:     '1 0 0',
                minWidth: 0,
                padding:  `${spacing['bt-2']} ${spacing.xs}`,
                overflow: 'hidden',
              }}>
                <TruncatedText text={proc.processNumber} style={{ ...typography.styles.body2, color: colors.secondary.main }}>
                  {proc.processNumber}
                </TruncatedText>
              </div>

              {/* Campos editáveis (reagendar) */}
              {isReagendar && (
                <>
                  <div style={{ width: 130, flexShrink: 0, padding: `4px ${spacing.xs}` }}>
                    <DateInput
                      value={itemFields[id]?.dataRef ?? ''}
                      onChange={val => updateItemField(id, 'dataRef', val ?? '')}
                      invalid={drInvalid}
                      errorMessage={msgDataRef(itemFields[id]?.dataRef ?? '')}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ width: 90, flexShrink: 0, padding: `4px ${spacing.xs}` }}>
                    <input
                      value={itemFields[id]?.numDias ?? ''}
                      onChange={e => {
                        const v = e.target.value;
                        if (v === '' || parseInt(v, 10) >= 0) updateItemField(id, 'numDias', v);
                      }}
                      placeholder="0"
                      type="number"
                      min={0}
                      style={{
                        width:           '100%',
                        ...typography.styles.body2,
                        color:           colors.secondary.main,
                        border:          `1px solid ${colors.secondary.medium}`,
                        borderRadius:    borders.radius.md,
                        padding:         `5px 10px 7px 10px`,
                        backgroundColor: colors.surface.xxxl,
                        outline:         'none',
                        boxSizing:       'border-box',
                      }}
                    />
                  </div>
                  <div style={{ width: 130, flexShrink: 0, padding: `4px ${spacing.xs}` }}>
                    <DateInput
                      value={itemFields[id]?.fimPrazo ?? ''}
                      onChange={val => updateItemField(id, 'fimPrazo', val ?? '')}
                      invalid={fpInvalid}
                      errorMessage={msgFimPrazo(itemFields[id]?.fimPrazo ?? '')}
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}

              {/* Ação — remover */}
              <div style={{ width: 48, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => handleRemove(proc.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4 }}
                >
                  <DeleteIcon style={{ fontSize: 24, color: colors.secondary.main }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Campos abaixo da tabela (agendar) ─────────────────────────────── */}
      {!isReagendar && (
        <div style={{ marginTop: spacing.md, display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.xs, flexWrap: 'wrap' }}>
            <DateInput
              label={cfg.textos.campos.dataReferencia}
              value={dataRef}
              onChange={val => setDataRef(val ?? '')}
              onBlur={() => setDataRefTouched(true)}
              invalid={dataRefTouched && dataRefInvalida}
              errorMessage={msgDataRef(dataRef)}
              disablePast
              style={{ flex: '1 0 0' }}
            />
            <FieldInput
              label={cfg.textos.campos.numDias}
              value={numDias}
              onChange={e => {
                const v = e.target.value;
                if (v === '' || parseInt(v, 10) >= 0) setNumDias(v);
              }}
              type="number"
              min={0}
              style={{ flex: '1 0 0' }}
            />
            <DateInput
              label={cfg.textos.campos.fimPrazo}
              value={fimPrazo}
              onChange={val => setFimPrazo(val ?? '')}
              invalid={(showErrors && !fimPrazo.trim()) || fimPrazoInvalido}
              errorMessage={msgFimPrazo(fimPrazo)}
              style={{ flex: '1 1 200px', minWidth: 180 }}
            />
          </div>
        </div>
      )}

      {/* ── Radio ─────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: spacing.md }}>
        <RadioGroup type="primary" value={option} onChange={setOption} direction="column">
          <Radio value="stay">{cfg.textos.opcoes.permanecer}</Radio>
          <Radio value="return">{cfg.textos.opcoes.retornar}</Radio>
        </RadioGroup>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div style={{ marginTop: spacing.sm }}>
        <DividerH style={{ padding: `${spacing.xs} 0 ${spacing.xxs}` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xs, flexWrap: 'wrap' }}>
          {showErrors && !isValid ? (
            <span style={{ ...typography.styles.caption, color: colors.error.main }}>
              {cfg.textos.mensagemObrigatorio}
            </span>
          ) : (
            <div />
          )}
          <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
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
  );
}
