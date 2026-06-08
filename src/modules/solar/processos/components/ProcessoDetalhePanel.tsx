import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Categoria } from '../../../../domain/categorias/types/categoriaTypes';
import type { Tarefa } from '../../../../domain/processos/tarefas/models/tarefa.model';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoIcon from '@mui/icons-material/Info';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PushPinIcon from '@mui/icons-material/PushPin';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Breadcrumb } from '../../../../components/ds/atoms/Header/Breadcrumb';
import { Button } from '../../../../components/ds/atoms/Button/Button';
import { Tabs } from '../../../../components/ds/atoms/Tabs/Tabs';
import { DividerH } from '../../../../components/ds/atoms/Divider';
import { InputRead } from '../../../../components/ds/atoms/InputRead';
import { TruncatedText } from '../../../../components/ds/atoms/TruncatedText';
import { ButtonHint } from '../../../../components/custom/ButtonHint';
import { TagChipList } from '../../../../components/custom/TagChipList';
import { CategoriasDropdown } from '../../../../components/custom/CategoriasDropdown';
import { CriarTagModal } from '../../../../components/custom/CriarTagModal';
import { GerenciarTagsModal } from '../../../../components/custom/GerenciarTagsModal';
import { ProcessoTarefasTab } from './processo-detalhe/ProcessoTarefasTab';
import { TarefaDetalheOverlay } from './processo-detalhe/TarefaDetalheOverlay';
import { useCategorias } from '../../../../application/providers/useCategorias';
import { useTarefasState } from '../../../../application/providers/useTarefasState';
import { getProcessoLembretesEmDestaque } from '../../../../domain/processos/selectors/processoSelectors';
import type { ProcessoDigital } from '../../../../domain/processos/models/processoDigital.model';
import { colors } from '../../../../styles/tokens/colors';
import { shadows } from '../../../../styles/tokens/shadows';
import { typography } from '../../../../styles/tokens/typography';
import { layout } from '../../../../styles/tokens/layout';
import { spacing } from '../../../../styles/tokens/spacing';

const tabs = [
  'Dados',
  'Anexos',
  'Tramitações',
  'Tarefas',
  'Juntadas/Vinculações',
  'Dados Adicionais',
];

const styles = {
  primary: colors.primary.main,
  text: colors.surface.dark,
  muted: colors.surface.main,
  panelPadding: `${layout.containerPaddingY} ${layout.containerPaddingX}`,
  contentPaddingX: 0,
  sectionTitleGap: 12,
  rowGap: 16,
};

const tarefaActionLabels = {
  categorias: 'Categorias',
  atribuir: 'Atribuir',
  desatribuir: 'Desatribuir',
  rejeitar: 'Rejeitar',
  agendar: 'Agendar',
};

const categoriasDropdownConfig = {
  tooltipIcones: {
    groups: 'Tag de setor',
    person: 'Tag pessoal',
    account_balance: 'Tag de órgão',
  },
  acoes: ['Aplicar tag', 'Criar tag pessoal', 'Gerenciar tags'],
};

function FieldRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        columnGap: 24,
        rowGap: styles.rowGap,
        width: '100%',
        alignItems: 'start',
      }}
    >
      {children}
    </div>
  );
}

function BlankField() {
  return <div style={{ minHeight: 43 }} />;
}

function ReadField({ label, value }: { label?: string; value?: unknown }) {
  return (
    <InputRead
      label={label}
      value={value == null ? '-' : String(value)}
      style={{ minWidth: 0, width: '100%' }}
    />
  );
}

function EmptyBusinessData() {
  return (
    <span
      style={{
        ...typography.styles.body2,
        color: colors.surface.main,
      }}
    >
      Nenhum dado encontrado.
    </span>
  );
}

