import type { Chip } from '../../../shared.types';

export type TarefaStatusAtribuicao = 'atribuida' | 'nao_atribuida';
export type TarefaSituacao = 'finalizada' | 'em_aberto' | 'cancelada' | 'rejeitada';

export interface TarefaDados {
  detalhamento: string;
  interessado: string;
  responsaveis: string;
  municipio: string;
  categoria: string;
}

export interface TarefaIndicadores {
  documentCount: number;
  alertActive: boolean;
}

export interface TarefaProcesso {
  numero: string;
  classificacao: string;
}

export interface TarefaCriacao {
  data: string;
  unidadeUsuario: string;
}

export interface TarefaAtribuicao {
  atribuidoA: string;
  data: string;
}

export interface TarefaAgendamento {
  agendada: boolean;
  dataPrazo: string;
}

/** Shape completo de uma tarefa consolidada. */
export interface Tarefa {
  id: string;
  processoId: string;
  titulo: string;
  tipo: string;
  statusAtribuicao: TarefaStatusAtribuicao;
  status: TarefaStatusAtribuicao;
  situacao: TarefaSituacao;
  processo: TarefaProcesso;
  dados: TarefaDados;
  criacao: TarefaCriacao;
  atribuicao: TarefaAtribuicao;
  agendamento: TarefaAgendamento;
  chips: Chip[];
  indicadores: TarefaIndicadores;
}

export const TAREFA_MODEL_VERSION = 1;
