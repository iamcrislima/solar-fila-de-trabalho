export interface ProcessoTarefaCardField {
  id: string;
  fieldId: string;
  label: string;
  path: string;
}

export const PROCESSO_TAREFA_CARD_FIELDS: ProcessoTarefaCardField[] = [
  { id: 'tipo-tarefa',     fieldId: 'tipoDeTarefa',  label: 'Tipo de tarefa',  path: 'tipo' },
  { id: 'categoria',       fieldId: 'categoria',     label: 'Categoria',       path: 'dados.categoria' },
  { id: 'detalhamento',    fieldId: 'detalhamento',  label: 'Detalhamento',    path: 'dados.detalhamento' },
  { id: 'data-criacao',    fieldId: 'dataCriacao',   label: 'Data criação',    path: 'criacao.data' },
  { id: 'uni-usr-criacao', fieldId: 'uniUsrCriacao', label: 'Uni/Usr Criação', path: 'criacao.unidadeUsuario' },
  { id: 'responsaveis',    fieldId: 'responsaveis',  label: 'Responsáveis',    path: 'dados.responsaveis' },
  { id: 'interessado',     fieldId: 'interessado',   label: 'Interessado',     path: 'dados.interessado' },
  { id: 'atribuido-a',     fieldId: 'atribuidoA',    label: 'Atribuído a',     path: 'atribuicao.atribuidoA' },
  { id: 'data-atribuicao', fieldId: 'dataAtribuicao',label: 'Data atribuição', path: 'atribuicao.data' },
  { id: 'data-prazo',      fieldId: 'dataPrazo',     label: 'Data prazo',      path: 'agendamento.dataPrazo' },
];
