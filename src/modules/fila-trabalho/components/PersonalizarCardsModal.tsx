import { useState, useEffect } from 'react';
import type { DragEvent } from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RefreshIcon       from '@mui/icons-material/Refresh';
import { Modal }         from '../../../components/ds/atoms/Modal';
import { Switch }        from '../../../components/ds/atoms/Switch/Switch';
import { Button }        from '../../../components/ds/atoms/Button/Button';
import { TruncatedText } from '../../../components/ds/atoms/TruncatedText';
import { colors }        from '../../../styles/tokens/colors';
import { typography }    from '../../../styles/tokens/typography';
import { spacing }       from '../../../styles/tokens/spacing';
import { borders }       from '../../../styles/tokens/borders';
import { shadows }       from '../../../styles/tokens/shadows';

interface PersonalizacaoItem {
  id: string;
  label: string;
  previewLabel?: string;
  dataKey?: string;
  fieldId?: string;
  path?: string;
  aliases?: string[];
}

interface PersonalizarConfig {
  textos: {
    titulo: string;
    sectionDisponivel: string;
    subtituloDisponivel: string;
    sectionCard: string;
    subtituloCard: string;
    sectionPreview: string;
    mensagemMaximo: string;
    mensagemMinimo: string;
    botoes: { restaurar: string; cancelar: string; salvar: string; desmarcarTodos: string };
  };
}

// ─── SwitchRow ────────────────────────────────────────────────────────────────

interface SwitchRowProps { item: { label: string; id?: string }; checked: boolean; onToggle?: () => void; disabled?: boolean; }

function SwitchRow({ item, checked, onToggle, disabled = false }: SwitchRowProps) {
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      style={{
        display:         'flex',
        alignItems:      'flex-start',
        gap:             spacing.xs,
        padding:         `${spacing.xs} ${spacing.sm}`,
        borderRadius:    borders.radius.lg,
        backgroundColor: colors.secondary.xl,
        cursor:          disabled ? 'not-allowed' : 'pointer',
        opacity:         disabled ? 0.45 : 1,
        userSelect:      'none',
        width:           '100%',
        boxSizing:       'border-box',
      }}
    >
      <div style={{ pointerEvents: 'none', flexShrink: 0 }}>
        <Switch type="primary" checked={checked} showLabel={false} noContainer={true} onChange={() => {}} />
      </div>
      <TruncatedText text={item.label} style={{ ...typography.styles.body2, color: colors.secondary.dark, flex: '1 1 auto' }}>
        {item.label}
      </TruncatedText>
    </div>
  );
}

// ─── DragRow ──────────────────────────────────────────────────────────────────

function DragRow({ item, index, isDragging, isOver, onDragStart, onDragOver, onDrop, onDragEnd }: { item: { label: string }; index: number; isDragging?: boolean; isOver?: boolean; onDragStart: (e: DragEvent, i: number) => void; onDragOver: (e: DragEvent, i: number) => void; onDrop: (e: DragEvent, i: number) => void; onDragEnd?: () => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e)  => onDragOver(e, index)}
      onDrop={(e)      => onDrop(e, index)}
      onDragEnd={onDragEnd}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             spacing.xs,
        padding:         `${spacing.bt} ${spacing.xs}`,
        borderRadius:    borders.radius.lg,
        backgroundColor: colors.secondary.xl,
        cursor:          'grab',
        opacity:         isDragging ? 0.4 : 1,
        borderTop:       isOver && !isDragging ? `2px solid ${colors.primary.main}` : '2px solid transparent',
        boxSizing:       'border-box',
      }}
    >
      <DragIndicatorIcon style={{ fontSize: 24, color: colors.secondary.main, flexShrink: 0 }} />
      <span style={{ flex: '1 0 0', ...typography.styles.body2, color: colors.secondary.dark }}>
        {item.label}
      </span>
    </div>
  );
}

// ─── PreviewField ─────────────────────────────────────────────────────────────

function PreviewField({ item }: { item: { previewLabel?: string } }) {
  return (
    <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 19, overflow: 'hidden' }}>
        <span style={{ ...typography.styles.captionBold, color: colors.secondary.dark, whiteSpace: 'nowrap' }}>
          {item.previewLabel}
        </span>
      </div>
      <div style={{ height: 24, display: 'flex', alignItems: 'flex-start', paddingBottom: 2 }}>
        <span style={{ ...typography.styles.caption, color: colors.secondary.main, whiteSpace: 'nowrap' }}>
          {item.previewLabel}
        </span>
      </div>
    </div>
  );
}

// ─── PersonalizarCardsModal ───────────────────────────────────────────────────

