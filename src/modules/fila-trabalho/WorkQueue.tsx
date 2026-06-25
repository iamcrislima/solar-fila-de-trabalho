import { useState, useRef, useEffect } from 'react';
import type { ChangeEventHandler, ReactNode } from 'react';
import type { WorkQueueCard } from './types';

import { useViewportWidth } from '../../shared/hooks/useViewportWidth';

import { CustomTabs } from '../../components/custom/CustomTabs';
import { Chip } from '../../components/ds/atoms/Chip';
import { Overlay } from '../../components/ds/atoms/Overlay';
import { PortalContent } from '../../shell/PortalContent';

import { ButtonHint } from '../../components/custom/ButtonHint';
import { SelectAll } from '../../components/custom/SelectAll';
import { OrdenacaoDropdown } from '../../components/custom/OrdenacaoDropdown';
import { VisualizacaoDropdown } from '../../components/custom/VisualizacaoDropdown';
import { KeywordSearch } from '../../components/custom/KeywordSearch';
import { spacing } from '../../styles/tokens/spacing';
import { layout } from '../../styles/tokens/layout';
import { colors } from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { borders } from '../../styles/tokens/borders';

import {
  IconRefresh,
  IconFileTypePdf,
  IconTable,
  IconSettings,
  IconX,
  IconInbox,
  IconAdjustments,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconCheck,
} from '@tabler/icons-react';

const innerPadding = `${layout.containerPaddingY} ${layout.containerPaddingX}`;

const layoutSpacing = {
  blockGap: layout.blockGap,
  listGap: layout.listGap,
};

type ChipColor = 'primary' | 'warning' | 'success' | 'surface' | 'error' | 'support';

interface WorkQueueTexts {
  botaoAtualizar: string;
  tooltips: { exportarPdf: string; exportarPlanilha: string; configuracoes: string };
}

interface OrdenacaoItem { label: string; selecionado?: boolean; selected?: boolean; onClick?: () => void; id?: string; }
interface OrdenacaoSection { titulo?: string; title?: string; itens?: OrdenacaoItem[]; items?: OrdenacaoItem[]; }
interface VisualizacaoOption { label: string; id?: string; }
interface CustomViewOption { id?: string; label: string; }

interface WorkQueueProps {
  texts: WorkQueueTexts;
  activeTab?: number;
  onTabChange?: (index: number) => void;
  tabLabels: string[];
  allChecked?: boolean;
  onToggleAllChecked?: () => void;
  allExpanded?: boolean;
  onToggleAllExpanded?: () => void;
  ordenacaoSections?: OrdenacaoSection[];
  visualizacao?: string;
  visualizacaoOptions?: VisualizacaoOption[];
  customViews?: CustomViewOption[];
  onCreateCustomView?: () => void;
  onEditCustomView?: (id: string) => void;
  onVisualizacaoChange?: (value: string) => void;
  keyword?: string;
  onKeywordChange?: ChangeEventHandler<HTMLInputElement>;
  onOpenFilters?: () => void;
  hasAppliedFilters?: boolean;
  onClearAppliedFilters?: () => void;
  categoriasSlot?: ReactNode;
  filteredCount?: number;
  resultChipColor?: ChipColor;
  actionSlot?: ReactNode;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (p: number) => void;
  onPageSizeChange?: (s: number) => void;
  displayedItems?: WorkQueueCard[];
  emptyMessage?: string;
  renderItem: (item: WorkQueueCard) => ReactNode;
  sidePanel?: ReactNode;
  sidePanelOpen?: boolean;
  overlayPanel?: ReactNode;
  overlayPanelOpen?: boolean;
  overlayOnClose?: () => void;
  onOpenPersonalizacao?: () => void;
  onRefresh?: () => void;
  /** Quando true, o grupo de ações contextuais fica bloqueado (nenhum item selecionado). */
  actionSlotLocked?: boolean;
}

