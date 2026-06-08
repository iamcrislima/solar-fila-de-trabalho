import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { CategoriasProvider } from '@/application/providers/CategoriasProvider';
import { extractPersonalTagsFromItems } from '@/application/providers/useCategorias';
import { TarefasProvider }     from '@/application/providers/TarefasProvider';
import { CustomViewsProvider } from './providers/CustomViewsProvider';
import { getTarefasVisiveis }         from '@/domain/processos/tarefas/repositories/tarefas.repository';
import { USUARIO_LOGADO_MOCK }        from '@/domain/usuario/usuario.mock';
import { getProcessosWorkQueueCards } from './selectors/processoQueue.selectors';
import { getTarefasWorkQueueCards }   from './selectors/tarefaQueue.selectors';
import { FilaDeProcessos } from './pages/fila-processos/FilaDeProcessos';
import { FilaDeTarefas }   from './pages/fila-tarefas/FilaDeTarefas';

const initialProcessos = getProcessosWorkQueueCards() as unknown as unknown as Parameters<typeof extractPersonalTagsFromItems>[0];
const initialTarefas = getTarefasWorkQueueCards() as unknown as unknown as Parameters<typeof extractPersonalTagsFromItems>[0];
const initialPersonalTags = [
  ...extractPersonalTagsFromItems(initialProcessos),
  ...extractPersonalTagsFromItems(initialTarefas),
];

// Breadcrumbs por página — chave = valor do state `page`
const PAGE_BREADCRUMBS: Record<string, { title: string; subtitle: string }> = {
  processos: { title: 'Fila de trabalho', subtitle: 'Processos/Documentos' },
  tarefas:   { title: 'Fila de trabalho', subtitle: 'Tarefas'               },
};

interface FilaModuleInnerProps {
  onSidebarChange?:    (content: ReactNode) => void;
  onBreadcrumbChange?: (node: ReactNode) => void;
}

function FilaModuleInner({ onSidebarChange, onBreadcrumbChange }: FilaModuleInnerProps) {
  const [page, setPage] = useState('processos');
  const [processosSidebar, setProcessosSidebar] = useState<ReactNode>(null);
  const [tarefasSidebar,   setTarefasSidebar]   = useState<ReactNode>(null);
  const [processosCounts,  setProcessosCounts]  = useState<unknown>(null);
  const [tarefasCounts,    setTarefasCounts]    = useState<unknown>(null);

  useEffect(() => {
    onSidebarChange?.(page === 'tarefas' ? tarefasSidebar : processosSidebar);
  }, [page, processosSidebar, tarefasSidebar, onSidebarChange]);

  // Emite o breadcrumb correto para o AppShell sempre que a página muda
  useEffect(() => {
    const crumb = PAGE_BREADCRUMBS[page];
    if (!crumb) return;
    onBreadcrumbChange?.(
      <nav aria-label="Localização" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ ...typography.styles.caption, color: colors.secondary.main, whiteSpace: 'nowrap' }}>
          {crumb.title}
        </span>
        <span style={{ ...typography.styles.caption, color: colors.secondary.medium, userSelect: 'none' }}>
          /
        </span>
        <span style={{ ...typography.styles.captionBold, color: colors.secondary.dark, whiteSpace: 'nowrap' }}>
          {crumb.subtitle}
        </span>
      </nav>
    );
  }, [page, onBreadcrumbChange]);

  const hidden:  React.CSSProperties = { display: 'none' };
  const visible: React.CSSProperties = { display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden', minHeight: 0 };

  return (
    <>
      <div style={page === 'processos' ? visible : hidden}>
        <FilaDeProcessos onNavigate={setPage} onSidebarChange={setProcessosSidebar} onCountsChange={setProcessosCounts} crossCounts={tarefasCounts} />
      </div>
      <div style={page === 'tarefas' ? visible : hidden}>
        <FilaDeTarefas onNavigate={setPage} onSidebarChange={setTarefasSidebar} onCountsChange={setTarefasCounts} crossCounts={processosCounts} />
      </div>
    </>
  );
}

interface FilaModuleProps {
  onSidebarChange?:    (content: ReactNode) => void;
  onBreadcrumbChange?: (node: ReactNode) => void;
}

export function FilaModule({ onSidebarChange, onBreadcrumbChange }: FilaModuleProps) {
  return (
    <TarefasProvider initialTarefas={getTarefasVisiveis(USUARIO_LOGADO_MOCK.nome, USUARIO_LOGADO_MOCK.unidade)}>
      <CategoriasProvider
        initialPersonalTags={initialPersonalTags as never}
        initialItemsByContext={{ processos: initialProcessos as unknown as { id: string; chips?: never[] }[], tarefas: initialTarefas as unknown as { id: string; chips?: never[] }[] }}
      >
        <CustomViewsProvider>
          <FilaModuleInner onSidebarChange={onSidebarChange} onBreadcrumbChange={onBreadcrumbChange} />
        </CustomViewsProvider>
      </CategoriasProvider>
    </TarefasProvider>
  );
}
