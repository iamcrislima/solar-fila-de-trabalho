// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURAÇÃO — FILA DE PROCESSOS (conteúdo comportamental)             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║  Contém APENAS valores comportamentais (textos, dados, controles).      ║
// ║  Cores, layout, espaçamentos e tipografia são responsabilidade dos      ║
// ║  componentes — NÃO pertencem a este arquivo.                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import {
  PROCESSO_DEFAULT_PERSONALIZACAO_ITEMS,
  PROCESSO_PERSONALIZACAO_ITEMS,
  PROCESSO_SORT_ITEMS,
} from '../../fields/processoQueueFields';

export const cardConfig = {

  // ── Textos ────────────────────────────────────────────────────────────────

  textos: {
    titulo:         'Fila de trabalho',
    subtitulo:      'Processos/Documentos',
    botaoAtualizar: 'Atualizar fila',
    tooltips: {
      exportarPdf:      'Exportar PDF',
      exportarPlanilha: 'Exportar planilha',
      configuracoes:    'Configurações',
    },
  },

  // ── Dados ─────────────────────────────────────────────────────────────────

  dados: {
    filtros: {
      cadastradoPor: ['Rafael Vitorino', 'Fernando Naim'],
    },
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
      { label: 'Visualização padrão'      },
      { label: 'Fora da fila de trabalho' },
    ],

    buscaPlaceholder:   'Palavra-chave',
    usuarioRecebimento: 'Machado de Assis',

    chipResultadosCor: 'success',

    acoes: {
      ordenar:             'Ordenar',
      filtros:             'Filtros',
      expandirRetrair:     'Expandir/Retrair',
      receber:             'Receber',
      cancelar:            'Recusar',
      encaminhar:          'Encaminhar',
      arquivar:            'Arquivar',
      historico:           'Incluir prazo',
      reagendarPrazo:          'Reagendar prazo',
      mensagemJaRecebidos:     'Alguns itens já estavam recebidos e não foram alterados.',
      mensagemRecebidos:       'O(s) processo(s)/documento(s) foram recebidos.',
      mensagemSelecaoApenasRecebidos:    'Esta ação só pode ser executada em processos/documentos recebidos.',
      mensagemSelecaoApenasNaoRecebidos: 'Esta ação só pode ser executada em processos/documentos não recebidos.',
      categorias:              'Categorias',
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
        itens: PROCESSO_SORT_ITEMS,
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

  // ── Modal de lembretes ────────────────────────────────────────────────────

  modalLembretes: {
    titulo:     'Lembretes',
    textoVazio: 'Nenhum lembrete cadastrado.',
  },

  // ── Modal de filtros ─────────────────────────────────────────────────────
  // Contém apenas os DADOS comportamentais (quais grupos/campos aparecem).
  // Textos dos botões e estilos visuais são responsabilidade do FiltersModal.

  modalFiltros: {
    dados: {
      grupos: [
        { key: 'tipo',           titulo: 'Tipo',            itens: ['Processo', 'Documento']         },
        { key: 'natureza',       titulo: 'Natureza',        itens: ['Digital', 'Físico']             },
        { key: 'encaminhamento', titulo: 'Encaminhamento',  itens: ['Encaminhado para o setor', 'Encaminhado para mim'], autoWidth: true },
        { key: 'fluxo',          titulo: 'Fluxo',           itens: ['Possui fluxo', 'Sem fluxo']     },
        { key: 'tarefas',        titulo: 'Tarefas',         itens: ['Em aberto', 'Sem tarefas']      },
        { key: 'sigilo',         titulo: 'Sigilo',          itens: ['Sim', 'Não']                    },
      ],
      // ddColCount: todas as linhas de dropdowns respeitam 3 colunas.
      // Linhas com menos de 3 campos mantêm a largura de coluna sem esticar.
      ddColCount: 3,
      ddRows: [
        ['processoDocumento', 'interessado', 'classificacao'],
        ['categoria', 'cadastradoPor', 'unidadeEncaminhamento'],
        ['unidadeAtual', 'recebidoPor'],
      ],
      ddLabels: {
        processoDocumento:     'Processo/Documento:',
        interessado:           'Interessado:',
        classificacao:         'Classificação:',
        categoria:             'Categoria:',
        cadastradoPor:         'Cadastrado por:',
        unidadeEncaminhamento: 'Unidade de encaminhamento:',
        unidadeAtual:          'Unidade atual:',
        recebidoPor:           'Usuário de recebimento:',
      },
      dateRangeRows: [
        ['dataEntrada', 'dataEncaminhamento'],
        ['prazoEncaminhamento', 'recebidoEm'],
      ],
      dateRangeLabels: {
        dataEntrada:         'Data de entrada',
        dataEncaminhamento:  'Data de encaminhamento:',
        prazoEncaminhamento: 'Prazo de encaminhamento:',
        recebidoEm:          'Prazo de recebimento',
      },
    },
  },

  // ── Itens de personalização de cards ────────────────────────────────────

  personalizacaoItems: PROCESSO_PERSONALIZACAO_ITEMS,

  defaultPersonalizacaoItems: PROCESSO_DEFAULT_PERSONALIZACAO_ITEMS,

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

  // ── Modal de prazo ────────────────────────────────────────────────────────

  modalPrazo: {

    textos: {
      tituloAgendar:   'Agendar prazo',
      tituloReagendar: 'Reagendar prazo',
      colunas: {
        processoDocumento: 'Processo/Documento',
        dataReferencia:    'Data referência',
        numDias:           'Nº de dias',
        fimPrazo:          'Fim do prazo*',
      },
      campos: {
        dataReferencia: 'Data referência',
        numDias:        'Nº de dias',
        fimPrazo:       'Fim do prazo*',
      },
      opcoes: {
        permanecer: 'Permanecer na fila de trabalho',
        retornar:   'Retornar para fila de trabalho no término do prazo',
      },
      botoes: {
        cancelar: 'Cancelar',
        salvar:   'Salvar',
      },
      mensagemObrigatorio: 'Preencha os campos obrigatórios marcados com *.',
    },

  },

};
