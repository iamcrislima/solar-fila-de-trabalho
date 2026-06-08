import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, ModalDialog } from '@/components/ds/atoms/Modal';
import { Button } from '@/components/ds/atoms/Button/Button';
import { Checkbox } from '@/components/ds/atoms/Checkbox/Checkbox';
import { DividerH } from '@/components/ds/atoms/Divider';
import { copyFilters } from './FiltersModal';
import {
  FILTER_MODAL_BACKDROP,
  FILTER_MODAL_STYLE,
  FilterFieldsContent,
  type GrupoConfig,
} from './FiltersModal';
import { typography } from '@/styles/tokens/typography';
import { colors } from '@/styles/tokens/colors';
import { spacing } from '@/styles/tokens/spacing';
import { layout } from '@/styles/tokens/layout';
import { borders } from '@/styles/tokens/borders';
import type { FilterState } from '@/domain/filtros/filterModel';
import type { DateRange } from '@/domain/filtros/dateRange';
import {
  USER_DEFINED_NAME_MAX_LENGTH,
  getUserDefinedNameValidationCode,
  normalizeUserDefinedName,
} from '@/shared/utils/userDefinedName';

const asSet = (value: unknown): Set<string> =>
  value instanceof Set ? new Set(value as Set<string>) : new Set<string>();

interface SavedView {
  label: string;
  filters?: FilterState;
  pinInSidebar?: boolean;
}

const DEFAULT_DD_ROWS = [
  ['processoDocumento', 'classificacao', 'interessado'],
  ['cadastradoPor', 'categoria', 'unidadeEncaminhamento'],
  ['unidadeAtual', 'recebidoPor'],
];

const DEFAULT_DD_LABELS: Record<string, string> = {
  processoDocumento:     'Processo/Documento:',
  classificacao:         'Classificação:',
  interessado:           'Interessado:',
  cadastradoPor:         'Cadastrado por:',
  categoria:             'Categoria:',
  unidadeEncaminhamento: 'Unidade encaminhamento:',
  unidadeAtual:          'Unidade atual:',
  recebidoPor:           'Usuário de recebimento:',
};

interface VisualizacaoPersonalizadaModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (view: { label: string; filters: FilterState; pinInSidebar: boolean; originalLabel: string | null }) => void;
  onDelete?: () => void;
  filterOptions?: Record<string, string[]>;
  existingLabels?: string[];
  initialView?: SavedView | null;
  grupos?: GrupoConfig[];
  ddRows?: string[][];
  ddColCount?: number;
  ddLabels?: Record<string, string>;
  dateRangeRows?: string[][];
  dateRangeLabels?: Record<string, string>;
  dateRangeColCount?: number;
  emptyFiltersFactory?: () => FilterState;
}

