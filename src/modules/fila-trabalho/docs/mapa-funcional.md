# Mapa Funcional — Fila de Trabalho

**Módulo:** `src/modules/fila-trabalho/`
**Atualizado em:** 2026-06

> Para localizar os arquivos de uma funcionalidade, use Glob/Grep — o nome do componente
> ou função aparece nos nomes de arquivo. Este doc existe para responder o que ferramentas
> não respondem: o propósito, as decisões de design e as regras que governam cada área.
>
> **Manutenção obrigatória:** ao criar nova tela, modal ou fluxo, adicionar uma entrada aqui.

---

## Índice

1. [Fila de Processos/Documentos](#1-fila-de-processosdocumentos)
2. [Fila de Tarefas](#2-fila-de-tarefas)
3. [Card de Processo](#3-card-de-processo)
4. [Card de Tarefa](#4-card-de-tarefa)
5. [Painel lateral de tarefa](#5-painel-lateral-de-tarefa)
6. [Painel de detalhe de processo (overlay)](#6-painel-de-detalhe-de-processo-overlay)
7. [Modal de filtros](#7-modal-de-filtros)
8. [Visualizações personalizadas](#8-visualizações-personalizadas)
9. [Personalizar campos do card](#9-personalizar-campos-do-card)
10. [Categorias e Tags](#10-categorias-e-tags)
11. [Fora da fila / Prazo de processos](#11-fora-da-fila--prazo-de-processos)
12. [Agendar / Reagendar tarefa](#12-agendar--reagendar-tarefa)
13. [Receber processos](#13-receber-processos)
14. [Atribuir / Desatribuir tarefa](#14-atribuir--desatribuir-tarefa)
15. [Lembretes do processo](#15-lembretes-do-processo)
16. [Estrutura compartilhada (WorkQueue)](#16-estrutura-compartilhada-workqueue)

---

## 1. Fila de Processos/Documentos

Lista os processos em andamento atribuídos ao usuário/setor. Permite filtrar, ordenar, paginar, selecionar em lote, fixar, expandir cards e abrir o detalhe de um processo.

**Navegação:** não usa React Router — renderizada quando `activeFeatureId === 'fila.trabalho'` em `App.tsx`. `Processos/Documentos` e `Tarefas` são abas internas do `FilaModule`, não rotas separadas.

**Decisões de design:**
- O estado de filtros aplicados vive no `CustomViewsProvider`, não em estado local da página — isso permite persistir os filtros ao navegar entre processos e tarefas
- `fieldOverrideMap` (`Map<cardId, Record<label, valor>>`) sobrescreve campos de exibição após ações (ex.: recebimento) sem alterar o dado no domínio
- `processBgColorMap` controla o estado de recebimento visual: branco = recebido, cinza = não recebido
- A filtragem (keyword + filtros aplicados) acontece na própria página via `processMatchesAppliedFilters()` e `processMatches()`, não no selector

**Regras:** `regras-fila-trabalho.md` — seção Fila de Processos

---

## 2. Fila de Tarefas

Lista as tarefas do usuário/setor. Permite filtrar, ordenar, paginar, atribuir/desatribuir, agendar, expandir cards e abrir o painel lateral de detalhes.

**Decisões de design:**
- `effectiveFieldOverrideMap` combina `fieldOverrideMap` local com `assignmentMap` do `TarefasProvider` — campos de atribuição são sobrepostos dinamicamente sem mutar o dado original
- `agendadasIds` e `agendamentoMap` controlam o estado de agendamento em memória
- A aba "Tarefas agendadas" é uma **visualização filtrada** da mesma lista, não uma tela ou fetch separado

**Regras:** `regras-fila-trabalho.md` — seção Fila de Tarefas

---

## 3. Card de Processo

Componente visual de um processo na fila. Exibe número, classe, campos configuráveis, chips de categoria, ícones de status e estados de expansão/seleção.

**Decisões de design:**
- `fields` = primeiros 4 campos visíveis; `extraFields` = campos adicionais revelados na expansão
- `bgColor` no card indica estado de recebimento — não é estilização, é dado funcional
- `statusActions[assignment].onClick` abre o `ProcessoDetalhePanel` diretamente na aba de tarefas (tab index 3)
- Os ícones de status (`groups`, `library_books`, `lock`, `assignment`, `warning`) são gerados no adapter, não no componente

---

## 4. Card de Tarefa

Componente visual de uma tarefa na fila. Exibe título, processo vinculado, campos configuráveis, chips, indicador de fluxo e estado de atribuição.

**Decisões de design:**
- Cor de fundo é funcional: branco (`colors.surface.xxxl`) = atribuída; azul claro (`colors.primary.xxl`) = não atribuída
- `possuiFluxo` é derivado cruzando a tarefa com `processosRelacionados` — não vem do dado bruto
- `compact = true` quando o painel lateral está aberto, para economizar espaço horizontal

---

## 5. Painel lateral de tarefa

Painel deslizante à direita que abre ao clicar em uma tarefa. Exibe detalhes e ações (atribuir, desatribuir, agendar, editar, cancelar).

**Decisões de design:**
- A tarefa selecionada persiste visualmente (`selectedTaskId`) mesmo após fechar o painel — referência ao retornar do overlay de processo
- Ao abrir o overlay de processo a partir do painel, o painel fecha e `processOverlaySourceTaskId` é gravado para restaurar a seleção ao fechar o overlay
- O dropdown de categorias dentro do painel aplica tags **apenas à tarefa aberta**, não às selecionadas

---

## 6. Painel de detalhe de processo (overlay)

Overlay de tela cheia com o detalhe completo de um processo. Acessível da fila de processos (clique no card) e da fila de tarefas (botão "ver processo"). Tem navegação prev/next entre processos.

**Decisões de design:**
- O componente vive em `modules/solar/processos/` — pertence ao módulo Solar, não ao fila-trabalho
- A lista de navegação prev/next é montada diferente por contexto: na fila de processos usa `sortedProcessos`; na fila de tarefas usa `processNavListTarefas` (processos únicos na ordem das tarefas visíveis)

**Regras:** `src/modules/solar/processos/docs/regras-lembretes-processo.md`

---

## 7. Modal de filtros

Um único componente (`FiltersModal`) usado em ambas as filas com configuração diferente. Suporta "filtros travados" quando uma visualização personalizada está ativa.

**Decisões de design:**
- `lockedFilters` trava as chaves da visualização ativa — o usuário só adiciona filtros extras, nunca remove os da visualização
- Estado pendente (`pendingFilters`) vive localmente enquanto o modal está aberto; ao confirmar, copia para `appliedFilters` via `CustomViewsProvider`
- A configuração de grupos/campos vem do `config.processos.ts` ou `config.tarefas.ts` — o modal não sabe qual fila está usando

**Regras:** `regras-fila-trabalho.md` — seções Fila de Processos e Fila de Tarefas

---

## 8. Visualizações personalizadas

Permite criar visualizações nomeadas com filtros pré-aplicados. Podem ser fixadas na sidebar. Ao ativar, os filtros da visualização ficam travados.

**Decisões de design:**
- Todo estado de visualização (`customViews`, `pinnedSidebarViews`, `activeViewLabel`, `activeViewBaseFilters`, `appliedFilters`) vive no `CustomViewsProvider` — é compartilhado entre processos e tarefas
- Criar e editar usam o mesmo modal (`VisualizacaoPersonalizadaModal`), diferenciado pelas props `initialView` e `onDelete`

**Regras:** `regras-fila-trabalho.md` — seção Visualizações Personalizadas

---

## 9. Personalizar campos do card

Modal que permite escolher quais campos são exibidos nos cards (campos principais e extras). A seleção é salva localmente.

**Decisões de design:**
- O estado de personalização (`savedPersonalizacao`) é local à página (processos ou tarefas) — não é compartilhado entre filas
- A aplicação usa `resolveDisplayFields()` em `workQueueUtils.ts` que combina a personalização com o `fieldOverrideMap`
- Os itens disponíveis vêm de `cardConfig.personalizacaoItems`; o padrão inicial de `cardConfig.defaultPersonalizacaoItems`

---

## 10. Categorias e Tags

Sistema de etiquetas (chips coloridos) aplicáveis aos cards. Há tags externas (pré-definidas) e tags pessoais (criadas pelo usuário).

**Decisões de design:**
- Todo o estado vive no `CategoriasProvider` (transversal — compartilhado entre processos e tarefas)
- `getChipsMap(context)` retorna o mapa de chips por contexto (`'processos'` ou `'tarefas'`) — o mesmo provider serve os dois, separados por chave
- `countTagUsage(label)` existe para o modal de gerenciamento mostrar quantos cards usam cada tag antes de excluir
- A regra de contraste/contorno de cores de tags está centralizada em `tagColorVisual.ts` — nunca duplicar essa lógica

**Regras:** `regras-fila-trabalho.md` — seção Categorias e Tags

---

## 11. Fora da fila / Prazo de processos

Move processos para uma visualização "Fora da fila de trabalho" com data de retorno. Reagendar permite alterar ou cancelar o prazo.

**Decisões de design:**
- `foraFilaIds: Set<string>` controla quais processos estão fora da fila — é estado local da página, não do domínio
- A visualização "Fora da fila" é apenas um filtro local (`isForaFila = visualizacao === 'Fora da fila de trabalho'`), não uma tela separada
- Ao incluir prazo, um chip visual é adicionado ao `processChipsMap` com o texto de `cardConfig.modalPrazo.textos.chipAguardando`

---

## 12. Agendar / Reagendar tarefa

Fluxo análogo ao prazo de processos, mas para tarefas. Move para "Tarefas agendadas" com data de prazo.

**Decisões de design:**
- Estrutura espelhada ao prazo de processos: `agendadasIds`, `agendamentoMap`, visualização filtrada
- `handleSaveAgendamento` atualiza também o `fieldOverrideMap` para que o campo de data seja exibido no card imediatamente, sem esperar refetch

---

## 13. Receber processos

Ação em lote que marca processos como recebidos. Muda o fundo do card de cinza para branco.

**Decisões de design:**
- Não altera o dado no domínio — usa `fieldOverrideMap` para sobrescrever `recebidoEm` e `recebidoPor` localmente
- O usuário simulado vem de `cardConfig.controles.usuarioRecebimento` no config da fila

---

## 14. Atribuir / Desatribuir tarefa

Atribui ou remove a atribuição de tarefas selecionadas ao usuário logado.

**Decisões de design:**
- O estado de atribuição vive no `TarefasProvider` (transversal) — `atribuirTarefa()`, `desatribuirTarefa()`, `isTarefaAtribuida()`
- A cor de fundo do card muda imediatamente via `fieldOverrideMap` — não espera refetch
- `mergeTarefaAssignment()` combina a tarefa original com o estado de atribuição atual antes de renderizar

---

## 15. Lembretes do processo

Modal com os lembretes associados a um processo. Acessível via ícone `warning` no cabeçalho do card.

**Decisões de design:**
- `alertActive` no `WorkQueueCard` é derivado no adapter a partir de `processo.indicadores.lembretes` — não é campo nativo do mock
- As regras de exibição de lembretes estão no módulo Solar, não no fila-trabalho

**Regras:** `src/modules/solar/processos/docs/regras-lembretes-processo.md`

---

## 16. Estrutura compartilhada (WorkQueue)

Componente que provê layout, toolbar, paginação, tabs, ordenação, busca e slots de painel lateral/overlay para ambas as filas.

**Decisões de design:**
- `WorkQueue` não conhece regra de processo nem de tarefa — recebe tudo via props (`renderItem`, `displayedItems`, `sidePanelOpen`, `overlayPanelOpen`, etc.)
- Há apenas uma Fila de Trabalho: `Processos/Documentos` e `Tarefas` são variações de contexto, não telas diferentes. O que varia: dados, cards, ações, filtros, labels. O que não varia: estrutura de layout, spacing, toolbar, paginação
- Config de contexto controla **conteúdo e comportamento** — nunca layout, padding, gap ou cores estruturais

---

## Dependências entre módulos

| Funcionalidade | Vem de |
|---|---|
| Dados de processos | `domain/processos/` → adapter → selector |
| Dados de tarefas | `domain/processos/tarefas/` → adapter → selector |
| Detalhe de processo | `modules/solar/processos/` |
| Chips/tags dos cards | `application/providers/CategoriasProvider` |
| Atribuição de tarefas | `application/providers/TarefasProvider` |
| Visualizações e filtros | `modules/fila-trabalho/providers/CustomViewsProvider` |
| Utilitários de filtro | `domain/filtros/filterModel`, `domain/filtros/dateRange` |
