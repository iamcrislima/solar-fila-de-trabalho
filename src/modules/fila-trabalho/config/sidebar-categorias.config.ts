// Configuração de seções da sidebar da Fila de Trabalho.
// Esta config é específica do módulo fila-trabalho — não pertence ao shell global.

export const sidebarCategoriasConfig = {
  dados: {
    secoes: [
      {
        titulo: 'Assinaturas',
        itens: [
          { label: 'Pendentes', count: 0 },
        ],
      },
      {
        titulo: 'Processos/Documentos',
        itens: [
          { label: 'Visualização padrão',      count: 3, ativo: true },
          { label: 'Fora da fila de trabalho', count: 1              },
        ],
      },
      {
        titulo: 'Tarefas',
        itens: [
          { label: 'Visualização padrão', count: 3 },
          { label: 'Tarefas agendadas',   count: 1 },
        ],
      },
    ],
  },
};