export function PersonalizarCardsModal({
  open,
  onClose,
  onSave,
  savedItems = [],
  defaultItems = [],
  allItems = [],
  config,
}: { open: boolean; onClose: () => void; onSave?: (items: string[]) => void; savedItems?: string[]; defaultItems?: string[]; allItems?: PersonalizacaoItem[]; config: PersonalizarConfig }) {
  const MAX = 8;
  const cfg = config;

  const [orderedItems, setOrderedItems] = useState<string[]>([]);
  const [maxError,     setMaxError]     = useState(false);
  const [minError,     setMinError]     = useState(false);
  const [dragIndex,    setDragIndex]    = useState<number | null>(null);
  const [overIndex,    setOverIndex]    = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setOrderedItems([...savedItems]);
      setMaxError(false);
      setMinError(false);
      setDragIndex(null);
      setOverIndex(null);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSelected = (id: string) => orderedItems.includes(id);

  const handleToggle = (id: string) => {
    if (isSelected(id)) {
      setOrderedItems(prev => prev.filter(i => i !== id));
      setMaxError(false);
      setMinError(false);
    } else {
      if (orderedItems.length >= MAX) { setMaxError(true); return; }
      setOrderedItems(prev => [...prev, id]);
      setMaxError(false);
      setMinError(false);
    }
  };

  const handleDesmarcarTodos = () => {
    setOrderedItems([]);
    setMaxError(false);
    setMinError(false);
  };

  const handleDragStart = (e: DragEvent, index: number) => { setDragIndex(index); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver  = (e: DragEvent, index: number) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overIndex !== index) setOverIndex(index); };
  const handleDrop      = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) { setDragIndex(null); setOverIndex(null); return; }
    const next = [...orderedItems];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setOrderedItems(next);
    setDragIndex(null); setOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  const handleSave    = () => { if (orderedItems.length === 0) { setMinError(true); return; } onSave?.([...orderedItems]); };
  const handleCancel  = () => { onClose(); };
  const handleRestore = () => { setOrderedItems([...defaultItems]); setMaxError(false); setMinError(false); };

  const desmarcarDisabled = orderedItems.length === 0;
  const leftColItems      = allItems.slice(0, 8);
  const rightColItems     = allItems.slice(8);
  const previewItems      = orderedItems.slice(0, MAX);
  const previewRow1       = previewItems.slice(0, 4);
  const previewRow2       = previewItems.slice(4, 8);

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={cfg.textos.titulo}
      style={{ width: 'min(1040px, 95vw)', maxHeight: '90vh' }}
      leftFooter={(
        <Button type="primary" variant="flat" leadingIcon={<RefreshIcon />} onClick={handleRestore}>
          {cfg.textos.botoes.restaurar}
        </Button>
      )}
      footer={(
        <>
          <Button type="primary" variant="outline" onClick={handleCancel}>{cfg.textos.botoes.cancelar}</Button>
          <Button type="primary" variant="filled"  onClick={handleSave}>{cfg.textos.botoes.salvar}</Button>
        </>
      )}
    >
      <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* Informações disponíveis — duas sub-colunas */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <span style={{ ...typography.styles.subtitle2, color: colors.secondary.dark }}>{cfg.textos.sectionDisponivel}</span>
          <span style={{ ...typography.styles.overline, color: colors.secondary.main }}>{cfg.textos.subtituloDisponivel}</span>
          {maxError && <span style={{ ...typography.styles.caption, color: colors.error.main }}>{cfg.textos.mensagemMaximo}</span>}
          {minError && <span style={{ ...typography.styles.caption, color: colors.error.main }}>{cfg.textos.mensagemMinimo}</span>}
          <Button
            type="primary"
            variant="flat"
            disabled={desmarcarDisabled}
            onClick={handleDesmarcarTodos}
            style={{ alignSelf: 'flex-start' }}
          >
            {cfg.textos.botoes.desmarcarTodos}
          </Button>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: '1 0 0', width: '100%' }}>
            <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
              {leftColItems.map(item => (
                <SwitchRow key={item.id} item={item} checked={isSelected(item.id)} onToggle={() => handleToggle(item.id)} />
              ))}
            </div>
            {rightColItems.length > 0 && (
              <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
                {rightColItems.map(item => (
                  <SwitchRow key={item.id} item={item} checked={isSelected(item.id)} onToggle={() => handleToggle(item.id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Divisória */}
        <div style={{ padding: `0 ${spacing.xs}`, alignSelf: 'stretch', display: 'flex', flexShrink: 0 }}>
          <div style={{ width: 1, height: '100%', backgroundColor: colors.surface.light }} />
        </div>

        {/* Informações no card — drag */}
        <div style={{ width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <span style={{ ...typography.styles.subtitle2, color: colors.secondary.dark }}>{cfg.textos.sectionCard}</span>
          <span style={{ ...typography.styles.overline, color: colors.secondary.main }}>{cfg.textos.subtituloCard}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
            {orderedItems.map((id, index) => {
              const item = allItems.find(i => i.id === id);
              if (!item) return null;
              return (
                <DragRow key={id} item={item} index={index}
                  isDragging={dragIndex === index} isOver={overIndex === index}
                  onDragStart={handleDragStart} onDragOver={handleDragOver}
                  onDrop={handleDrop} onDragEnd={handleDragEnd}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, marginTop: spacing.sm }}>
        <span style={{ ...typography.styles.subtitle2, color: colors.secondary.dark }}>{cfg.textos.sectionPreview}</span>
        <div style={{
          backgroundColor: colors.surface.xxxl,
          boxShadow:       shadows.level1,
          borderRadius:    borders.radius.lg,
          padding:         spacing.sm,
          minHeight:       118,
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          boxSizing:       'border-box',
        }}>
          {previewRow1.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
              {previewRow1.map(id => { const item = allItems.find(i => i.id === id); return item ? <PreviewField key={id} item={item} /> : null; })}
            </div>
          )}
          {previewRow2.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
              {previewRow2.map(id => { const item = allItems.find(i => i.id === id); return item ? <PreviewField key={id} item={item} /> : null; })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
