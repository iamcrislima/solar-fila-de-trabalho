import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Tarefa } from '@/domain/processos/tarefas/models/tarefa.model';
import { tarefasMock } from '@/domain/processos/tarefas/mocks/tarefas.mock';
import { TarefasContext } from './useTarefasState';
import type { TarefaAssignment } from './useTarefasState';
const DEFAULT_ASSIGNMENT_USER = 'Machado de Assis';

function formatCurrentDateTime(date: Date = new Date()): string {
  const pad = (v: number) => String(v).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createInitialAssignmentMap(tarefas: Tarefa[]): Map<string, TarefaAssignment> {
  return new Map(
    tarefas.map((t) => [
      t.id,
      {
        statusAtribuicao: t.statusAtribuicao ?? t.status ?? 'nao_atribuida',
        atribuidoA: t.atribuicao?.atribuidoA ?? '-',
        data: t.atribuicao?.data ?? '-',
      },
    ])
  );
}

export function TarefasProvider({
  children,
  initialTarefas = tarefasMock,
  usuarioAtribuicao = DEFAULT_ASSIGNMENT_USER,
}: {
  children: ReactNode;
  initialTarefas?: Tarefa[];
  usuarioAtribuicao?: string;
}) {
  const [assignmentMap, setAssignmentMap] = useState(() =>
    createInitialAssignmentMap(initialTarefas)
  );

  const getTarefaAssignment = useCallback(
    (tarefaOrId: Tarefa | string): TarefaAssignment => {
      const id = typeof tarefaOrId === 'string' ? tarefaOrId : tarefaOrId?.id;
      const tarefa =
        typeof tarefaOrId === 'string'
          ? initialTarefas.find((item) => item.id === tarefaOrId)
          : tarefaOrId;
      return (
        assignmentMap.get(id) ?? {
          statusAtribuicao: tarefa?.statusAtribuicao ?? tarefa?.status ?? 'nao_atribuida',
          atribuidoA: tarefa?.atribuicao?.atribuidoA ?? '-',
          data: tarefa?.atribuicao?.data ?? '-',
        }
      );
    },
    [assignmentMap, initialTarefas]
  );

  const isTarefaAtribuida = useCallback(
    (tarefaOrId: Tarefa | string) =>
      getTarefaAssignment(tarefaOrId).statusAtribuicao === 'atribuida',
    [getTarefaAssignment]
  );

  const atribuirTarefa = useCallback(
    (tarefaOrId: Tarefa | string) => {
      const id = typeof tarefaOrId === 'string' ? tarefaOrId : tarefaOrId?.id;
      if (!id) return;
      setAssignmentMap((prev) => {
        const next = new Map(prev);
        next.set(id, { statusAtribuicao: 'atribuida', atribuidoA: usuarioAtribuicao, data: formatCurrentDateTime() });
        return next;
      });
    },
    [usuarioAtribuicao]
  );

  const desatribuirTarefa = useCallback((tarefaOrId: Tarefa | string) => {
    const id = typeof tarefaOrId === 'string' ? tarefaOrId : tarefaOrId?.id;
    if (!id) return;
    setAssignmentMap((prev) => {
      const next = new Map(prev);
      next.set(id, { statusAtribuicao: 'nao_atribuida', atribuidoA: '-', data: '-' });
      return next;
    });
  }, []);

  const toggleTarefaAtribuicao = useCallback(
    (tarefaOrId: Tarefa | string) => {
      if (isTarefaAtribuida(tarefaOrId)) desatribuirTarefa(tarefaOrId);
      else atribuirTarefa(tarefaOrId);
    },
    [atribuirTarefa, desatribuirTarefa, isTarefaAtribuida]
  );

  const mergeTarefaAssignment = useCallback(
    (tarefa: Tarefa | null): Tarefa | null => {
      if (!tarefa) return null;
      const assignment = getTarefaAssignment(tarefa);
      return {
        ...tarefa,
        statusAtribuicao: assignment.statusAtribuicao,
        status: assignment.statusAtribuicao,
        atribuicao: { ...(tarefa.atribuicao ?? {}), atribuidoA: assignment.atribuidoA, data: assignment.data },
      };
    },
    [getTarefaAssignment]
  );

  const value = useMemo(
    () => ({ assignmentMap, getTarefaAssignment, isTarefaAtribuida, atribuirTarefa, desatribuirTarefa, toggleTarefaAtribuicao, mergeTarefaAssignment }),
    [assignmentMap, getTarefaAssignment, isTarefaAtribuida, atribuirTarefa, desatribuirTarefa, toggleTarefaAtribuicao, mergeTarefaAssignment]
  );

  return <TarefasContext.Provider value={value}>{children}</TarefasContext.Provider>;
}
