import { useEffect, useState } from 'react';
import type { ChangeEventHandler, ReactNode } from 'react';
import type { WorkQueueCard } from './types';

import { CustomTabs } from '../../components/custom/CustomTabs';
import { Chip } from '../../components/ds/atoms/Chip';
import { SimplePagination } from '../../components/custom/SimplePagination';
import { Overlay } from '../../components/ds/atoms/Overlay';
import { PortalContent } from '../../shell/PortalContent';

import { ButtonHint } from '../../components/custom/ButtonHint';
import { SelectAll } from '../../components/custom/SelectAll';
import { OrdenacaoDropdown } from '../../components/custom/OrdenacaoDropdown';
import { VisualizacaoDropdown } from '../../components/custom/VisualizacaoDropdown';
import { KeywordSearch } from '../../components/custom/KeywordSearch';
import { ExpandRetractButton } from '../../components/custom/ExpandRetractButton';
import { spacing } from '../../styles/tokens/spacing';
import { layout } from '../../styles/tokens/layout';
import { colors } from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { shadows } from '../../styles/tokens/shadows';
import { borders } from '../../styles/tokens/borders';

import ArrowBackIcon    from '@mui/icons-material/ArrowBack';
import RefreshIcon      from '@mui/icons-material/Refresh';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BackupTableIcon  from '@mui/icons-material/BackupTable';
import SettingsIcon     from '@mui/icons-material/Settings';
import CloseIcon        from '@mui/icons-material/Close';
import InboxIcon        from '@mui/icons-material/Inbox';
import TuneIcon         from '@mui/icons-material/Tune';

const styles = {
  primary:     colors.primary.main,
  tabInactive: colors.surface.medium,
  updateButton: colors.primary.main,
  title:       colors.surface.dark,
  chevron:     colors.surface.main,
  subtitle:    colors.primary.main,
  innerPadding: `${layout.containerPaddingY} ${layout.containerPaddingX}`,
  gapHeaderTabs:    spacing.xs,
  gapTabsControls:  spacing.xs,
  gapControls:      spacing.xs,
  gapHeaderActions: layout.actionGap,
  gapActions:       layout.actionGap,
};

const layoutSpacing = {
  blockGap: layout.blockGap,
  listGap: layout.listGap,
};