/** Botão "Filtros" — mesmo estilo visual dos dropdowns da barra de filtros */
function FiltrosToolbarBtn({ hasApplied, count, onClick }: { hasApplied?: boolean; count?: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const active = !!hasApplied;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             6,
        padding:         '0 10px',
        height:          32,
        boxSizing:       'border-box',
        border:          `1px solid ${active ? '#0058db' : hovered ? '#9CA3AF' : '#D1D5DB'}`,
        borderRadius:    8,
        backgroundColor: '#fff',
        cursor:          'pointer',
        flexShrink:      0,
        transition:      'border-color 0.15s',
        userSelect:      'none',
        fontFamily:      'inherit',
      }}
    >
      <IconAdjustments size={15} stroke={1.5} color={active ? '#0058db' : '#6B7280'} style={{ flexShrink: 0 }} />
      <span style={{ ...typography.styles.caption, color: active ? '#0058db' : '#374151', whiteSpace: 'nowrap', lineHeight: '20px', fontWeight: active ? 600 : 400 }}>
        Filtros
      </span>
      {active && count != null && count > 0 && (
        <span style={{
          minWidth:        17,
          height:          17,
          fontSize:        11,
          fontWeight:      600,
          backgroundColor: '#edf2ff',
          color:           '#0058db',
          borderRadius:    100,
          display:         'inline-flex',
          alignItems:      'center',
          justifyContent:  'center',
          padding:         '0 4px',
          lineHeight:      1,
          boxSizing:       'border-box',
        }}>
          {count}
        </span>
      )}
    </button>
  );
}


