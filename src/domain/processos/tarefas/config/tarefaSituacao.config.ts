import type { TarefaSituacao } from '../models/tarefa.model';

export const TAREFA_SITUACAO = {
  FINALIZADA: 'finalizada',
  EM_ABERTO: 'em_aberto',
  CANCELADA: 'cancelada',
  REJEITADA: 'rejeitada',
} as const;

interface SituacaoConfig {
  label: string;
  tooltip: string;
}

export const TAREFA_SITUACAO_CONFIG: Record<TarefaSituacao, SituacaoConfig> = {
  [TAREFA_SITUACAO.FINALIZADA]: { label: 'Finalizada', tooltip: 'Finalizada' },
  [TAREFA_SITUACAO.EM_ABERTO]: { label: 'Em aberto', tooltip: 'Em aberto' },
  [TAREFA_SITUACAO.CANCELADA]: { label: 'Cancelada', tooltip: 'Cancelada' },
  [TAREFA_SITUACAO.REJEITADA]: { label: 'Rejeitada', tooltip: 'Rejeitada' },
};

export interface SituacaoLegendItem extends SituacaoConfig {
  key: TarefaSituacao;
}

export const TAREFA_SITUACAO_LEGEND: SituacaoLegendItem[] = (
  Object.values(TAREFA_SITUACAO) as TarefaSituacao[]
).map((key) => ({ key, ...TAREFA_SITUACAO_CONFIG[key] }));

export function getTarefaSituacaoConfig(situacao: string): SituacaoConfig {
  return (
    TAREFA_SITUACAO_CONFIG[situacao as TarefaSituacao] ??
    TAREFA_SITUACAO_CONFIG[TAREFA_SITUACAO.EM_ABERTO]
  );
}
