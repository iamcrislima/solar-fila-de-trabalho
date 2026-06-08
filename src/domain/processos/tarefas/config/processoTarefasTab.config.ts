import { PROCESSO_TAREFA_CARD_FIELDS } from '../fields/processoTarefaCardFields';
import { TAREFA_SITUACAO_LEGEND } from './tarefaSituacao.config';

interface FilterField {
  id: string;
  label: string;
  fieldId: string;
  type?: string;
  source?: string;
}

interface DateRangeField {
  id: string;
  label: string;
  fieldId: string;
}

export const PROCESSO_TAREFAS_TAB_FILTER_FIELDS: FilterField[] = [
  { id: 'tipoDeTarefa',  label: 'Tipo de tarefa:',             fieldId: 'tipoDeTarefa',  type: 'text' },
  { id: 'situacao',      label: 'Situação:',                   fieldId: 'situacao',      source: 'situacao' },
  { id: 'categoria',     label: 'Categoria:',                  fieldId: 'categoria',     type: 'text' },
  { id: 'atribuidoA',    label: 'Atribuído a:',                fieldId: 'atribuidoA',    type: 'text' },
  { id: 'uniUsrCriacao', label: 'Unidade/Usuário de criação:', fieldId: 'uniUsrCriacao', type: 'text' },
  { id: 'responsaveis',  label: 'Responsáveis:',               fieldId: 'responsaveis',  type: 'text' },
];

export const PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS: DateRangeField[] = [
  { id: 'dataCriacao',    label: 'Data de criação:',   fieldId: 'dataCriacao' },
  { id: 'dataPrazo',      label: 'Data prazo:',         fieldId: 'dataPrazo' },
  { id: 'dataAtribuicao', label: 'Data de atribuição:', fieldId: 'dataAtribuicao' },
];

export const PROCESSO_TAREFAS_TAB_FILTER_ROWS: string[][] = [
  ['tipoDeTarefa', 'situacao', 'categoria'],
  ['atribuidoA', 'uniUsrCriacao', 'responsaveis'],
];

export const PROCESSO_TAREFAS_TAB_DD_COL_COUNT = 3;

export const PROCESSO_TAREFAS_TAB_GRUPOS = [
  { key: 'fluxo', titulo: 'Fluxo', itens: ['Possui fluxo', 'Sem fluxo'] },
];

export const PROCESSO_TAREFAS_TAB_DATE_RANGE_ROWS: string[][] = [
  ['dataCriacao', 'dataPrazo'],
  ['dataAtribuicao'],
];

export const PROCESSO_TAREFAS_TAB_FILTER_LABELS: Record<string, string> =
  PROCESSO_TAREFAS_TAB_FILTER_FIELDS.reduce<Record<string, string>>((acc, field) => {
    acc[field.fieldId] = field.label;
    return acc;
  }, {});

export const PROCESSO_TAREFAS_TAB_DATE_RANGE_LABELS: Record<string, string> =
  PROCESSO_TAREFAS_TAB_DATE_RANGE_FIELDS.reduce<Record<string, string>>((acc, field) => {
    acc[field.fieldId] = field.label;
    return acc;
  }, {});

export const PROCESSO_TAREFAS_TAB_SORT_FIELDS = PROCESSO_TAREFA_CARD_FIELDS.map((field) => ({
  id: field.fieldId,
  label: field.label,
  fieldId: field.fieldId,
}));

export const PROCESSO_TAREFAS_TAB_SITUACAO_OPTIONS = TAREFA_SITUACAO_LEGEND.map((item) => ({
  value: item.key,
  label: item.label,
}));

export const PROCESSO_TAREFAS_TAB_TOOLBAR = {
  tooltips: { ordenar: 'Ordenar', expandirRetrair: 'Expandir/Retrair', filtros: 'Filtros' },
  busca: { placeholder: 'Palavra-chave' },
};