function PageSizeSelect({ value, options, onChange }: {
  value: number;
  options: number[];
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hov, setHov]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 32, boxSizing: 'border-box', padding: '0 10px',
          border: `1px solid ${open ? '#0058db' : hov ? '#9CA3AF' : '#D1D5DB'}`,
          borderRadius: 8, backgroundColor: '#fff', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'border-color 0.15s', userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <span style={{ ...typography.styles.caption, color: open ? '#0058db' : '#374151', whiteSpace: 'nowrap', lineHeight: '20px', fontWeight: open ? 600 : 400 }}>
          Resultados: {value}
        </span>
        {open
          ? <IconChevronUp   size={16} stroke={2} color={open ? '#0058db' : '#9CA3AF'} style={{ flexShrink: 0 }} />
          : <IconChevronDown size={16} stroke={2} color="#9CA3AF"                       style={{ flexShrink: 0 }} />}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          backgroundColor: '#fff', border: '1px solid #E5E7EB',
          borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 500, overflow: 'hidden', minWidth: 120,
        }}>
          {options.map(opt => (
            <PageSizeOption key={opt} label={opt} selected={opt === value} onClick={() => { onChange(opt); setOpen(false); }} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageSizeOption({ label, selected, onClick }: { label: number; selected: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', width: '100%', boxSizing: 'border-box',
        backgroundColor: selected ? '#edf2ff' : hov ? '#F9FAFB' : '#fff',
        border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ width: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selected && <IconCheck size={13} stroke={2.5} color="#0058db" />}
      </div>
      <span style={{ ...typography.styles.caption, fontWeight: selected ? 600 : 400, color: selected ? '#0058db' : '#374151' }}>
        {label} por página
      </span>
    </button>
  );
}

function NavPageBtn({
  icon, disabled, onClick,
}: { icon: React.ReactNode; disabled: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 26, height: 26, padding: 0,
        border: `1px solid ${disabled ? '#E5E7EB' : hov ? '#93C5FD' : '#D1D5DB'}`,
        borderRadius: 4,
        background: disabled ? '#F9FAFB' : hov ? '#EFF6FF' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? '#9CA3AF' : '#374151',
        flexShrink: 0, transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      {icon}
    </button>
  );
}


export function WorkQueue({
  texts,
  activeTab,
  onTabChange,
  tabLabels,
  allChecked,
  onToggleAllChecked,
  ordenacaoSections,
  visualizacao,
  visualizacaoOptions,
  customViews = [],
  onCreateCustomView,
  onEditCustomView,
  onVisualizacaoChange,
  keyword,
  onKeywordChange,
  onOpenFilters,
  hasAppliedFilters,
  onClearAppliedFilters,
  filteredCount,
  resultChipColor = 'success',
  actionSlot,
  categoriasSlot,
  page,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  displayedItems = [],
  emptyMessage,
  renderItem,
  sidePanel,
  sidePanelOpen = false,
  overlayPanel,
  overlayPanelOpen = false,
  overlayOnClose: _overlayOnClose,
  onOpenPersonalizacao,
  onRefresh,
  actionSlotLocked = false,
}: WorkQueueProps) {
  const viewportWidth = useViewportWidth();
  const isNarrow = viewportWidth <= 1180;
  const isReduced = viewportWidth <= 980;

  const curPage    = page ?? 1;
  const curSize    = pageSize ?? 10;
  const totalPages = filteredCount != null ? Math.max(1, Math.ceil(filteredCount / curSize)) : 1;
  const rangeStart = filteredCount ? (curPage - 1) * curSize + 1 : 0;
  const rangeEnd   = filteredCount != null ? Math.min(curPage * curSize, filteredCount) : 0;
  const contentPadding = isNarrow ? `${spacing['bt-3']} ${spacing.sm}` : innerPadding;
  const listFramePadding = isNarrow ? `0 0 ${spacing.xs}` : `0 0 ${layout.listShadowGuard}`;
  const sidePanelStacked = sidePanelOpen && isReduced;

  return (
    <PortalContent
      overlayOpen={overlayPanelOpen}
      style={{ padding: 0 }}
      frameStyle={{ gap: 0, padding: 0, borderRadius: 0, boxShadow: 'none' }}
    >

      {/* ── Área de conteúdo (scroll local) ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: layout.blockGap,
        padding: contentPadding,
        backgroundColor: colors.secondary.xl,
        position: 'relative',
        boxSizing: 'border-box',
        flex: 1,
        minHeight: 0,
        overflowY: overlayPanelOpen ? 'visible' : 'auto',
      }}>
        {/* ── Card de tabs ── */}
        <div style={{
          backgroundColor: colors.surface.xxxl,
          borderRadius:    borders.radius.lg,
          border:          `1px solid ${colors.surface.light}`,
          padding:         `0 ${layout.containerPaddingX}`,
          flexShrink:      0,
        }}>
          <CustomTabs
            tabs={tabLabels.map(label => ({ label }))}
            active={activeTab}
            onChange={onTabChange}
          />
        </div>

        {/* ── Barra de controles / filtros ── */}
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        8,
          flexShrink: 0,
          flexWrap:   isReduced ? 'wrap' : 'nowrap',
          overflow:   'visible',
        }}>
          {/* Busca — ocupa o espaço disponível */}
          <KeywordSearch
            value={keyword}
            onChange={onKeywordChange}
            style={{
              flex:            '1 1 120px',
              minWidth:        isReduced ? '100%' : 100,
              backgroundColor: colors.surface.xxxl,
              border:          '0.5px solid rgba(0,0,0,0.10)',
              borderRadius:    borders.radius.lg,
              height:          'auto',
              paddingTop:      6,
              paddingBottom:   6,
            }}
          />

          {/* Visualização — ao lado da busca */}
          <VisualizacaoDropdown
            value={visualizacao}
            options={visualizacaoOptions}
            myViews={customViews}
            onCreateCustom={onCreateCustomView}
            onEditView={onEditCustomView}
            onChange={onVisualizacaoChange}
            variant="toolbar"
          />

          {/* Separador */}
          <div style={{ width: 1, height: 20, backgroundColor: colors.surface.light, flexShrink: 0 }} />

          {/* Label FILTROS */}
          <span style={{
            fontSize:      11,
            fontWeight:    500,
            color:         colors.surface.medium,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace:    'nowrap',
            flexShrink:    0,
          }}>
            Filtros
          </span>

          {/* Marcadores (categoriasSlot — já é tbtn) */}
          {categoriasSlot}

          {/* Ordenar */}
          <OrdenacaoDropdown sections={ordenacaoSections} hint="Ordenar" variant="toolbar" />

          {/* Filtros */}
          <FiltrosToolbarBtn
            hasApplied={hasAppliedFilters}
            count={filteredCount}
            onClick={onOpenFilters}
          />
        </div>

        {/* ── Barra unificada: ações + paginação ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>

          {/* SelectAll — sempre primeiro */}
          <SelectAll selected={allChecked} onChange={onToggleAllChecked} iconSize={15} />

          {/* G1 — Ações contextuais */}
          {actionSlot != null && (
            <div style={{
              display:         'flex',
              alignItems:      'center',
              gap:             2,
              backgroundColor: actionSlotLocked ? colors.surface.xl : colors.primary.xxl,
              borderRadius:    borders.radius.lg,
              padding:         '0 5px',
              marginRight:     4,
              opacity:         actionSlotLocked ? 0.45 : 1,
              pointerEvents:   actionSlotLocked ? 'none' : 'auto',
              transition:      'opacity 0.2s',
              flexShrink:      0,
            }}>
              {actionSlot}
            </div>
          )}
          {actionSlot != null && (
            <div style={{ width: 1, height: 20, backgroundColor: colors.surface.light, flexShrink: 0, margin: '0 4px' }} />
          )}

          {/* G2 — Organização da fila */}
          <ButtonHint icon={<IconRefresh size={15} stroke={1.5} />} hint={texts.botaoAtualizar} onClick={onRefresh} />

          {/* Divisor */}
          <div style={{ width: 1, height: 20, backgroundColor: colors.surface.light, flexShrink: 0, margin: '0 4px' }} />

          {/* G3 — Ferramentas */}
          <ButtonHint icon={<IconFileTypePdf size={15} stroke={1.5} />} hint={texts.tooltips.exportarPdf} />
          <ButtonHint icon={<IconTable       size={15} stroke={1.5} />} hint={texts.tooltips.exportarPlanilha} />
          <ButtonHint icon={<IconSettings    size={15} stroke={1.5} />} hint={texts.tooltips.configuracoes} onClick={onOpenPersonalizacao} />

          {/* Espaçador */}
          <div style={{ flex: 1 }} />

          {/* Paginação inline */}
          {filteredCount != null && onPageChange && (
            <>
              {onPageSizeChange && (
                <PageSizeSelect
                  value={curSize}
                  options={pageSizeOptions ?? [10, 20, 50, 100]}
                  onChange={n => { onPageSizeChange(n); onPageChange(1); }}
                />
              )}
              <span style={{ fontSize: 12, color: colors.surface.medium, whiteSpace: 'nowrap', margin: '0 8px' }}>
                {filteredCount} registros · {rangeStart}–{rangeEnd}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <NavPageBtn icon={<IconChevronsLeft  size={14} stroke={1.5} />} disabled={curPage <= 1}          onClick={() => onPageChange(1)} />
                <NavPageBtn icon={<IconChevronLeft   size={14} stroke={1.5} />} disabled={curPage <= 1}          onClick={() => onPageChange(curPage - 1)} />
                <span style={{
                  minWidth: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: colors.primary.main,
                  border: `1px solid ${colors.primary.light}`,
                  borderRadius: 4, background: colors.primary.xxl,
                  padding: '0 6px', boxSizing: 'border-box',
                }}>{curPage}</span>
                <NavPageBtn icon={<IconChevronRight  size={14} stroke={1.5} />} disabled={curPage >= totalPages} onClick={() => onPageChange(curPage + 1)} />
                <NavPageBtn icon={<IconChevronsRight size={14} stroke={1.5} />} disabled={curPage >= totalPages} onClick={() => onPageChange(totalPages)} />
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: layoutSpacing.blockGap }}>
          <div style={{
            display: 'flex',
            flexDirection: sidePanelOpen && !sidePanelStacked ? 'row' : 'column',
            gap: layoutSpacing.listGap,
            padding: 0,
            boxSizing: 'border-box',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: layoutSpacing.listGap,
              width: sidePanelOpen && !sidePanelStacked ? 352 : '100%',
              minWidth: sidePanelOpen && !sidePanelStacked ? 320 : 0,
              maxWidth: sidePanelOpen && !sidePanelStacked ? 352 : '100%',
              maxHeight: sidePanelStacked ? 260 : undefined,
              overflowX: 'hidden',
              padding: listFramePadding,
              boxSizing: 'border-box',
              transition: 'width 180ms ease, max-width 180ms ease',
            }}>
              {displayedItems.length === 0 && emptyMessage ? (
                <div style={{ padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                  <IconInbox size={64} color={colors.secondary.light} />
                  <span style={{ ...typography.styles.body2, color: colors.secondary.main }}>{emptyMessage}</span>
                  {hasAppliedFilters && onClearAppliedFilters && (
                    <button
                      type="button"
                      onClick={onClearAppliedFilters}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 4 }}
                    >
                      <Chip color={resultChipColor} size="sm" trailingIcon={<IconX size={14} stroke={1.5} />} style={{ cursor: 'pointer' }}>
                        Limpar filtros
                      </Chip>
                    </button>
                  )}
                </div>
              ) : (
                displayedItems.map((item, index) => (
                  <div key={item?.id ?? index} data-id={item?.id} style={{ padding: 0, boxSizing: 'border-box', flexShrink: 0 }}>
                    {renderItem(item)}
                  </div>
                ))
              )}
            </div>
            {sidePanelOpen && sidePanel}
          </div>
        </div>

        <div
          aria-hidden={!overlayPanelOpen}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: overlayPanelOpen
              ? 'translate(-50%, -50%)'
              : 'translate(-50%, -48%) scale(0.97)',
            zIndex: 210,
            width: 'min(90vw, 720px)',
            height: 'min(90vh, 900px)',
            opacity: overlayPanelOpen ? 1 : 0,
            pointerEvents: overlayPanelOpen ? 'auto' : 'none',
            transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.2, 0, 0, 1)',
            overflow: 'visible',
            boxSizing: 'border-box',
          }}
        >
          {overlayPanel}
        </div>
        <Overlay
          open={overlayPanelOpen}
          backdropColor="rgba(15,20,30,0.45)"
          zIndex={200}
          closeOnBackdrop={false}
          contentStyle={{ display: 'none' }}
        />
      </div>
    </PortalContent>
  );
}
