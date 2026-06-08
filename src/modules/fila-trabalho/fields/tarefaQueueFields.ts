export const TAREFA_LABELS = {
  titulo: 'Tipo de tarefa',
  processoDocumento: 'Processo/Documento',
  detalhamento: 'Detalhamento',
  dataCriacao: 'Data criação',
  uniUsrCriacao: 'Uni/Usr Criação',
  responsaveis: 'Responsáveis',
  interessado: 'Interessado',
  atribuidoA: 'Atribuído a',
  dataAtribuicao: 'Data de atribuição',
  dataPrazo: 'Data prazo',
  classificacao: 'Classificação',
  prazoAgendamento: 'Prazo agendamento',
};

export const TAREFA_FIELD_DEFS = [
  {
    id: 'detalhamento',
    fieldId: 'detalhamento',
    label: 'Detalhamento',
    previewLabel: 'Detalhamento',
    path: 'dados.detalhamento',
    cardArea: 'fields',
    defaultVisible: true,
    filterable: false,
    sortable: true,
  },
  {
    id: 'data-criacao',
    fieldId: 'dataCriacao',
    label: TAREFA_LABELS.dataCriacao,
    previewLabel: 'Data criação',
    path: 'criacao.data',
    cardArea: 'fields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'uni-usr-criacao',
    fieldId: 'uniUsrCriacao',
    label: TAREFA_LABELS.uniUsrCriacao,
    previewLabel: 'Uni/Usr Cria.',
    path: 'criacao.unidadeUsuario',
    cardArea: 'fields',
    defaultVisible: true,
    filterKey: 'uniUsrCriacao',
    filterable: true,
    sortable: true,
  },
  {
    id: 'responsaveis',
    fieldId: 'responsaveis',
    label: TAREFA_LABELS.responsaveis,
    previewLabel: 'Responsáveis',
    path: 'dados.responsaveis',
    cardArea: 'fields',
    defaultVisible: true,
    filterKey: 'responsaveis',
    filterable: true,
    sortable: true,
  },
  {
    id: 'interessado',
    fieldId: 'interessado',
    label: 'Interessado',
    previewLabel: 'Interessado',
    path: 'dados.interessado',
    cardArea: 'extraFields',
    defaultVisible: true,
    filterKey: 'interessado',
    filterable: true,
    sortable: true,
  },
  {
    id: 'atribuido-a',
    fieldId: 'atribuidoA',
    label: TAREFA_LABELS.atribuidoA,
    previewLabel: 'Atribuído a',
    path: 'atribuicao.atribuidoA',
    cardArea: 'extraFields',
    defaultVisible: true,
    filterKey: 'atribuidoA',
    filterable: true,
    sortable: true,
  },
  {
    id: 'data-atribuicao',
    fieldId: 'dataAtribuicao',
    label: TAREFA_LABELS.dataAtribuicao,
    previousLabels: ['Data atribuição', 'Data de atribuição'],
    previewLabel: 'Data atrib.',
    path: 'atribuicao.data',
    cardArea: 'extraFields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'data-prazo',
    fieldId: 'dataPrazo',
    label: 'Data prazo',
    previewLabel: 'Data prazo',
    path: 'agendamento.dataPrazo',
    cardArea: 'extraFields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'classificacao',
    fieldId: 'classificacao',
    label: TAREFA_LABELS.classificacao,
    previewLabel: 'Classif.',
    path: 'processo.classificacao',
    cardArea: 'extraFields',
    defaultVisible: false,
    filterKey: 'classificacao',
    filterable: true,
    sortable: true,
  },
  {
    // Valor injetado via fieldOverrideMap ao executar "Agendar".
    // Origem: agendamentoMap — data de início agendado definida pelo usuário.
    // Expiração/remoção automática é responsabilidade do backend.
    id: 'prazo-agendamento',
    fieldId: 'prazoAgendamento',
    label: TAREFA_LABELS.prazoAgendamento,
    previewLabel: 'Prazo agend.',
    path: '',
    cardArea: 'extraFields',
    defaultVisible: false,
    sortable: false,
  },
];

export const TAREFA_PERSONALIZACAO_ITEMS = TAREFA_FIELD_DEFS.map(field => ({
  id: field.id,
  label: field.id === 'classificacao' ? 'Classificação (Processo/Documento)'
       : field.id === 'interessado'   ? 'Interessado (Processo/Documento)'
       : field.label,
  previewLabel: field.previewLabel,
  dataKey: field.label,
  fieldId: field.fieldId,
  path: field.path,
  aliases: field.previousLabels ?? [],
}));

export const TAREFA_DEFAULT_PERSONALIZACAO_ITEMS = TAREFA_FIELD_DEFS
  .filter(field => field.defaultVisible)
  .map(field => field.id);

export const TAREFA_SORT_ITEMS = [
  { label: TAREFA_LABELS.titulo, dataKey: 'processNumber', selecionado: true },
  ...[...TAREFA_FIELD_DEFS]
    .filter(field => field.sortable)
    .map(field => ({
      label: field.label,
      dataKey: `${field.cardArea}:${field.label}`,
      fieldId: field.fieldId,
      selecionado: false,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR')),
];

export function findTaskFieldByFilterKey(filterKey: string) {
  return TAREFA_FIELD_DEFS.find(field => field.filterKey === filterKey);
}

export function findTaskFieldByLabel(label: string) {
  return TAREFA_FIELD_DEFS.find(field =>
    field.label === label || (field.previousLabels ?? []).includes(label)
  );
}