export function VisualizacaoPersonalizadaModal({
  open,
  onClose,
  onSave,
  onDelete,
  filterOptions = {},
  existingLabels = [],
  initialView = null,
  grupos = [],
  ddRows = DEFAULT_DD_ROWS,
  ddColCount,
  ddLabels = DEFAULT_DD_LABELS,
  dateRangeRows = [],
  dateRangeLabels = {},
  dateRangeColCount,
  emptyFiltersFactory,
}: VisualizacaoPersonalizadaModalProps) {
  const emptyF: () => FilterState = emptyFiltersFactory ?? (() => ({}));
  const isEditMode = !!initialView;

  const [name, setName] = useState('');
  const [pinSidebar, setPinSidebar] = useState(false);
  const [filters, setFilters] = useState<FilterState>(emptyF);
  const [nameError, setNameError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initialView) {
      setName(initialView.label);
      setPinSidebar(initialView.pinInSidebar ?? false);
      setFilters(copyFilters(initialView.filters ?? emptyF()));
    } else {
      setName('');
      setPinSidebar(false);
      setFilters(emptyF());
    }

    setNameError('');
    setFilterError('');
    setDeleteConfirmOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getOtherLabels = () => isEditMode
    ? existingLabels.filter(label => label.toLowerCase() !== (initialView?.label ?? '').toLowerCase())
    : existingLabels;

  const validateName = (value: string) => {
    const normalized = normalizeUserDefinedName(value);
    if (!normalized) return '';

    const validationCode = getUserDefinedNameValidationCode(normalized);
    if (validationCode === 'maxLength') {
      return `O nome deve ter no máximo ${USER_DEFINED_NAME_MAX_LENGTH} caracteres.`;
    }

    if (validationCode === 'invalidCharacters') {
      return 'Use apenas letras, números e espaços.';
    }

    return getOtherLabels().some(label => normalizeUserDefinedName(label).toLowerCase() === normalized.toLowerCase())
      ? 'Já existe uma visualização com esse nome.'
      : '';
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const clearFilterError = () => {
    if (filterError) setFilterError('');
  };

  const toggleCb = (key: string, value: string) => {
    clearFilterError();
    const next = asSet(filters[key]);
    next.has(value) ? next.delete(value) : next.add(value);
    setFilters(previous => ({ ...previous, [key]: next }));
  };

  const toggleDd = (key: string, id: string | number, checked: boolean) => {
    clearFilterError();
    const value = String(id);
    const next = asSet(filters[key]);
    checked ? next.add(value) : next.delete(value);
    setFilters(previous => ({ ...previous, [key]: next }));
  };

  const toggleDdAll = (key: string, ids: Array<string | number>, checked: boolean) => {
    clearFilterError();
    setFilters(previous => {
      const next = asSet(previous[key]);
      ids.forEach(id => checked ? next.add(String(id)) : next.delete(String(id)));
      return { ...previous, [key]: next };
    });
  };

  const updateDateRange = (key: string, rangeValue: DateRange) => {
    clearFilterError();
    setFilters(previous => ({ ...previous, [key]: rangeValue }));
  };

  const hasAnyFilter = (filterState: FilterState) =>
    Object.values(filterState).some(value =>
      value instanceof Set ? value.size > 0 : !!((value as DateRange | null)?.from || (value as DateRange | null)?.to)
    );

  const handleClear = () => {
    setFilters(emptyF());
    setPinSidebar(false);
    setFilterError('');
  };

  const handleSave = () => {
    const normalizedName = normalizeUserDefinedName(name);

    if (!normalizedName) {
      setNameError('O nome da visualização é obrigatório.');
      return;
    }

    const error = validateName(normalizedName);
    if (error) {
      setNameError(error);
      return;
    }

    if (!hasAnyFilter(filters)) {
      setFilterError('Informe pelo menos um filtro para salvar a visualização personalizada.');
      return;
    }

    setFilterError('');
    onSave?.({
      label:         normalizedName,
      filters,
      pinInSidebar:  pinSidebar,
      originalLabel: isEditMode ? (initialView?.label ?? null) : null,
    });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Visualização personalizada"
        backdropColor={FILTER_MODAL_BACKDROP}
        footerGap={layout.blockGap}
        style={FILTER_MODAL_STYLE}
        leftFooter={isEditMode && (
          <Button
            type="primary"
            variant="flat"
            leadingIcon={<DeleteIcon />}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Excluir visualização
          </Button>
        )}
        footer={(
          <>
            <Button type="primary" variant="outline" style={{ borderColor: colors.primary.main }} onClick={handleClear}>
              Limpar
            </Button>
            <Button type="primary" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="primary" variant="filled" onClick={handleSave}>
              Salvar
            </Button>
          </>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: layout.blockGap }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
            <span style={{ ...typography.styles.body2, color: colors.secondary.dark }}>
              Nome
            </span>
            <input
              value={name}
              onChange={handleNameChange}
              maxLength={USER_DEFINED_NAME_MAX_LENGTH}
              placeholder="Informe um nome para a visualização"
              style={{
                ...typography.styles.body2,
                color:           colors.secondary.dark,
                border:          `${borders.width.sm} solid ${nameError ? colors.error.main : colors.secondary.medium}`,
                borderRadius:    borders.radius.md,
                padding:         `${spacing.xs} ${spacing['bt-3']} ${spacing['bt-2']}`,
                outline:         'none',
                width:           '100%',
                boxSizing:       'border-box',
                backgroundColor: colors.surface.xxxl,
              }}
            />
            {nameError && (
              <span style={{ ...typography.styles.caption, color: colors.error.main }}>
                {nameError}
              </span>
            )}
          </div>

          <Checkbox
            type="solarbpm"
            checked={pinSidebar}
            onChange={() => setPinSidebar(value => !value)}
          >
            Fixar no menu lateral
          </Checkbox>

          <DividerH style={{ padding: `${spacing.xxs} 0` }} />

          {filterError && (
            <span style={{ ...typography.styles.caption, color: colors.error.main }}>
              {filterError}
            </span>
          )}

          <FilterFieldsContent
            filters={filters}
            filterOptions={filterOptions}
            grupos={grupos}
            ddRows={ddRows}
            ddLabels={ddLabels}
            ddColCount={ddColCount}
            dateRangeRows={dateRangeRows}
            dateRangeLabels={dateRangeLabels}
            dateRangeColCount={dateRangeColCount}
            onToggleCheckbox={toggleCb}
            onToggleDropdown={toggleDd}
            onToggleDropdownAll={toggleDdAll}
            onDateRangeChange={updateDateRange}
          />
        </div>
      </Modal>

      <ModalDialog
        open={deleteConfirmOpen}
        title="Excluir visualização"
        message="Tem certeza que deseja excluir esta visualização personalizada? Os itens da fila não serão excluídos e continuarão disponíveis na Visualização padrão."
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={() => { onDelete?.(); setDeleteConfirmOpen(false); }}
      />
    </>
  );
}
