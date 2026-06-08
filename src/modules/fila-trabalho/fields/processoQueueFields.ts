export const PROCESSO_LABELS = {
  numero: 'Número',
  classificacao: 'Classificação',
  unidadeEncaminhamento: 'Unidade de origem',
  dataEncaminhamento: 'Data encam.',
  prazoEncaminhamento: 'Prazo encam.',
  unidadeAtual: 'Unidade atual',
  detalhamentoAssunto: 'Assunto',
  interessado: 'Interessado',
  recebidoEm: 'Data recebimento',
  recebidoPor: 'Usuário',
  cadastradoPor: 'Cadastrado por',
  dataEntrada: 'Data de entrada',
  prazoAgendamento: 'Prazo agendamento',
};

export const PROCESSO_FIELD_DEFS = [
  {
    id: 'unidade-encaminhamento',
    fieldId: 'unidadeEncaminhamento',
    label: PROCESSO_LABELS.unidadeEncaminhamento,
    previousLabels: ['Unidade de encaminhamento', 'Unidade encaminhamento'],
    previewLabel: 'Uni. encam.',
    path: 'tramite.unidadeEncaminhamento',
    cardArea: 'fields',
    defaultVisible: true,
    filterKey: 'unidadeEncaminhamento',
    filterable: true,
    sortable: true,
  },
  {
    id: 'data-encaminhamento',
    fieldId: 'dataEncaminhamento',
    label: PROCESSO_LABELS.dataEncaminhamento,
    previousLabels: ['Data de encaminhamento', 'Data encaminhamento', 'Data'],
    previewLabel: 'Data encam.',
    path: 'tramite.dataEncaminhamento',
    cardArea: 'fields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'prazo-encaminhamento',
    fieldId: 'prazoEncaminhamento',
    label: PROCESSO_LABELS.prazoEncaminhamento,
    previousLabels: ['Prazo de encaminhamento', 'Prazo encaminhamento', 'Prazo'],
    previewLabel: 'Prazo encam.',
    path: 'tramite.prazoEncaminhamento',
    cardArea: 'fields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'unidade-atual',
    fieldId: 'unidadeAtual',
    label: PROCESSO_LABELS.unidadeAtual,
    previousLabels: ['Unidade atual'],
    previewLabel: 'Unid. atual',
    path: 'fluxo.unidadeAtual',
    cardArea: 'fields',
    defaultVisible: true,
    filterKey: 'unidadeAtual',
    filterable: true,
    sortable: true,
  },
  {
    id: 'detalhamento',
    fieldId: 'detalhamentoAssunto',
    label: PROCESSO_LABELS.detalhamentoAssunto,
    previousLabels: ['Detalhamento', 'Detalhamento do assunto'],
    previewLabel: 'Detalhamento',
    path: 'dados.detalhamentoAssunto',
    cardArea: 'extraFields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'interessado',
    fieldId: 'interessado',
    label: PROCESSO_LABELS.interessado,
    previewLabel: 'Interessado',
    path: 'dados.interessado',
    cardArea: 'extraFields',
    defaultVisible: true,
    filterKey: 'interessado',
    filterable: true,
    sortable: true,
  },
  {
    id: 'data-recebimento',
    fieldId: 'recebidoEm',
    label: PROCESSO_LABELS.recebidoEm,
    previousLabels: ['Recebido em', 'Data recebimento'],
    previewLabel: 'Data receb.',
    path: 'recebimento.recebidoEm',
    cardArea: 'extraFields',
    defaultVisible: true,
    sortable: true,
  },
  {
    id: 'usuario-recebimento',
    fieldId: 'recebidoPor',
    label: PROCESSO_LABELS.recebidoPor,
    previousLabels: ['Recebido por', 'Usuario recebimento', 'Usuario de recebimento', 'Usuário recebimento', 'Usuário de recebimento'],
    previewLabel: 'Usuário receb.',
    path: 'recebimento.recebidoPor',
    cardArea: 'extraFields',
    defaultVisible: true,
    filterKey: 'recebidoPor',
    filterable: true,
    sortable: true,
  },
  {
    id: 'cadastrado-por',
    fieldId: 'cadastradoPor',
    label: PROCESSO_LABELS.cadastradoPor,
    previewLabel: 'Cad. por',
    path: 'dados.cadastradoPor',
    cardArea: 'extraFields',
    defaultVisible: false,
    filterKey: 'cadastradoPor',
    filterable: true,
    sortable: true,
  },
  {
    id: 'data-entrada',
    fieldId: 'dataEntrada',
    label: PROCESSO_LABELS.dataEntrada,
    previewLabel: 'Data entrada',
    path: 'dados.dataEntrada',
    cardArea: 'extraFields',
    defaultVisible: false,
    sortable: true,
  },
  {
    // Valor injetado via fieldOverrideMap ao executar "Incluir prazo".
    // Origem: prazoInternoMap — prazo interno definido pelo setor receptor.
    // Expiração/remoção automática é responsabilidade do backend.
    id: 'prazo-agendamento',
    fieldId: 'prazoAgendamento',
    label: PROCESSO_LABELS.prazoAgendamento,
    previewLabel: 'Prazo agend.',
    path: '',
    cardArea: 'extraFields',
    defaultVisible: false,
    sortable: false,
  },
];

export const PROCESSO_PERSONALIZACAO_ITEMS = PROCESSO_FIELD_DEFS
  .map(field => ({
    id: field.id,
    label: field.label,
    previewLabel: field.previewLabel,
    dataKey: field.label,
    fieldId: field.fieldId,
    path: field.path,
    aliases: field.previousLabels ?? [],
  }));

export const PROCESSO_DEFAULT_PERSONALIZACAO_ITEMS = PROCESSO_FIELD_DEFS
  .filter(field => field.defaultVisible)
  .map(field => field.id);

export const PROCESSO_SORT_ITEMS = [
  { label: 'Número', dataKey: 'processNumber', selecionado: false },
  ...[...PROCESSO_FIELD_DEFS]
    .filter(field => field.sortable)
    .map(field => ({
      label: field.label,
      dataKey: `${field.cardArea}:${field.label}`,
      fieldId: field.fieldId,
      selecionado: false,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR')),
];

export function findProcessFieldByFilterKey(filterKey: string) {
  return PROCESSO_FIELD_DEFS.find(field => field.filterKey === filterKey);
}

export function findProcessFieldByLabel(label: string) {
  return PROCESSO_FIELD_DEFS.find(field =>
    field.label === label || (field.previousLabels ?? []).includes(label)
  );
}
