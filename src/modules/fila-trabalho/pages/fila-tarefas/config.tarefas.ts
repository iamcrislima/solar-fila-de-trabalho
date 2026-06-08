// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURAÇÃO — FILA DE TAREFAS (conteúdo comportamental)               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║  Contém APENAS valores comportamentais (textos, dados, controles).      ║
// ║  Cores, layout, espaçamentos e tipografia são responsabilidade dos      ║
// ║  componentes — NÃO pertencem a este arquivo.                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import {
  TAREFA_DEFAULT_PERSONALIZACAO_ITEMS,
  TAREFA_PERSONALIZACAO_ITEMS,
  TAREFA_SORT_ITEMS,
} from '../../fields/tarefaQueueFields';

export const tarefasConfig = {

  // ── Textos ────────────────────────────────────────────────────────────────

  textos: {
    titulo:         'Fila de trabalho',
    subtitulo:      'Tarefas',
    botaoAtualizar: 'Atualizar fila',
    tooltips: {
      exportarPdf:      'Exportar PDF',
      exportarPlanilha: 'Exportar planilha',
      configuracoes:    'Configurações',
    },
  },

  // ── Dados ─────────────────────────────────────────────────────────────────

  dados: {
    filtros: {},
    paginacao: {
      totalRegistros: 14,
      page:           1,
      pageSize:       20,
    },
  },

  // ── Controles da barra de ações ──────────────────────────────────────────

  controles: {
    visualizacaoValor:  'Visualização padrão',
    visualizacaoOpcoes: [
      { label: 'Visualização padrão' },
      { label: 'Tarefas agendadas'   },
    ],

    chipResultadosCor: 'success',
    usuarioAtribuicao: 'Machado de Assis',

    acoes: {
      ordenar:               'Ordenar',
      filtros:               'Filtros',
      expandirRetrair:       'Expandir/Retrair',
      atribuir:              'Atribuir',
      desatribuir:           'Desatribuir',
      rejeitar:              'Rejeitar',
      agendar:               'Agendar',
      reagendar:             'Reagendar',
      categorias:            'Categorias',
      mensagemAtribuidas:      'A(s) tarefa(s) foram atribuídas.',
      mensagemJaAtribuidas:    'Alguns itens já estavam atribuídos e não foram alterados.',
      mensagemDesatribuidas:   'A(s) tarefa(s) foram desatribuídas.',
      mensagemJaDesatribuidas: 'Alguns itens já estavam desatribuídos e não foram alterados.',
      mensagemSelecaoApenasNaoAtribuidas: 'Esta ação só pode ser executada em tarefas não atribuídas.',
    },

    categoriasDropdown: {
      tooltipIcones: {
        groups: 'Tag de setor',
        person: 'Tag pessoal',
        account_balance: 'Tag de órgão',
      },
      acoes: ['Aplicar tag', 'Criar tag pessoal', 'Gerenciar tags'],
    },

    ordenacao: [
      {
        titulo: 'CLASSIFICAR POR',
        itens: TAREFA_SORT_ITEMS,
      },
      {
        titulo: 'ORDENAR POR',
        itens: [
          { label: 'Crescente',   selecionado: true  },
          { label: 'Decrescente', selecionado: false },
        ],
      },
    ],
  },

  // ── Modal de filtros ─────────────────────────────────────────────────────

  modalFiltros: {
    dados: {
      // Fluxo aparece como grupo no topo (node 2090:6818)
      grupos: [
        { key: 'fluxo', titulo: 'Fluxo', itens: ['Possui fluxo', 'Sem fluxo'] },
      ],
      // ddColCount: 3 cols — linha com 2 campos mantém largura de 1/3 sem esticar
      ddColCount: 3,
      ddRows: [
        ['processoDocumento', 'classificacao', 'interessado'],
        ['atribuidoA', 'responsaveis', 'uniUsrCriacao'],
        ['categoria', 'tipoTarefa'],
      ],
      ddLabels: {
        processoDocumento: 'Processo/Documento:',
        classificacao:     'Classificação:',
        interessado:       'Interessado:',
        atribuidoA:        'Atribuído a:',
        responsaveis:      'Responsáveis:',
        uniUsrCriacao:     'Unidade/Usuário de criação:',
        categoria:         'Categoria:',
        tipoTarefa:        'Tipo de tarefa:',
      },
      dateRangeRows: [
        ['dataCriacao', 'dataPrazo'],
        ['dataAtribuicao'],
      ],
      dateRangeLabels: {
        dataCriacao:    'Data de criação:',
        dataPrazo:      'Data prazo:',
        dataAtribuicao: 'Data de atribuição:',
      },
    },
  },

  // ── Itens de personalização de cards ────────────────────────────────────

  personalizacaoItems: TAREFA_PERSONALIZACAO_ITEMS,

  defaultPersonalizacaoItems: TAREFA_DEFAULT_PERSONALIZACAO_ITEMS,

  // ── Modal de personalização de cards ────────────────────────────────────

  modalPersonalizarCards: {
    textos: {
      titulo:              'Personalizar cards',
      sectionDisponivel:   'Informações disponíveis',
      subtituloDisponivel: 'Selecione até 8 opções',
      mensagemMaximo:      'Você pode selecionar no máximo 8 informações.',
      mensagemMinimo:      'Selecione ao menos 1 informação.',
      sectionCard:         'Informações no card',
      subtituloCard:       'Arraste para reordenar',
      sectionPreview:      'Preview do card (exemplo)',
      botoes: {
        desmarcarTodos: 'Desmarcar todos',
        restaurar:      'Restaurar original',
        cancelar:       'Cancelar',
        salvar:         'Salvar',
      },
    },
  },

  // ── Tarefas (dados dos cards) ─────────────────────────────────────────────

  modalAgendamento: {
    textos: {
      tituloAgendar:   'Agendar tarefa',
      tituloReagendar: 'Reagendar tarefa',
      alerta:          'Ao selecionar uma data de agendamento, a tarefa ficará ausente da fila de tarefas e retornará na data selecionada.',
      colunas: {
        tarefa:     'Tarefa',
        dataInicio: 'Data de início',
        acoes:      'Ações',
      },
      campos: {
        dataInicio: 'Informar data de início (agendar)*',
      },
      acoes: {
        removerItem: 'Remover tarefa da seleção',
      },
      botoes: {
        cancelar:           'Cancelar',
        salvar:             'Salvar',
        confirmar:          'Confirmar',
        removerAgendamento: 'Remover agendamento',
      },
      confirmacao: {
        titulo:   'Remover agendamento',
        mensagem: 'Deseja remover o(s) agendamento(s) e retornar a(s) tarefa(s) para a fila de tarefas?',
      },
      mensagemObrigatorio: 'Informe a data de início para salvar o agendamento.',
      mensagemDataPassada: 'A data de início não pode ser anterior à data de hoje.',
    },
  },

};