function useViewportWidth(): number {
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

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

/** Botão "Filtros" no estilo tbtn com badge opcional quando há filtros ativos */
function FiltrosToolbarBtn({ hasApplied, count, onClick }: { hasApplied?: boolean; count?: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const lit = hovered || !!hasApplied;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             5,
        padding:         '5px 9px',
        height:          30,
        boxSizing:       'border-box',
        border:          `0.5px solid ${lit ? 'rgba(0,0,0,0.18)' : 'transparent'}`,
        borderRadius:    borders.radius.lg,
        backgroundColor: lit ? colors.surface.xl : 'transparent',
        cursor:          'pointer',
        flexShrink:      0,
        transition:      'background 0.1s, border-color 0.1s',
        userSelect:      'none',
        fontFamily:      'inherit',
      }}
    >
      <TuneIcon style={{ fontSize: 15, color: lit ? colors.secondary.dark : colors.surface.main, flexShrink: 0 }} />
      <span style={{ ...typography.styles.caption, color: lit ? colors.secondary.dark : colors.secondary.main, whiteSpace: 'nowrap', lineHeight: '20px' }}>
        Filtros
      </span>
      {hasApplied && count != null && count > 0 && (
        <span style={{
          minWidth:        17,
          height:          17,
          fontSize:        11,
          fontWeight:      600,
          backgroundColor: colors.primary.xxl,
          color:           colors.primary.main,
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

export function WorkQueue({
  texts,
  activeTab,
  onTabChange,
  tabLabels,
  allChecked,
  onToggleAllChecked,
  allExpanded,
  onToggleAllExpanded,
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
  pageSizeOptions: _pageSizeOptions,
  onPageChange,
  onPageSizeChange: _onPageSizeChange,
  displayedItems = [],
  emptyMessage,
  renderItem,
  sidePanel,
  sidePanelOpen = false,
  overlayPanel,
  overlayPanelOpen = false,
  overlayOnClose,
  onOpenPersonalizacao,
  onRefresh,
  actionSlotLocked = false,
}: WorkQueueProps) {
  const viewportWidth = useViewportWidth();
  const isNarrow = viewportWidth <= 1180;
  const isReduced = viewportWidth <= 980;
  const contentPadding = isNarrow ? `${spacing['bt-3']} ${spacing.sm}` : styles.innerPadding;
  const listFramePadding = isNarrow ? `0 0 ${spacing.xs}` : `0 0 ${layout.listShadowGuard}`;
  const sidePanelStacked = sidePanelOpen && isReduced;

  return (
    <PortalContent
      overlayOpen={overlayPanelOpen}
      style={{ padding: 0 }}
      frameStyle={{ gap: 0, padding: 0, borderRadius: 0, boxShadow: 'none' }}
    >
      {/* ── Toolbar: grupos de ação + paginação com navegação ── */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         `0 ${layout.containerPaddingX}`,
        height:          44,
        borderBottom:    `1px solid ${colors.surface.light}`,
        flexShrink:      0,
        boxSizing:       'border-box',
        backgroundColor: colors.surface.xxxl,
      }}>

        {/* ── ESQUERDA: G1 ações contextuais + G2 organização ── */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>

          {/* G1 — Ações contextuais (destaque azul, bloqueado sem seleção) */}
          {actionSlot != null && (
            <div style={{
              display:         'flex',
              alignItems:      'center',
              gap:             2,
              backgroundColor: actionSlotLocked ? colors.surface.xl : colors.primary.xxl,
              borderRadius:    borders.radius.lg,
              padding:         '0 5px',
              margin:          '6px 0',
              opacity:         actionSlotLocked ? 0.45 : 1,
              pointerEvents:   actionSlotLocked ? 'none' : 'auto',
              transition:      'opacity 0.2s',
              flexShrink:      0,
            }}>
              {actionSlot}
            </div>
          )}

          {/* Divisor */}
          <div style={{ width: 1, height: 20, backgroundColor: colors.surface.light, flexShrink: 0, margin: '0 6px' }} />

          {/* G2 — Organização da fila */}
          <SelectAll selected={allChecked} onChange={onToggleAllChecked} iconSize={15} />
          <ExpandRetractButton expanded={!allExpanded} label="Expandir/Retrair" onClick={onToggleAllExpanded} iconSize={15} />
          <ButtonHint icon={<RefreshIcon style={{ fontSize: 15 }} />} hint={texts.botaoAtualizar} onClick={onRefresh} />
        </div>

        {/* ── DIREITA: G3 ferramentas + paginação ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>

          {/* G3 — Ferramentas */}
          <ButtonHint icon={<PictureAsPdfIcon />} hint={texts.tooltips.exportarPdf} />
          <ButtonHint icon={<BackupTableIcon />}  hint={texts.tooltips.exportarPlanilha} />
          <ButtonHint icon={<SettingsIcon />}     hint={texts.tooltips.configuracoes} onClick={onOpenPersonalizacao} />
        </div>
      </div>

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
              flex:            '1 1 200px',
              minWidth:        isReduced ? '100%' : 160,
              backgroundColor: colors.surface.xxxl,
              border:          '0.5px solid rgba(0,0,0,0.10)',
              borderRadius:    borders.radius.lg,
              height:          'auto',
              paddingTop:      6,
              paddingBottom:   6,
            }}
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

          {/* Visualização */}
          <VisualizacaoDropdown
            value={visualizacao}
            options={visualizacaoOptions}
            myViews={customViews}
            onCreateCustom={onCreateCustomView}
            onEditView={onEditCustomView}
            onChange={onVisualizacaoChange}
            variant="toolbar"
          />

          {/* Filtros */}
          <FiltrosToolbarBtn
            hasApplied={hasAppliedFilters}
            count={filteredCount}
            onClick={onOpenFilters}
          />
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
                  <InboxIcon style={{ fontSize: 64, color: colors.secondary.light }} />
                  <span style={{ ...typography.styles.body2, color: colors.secondary.main }}>{emptyMessage}</span>
                  {hasAppliedFilters && onClearAppliedFilters && (
                    <button
                      type="button"
                      onClick={onClearAppliedFilters}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: 4 }}
                    >
                      <Chip color={resultChipColor} size="sm" trailingIcon={<CloseIcon />} style={{ cursor: 'pointer' }}>
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
          {onPageChange && (
            <SimplePagination
              page={page ?? 1}
              totalPages={Math.ceil((filteredCount ?? 0) / (pageSize ?? 10))}
              onPageChange={onPageChange}
              style={{ marginTop: 4 }}
            />
          )}
        </div>

        <div
          aria-hidden={!overlayPanelOpen}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
            boxSizing: 'border-box',
            background: 'transparent',
            opacity: overlayPanelOpen ? 1 : 0,
            pointerEvents: overlayPanelOpen ? 'auto' : 'none',
            transform: overlayPanelOpen ? 'translateX(0)' : 'translateX(64px)',
            transition: 'opacity 220ms ease, transform 260ms cubic-bezier(0.2, 0, 0, 1)',
            overflow: 'hidden',
          }}
        >
          {overlayPanel}
        </div>
        {overlayPanelOpen && overlayOnClose && (
          <button
            type="button"
            aria-label="Voltar para a fila"
            onClick={overlayOnClose}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 25,
              width: 32,
              height: 32,
              border: 'none',
              borderRadius: 500,
              background: colors.primary.main,
              color: colors.surface.xxxl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: shadows.level2,
              flexShrink: 0,
            }}
          >
            <ArrowBackIcon style={{ fontSize: 20 }} />
          </button>
        )}
        <Overlay
          open={overlayPanelOpen}
          backdropColor="rgba(0,0,0,0.5)"
          zIndex={18}
          closeOnBackdrop={false}
          contentStyle={{ display: 'none' }}
        />
      </div>
    </PortalContent>
  );
}
