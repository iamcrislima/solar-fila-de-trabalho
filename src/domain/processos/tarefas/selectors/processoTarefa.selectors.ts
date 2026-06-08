import type { Tarefa } from '../models/tarefa.model';
import type { ProcessoDigital } from '../../models/processoDigital.model';
import { isTarefaAberta } from './tarefaSelectors';

export function normalizeProcessNumber(numero: string | number | null | undefined): string {
  return String(numero ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\d/a-z]/g, '');
}

export function buildProcessosById(processos: ProcessoDigital[] = []): Map<string, ProcessoDigital> {
  return new Map(processos.map((p) => [p.id, p]));
}

export function buildProcessosByNumero(processos: ProcessoDigital[] = []): Map<string, ProcessoDigital> {
  return new Map(processos.map((p) => [normalizeProcessNumber(p.numero), p]));
}

export function resolveProcessoForTarefa(
  tarefa: Tarefa | null | undefined,
  processos: ProcessoDigital[] = []
): ProcessoDigital | null {
  if (!tarefa) return null;
  const processosById = buildProcessosById(processos);
  const processosByNumero = buildProcessosByNumero(processos);
  const processoNumero = tarefa.processo?.numero;

  return (
    processosById.get(tarefa.processoId) ??
    processosByNumero.get(normalizeProcessNumber(processoNumero)) ??
    null
  );
}

export function getTarefasByProcessoId(processoId: string, tarefas: Tarefa[] = []): Tarefa[] {
  if (!processoId) return [];
  return tarefas.filter((t) => t.processoId === processoId);
}

export function getTarefasAbertasByProcessoId(processoId: string, tarefas: Tarefa[] = []): Tarefa[] {
  return getTarefasByProcessoId(processoId, tarefas).filter(isTarefaAberta);
}

export function countTarefasAbertasByProcessoId(processoId: string, tarefas: Tarefa[] = []): number {
  return getTarefasAbertasByProcessoId(processoId, tarefas).length;
}

export function buildTarefasByProcessoId(tarefas: Tarefa[] = []): Map<string, Tarefa[]> {
  return tarefas.reduce((map, tarefa) => {
    const { processoId } = tarefa;
    if (!processoId) return map;
    const current = map.get(processoId) ?? [];
    map.set(processoId, [...current, tarefa]);
    return map;
  }, new Map<string, Tarefa[]>());
}
