import type { Chip } from '../../shared.types';

export type ProcessoTipo = 'Processo' | 'Documento';
export type ProcessoNatureza = 'Digital' | 'Fisico';
export type EncaminhamentoTipo = 'Interpessoal' | 'Setorial' | string;

export interface ProcessoDados {
  orgao?: string;
  unidadeResponsavel?: string;
  dataEntrada?: string;
  autuadoEm?: string;
  interessado?: string;
  ativo?: string;
  principal?: string;
  origemAbertura?: string;
  tipoProcesso?: string;
  detalhamentoAssunto?: string;
  informacoesComplementares?: string;
  municipio?: string;
  unidadeOrigem?: string;
  cadastradoPor?: string;
  autuadoPor?: string;
  situacao?: string;
  prioritario?: string;
  controleAcesso?: string;
}

export interface ProcessoFluxo {
  possuiFluxo?: boolean;
  unidadeAtual?: string;
}

export interface ProcessoTramite {
  unidadeEncaminhamento?: string;
  dataEncaminhamento?: string;
  prazoEncaminhamento?: string;
  encaminhamento?: EncaminhamentoTipo;
  usuarioDestinatario?: string;
}

export interface ProcessoRecebimento {
  recebidoEm?: string;
  recebidoPor?: string;
  unidadeRecebimento?: string;
}

export interface ProcessoIndicadores {
  possuiFluxo?: boolean;
  possuiRestricao?: boolean;
  tarefasPendentes?: boolean;
  lembretes?: boolean;
  documentCount?: number;
}

export type ProcessoLembreteOrigem = 'manual' | 'sistema';

export interface ProcessoLembrete {
  id: string;
  texto: string;
  destaque: boolean;
  origem?: ProcessoLembreteOrigem;
  criadoEm?: string;
  autor?: string;
}

export interface ProcessoComplementos {
  chips?: Chip[];
  lembretes?: Array<ProcessoLembrete | string>;
}

/** Shape da entrada antes de compor o ProcessoDigital completo. */
export interface ProcessoBase {
  id: string;
  numero: string;
  classificacao: string;
  tipo: ProcessoTipo;
  natureza: ProcessoNatureza;
  emAndamento: boolean;
  fila?: { foraFila?: boolean; bgColor?: string; fimPrazoInterno?: string };
}

/** Shape completo de um processo digital consolidado com todos os sub-objetos. */
export interface ProcessoDigital extends Omit<ProcessoBase, 'fila'> {
  dados: ProcessoDados;
  fluxo: ProcessoFluxo;
  tramite: ProcessoTramite;
  recebimento: ProcessoRecebimento;
  indicadores: ProcessoIndicadores;
  chips: Chip[];
  lembretes: ProcessoLembrete[];
  foraFila: boolean;
  bgColor?: string;
}

export const PROCESSO_DIGITAL_MODEL_VERSION = 1;
