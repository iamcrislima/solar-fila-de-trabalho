import type { Tarefa, TarefaSituacao, TarefaStatusAtribuicao } from '../models/tarefa.model';
import type { Chip } from '@/domain/shared.types';
import { PROCESSO_TAREFA_CARD_FIELDS } from '../fields/processoTarefaCardFields';

interface TarefaCardField {
  id: string;
  fieldId: string;
  label: string;
  value: string;
}

export interface TarefaProcessCard {
  id: string;
  tarefa: Tarefa;
  taskName: string;
  situacao: TarefaSituacao;
  statusAtribuicao: TarefaStatusAtribuicao | string;
  fields: TarefaCardField[];
  chips: Chip[];
}

function readPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

function toDisplayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

export function tarefaToProcessTaskCard(tarefa: Tarefa): TarefaProcessCard {
  return {
    id: tarefa.id,
    tarefa,
    taskName: tarefa.titulo,
    situacao: tarefa.situacao ?? 'em_aberto',
    statusAtribuicao: tarefa.statusAtribuicao ?? tarefa.status,
    fields: PROCESSO_TAREFA_CARD_FIELDS.map((field) => ({
      id: field.id,
      fieldId: field.fieldId,
      label: field.label,
      value: toDisplayValue(readPath(tarefa, field.path)),
    })),
    chips: tarefa.chips ?? [],
  };
}

export function tarefasToProcessTaskCards(tarefas: Tarefa[] = []): TarefaProcessCard[] {
  return tarefas.map(tarefaToProcessTaskCard);
}