function Observacoes({ items }: { items: Array<{ texto: string }> }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        width: '100%',
      }}
    >
      {items.map((item, index) => (
        <div
          key={`${item.texto}-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            width: '100%',
            minWidth: 0,
          }}
        >
          <ReportProblemIcon
            style={{
              fontSize: spacing.md,
              color: colors.warning.main,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              ...typography.styles.body2,
              color: colors.surface.main,
              minWidth: 0,
            }}
          >
            {item.texto}
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  action,
  children,
  withDivider = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  withDivider?: boolean;
}) {
  return (
    <>
      {withDivider && <DividerH />}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: styles.sectionTitleGap,
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h2
            style={{
              ...typography.styles.subtitle1,
              color: styles.text,
              margin: 0,
            }}
          >
            {title}
          </h2>
          {action}
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: styles.rowGap, width: '100%' }}
        >
          {children}
        </div>
      </section>
    </>
  );
}

interface OpenedTaskCard {
  id: string;
  tarefa?: Record<string, unknown>;
  taskName?: string;
  chips?: unknown[];
}

export function ProcessoDetalhePanel({
  processo,
  onClose,
  initialTab = 0,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  origin,
}: {
  processo: Record<string, unknown>;
  onClose?: () => void;
  initialTab?: number;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  origin?: { label?: string };
}) {
  const {
    externalTags,
    personalTags,
    savePersonalTag,
    deletePersonalTag,
    getChipsMap,
    updateChipsMap,
    countTagUsage,
  } = useCategorias();
  const { getTarefaAssignment, isTarefaAtribuida, toggleTarefaAtribuicao, mergeTarefaAssignment } =
    useTarefasState();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [openedTaskCard, setOpenedTaskCard] = useState<OpenedTaskCard | null>(null);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);
  const categoriaItems = useMemo(
    () => [
      ...new Map([...externalTags, ...personalTags].map((c) => [c.label, c] as const)).values(),
    ],
    [externalTags, personalTags]
  );

  useEffect(() => {
    setActiveTab(initialTab);
    setOpenedTaskCard(null);
  }, [initialTab, processo?.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!processo) return null;

  const entityLabel = processo.tipo === 'Documento' ? 'Documento Digital' : 'Processo Digital';
  const originLabel = origin?.label ?? 'Fila de trabalho';

  const dados = (processo.dados ?? {}) as Record<string, unknown>;
  const fluxo = (processo.fluxo ?? {}) as Record<string, unknown>;
  const recebimento = (processo.recebimento ?? {}) as Record<string, unknown>;
  const possuiFluxo = !!(processo.indicadores as Record<string, unknown>)?.possuiFluxo;
  const lembretesDestaque = getProcessoLembretesEmDestaque(processo as unknown as ProcessoDigital);
  const processChipsMap = getChipsMap('processos');
  const processChips = processChipsMap.get(processo.id as string) ?? [];
  const taskChipsMap = getChipsMap('tarefas');
  const openedTaskId = openedTaskCard?.id;
  const openedTaskAssigned = openedTaskCard ? isTarefaAtribuida(openedTaskCard.id) : false;
  const openedTaskForPanel = openedTaskCard
    ? mergeTarefaAssignment({
        ...openedTaskCard.tarefa,
        id: openedTaskCard.id,
        processNumber: openedTaskCard.taskName,
      } as unknown as Tarefa)
    : null;
  const openedTaskActionStates = {
    criarTarefa: !!openedTaskCard,
    atribuir: !!openedTaskCard && !openedTaskAssigned,
    desatribuir: !!openedTaskCard && openedTaskAssigned,
    rejeitar: false,
    agendar: !!openedTaskCard,
    editar: !!openedTaskCard,
    cancelar: !!openedTaskCard,
  };

  const handleApplyTags = (tagStates: Map<string, string>, targetIds: Set<string> = new Set()) => {
    updateChipsMap('tarefas', (prev) => {
      const next = new Map(prev);
      targetIds.forEach((id) => {
        let chips = [...(next.get(id) ?? [])];
        tagStates.forEach((state, label) => {
          if (state === 'checked') {
            const tag = categoriaItems.find((t) => t.label === label);
            if (tag && !chips.some((c) => c.label === label)) {
              chips = [...chips, tag];
            }
          } else if (state === 'unchecked') {
            chips = chips.filter((c) => c.label !== label);
          }
        });
        next.set(id, chips);
      });
      return next;
    });
  };

  const handleSaveTag = (updated: Record<string, unknown>, originalLabel?: string) => {
    savePersonalTag(updated as Partial<Categoria>, originalLabel);
  };

  const handleDeleteTag = (label: string) => {
    deletePersonalTag(label);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: layout.blockGap,
        width: '100%',
        height: '100%',
        padding: styles.panelPadding,
        boxSizing: 'border-box',
        borderRadius: 8,
        background: colors.surface.xxxl,
        boxShadow: shadows.level2,
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
          flexShrink: 0,
          width: '100%',
        }}
      >
        <Breadcrumb
          items={[{ label: originLabel, onClick: onClose }, { label: entityLabel }]}
          style={{ flex: '1 1 280px', minWidth: 0 }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 4,
            flexWrap: 'wrap',
          }}
        >
          <ButtonHint
            icon={<ArrowBackIcon />}
            hint="Anterior"

            onClick={onPrev}
            disabled={!hasPrev}
          />
          <ButtonHint
            icon={<ArrowForwardIcon />}
            hint="Próximo"

            onClick={onNext}
            disabled={!hasNext}
          />
          {onClose && (
            <ButtonHint
              icon={<CloseIcon />}
              hint="Fechar (ESC)"
              onClick={onClose}
            />
          )}
        </div>
      </header>
      <DividerH />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: '0 0 auto',
            flexWrap: 'wrap',
          }}
        >
          <TruncatedText
            text={processo.numero as string}
            style={{
              ...typography.styles.subtitle1,
              color: styles.text,
              flex: '0 1 auto',
            }}
          >
            {processo.numero as string}
          </TruncatedText>
          <InfoIcon style={{ fontSize: 24, color: styles.primary, flexShrink: 0 }} />
          <StarBorderIcon style={{ fontSize: 24, color: styles.primary, flexShrink: 0 }} />
          <PushPinIcon style={{ fontSize: 24, color: styles.primary, flexShrink: 0 }} />
        </div>

        {processChips.length > 0 && (
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <TagChipList
              chips={processChips}
              overflowVariant="full"
              overflowDisclosure="popover"
            />
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            flex: '1 1 300px',
            flexWrap: 'wrap',
          }}
        >
          <Button type="primary" variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button type="primary" variant="filled">
            Criar tarefa
          </Button>
          <Button type="primary" variant="outline" trailingIcon={<ArrowDropDownIcon />}>
            Ações
          </Button>
        </div>
      </div>

      <Tabs
        tabs={tabs.map((label) => ({ label }))}
        active={activeTab}
        onChange={setActiveTab}
        activeColor={styles.primary}
        inactiveColor={styles.muted}
        style={{ width: '100%', flexShrink: 0 }}
      />

      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding:
            activeTab === 3
              ? `${layout.blockGap} 0 ${layout.containerPaddingY}`
              : `${layout.blockGap} ${styles.contentPaddingX} ${layout.containerPaddingY}`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: layout.blockGap,
        }}
      >
        {activeTab === 0 && (
          <>
            {lembretesDestaque.length > 0 && (
              <Section title="Observações" withDivider={false}>
                <Observacoes items={lembretesDestaque} />
              </Section>
            )}

            <Section title={`Dados do ${entityLabel}`} withDivider={lembretesDestaque.length > 0}>
              <FieldRow>
                <ReadField label="Órgão" value={dados.orgao} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Unidade Responsável" value={dados.unidadeResponsavel} />
                <ReadField label="Data de Entrada" value={dados.dataEntrada} />
                <ReadField label="Autuado em" value={dados.autuadoEm} />
              </FieldRow>
              <FieldRow>
                <ReadField label="Interessado" value={dados.interessado} />
                <ReadField label="Ativo" value={dados.ativo} />
                <ReadField label="Principal" value={dados.principal} />
              </FieldRow>
              <FieldRow>
                <ReadField label="Classificação" value={processo.classificacao} />
                <ReadField label="Origem abertura" value={dados.origemAbertura} />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Tipo de processo" value={dados.tipoProcesso} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Detalhamento do assunto" value={dados.detalhamentoAssunto} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField
                  label="Informações complementares"
                  value={dados.informacoesComplementares}
                />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Município" value={dados.municipio} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Unidade Origem" value={dados.unidadeOrigem} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Cadastrado por" value={dados.cadastradoPor} />
                <ReadField label="Autuado por" value={dados.autuadoPor} />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField
                  label="Tipo"
                  value={processo.tipo === 'Documento' ? 'Documento Digital' : 'Processo Digital'}
                />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Situação" value={dados.situacao} />
                <ReadField label="Prioritário" value={dados.prioritario} />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Controle de acesso" value={dados.controleAcesso} />
                <BlankField />
                <BlankField />
              </FieldRow>
            </Section>

            <Section title="Dados do Fluxo">
              <FieldRow>
                <ReadField
                  label="Status"
                  value={possuiFluxo ? 'Possui fluxo' : 'Não possui fluxo'}
                />
                <BlankField />
                <BlankField />
              </FieldRow>
            </Section>

            <Section title="Unidade atual">
              <FieldRow>
                <ReadField label="Unidade" value={fluxo.unidadeAtual} />
                <BlankField />
                <BlankField />
              </FieldRow>
              <FieldRow>
                <ReadField label="Recebimento" value={recebimento.recebidoEm} />
                <BlankField />
                <BlankField />
              </FieldRow>
            </Section>

            <Section
              title="Dados de negócio"
              action={
                <Button type="primary" variant="outline">
                  Adicionar
                </Button>
              }
            >
              <EmptyBusinessData />
            </Section>
          </>
        )}

        {activeTab === 3 && (
          <ProcessoTarefasTab
            processo={processo}
            chipsMap={taskChipsMap}
            possuiFluxo={possuiFluxo}
            onOpenTask={(card) => setOpenedTaskCard(card as OpenedTaskCard)}
            getTarefaAssignment={(t) => getTarefaAssignment(t as Tarefa | string)}
            isTarefaAtribuida={(t) => isTarefaAtribuida(t as Tarefa | string)}
            onToggleTaskAssignment={(t) => toggleTarefaAtribuicao(t as Tarefa | string)}
          />
        )}

        {activeTab !== 0 && activeTab !== 3 && (
          <span style={{ ...typography.styles.body2, color: colors.surface.main }}>
            Conteúdo em construção.
          </span>
        )}
      </main>

      <TarefaDetalheOverlay
        tarefa={(openedTaskForPanel ?? undefined) as Record<string, unknown> | undefined}
        chips={openedTaskId ? (taskChipsMap.get(openedTaskId) ?? openedTaskCard?.chips ?? []) : []}
        actionLabels={tarefaActionLabels}
        actionStates={openedTaskActionStates}
        categoriasAction={
          openedTaskId ? (
            <CategoriasDropdown
              items={categoriaItems}
              iconTooltips={categoriasDropdownConfig.tooltipIcones}
              acoes={categoriasDropdownConfig.acoes}
              checkedIds={new Set([openedTaskId!])}
              processChipsMap={taskChipsMap}
              onApplyTags={(tagStates) => handleApplyTags(tagStates, new Set([openedTaskId!]))}
              onCreateTag={() => setCreateTagOpen(true)}
              onManageTags={() => setManageTagsOpen(true)}
              hint={tarefaActionLabels.categorias}
            />
          ) : null
        }
        onClose={() => setOpenedTaskCard(null)}
      />

      <CriarTagModal
        open={createTagOpen}
        onClose={() => setCreateTagOpen(false)}
        onSave={(tag) => handleSaveTag(tag)}
        existingLabels={personalTags.map((t) => t.label)}
      />
      <GerenciarTagsModal
        open={manageTagsOpen}
        onClose={() => setManageTagsOpen(false)}
        tags={personalTags as unknown as Record<string, unknown>[]}
        onSaveTag={handleSaveTag}
        onDeleteTag={handleDeleteTag}
        countTagUsage={countTagUsage}
      />
    </div>
  );
}
