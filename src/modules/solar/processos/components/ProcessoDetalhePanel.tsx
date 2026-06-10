import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Categoria } from '../../../../domain/categorias/types/categoriaTypes';
import type { Tarefa } from '../../../../domain/processos/tarefas/models/tarefa.model';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PushPinIcon from '@mui/icons-material/PushPin';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import LinkIcon from '@mui/icons-material/Link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BlockIcon from '@mui/icons-material/Block';
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

// ─── Types & constants ──────────────────────────────────────────────────────

const TAB_LABELS = [
  'Dados',
  'Anexos',
  'Tramitações',
  'Tarefas',
  'Juntadas/Vinculações',
  'Dados Adicionais',
];

type PillVariant = 'blue' | 'gray' | 'green' | 'orange' | 'red';

const PILL_STYLES: Record<PillVariant, { bg: string; color: string; border: string; dot: string }> = {
  blue:   { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', dot: '#3B82F6' },
  gray:   { bg: '#F9FAFB', color: '#6B7280', border: '#E5E7EB', dot: '#9CA3AF' },
  green:  { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0', dot: '#22C55E' },
  orange: { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA', dot: '#F97316' },
  red:    { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA', dot: '#EF4444' },
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

// ─── Helper functions ────────────────────────────────────────────────────────

function getStatusPillVariant(value: string): PillVariant {
  const v = String(value).toLowerCase();
  if (['recebido', 'em tramitação', 'em andamento', 'ativo', 'possui fluxo', 'em análise'].some((k) => v.includes(k))) return 'blue';
  if (['concluído', 'público', 'sim', 'aprovado', 'finalizado'].some((k) => v.includes(k))) return 'green';
  if (['não possui', 'sem fluxo', 'aguardando', 'pendente', 'restrito', 'em espera'].some((k) => v.includes(k))) return 'orange';
  if (['cancelado', 'rejeitado', 'privado', 'erro', 'arquivado'].some((k) => v.includes(k))) return 'red';
  return 'gray';
}

function strVal(v: unknown): string {
  return v == null ? '-' : String(v);
}

// ─── UI helper components ────────────────────────────────────────────────────

function SmallIconBtn({
  title,
  onClick,
  disabled,
  children,
}: {
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: 'none',
        background: hovered ? '#F3F4F6' : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? '#374151' : '#6B7280',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.15s, color 0.15s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function CloseBtnX({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      title="Fechar (ESC)"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        border: 'none',
        background: hovered ? '#FEE2E2' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        color: hovered ? '#DC2626' : '#9CA3AF',
        marginLeft: 4,
        transition: 'background 0.15s, color 0.15s',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <CloseIcon style={{ fontSize: 16 }} />
    </button>
  );
}

function VoltarBtn({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 14px',
        height: 32,
        borderRadius: 7,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${hovered ? '#9CA3AF' : '#D1D5DB'}`,
        background: hovered ? '#F9FAFB' : '#fff',
        color: '#374151',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s, border-color 0.15s',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    >
      <ArrowBackIcon style={{ fontSize: 14 }} />
      Voltar
    </button>
  );
}

function BtnSm({
  icon,
  onClick,
  children,
}: {
  icon?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '0 10px',
        height: 26,
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${colors.primary.main}`,
        background: hovered ? '#EFF6FF' : '#fff',
        color: colors.primary.main,
        transition: 'background 0.15s',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        margin: 0,
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  );
}

function MetaGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '14px 24px',
      }}
    >
      {children}
    </div>
  );
}

function MetaField({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: 13, color: '#111827', fontWeight: 500, margin: 0 }}>{strVal(value)}</p>
    </div>
  );
}

function MetaFieldNode({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px' }}>{label}</p>
      <div>{children}</div>
    </div>
  );
}

function StatusPill({ label, variant = 'gray' }: { label: string; variant?: PillVariant }) {
  const s = PILL_STYLES[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        lineHeight: '18px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: s.dot,
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#F3F4F6', margin: '18px 0' }} />;
}

function InfoBox({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 9,
        padding: '10px 13px',
        background: '#F8FAFC',
        borderRadius: 8,
        border: '1px solid #E2E8F0',
      }}
    >
      {icon && (
        <span
          style={{
            fontSize: 15,
            color: '#94A3B8',
            marginTop: 1,
            flexShrink: 0,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        color: '#9CA3AF',
        gap: 10,
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 32, opacity: 0.45, display: 'flex', lineHeight: 1 }}>{icon}</span>
      <p style={{ fontSize: 13, margin: 0 }}>{text}</p>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

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
  const {
    getTarefaAssignment,
    isTarefaAtribuida,
    toggleTarefaAtribuicao,
    mergeTarefaAssignment,
  } = useTarefasState();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [openedTaskCard, setOpenedTaskCard] = useState<OpenedTaskCard | null>(null);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);

  const categoriaItems = useMemo(
    () => [
      ...new Map(
        [...externalTags, ...personalTags].map((c) => [c.label, c] as const)
      ).values(),
    ],
    [externalTags, personalTags]
  );

  useEffect(() => {
    setActiveTab(initialTab);
    setOpenedTaskCard(null);
  }, [initialTab, processo?.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!processo) return null;

  const dados = (processo.dados ?? {}) as Record<string, unknown>;
  const fluxo = (processo.fluxo ?? {}) as Record<string, unknown>;
  const recebimento = (processo.recebimento ?? {}) as Record<string, unknown>;
  const possuiFluxo = !!(processo.indicadores as Record<string, unknown>)?.possuiFluxo;
  const lembretesDestaque = getProcessoLembretesEmDestaque(
    processo as unknown as ProcessoDigital
  );
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

  const handleApplyTags = (
    tagStates: Map<string, string>,
    targetIds: Set<string> = new Set()
  ) => {
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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: '16px 20px 0',
          borderBottom: '1px solid #EBEBEB',
          flexShrink: 0,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 14,
          }}
        >
          {/* Left: process ID + icon actions + chips */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.primary.main,
                whiteSpace: 'nowrap',
              }}
            >
              {processo.numero as string}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SmallIconBtn title="Informações">
                <InfoOutlinedIcon style={{ fontSize: 16 }} />
              </SmallIconBtn>
              <SmallIconBtn title="Fixar">
                <PushPinIcon style={{ fontSize: 16 }} />
              </SmallIconBtn>
              <SmallIconBtn title="Favoritar">
                <StarBorderIcon style={{ fontSize: 16 }} />
              </SmallIconBtn>
            </div>

            {processChips.length > 0 && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}
              >
                <TagChipList
                  chips={processChips}
                  overflowVariant="full"
                  overflowDisclosure="popover"
                />
              </div>
            )}
          </div>

          {/* Right: prev/next + voltar + criar tarefa split + close */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            {(hasPrev || hasNext) && (
              <>
                <SmallIconBtn title="Anterior" onClick={onPrev} disabled={!hasPrev}>
                  <ArrowBackIcon style={{ fontSize: 16 }} />
                </SmallIconBtn>
                <SmallIconBtn title="Próximo" onClick={onNext} disabled={!hasNext}>
                  <ArrowForwardIcon style={{ fontSize: 16 }} />
                </SmallIconBtn>
              </>
            )}

            <VoltarBtn onClick={onClose} />

            {/* Split button */}
            <div
              style={{
                display: 'flex',
                borderRadius: 7,
                overflow: 'hidden',
                border: `1px solid ${colors.primary.main}`,
              }}
            >
              <button
                type="button"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#0046b5';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = colors.primary.main;
                }}
                style={{
                  background: colors.primary.main,
                  color: '#fff',
                  border: 'none',
                  padding: '0 14px',
                  height: 32,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <AddIcon style={{ fontSize: 14 }} />
                Criar tarefa
              </button>
              <div
                style={{
                  width: 1,
                  background: 'rgba(255,255,255,0.25)',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                }}
              />
              <button
                type="button"
                title="Mais ações"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#0046b5';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = colors.primary.main;
                }}
                style={{
                  width: 30,
                  background: colors.primary.main,
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
              >
                <ArrowDropDownIcon style={{ fontSize: 13 }} />
              </button>
            </div>

            <CloseBtnX onClick={onClose} />
          </div>
        </div>

        {/* Tabs row */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            overflowX: 'auto',
          }}
        >
          {TAB_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              onClick={() => setActiveTab(i)}
              style={{
                padding: '8px 14px',
                fontSize: 13,
                flexShrink: 0,
                color: activeTab === i ? colors.primary.main : '#6B7280',
                cursor: 'pointer',
                borderBottom: activeTab === i
                  ? `2px solid ${colors.primary.main}`
                  : '2px solid transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                background: 'transparent',
                fontWeight: activeTab === i ? 500 : 400,
                whiteSpace: 'nowrap',
                transition: 'color 0.15s, border-color 0.15s',
                userSelect: 'none',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          padding: activeTab === 3 ? '20px 0 24px' : '20px 20px 24px',
          overflowY: 'auto',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* ── Tab 0: Dados ── */}
        {activeTab === 0 && (
          <>
            {/* Observações / Lembretes em destaque */}
            {lembretesDestaque.length > 0 && (
              <>
                {lembretesDestaque.map((l, i) => (
                  <div key={`lembrete-${i}`} style={{ marginBottom: 10 }}>
                    <InfoBox icon={<WarningAmberIcon style={{ fontSize: 15 }} />}>
                      {l.texto}
                    </InfoBox>
                  </div>
                ))}
                <Divider />
              </>
            )}

            {/* Processo digital */}
            <SectionTitle>Processo digital</SectionTitle>
            <MetaGrid>
              <MetaField label="Órgão" value={dados.orgao} />
              <MetaField label="Unidade responsável" value={dados.unidadeResponsavel} />
              <MetaField label="Unidade origem" value={dados.unidadeOrigem} />
              <MetaField label="Interessado" value={dados.interessado} />
              <MetaField label="Município" value={dados.municipio} />
              <MetaField label="Origem abertura" value={dados.origemAbertura} />
              <MetaField label="Data de entrada" value={dados.dataEntrada} />
              <MetaField label="Autuado em" value={dados.autuadoEm} />
              <MetaField
                label="Tipo"
                value={
                  processo.tipo === 'Documento' ? 'Documento Digital' : 'Processo Digital'
                }
              />
              <MetaField label="Cadastrado por" value={dados.cadastradoPor} />
              <MetaField label="Autuado por" value={dados.autuadoPor} />
              <div />
              <MetaFieldNode label="Situação">
                <StatusPill
                  label={strVal(dados.situacao)}
                  variant={getStatusPillVariant(strVal(dados.situacao))}
                />
              </MetaFieldNode>
              <MetaFieldNode label="Prioritário">
                <StatusPill
                  label={strVal(dados.prioritario)}
                  variant={getStatusPillVariant(strVal(dados.prioritario))}
                />
              </MetaFieldNode>
              <MetaFieldNode label="Controle de acesso">
                <StatusPill
                  label={strVal(dados.controleAcesso)}
                  variant={getStatusPillVariant(strVal(dados.controleAcesso))}
                />
              </MetaFieldNode>
            </MetaGrid>

            <Divider />

            {/* Classificação */}
            <SectionTitle>Classificação</SectionTitle>
            <MetaGrid>
              <MetaField label="Tipo de processo" value={dados.tipoProcesso} />
              <MetaField label="Classificação" value={processo.classificacao} />
              <MetaField label="Detalhamento" value={dados.detalhamentoAssunto} />
            </MetaGrid>

            {/* Info complementar */}
            {dados.informacoesComplementares && (
              <>
                <Divider />
                <InfoBox icon={<ChatBubbleOutlineIcon style={{ fontSize: 15 }} />}>
                  {strVal(dados.informacoesComplementares)}
                </InfoBox>
              </>
            )}

            {/* Process chips / tags */}
            {processChips.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 14,
                  flexWrap: 'wrap',
                }}
              >
                <TagChipList
                  chips={processChips}
                  overflowVariant="full"
                  overflowDisclosure="popover"
                />
              </div>
            )}

            <Divider />

            {/* Dados do fluxo */}
            <SectionTitle>Dados do fluxo</SectionTitle>
            <MetaGrid>
              <MetaFieldNode label="Status">
                <StatusPill
                  label={possuiFluxo ? 'Possui fluxo' : 'Não possui fluxo'}
                  variant={possuiFluxo ? 'green' : 'orange'}
                />
              </MetaFieldNode>
            </MetaGrid>

            <Divider />

            {/* Unidade atual */}
            <SectionTitle>Unidade atual</SectionTitle>
            <MetaGrid>
              <MetaField label="Unidade" value={fluxo.unidadeAtual} />
              <MetaField label="Recebimento" value={recebimento.recebidoEm} />
            </MetaGrid>

            <Divider />

            {/* Dados de negócio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  margin: 0,
                }}
              >
                Dados de negócio
              </p>
              <BtnSm icon={<AddIcon style={{ fontSize: 13 }} />}>Adicionar</BtnSm>
            </div>
            <div
              style={{
                padding: 20,
                background: '#FAFAFA',
                borderRadius: 8,
                border: '1px dashed #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
              }}
            >
              <BlockIcon style={{ fontSize: 24, color: '#9CA3AF', opacity: 0.45 }} />
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>
                Nenhum dado de negócio encontrado.
              </p>
            </div>
          </>
        )}

        {/* ── Tab 1: Anexos ── */}
        {activeTab === 1 && (
          <EmptyState
            icon={<AttachFileIcon style={{ fontSize: 32 }} />}
            text="Nenhum anexo vinculado a este processo."
          />
        )}

        {/* ── Tab 2: Tramitações ── */}
        {activeTab === 2 && (
          <EmptyState
            icon={<SyncAltIcon style={{ fontSize: 32 }} />}
            text="Sem tramitações registradas."
          />
        )}

        {/* ── Tab 3: Tarefas ── */}
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

        {/* ── Tab 4: Juntadas/Vinculações ── */}
        {activeTab === 4 && (
          <EmptyState
            icon={<LinkIcon style={{ fontSize: 32 }} />}
            text="Sem juntadas ou vinculações."
          />
        )}

        {/* ── Tab 5: Dados Adicionais ── */}
        {activeTab === 5 && (
          <EmptyState
            icon={<ListAltIcon style={{ fontSize: 32 }} />}
            text="Nenhum dado adicional cadastrado."
          />
        )}
      </div>

      {/* ── Overlays & Modals ── */}
      <TarefaDetalheOverlay
        tarefa={(openedTaskForPanel ?? undefined) as Record<string, unknown> | undefined}
        chips={
          openedTaskId
            ? (taskChipsMap.get(openedTaskId) ?? openedTaskCard?.chips ?? [])
            : []
        }
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
              onApplyTags={(tagStates) =>
                handleApplyTags(tagStates, new Set([openedTaskId!]))
              }
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
