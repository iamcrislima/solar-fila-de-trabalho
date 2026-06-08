# Regras de Negócio — Fila de Trabalho

**Módulo:** fila-trabalho
**Atualizado em:** 2026-06

---

## Índice

- [Fila de Processos](#fila-de-processos) — RN-FP-01 a RN-FP-10
- [Fila de Tarefas](#fila-de-tarefas) — RN-FT-01 a RN-FT-11
- [Visualizações Personalizadas](#visualizações-personalizadas) — RN-VP-01 a RN-VP-08
- [Categorias e Tags](#categorias-e-tags) — RN-CT-01 a RN-CT-10

---

## Fila de Processos

### Contexto

A Fila de Processos exibe os processos e documentos digitais que estão atualmente na unidade de trabalho do usuário, permitindo que ele execute ações sobre eles (receber, encaminhar, arquivar, categorizar, agendar prazo). É um dos dois contextos da Fila de Trabalho — o outro é a Fila de Tarefas.

### Entidades envolvidas

- `Processo` — entidade principal; possui número, classificação, unidade atual, situação e indicadores
- `Visualização` — modo de exibição ativo (padrão, fora da fila, ou personalizada)
- `Usuário` — determina quais processos aparecem, com base na sua unidade de lotação

---

### RN-FP-01: Visibilidade por unidade atual

**Descrição:** A fila de processos exibe apenas processos cuja `unidadeAtual` (campo do fluxo do processo) corresponde à unidade de lotação do usuário logado.

**Condição:** Aplica-se sempre que a fila de processos é carregada ou atualizada.

**Implementação atual (mock):** O repositório retorna todos os processos `emAndamento: true`. A filtragem por unidade está refletida apenas nos dados: todos os processos mock têm `unidadeAtual: 'SolarBPM/RH'`, que é a unidade do usuário Rafael Vitorino.

**Pendência:** Quando integrado à API, o repositório deve receber a unidade do usuário como parâmetro de filtro — a lógica de filtro não deve residir no componente.

**Casos de teste:**
- Dado repositório com processos de múltiplas unidades, quando `getProcessosEmAndamento` é chamado para usuário da unidade X, então retorna apenas processos com `unidadeAtual === X`
- Dado repositório, quando `getProcessosEmAndamento` é chamado, então não inclui processos de unidades diferentes do usuário

**Cobertura:** `pendente`

---

### RN-FP-02: Visualização "Fora da fila de trabalho"

**Descrição:** Processos podem ser movidos para "fora da fila" (prazo agendado). Esses processos não aparecem na visualização padrão e só aparecem ao selecionar a visualização "Fora da fila de trabalho".

**Condição:** O estado `foraFila` é determinado em runtime pelo conjunto `foraFilaIds`. Inicializado com processos que têm `foraFila: true` no mock; modificado pelas ações "Agendar prazo" (move para fora) e "Reagendar prazo" (retorna à fila).

**Exclusividade:** Um processo está sempre em exatamente um dos dois estados: na fila principal ou fora dela. Nunca nos dois simultaneamente.

**Casos de teste:**
- Dado processo com `foraFila: true`, quando a visualização padrão está ativa, então o processo não aparece na lista
- Dado processo com `foraFila: true`, quando a visualização "Fora da fila de trabalho" está ativa, então o processo aparece
- Dado processo na fila, quando a ação "Agendar prazo" é executada, então o processo move para `foraFila: true` e sai da visualização padrão

**Cobertura:** `pendente`

---

### RN-FP-03: Chip obrigatório "Aguardando prazo"

**Descrição:** Todo processo cujo estado é `foraFila: true` deve ter o chip "Aguardando prazo" aplicado.

**Condição:** O chip é adicionado automaticamente pela ação "Agendar prazo" (`handleSavePrazo`). No mock, os processos com `foraFila: true` já iniciam com esse chip.

**Exceção:** O chip permanece visível mesmo se o processo retornar à fila principal (o usuário pode removê-lo manualmente via categorias).

**Casos de teste:**
- Dado processo, quando `handleSavePrazo` é executado, então o chip "Aguardando prazo" é adicionado ao processo
- Dado processo com `foraFila: true` que retorna à fila via reagendamento, quando os chips são verificados, então o chip "Aguardando prazo" ainda está presente

**Cobertura:** `pendente`

---

### RN-FP-04: Abas de situação

**Descrição:** A fila de processos possui três abas que filtram por situação de recebimento:
- **Todos** — todos os processos da visualização ativa (padrão ou fora da fila)
- **Recebidos** — processos com `bgColor: '#FFFFFF'` (indicador de recebimento)
- **Não recebidos** — processos que ainda não foram recebidos

**Condição:** Os contadores de cada aba refletem os processos da visualização ativa, não o total geral.

**Comportamento:** Trocar de aba reseta a página para 1 e limpa a seleção.

**Casos de teste:**
- Dado processos com estados mistos de recebimento, quando a aba "Recebidos" é selecionada, então apenas processos com `bgColor: '#FFFFFF'` são exibidos
- Dado processos com estados mistos, quando a aba "Não recebidos" é selecionada, então apenas processos sem `bgColor: '#FFFFFF'` aparecem
- Dado usuário na página 2, quando troca de aba, então a página retorna para 1 e a seleção é limpa

**Cobertura:** `pendente`

---

### RN-FP-05: Paginação com escopo por página

**Descrição:** A paginação exibe um subconjunto dos processos filtrados. O usuário pode navegar entre páginas e alterar a quantidade de itens por página (opções: 5, 10, 15, 20).

**Comportamento de reset:** A página retorna a 1 quando qualquer um destes eventos ocorre: troca de filtro, troca de ordenação, troca de aba, troca de visualização, alteração de quantidade por página, digitação na busca por palavra-chave.

**Casos de teste:**
- Dado 12 processos filtrados e página configurada para 5 por página, quando a página 2 é exibida, então exibe apenas os processos 6 a 10
- Dado usuário na página 3, quando um novo filtro é aplicado, então a página retorna para 1
- Dado usuário na página 2, quando a ordenação é alterada, então a página retorna para 1

**Cobertura:** `pendente`

---

### RN-FP-06: Ações em lote restritas à página atual

**Descrição:** As ações em lote (receber, recusar, encaminhar, arquivar, agendar prazo, categorizar) se aplicam apenas aos processos **visíveis na página atual**, não a todos os processos filtrados.

**Comportamento:** "Selecionar todos" marca apenas os itens da página atual. Ao trocar de página, a seleção é limpa automaticamente. Após execução de uma ação, a seleção é limpa.

**Elegibilidade na aba "Todos":** Quando a seleção mistura processos recebidos e não recebidos, o sistema deve diferenciar ações parciais de ações críticas:
- **Ações parciais:** "Receber" pode executar com seleção mista, aplicando apenas aos processos não recebidos e exibindo aviso para os itens ignorados.
- **Ações críticas:** "Recusar" exige que todos os selecionados sejam não recebidos. "Encaminhar", "Arquivar" e "Incluir prazo" exigem que todos os selecionados sejam recebidos. Se houver qualquer item inelegível, a ação fica indisponível com feedback explicando a restrição.

**Rationale:** Evita que o usuário aplique ações em registros que não estão visíveis e portanto não foram intencionalmente revisados.

**Casos de teste:**
- Dado 10 processos em duas páginas (5 por página), quando o usuário clica em "Selecionar todos" na página 1, então apenas os 5 processos visíveis são selecionados
- Dado processos selecionados na página 1, quando o usuário navega para a página 2, então a seleção é limpa automaticamente
- Dado processos selecionados, quando uma ação em lote é executada, então a ação aplica-se apenas aos selecionados e a seleção é limpa após
- Dado seleção mista de processos recebidos e não recebidos na aba "Todos", quando o usuário avalia "Arquivar", "Encaminhar" ou "Incluir prazo", então a ação fica indisponível porque exige apenas processos recebidos
- Dado seleção mista de processos recebidos e não recebidos na aba "Todos", quando o usuário avalia "Recusar", então a ação fica indisponível porque exige apenas processos não recebidos

**Cobertura:** `parcial` (`src/modules/fila-trabalho/utils/workQueueUtils.test.ts`)

---

### RN-FP-07: Overlay de detalhe do processo

**Descrição:** Ao clicar no ícone de tarefas do card (ou ao abrir o detalhe do processo), o painel de detalhe abre como overlay sobrepondo a fila. O overlay exibe dados do processo, tramitações, tarefas vinculadas e dados adicionais.

**Condição:** O overlay abre diretamente na aba "Tarefas" quando acionado pelo ícone de tarefas do card.

**Comportamento:** A fila permanece montada e com estado preservado durante a exibição do overlay. Fechar o overlay retorna o usuário ao estado anterior da fila.

**Casos de teste:**
- Dado processo na fila, quando o ícone de tarefas do card é clicado, então o overlay abre diretamente na aba "Tarefas"
- Dado overlay aberto, quando o usuário fecha o overlay, então a fila retorna ao estado anterior com o mesmo filtro e seleção
- Dado overlay aberto, quando visualizado em qualquer estado, então a fila permanece montada com estado preservado

**Cobertura:** `pendente`

---

### RN-FP-08: Processo recebido

**Descrição:** A ação "Receber" marca o processo como recebido, alterando seu `bgColor` para `#FFFFFF`. Processos recebidos aparecem na aba "Recebidos".

**Condição:** Só pode receber processos que ainda não foram recebidos. Tentar receber um já recebido exibe notificação de feedback sem alteração de estado.

**Implementação atual:** O recebimento é uma operação de runtime (não persiste entre sessões, sem API).

**Casos de teste:**
- Dado processo não recebido, quando a ação "Receber" é executada, então `bgColor` muda para `'#FFFFFF'` e o processo passa a aparecer na aba "Recebidos"
- Dado processo já recebido, quando a ação "Receber" é tentada novamente, então exibe feedback sem alterar o estado
- Dado seleção mista de processos recebidos e não recebidos, quando a ação "Receber" é executada, então apenas os processos não recebidos são recebidos e os demais são ignorados com aviso

**Cobertura:** `pendente`

---

### RN-FP-09: Processos interpessoais pertencem ao usuário destinatário, não ao setor

**Descrição:** Processos com `encaminhamento === 'Interpessoal'` possuem um vínculo direto com um usuário específico (`tramite.usuarioDestinatario`). Eles devem aparecer **exclusivamente** na fila do usuário destinatário — nunca para outros usuários do mesmo setor.

**Condição:** Aplica-se na montagem da fila, na camada de repositório, antes de qualquer filtro de UI.

**Regra de filtro:**
- Processo `Setorial` → visível para todos os usuários da unidade atual do processo
- Processo `Interpessoal` → visível **apenas** se `tramite.usuarioDestinatario === usuário logado`

**Exemplo correto:**
- Processo 000006 (`Interpessoal`, destinatário: Rafael Vitorino) → aparece para Rafael
- Processo 000014 (`Interpessoal`, destinatário: João Carvalho) → NÃO aparece para Rafael

**Implementação:** A regra está em `isProcessoVisivelParaUsuario()` em `processos.repository.ts`, chamada por `getProcessosEmAndamento(nomeUsuario)`. O contexto do usuário vem de `src/domain/usuario/usuario.mock.ts` (na API real virá do contexto de autenticação).

**Impactos verificados:**
- Filtros dinâmicos da UI: constroem opções a partir do array já filtrado → automático
- Contadores do sidebar: usam o mesmo array filtrado → automático
- Paginação: opera sobre o array filtrado → automático
- Buscas/keyword: operam sobre o array filtrado → automático

**Exceção:** Não há. Mesmo processos interpessoais pendentes/não recebidos seguem esta regra.

**Casos de teste:**
- Dado processo `Interpessoal` com `tramite.usuarioDestinatario: 'Rafael Vitorino'`, quando `isProcessoVisivelParaUsuario('Rafael Vitorino')` é chamado, então retorna `true`
- Dado processo `Interpessoal` com `tramite.usuarioDestinatario: 'João Carvalho'`, quando `isProcessoVisivelParaUsuario('Rafael Vitorino')` é chamado, então retorna `false`
- Dado processo `Setorial`, quando `isProcessoVisivelParaUsuario` é chamado para usuário da mesma unidade, então retorna `true`

**Cobertura:** `pendente`

---

### RN-FP-10: Navegação Anterior/Próximo no painel de detalhe do processo

**Descrição:** O painel de detalhe de processo (`ProcessoDetalhePanel`) exibe dois botões de navegação — "Anterior" e "Próximo" — que permitem navegar sequencialmente entre os processos da fila de origem sem fechar o painel.

**Lista de navegação por origem:**
- **Fila de Processos:** a lista de navegação é `sortedProcessos` — a lista completa filtrada e ordenada conforme estado atual da fila (filtros aplicados, keyword, ordenação, aba ativa, visualização). Não se limita à página atual da paginação.
- **Fila de Tarefas:** a lista de navegação é composta pelos processos únicos referenciados pelas tarefas visíveis em `sortedTarefas`, deduplizados e na ordem em que as tarefas aparecem.

**Regras de habilitação:**
- Botão "Anterior" habilitado apenas se houver processo anterior na lista de navegação (índice > 0).
- Botão "Próximo" habilitado apenas se houver processo seguinte (índice < tamanho - 1).
- Quando desabilitados: sem ação no clique e feedback visual de indisponibilidade.

**Condição:** Aplica-se a qualquer processo aberto a partir da Fila de Trabalho. O contexto (processos vs. tarefas) determina a lista de navegação — não há mistura entre os dois contextos.

**Casos de teste:**
- Dado primeiro processo da lista aberto no painel de detalhe, quando o painel é exibido, então o botão "Anterior" está desabilitado
- Dado último processo da lista aberto no painel, quando o painel é exibido, então o botão "Próximo" está desabilitado
- Dado processo intermediário aberto, quando o botão "Próximo" é clicado, então o painel exibe o processo seguinte da `sortedProcessos`
- Dado overlay aberto a partir da fila de tarefas, quando o contexto de navegação é verificado, então usa `processNavListTarefas` como base (processos únicos das tarefas visíveis)

**Cobertura:** `pendente`

---

### Estados de um processo na fila

| Estado | Descrição | Visualização |
|---|---|---|
| Na fila, não recebido | Estado inicial padrão | Todos / Não recebidos |
| Na fila, recebido | Após ação "Receber" | Todos / Recebidos |
| Fora da fila | Após "Agendar prazo" | Fora da fila de trabalho |

---

### Distinção entre prazo interno e Prazo encaminhamento

O campo **"Prazo encaminhamento"** exibido no card do processo é um dado da **tramitação**: é o prazo definido pelo setor que encaminhou o processo no momento do encaminhamento. Ele vem de `tramite.prazoEncaminhamento` e será populado pela funcionalidade de tramitação quando implementada.

A ação **"Incluir prazo"** é um **prazo interno** do setor receptor: o setor define quando quer trabalhar no processo, o que move o processo para "Fora da fila de trabalho". A data informada nessa ação é armazenada em `prazoInternoMap` exclusivamente para pré-preencher o modal "Reagendar prazo". Ela **não altera nem aparece** no campo "Prazo encaminhamento" do card.

| Campo | Origem | Quando populado |
|---|---|---|
| `Prazo encaminhamento` (card) | `tramite.prazoEncaminhamento` | Definido pelo setor que encaminha — funcionalidade de tramitação |
| Prazo interno ("Incluir prazo") | `prazoInternoMap` (runtime) | Definido pelo setor receptor ao agendar para "Fora da fila" |

### Pendências — Fila de Processos

- A filtragem por `unidadeAtual` hoje é implícita nos dados mock. Na integração com API, deve ser um parâmetro de query no repositório.
- O estado de recebimento (`bgColor`) hoje é runtime. Na API, será um campo persistido do processo.
- A regra de "fora da fila" pode evoluir para incluir múltiplas condições além do prazo (ex: processo aguardando complementação de dados).
- `prazoEncaminhamento` nos mocks já reflete a origem correta (`tramite.prazoEncaminhamento`). Na integração com API, virá da tramitação persistida.

---

## Fila de Tarefas

### Contexto

A Fila de Tarefas exibe as tarefas operacionais do usuário: atividades pendentes que precisam ser executadas, atribuídas ao usuário ou ao seu setor. Tarefas sempre pertencem a um processo, mas a fila de tarefas tem critérios de visibilidade próprios, independentes da fila de processos.

### Entidades envolvidas

- `Tarefa` — entidade principal; possui título, tipo, status de atribuição, situação e processo vinculado
- `Processo` — processo ao qual a tarefa pertence (referência, não exibido diretamente na fila)
- `Usuário` — determina quais tarefas aparecem

---

### RN-FT-01: Visibilidade por atribuição ou unidade

**Descrição:** A fila de tarefas exibe tarefas que satisfazem ao menos uma das condições:
1. A tarefa está atribuída diretamente ao usuário logado (`atribuidoA` = nome do usuário)
2. A tarefa pertence ao setor/unidade do usuário (`dados.responsaveis` = unidade do usuário)

**Implementação atual (mock):** O repositório retorna todas as tarefas. A visibilidade está implícita nos dados: tarefas da unidade `SolarBPM/RH` ou atribuídas a `Rafael Vitorino` são as que deveriam aparecer para o usuário mockado.

**Pendência:** Na integração com API, o repositório deve aplicar esse filtro server-side.

**Casos de teste:**
- Dado tarefa com `dados.responsaveis` contendo a unidade do usuário logado, quando a fila é carregada, então a tarefa aparece
- Dado tarefa diretamente atribuída ao usuário (`atribuidoA` = nome do usuário), quando a fila é carregada, então a tarefa aparece
- Dado tarefa de outro usuário de outra unidade sem nenhuma relação com o usuário logado, quando a fila é carregada, então a tarefa não aparece

**Cobertura:** `pendente`

---

### RN-FT-02: Tarefa pode existir sem o processo na fila de processos

**Descrição:** Uma tarefa pode aparecer na fila de tarefas do usuário mesmo que o processo ao qual ela pertence não esteja na fila de processos do mesmo usuário.

**Exemplo:** Uma tarefa atribuída ao Rafael Vitorino cujo processo está atualmente na unidade `SolarBPM/COMPRAS` (diferente de `SolarBPM/RH`). A tarefa aparece na fila de tarefas; o processo não aparece na fila de processos.

**Implicação:** O painel de detalhe do processo vinculado deve funcionar mesmo que o processo não esteja na fila de processos — ele é aberto por referência direta ao `processoId`.

**Casos de teste:**
- Dado tarefa cujo processo está em unidade diferente da do usuário, quando a fila de tarefas é carregada, então a tarefa aparece
- Dado mesma situação, quando a fila de processos é verificada, então o processo da outra unidade não aparece lá

**Cobertura:** `pendente`

---

### RN-FT-03: Visualização "Tarefas agendadas"

**Descrição:** Tarefas com `agendada: true` pertencem à visualização "Tarefas agendadas". Elas não aparecem na visualização padrão ("Visualização padrão").

**Condição:** O estado `agendada` é determinado em runtime pelo conjunto `agendadasIds`. Inicializado com tarefas que têm `agendamento.agendada: true` no mock; modificado pelas ações "Agendar" e "Reagendar".

**Exclusividade:** Uma tarefa está sempre em exatamente um dos dois contextos: padrão ou agendadas. Nunca nos dois.

**Casos de teste:**
- Dado tarefa com `agendada: true`, quando a visualização padrão está ativa, então a tarefa não aparece na lista
- Dado tarefa com `agendada: true`, quando a visualização "Tarefas agendadas" está ativa, então a tarefa aparece
- Dado tarefa sem agendamento, quando a ação "Agendar" é executada, então a tarefa passa para `agendada: true` e sai da visualização padrão

**Cobertura:** `pendente`

---

### RN-FT-04: Chip obrigatório "Aguardando prazo"

**Descrição:** Toda tarefa com estado `agendada: true` deve ter o chip "Aguardando prazo" aplicado.

**Condição:** O chip é adicionado automaticamente pela ação "Agendar" (`handleSaveAgendamento`). No mock, tarefas com `agendamento.agendada: true` já iniciam com esse chip.

**Casos de teste:**
- Dado tarefa sem agendamento, quando `handleSaveAgendamento` é executado, então o chip "Aguardando prazo" é adicionado à tarefa

**Cobertura:** `pendente`

---

### RN-FT-05: Abas de atribuição

**Descrição:** A fila de tarefas possui três abas:
- **Todas** — todas as tarefas da visualização ativa
- **Atribuídas** — tarefas com `statusAtribuicao: 'atribuida'`
- **Não atribuídas** — tarefas com `statusAtribuicao: 'nao_atribuida'`

**Comportamento:** Trocar de aba reseta a página para 1 e limpa a seleção.

**Casos de teste:**
- Dado mix de tarefas atribuídas e não atribuídas, quando a aba "Atribuídas" é selecionada, então apenas tarefas com `statusAtribuicao: 'atribuida'` aparecem
- Dado mix de tarefas, quando a aba "Não atribuídas" é selecionada, então apenas tarefas com `statusAtribuicao: 'nao_atribuida'` aparecem
- Dado usuário na página 2, quando troca de aba, então a página retorna para 1 e a seleção é limpa

**Cobertura:** `pendente`

---

### RN-FT-06: Atribuição e desatribuição

**Descrição:**
- **Atribuir:** Marca a tarefa como `atribuida`, registra o nome do usuário como `atribuidoA` e a data/hora da atribuição.
- **Desatribuir:** Reverte para `nao_atribuida`, limpa `atribuidoA` e a data.

**Condição:** A ação de atribuir só se aplica a tarefas `nao_atribuidas`. Tentar atribuir uma já atribuída exibe feedback sem alteração. O inverso vale para desatribuir.

**Escopo:** Atribuição/desatribuição se aplicam às tarefas elegíveis selecionadas na página atual. Em seleção mista, a ação é executada parcialmente: tarefas elegíveis são alteradas e tarefas inelegíveis são ignoradas com aviso. Após a ação, a seleção é limpa.

**Casos de teste:**
- Dado tarefa com `statusAtribuicao: 'nao_atribuida'`, quando a ação "Atribuir" é executada, então `statusAtribuicao` muda para `'atribuida'` e `atribuidoA` recebe o nome do usuário
- Dado tarefa com `statusAtribuicao: 'atribuida'`, quando a ação "Atribuir" é tentada, então exibe feedback sem alterar estado
- Dado tarefa com `statusAtribuicao: 'atribuida'`, quando a ação "Desatribuir" é executada, então `statusAtribuicao` volta para `'nao_atribuida'` e `atribuidoA` é limpo
- Dado tarefa com `statusAtribuicao: 'nao_atribuida'`, quando a ação "Desatribuir" é tentada, então exibe feedback sem alterar estado
- Dado seleção mista de tarefas atribuídas e não atribuídas, quando "Atribuir" ou "Desatribuir" é executada, então apenas as tarefas elegíveis são alteradas e as demais são ignoradas com aviso

**Cobertura:** `parcial` (`src/modules/fila-trabalho/utils/workQueueUtils.test.ts`)

---

### RN-FT-07: Painel lateral de detalhe da tarefa

**Descrição:** Ao abrir uma tarefa, o painel de detalhe aparece à direita da lista como side panel (não overlay). A lista comprime para exibir os cards em modo compacto enquanto o painel está aberto.

**Comportamento:** Apenas uma tarefa pode estar aberta por vez. Abrir uma segunda fecha a primeira com animação de retorno.

**Condição:** Em viewports estreitos (≤ 980px), o side panel empilha sobre a lista em vez de dividir o espaço.

**Casos de teste:**
- Dado tarefa A aberta no painel lateral, quando a tarefa B é clicada, então o painel fecha A e abre B
- Dado tarefa aberta no painel e viewport ≤ 980px, quando o painel é exibido, então ele empilha sobre a lista em vez de dividir o espaço

**Cobertura:** `pendente`

---

### RN-FT-08: Abertura do processo vinculado a partir da tarefa

**Descrição:** O usuário pode abrir o processo vinculado à tarefa diretamente do painel de detalhe ou do card. O processo abre como overlay, exibindo os dados na aba "Tarefas" por padrão.

**Condição:** Se o processo vinculado não existir na lista de processos relacionados (ex: processo de outra unidade), o sistema exibe uma notificação de aviso e não abre o overlay.

**Casos de teste:**
- Dado tarefa com `processoId` presente na lista de processos relacionados, quando o usuário clica para abrir o processo, então o overlay abre na aba "Tarefas"
- Dado tarefa com `processoId` ausente da lista de processos relacionados, quando o usuário tenta abrir o processo, então exibe notificação de aviso sem abrir overlay

**Cobertura:** `pendente`

---

### RN-FT-09: Paginação e ações em lote

**Descrição:** Mesmas regras da fila de processos: paginação por página, ações em lote apenas na página atual, reset de seleção ao trocar de página.

**Ver:** [RN-FP-05](#rn-fp-05) e [RN-FP-06](#rn-fp-06).

**Elegibilidade na aba "Todas":** "Rejeitar" é uma ação crítica e só fica disponível quando todas as tarefas selecionadas são não atribuídas. "Agendar" pode ser executada tanto em tarefas atribuídas quanto não atribuídas; sua disponibilidade depende apenas da visualização ativa (padrão vs. tarefas agendadas), não do status de atribuição.

**Casos de teste:**
- Dado tarefas selecionadas na página 1, quando o usuário navega para a página 2, então a seleção é limpa automaticamente
- Dado ações em lote com múltiplas tarefas selecionadas, quando a ação é executada, então aplica-se apenas às tarefas visíveis na página atual
- Dado seleção mista de tarefas atribuídas e não atribuídas na aba "Todas", quando o usuário avalia "Rejeitar", então a ação fica indisponível porque exige apenas tarefas não atribuídas
- Dado tarefa atribuída ou não atribuída na visualização padrão, quando o usuário avalia "Agendar", então a ação permanece disponível se houver seleção

**Cobertura:** `parcial` (`src/modules/fila-trabalho/utils/workQueueUtils.test.ts`)

---

### RN-FT-10: Visibilidade por responsável ou setor do usuário

**Descrição:** A fila de tarefas exibe apenas tarefas que satisfaçam ao menos uma das condições:
1. `dados.responsaveis` contém o nome do usuário logado (ex: `'Rafael Vitorino'`)
2. `dados.responsaveis` contém o setor do usuário logado (ex: `'SolarBPM/RH'`)
3. `atribuicao.atribuidoA` é igual ao nome do usuário logado

O campo `dados.responsaveis` pode conter um único valor ou múltiplos separados por vírgula (ex: `'Rafael Vitorino, SolarBPM/RH'`).

**Condição:** Aplica-se na montagem da fila, antes de qualquer filtro de UI.

**Regra de filtro por tipo de responsável:**

| Tipo | Condição | Visível para Rafael? |
|---|---|---|
| Setor do usuário | `responsaveis` contém `'SolarBPM/RH'` | ✅ Sim |
| Nome do usuário | `responsaveis` contém `'Rafael Vitorino'` | ✅ Sim |
| Ambos | `responsaveis = 'Rafael Vitorino, SolarBPM/RH'` | ✅ Sim |
| Outro setor | `responsaveis = 'SolarBPM/JUR'` | ❌ Não |
| Atribuída ao usuário | `atribuidoA = 'Rafael Vitorino'` | ✅ Sim |

**Implementação atual (mock):** O repositório retorna todas as tarefas. A filtragem por usuário/setor está implícita nos dados mock.

**Pendência:** Na integração com API, o repositório deve aplicar esse filtro server-side com o contexto do usuário autenticado.

**Casos de teste:**
- Dado tarefa com `dados.responsaveis: 'SolarBPM/RH'`, quando verificada para usuário da unidade `SolarBPM/RH`, então é visível
- Dado tarefa com `dados.responsaveis: 'SolarBPM/JUR'`, quando verificada para usuário da unidade `SolarBPM/RH`, então não é visível
- Dado tarefa com `atribuidoA: 'Rafael Vitorino'`, quando verificada para `'Rafael Vitorino'`, então é visível independente do `responsaveis`
- Dado tarefa com `dados.responsaveis: 'Rafael Vitorino, SolarBPM/RH'`, quando verificada, então é visível por ambas as condições

**Cobertura:** `pendente`

---

### RN-FT-11: Indicador de fluxo nos cards da Fila de Tarefas

**Descrição:** Cada card de tarefa na Fila de Tarefas exibe um ícone indicador de fluxo (etapas) no canto direito, refletindo se o processo vinculado à tarefa possui fluxo/workflow ativo.

**Regra:** O indicador é determinado exclusivamente pelo processo relacionado — não pela tarefa em si.
- Se `processo.indicadores.possuiFluxo === true` → ícone exibido com opacidade total, tooltip "Possui fluxo"
- Se `processo.indicadores.possuiFluxo === false` → ícone exibido com opacidade reduzida (0.2), tooltip "Não possui fluxo"

**Origem do dado:** `processosRelacionados.find(p => p.id === tarefa.processoId)?.processo?.indicadores?.possuiFluxo`

**Consistência visual:** O mesmo indicador, ícone, cor e comportamento de tooltip já existem na aba "Tarefas" dentro do painel de detalhe do processo (`ProcessTaskCard`). A Fila de Tarefas replica exatamente esse padrão.

**Casos de teste:**
- Dado processo vinculado com `indicadores.possuiFluxo: true`, quando o card da tarefa é renderizado, então o ícone `IconEtapas` aparece com opacidade total e tooltip "Possui fluxo"
- Dado processo vinculado com `indicadores.possuiFluxo: false`, quando o card da tarefa é renderizado, então o ícone aparece com opacidade `0.2` e tooltip "Não possui fluxo"

**Cobertura:** `pendente`

---

### Estados de uma tarefa na fila

| Estado | `statusAtribuicao` | `agendada` | Visualização |
|---|---|---|---|
| Não atribuída, padrão | `nao_atribuida` | `false` | Padrão / Não atribuídas |
| Atribuída, padrão | `atribuida` | `false` | Padrão / Atribuídas |
| Agendada | qualquer | `true` | Tarefas agendadas |

---

### Distinção entre prazo de agendamento e Data prazo do card

O campo **"Data prazo"** exibido no card da tarefa é um dado dos **dados básicos da tarefa**: é o prazo definido no momento da criação ou edição da tarefa. Esse valor **não existe ainda nos mocks** — `agendamento.dataPrazo` é um placeholder temporário que será substituído pelo caminho correto quando o campo for adicionado ao modelo da tarefa.

A ação **"Agendar"** é um **agendamento interno**: o usuário define quando quer iniciar o trabalho na tarefa, movendo-a para "Tarefas agendadas". A data informada nessa ação fica em `agendamentoMap` exclusivamente para pré-preencher o modal de reagendamento. Ela **não altera nem aparece** no campo "Data prazo" do card.

| Campo | Origem | Quando populado |
|---|---|---|
| `Data prazo` (card) | Dados básicos da tarefa (`dados.dataPrazo` ou equivalente) | Definido na criação/edição da tarefa — **pendente nos mocks** |
| Data de agendamento ("Agendar") | `agendamentoMap` (runtime) | Definido pelo usuário ao agendar internamente |

**Pendência de implementação:** adicionar `dataPrazo` nos dados básicos de cada tarefa nos mocks (`tarefas.mock.ts`) e atualizar o `path` do campo em `tarefaQueueFields.ts` de `'agendamento.dataPrazo'` para o caminho correto quando esse campo existir.

### Pendências — Fila de Tarefas

- A visibilidade por atribuição/unidade hoje é implícita nos dados mock. Na API, deve ser filtro server-side com contexto do usuário autenticado.
- O estado de atribuição hoje é runtime (não persiste). Na API, será campo persistido da tarefa.
- A regra de tarefas "agendadas" pode evoluir para incluir múltiplas condições além do agendamento manual.
- O comportamento de abertura do processo vinculado ([RN-FT-08](#rn-ft-08)) pode precisar de permissionamento futuro.
- `Data prazo` do card lê de `agendamento.dataPrazo` temporariamente. Quando o campo for adicionado aos dados básicos da tarefa, atualizar `path` em `tarefaQueueFields.ts` e popular os mocks.

---

## Visualizações Personalizadas

### Contexto

Visualizações personalizadas permitem ao usuário criar modos de exibição nomeados com filtros pré-aplicados para a fila de processos ou de tarefas. Uma vez criada, a visualização pode ser fixada no menu lateral (sidebar) para acesso rápido. Cada visualização é independente por contexto: processos e tarefas têm seus próprios conjuntos de visualizações.

### Entidades envolvidas

- `Visualização` — conjunto de: nome (`label`), filtros (`filters`), flag de pin (`pinInSidebar`)
- `BaseFilters` — filtros "travados" da visualização, aplicados automaticamente ao ativá-la
- `AppliedFilters` — filtros ativos, inclui baseFilters + eventuais filtros adicionais do usuário

---

### RN-VP-01: Filtros travados ao ativar uma visualização

**Descrição:** Ao selecionar uma visualização personalizada, seus filtros são aplicados como `baseFilters` (filtros travados). O usuário pode adicionar filtros extras por cima, mas não pode remover os filtros base enquanto a visualização estiver ativa.

**Comportamento:** O modal de filtros exibe os filtros base desabilitados para edição; os filtros adicionais podem ser alterados livremente. O chip de "resultados" aparece apenas quando há filtros *adicionais* além dos base.

**Condição:** Ao desativar a visualização personalizada (voltar para "Visualização padrão"), os filtros base são limpos e os filtros adicionais também.

**Casos de teste:**
- Dado visualização com `baseFilters: { tipo: new Set(['SETOR']) }`, quando ativada, então os filtros base são aplicados automaticamente e aparecem desabilitados no modal
- Dado visualização ativa com baseFilters, quando o usuário desativa voltando para "Visualização padrão", então `baseFilters` e `appliedFilters` são limpos

**Cobertura:** `pendente`

---

### RN-VP-02: Filtros adicionais acima dos filtros base

**Descrição:** Um usuário pode refinar uma visualização personalizada com filtros adicionais sem alterar a visualização salva. Os filtros adicionais existem apenas na sessão — ao retornar à visualização, os filtros adicionais não são preservados.

**Condição:** `hasAppliedFilters` é `true` apenas quando `appliedFilters ≠ baseFilters`. Na visualização padrão (sem base), é `true` quando qualquer filtro está ativo.

**Casos de teste:**
- Dado visualização ativa com `baseFilters`, quando o usuário aplica um filtro adicional, então `hasAppliedFilters` é `true` e `appliedFilters ≠ baseFilters`
- Dado visualização ativa com filtros adicionais, quando o usuário reativa a mesma visualização, então os filtros adicionais são descartados e apenas `baseFilters` é aplicado

**Cobertura:** `pendente`

---

### RN-VP-03: Contador no sidebar reflete os filtros da visualização

**Descrição:** O contador exibido ao lado de uma visualização fixada no sidebar indica quantos itens passam pelos filtros dessa visualização, não o total geral da fila.

**Condição:** O contador é calculado aplicando os filtros da visualização sobre o conjunto completo de dados da fila (não sobre os dados da página atual).

**Reatividade:** O contador atualiza automaticamente quando o estado dos dados muda em runtime (ex: processo movido para fora da fila, tarefa agendada).

**Casos de teste:**
- Dado visualização fixada no sidebar com filtros que correspondem a 3 de 10 itens, quando os contadores são calculados, então o sidebar exibe `3`
- Dado processo movido para "fora da fila" em runtime, quando os contadores do sidebar são recalculados, então o contador da visualização afetada reflete o novo total

**Cobertura:** `pendente`

---

### RN-VP-04: Pin no sidebar

**Descrição:** Uma visualização com `pinInSidebar: true` aparece como item clicável no menu lateral, abaixo das visualizações padrão. Ao clicar, ativa a visualização com seus filtros base.

**Condição:** Apenas visualizações explicitamente marcadas com `pinInSidebar` aparecem no sidebar. O número de visualizações fixadas não tem limite definido, mas o sidebar deve ser legível.

**Comportamento ao clicar:** Ativa a visualização (aplica baseFilters, reseta página para 1, limpa seleção).

**Casos de teste:**
- Dado visualização com `pinInSidebar: true`, quando o menu lateral é renderizado, então a visualização aparece como item clicável
- Dado visualização fixada clicada no sidebar, quando o clique ocorre, então a visualização é ativada com `baseFilters` aplicados e página resetada para 1
- Dado visualização com `pinInSidebar: false`, quando o menu lateral é renderizado, então a visualização não aparece no sidebar

**Cobertura:** `pendente`

---

### RN-VP-05: Criação de visualização

**Descrição:** O usuário cria uma visualização nomeando-a e definindo os filtros que ela deve travar. A visualização pode ser criada a partir do estado atual de filtros ou do zero.

**Condição:** O nome da visualização deve ser único dentro do contexto (processos ou tarefas), obrigatório, limitado a 40 caracteres e formado apenas por letras, números e espaços. Espaços excedentes são normalizados antes de salvar.

**Comportamento pós-criação:** A nova visualização é ativada imediatamente. Se marcada com pin, aparece no sidebar imediatamente.

**Casos de teste:**
- Dado nome de visualização único no contexto, quando a visualização é criada, então ela é ativada imediatamente com seus filtros
- Dado visualização marcada com `pinInSidebar` ao criar, quando criada, então aparece no sidebar imediatamente
- Dado nome de visualização já existente no mesmo contexto, quando a criação é tentada, então exibe erro de nome duplicado
- Dado nome de visualização com mais de 40 caracteres, quando a criação é tentada, então exibe erro de limite de caracteres
- Dado nome de visualização com caracteres especiais, quando a criação é tentada, então exibe erro de caracteres inválidos
- Dado nome de visualização com espaços excedentes, quando salvo, então o nome é persistido com apenas um espaço entre palavras

**Cobertura:** `pendente` (validação de nome coberta por `src/shared/utils/userDefinedName.test.ts`)

---

### RN-VP-06: Edição de visualização

**Descrição:** O usuário pode editar o nome, os filtros base e o status de pin de uma visualização existente.

**Condição:** Se a visualização editada estava ativa no momento da edição, ela permanece ativa com os novos filtros. Se o nome mudar, o sidebar e o dropdown atualizam o label.

**Casos de teste:**
- Dado visualização ativa sendo editada, quando o nome é alterado e salvo, então o sidebar e o dropdown atualizam o label imediatamente
- Dado visualização ativa sendo editada com novos filtros, quando salva, então a visualização permanece ativa com os novos `baseFilters`

**Cobertura:** `pendente`

---

### RN-VP-07: Exclusão de visualização

**Descrição:** Ao excluir uma visualização ativa, a fila retorna automaticamente para "Visualização padrão" com filtros limpos.

**Condição:** Se a visualização estava fixada no sidebar, o item é removido do sidebar imediatamente.

**Casos de teste:**
- Dado visualização ativa sendo excluída, quando a exclusão é confirmada, então a fila retorna para "Visualização padrão" com filtros limpos
- Dado visualização fixada no sidebar sendo excluída, quando confirmada, então o item é removido do sidebar imediatamente

**Cobertura:** `pendente`

---

### RN-VP-08: Independência por contexto

**Descrição:** Visualizações criadas na fila de processos não aparecem na fila de tarefas e vice-versa. Os dois contextos têm seus próprios conjuntos independentes de visualizações, pins e filtros ativos.

**Estado persistente:** O estado de visualizações é mantido no `CustomViewsProvider` durante a sessão. Como as duas filas ficam montadas simultaneamente (`display: none`), o estado é preservado ao alternar entre elas.

**Casos de teste:**
- Dado visualização criada no contexto `'processos'`, quando o contexto `'tarefas'` é verificado, então a visualização não aparece
- Dado `useCustomViews('processos')` e `useCustomViews('tarefas')` ativos, quando o estado de um contexto é alterado, então o outro permanece inalterado

**Cobertura:** `pendente`

---

### Pendências — Visualizações Personalizadas

- Visualizações hoje são da sessão (não persistem ao recarregar). Na integração com API, devem ser salvas por usuário.
- A regra de nome único deve ser validada com feedback claro ao usuário na interface.
- Visualizações compartilhadas (visíveis para outros usuários do mesmo setor) não estão no escopo atual, mas podem ser adicionadas como `tipo: 'setor'` futuramente.

---

## Categorias e Tags

### Contexto

Categorias são rótulos visuais (chips/tags) aplicados a processos e tarefas para facilitar identificação rápida, triagem e filtragem. O sistema possui duas origens de tags: tags externas (definidas pela organização) e tags pessoais (criadas pelo usuário). Algumas tags são aplicadas automaticamente pelo sistema com base em estados do processo/tarefa.

### Entidades envolvidas

- `Tag/Categoria` — rótulo com `label`, `color`, `tipo` e `iconKey`
- `Chip` — representação visual de uma tag aplicada a um item específico
- `ProcessChipsMap` / `TaskChipsMap` — mapas `Map<id, chips[]>` que armazenam os chips aplicados por item em runtime

---

### RN-CT-01: Fonte oficial de tags

**Descrição:** Tags só podem ser aplicadas se existirem na fonte oficial de categorias externas (`categoriasExternasMock`, futuramente via API). Não é permitido criar ou aplicar tags com labels arbitrários fora dessa fonte ou das tags pessoais do usuário.

**Fonte atual:**

| Label | Tipo | Color | Quem aplica |
|---|---|---|---|
| `Aguardando análise` | SETOR | support | Usuário (dropdown) |
| `Urgente` | PESSOAL | error | Usuário (dropdown) |
| `Assinatura(s) pendente(s)` | SISTEMA | warning | Sistema (automático) |
| `Assinatura(s) realizada(s)` | SISTEMA | success | Sistema (automático) |
| `Aguardando prazo` | SISTEMA | warning | Sistema (automático) |
| `Retornada do agendamento` | SISTEMA | success | Sistema (automático) |
| `Prioridade do órgão` | ORGAO | primary | Usuário (dropdown) |

**Casos de teste:**
- Dado label `'Urgente'` existente na fonte oficial, quando aplicado a um processo via dropdown, então o chip é adicionado com sucesso
- Dado `CategoriasDropdown` renderizado, quando as opções são verificadas, então apenas labels da fonte oficial (exceto SISTEMA) aparecem

**Cobertura:** `pendente`

---

### RN-CT-02: Tipos de tags e permissões de aplicação

**Descrição:** O tipo da tag determina quem pode aplicá-la:

- **SETOR** — aplicável pelo usuário via dropdown. Ícone: grupos (`groups`)
- **PESSOAL** — criada e aplicada pelo próprio usuário. Ícone: pessoa (`person`)
- **ORGAO** — aplicável pelo usuário via dropdown. Ícone: órgão (`account_balance`)
- **SISTEMA** — aplicada automaticamente pelo sistema em resposta a estados. **Não aparece no dropdown para seleção pelo usuário.**

**Condição:** O `CategoriasDropdown` filtra as tags do tipo `SISTEMA`, exibindo apenas as demais para seleção pelo usuário.

**Casos de teste:**
- Dado tags do tipo `SISTEMA` na fonte, quando o `CategoriasDropdown` é renderizado, então as tags SISTEMA não aparecem nas opções
- Dado tags dos tipos `SETOR`, `PESSOAL` e `ORGAO`, quando o dropdown é renderizado, então todas aparecem disponíveis para seleção

**Cobertura:** `pendente`

---

### RN-CT-03: Chips automáticos por estado do item

**Descrição:** O sistema aplica chips automaticamente quando um item muda de estado. Essas regras são obrigatórias e os mocks devem refletir o estado correto inicial:

#### Processos/Documentos

| Ação | Chip aplicado | Cor | Remoção |
|---|---|---|---|
| Prazo definido ("Incluir prazo") | `Aguardando prazo` | `warning` | **Backend:** prazo expira e processo retorna automaticamente à fila principal |

**Responsabilidade frontend:** aplicar o chip `Aguardando prazo` e injetar a data no campo `Prazo agendamento` via `fieldOverrideMap`.
**Responsabilidade backend:** remover o chip e retornar o processo à fila quando o prazo vencer. Não implementar lógica de expiração por data no frontend.

#### Tarefas — Ciclo de Agendamento

Agendamento e Prazo são dois ciclos **independentes**. O agendamento move a tarefa entre visualizações; o prazo define um vencimento com escalonamento de tags.

| Evento | Chip aplicado | Cor | Remoção |
|---|---|---|---|
| Agendamento criado (`handleSaveAgendamento`) | `Início agendado` | `error` | Agendamento removido manualmente ou data chega (backend) |
| Data do agendamento chega (retorno automático) | `Retornada do agendamento` | `success` | Permanece — sinal de que a tarefa retornou |
| Agendamento removido manualmente | — nenhum chip adicionado — | — | `Início agendado` é removido |

**Responsabilidade frontend:** aplicar `Início agendado` ao agendar; remover ao desagendar manualmente; injetar data no campo `Prazo agendamento` via `fieldOverrideMap`; limpar ao desagendar.
**Responsabilidade backend:** detectar que a data do agendamento chegou, retornar a tarefa à fila padrão e trocar `Início agendado` → `Retornada do agendamento`. Não implementar essa lógica no frontend.

**Distinção crítica:** Agendamento ≠ Prazo. Agendar uma tarefa NÃO aplica `Aguardando prazo`. O chip `Aguardando prazo` em tarefas pertence ao ciclo de Prazo (funcionalidade ainda não implementada — ver RN-CT-08).

#### Tarefas — Ciclo de Prazo (não implementado)

| Estado | Chips ativos | Cor |
|---|---|---|
| Prazo definido, dentro do limite | `Aguardando prazo` | `warning` |
| Prazo se aproximando do vencimento | `Aguardando prazo` + `Próxima do prazo final` | `warning` + `warning` |
| Prazo vencido | `Prazo vencido` | `error` |

**Casos de teste:**
- Dado processo, quando `handleSavePrazo` é executado, então o chip "Aguardando prazo" (warning) é adicionado ao `processChipsMap` do processo
- Dado tarefa, quando `handleSaveAgendamento` é executado, então o chip "Início agendado" (error) é adicionado ao `taskChipsMap` da tarefa
- Dado tarefa agendada, quando o agendamento é removido manualmente, então o chip "Início agendado" é removido e nenhum chip novo é adicionado
- Dado tarefa agendada, quando a data do agendamento expira, então a tarefa retorna para a fila padrão com chip "Retornada do agendamento" (success)

**Cobertura:** `pendente`

---

### RN-CT-04: Tags pessoais — criação e gerenciamento

**Descrição:** O usuário pode criar tags pessoais com label e cor personalizados. Tags pessoais são identificadas pelo tipo `PESSOAL` e ficam disponíveis no dropdown de categorias.

**Comportamento:**
- Criar: label obrigatório, único entre as tags pessoais do usuário, limitado a 40 caracteres e formado apenas por letras, números e espaços
- Editar: o label pode ser alterado seguindo as mesmas regras de criação; chips já aplicados com o label antigo são atualizados automaticamente em todos os itens
- Excluir: o modal de gerenciamento exibe o impacto (quantidade de itens afetados) antes de confirmar

**Casos de teste:**
- Dado usuário que cria tag pessoal com label único, quando criada, então fica disponível no `CategoriasDropdown`
- Dado tag pessoal aplicada em 3 itens com label `'Revisão'`, quando o label é editado para `'Revisão crítica'`, então os chips dos 3 itens são atualizados automaticamente
- Dado label de tag pessoal já existente entre as pessoais do usuário, quando nova tag com mesmo label é criada, então exibe erro de label duplicado
- Dado label de tag pessoal com mais de 40 caracteres, quando a criação é tentada, então exibe erro de limite de caracteres
- Dado label de tag pessoal com caracteres especiais, quando a criação é tentada, então exibe erro de caracteres inválidos
- Dado label de tag pessoal com espaços excedentes, quando salvo, então o label é persistido com apenas um espaço entre palavras

**Cobertura:** `pendente` (validação de nome coberta por `src/shared/utils/userDefinedName.test.ts`)

---

### RN-CT-05: Aplicação em seleção múltipla

**Descrição:** Ao aplicar tags com múltiplos itens selecionados, o dropdown distingue três estados por tag:

- **Marcado (checked):** todos os itens selecionados têm a tag → aplicar adiciona a itens que não têm
- **Desmarcado (unchecked):** nenhum item selecionado tem a tag → remover remove de todos que têm
- **Indeterminado (indeterminate):** apenas alguns itens têm a tag → ao confirmar, padroniza para todos ou remove de todos

**Condição:** Para seleção de um único item, o comportamento é binário (tem ou não tem).

**Pendência:** A regra atual do código aplica por item iterando o `checkedIds`. O comportamento indeterminado precisa ser definido e implementado formalmente.

**Casos de teste:**
- Dado 3 itens selecionados onde todos têm a tag X, quando o estado do checkbox da tag X é verificado, então está `checked`
- Dado 3 itens selecionados onde nenhum tem a tag X, quando verificado, então está `unchecked`
- Dado 3 itens selecionados onde apenas 1 tem a tag X, quando verificado, então está `indeterminate`
- Dado 1 único item selecionado, quando o checkbox é verificado, então o estado é binário (nunca `indeterminate`)

**Cobertura:** `pendente`

---

### RN-CT-06: Contexto separado por fila

**Descrição:** Chips de processos são armazenados no `processChipsMap` (contexto `'processos'`) e chips de tarefas no `taskChipsMap` (contexto `'tarefas'`). Os dois contextos são independentes — aplicar uma tag em um processo não afeta as tarefas vinculadas e vice-versa.

**Casos de teste:**
- Dado chip aplicado a um processo (contexto `'processos'`), quando o `taskChipsMap` é consultado para o mesmo `id`, então não contém o chip
- Dado chip aplicado a uma tarefa (contexto `'tarefas'`), quando o `processChipsMap` é consultado para o mesmo `id`, então não contém o chip

**Cobertura:** `pendente`

---

### RN-CT-07: Chips iniciais dos mocks

**Descrição:** Os dados mock (`processoComplementos.mock.ts` e `tarefas.mock.ts`) definem chips iniciais que representam o estado pré-existente dos itens antes de qualquer ação do usuário na sessão. Esses chips devem usar apenas labels que existam na fonte oficial ([RN-CT-01](#rn-ct-01)).

**Chips válidos nos mocks:** `Aguardando análise`, `Urgente`, `Assinatura(s) pendente(s)`, `Assinatura(s) realizada(s)`, `Aguardando prazo`, `Início agendado`, `Retornada do agendamento`, `Prioridade do órgão`, e tags pessoais criadas durante a sessão.

**Chips proibidos nos mocks:** Qualquer label que não exista na fonte oficial. Sufixos numéricos como `(2/5)` não são válidos como label de tag — use o label base sem sufixo.

**Casos de teste:**
- Dado mocks carregados inicialmente, quando os chips de todos os itens são verificados, então todos os labels existem na fonte oficial
- Dado mocks carregados, quando os labels dos chips são verificados, então nenhum contém sufixos numéricos como `(2/5)`

**Cobertura:** `pendente`

---

### RN-CT-08: Ciclo de Prazo de tarefa (funcionalidade pendente de implementação)

**Descrição:** Tarefas podem ter um prazo definido, independente do agendamento. O prazo segue um ciclo de escalonamento com três fases:

1. **Prazo vigente:** chip `Aguardando prazo` (warning) aplicado ao definir o prazo.
2. **Prazo próximo:** chip `Próxima do prazo final` (warning) adicionado junto ao `Aguardando prazo` quando o prazo está a N dias do vencimento. O threshold N é definido pelo produto.
3. **Prazo vencido:** chips `Aguardando prazo` e `Próxima do prazo final` removidos; chip `Prazo vencido` (error) aplicado.

**Distinção:** O ciclo de prazo é independente do ciclo de agendamento ([RN-CT-03](#rn-ct-03)). Uma tarefa pode ter prazo sem estar agendada e vice-versa.

**Tags de sistema necessárias (ainda não no mock):** `Próxima do prazo final` (warning), `Prazo vencido` (error).

**Pendência:** A interface para definir prazo em tarefas ainda não está implementada no projeto. Ao implementar, adicionar as tags ao mock e ao `categoriasExternasMock`.

**Cobertura:** `pendente`

---

### RN-CT-09: Exibição resumida de tags

**Descrição:** Cards e painéis de detalhe de processos e tarefas devem preservar uma linha estável para tags. Nos cards, quando as tags completas não couberem na largura disponível, o sistema alterna a lista para o modo compacto. No detalhe da tarefa, as tags permanecem completas até o limite da linha e as excedentes são resumidas em `+N`.

**Condição:** Aplica-se somente à exibição visual na fila e no detalhe lateral. Não limita a quantidade de tags que podem ser aplicadas a um processo ou tarefa.

**Comportamento:** Tags compactas mantêm tooltip com identificação da tag. O sistema deve exibir o máximo possível de tags antes de resumir excedentes em `+N`. Em cards, o indicador `+N` mostra tooltip responsivo com os labels ocultos. No detalhe da tarefa, o `+N` abre lista flutuante com as tags excedentes completas, sem checkbox. Essa lista deve abraçar o conteúdo (`max-content`), manter os labels em uma linha (`nowrap`) e respeitar limite responsivo de viewport para não sair da tela. Os ícones de tipo exibidos na lista devem manter tooltip com o tipo da tag.

**Casos de teste:**
- Dado card com poucas tags que cabem em uma linha, quando renderizado, então as tags aparecem completas com texto.
- Dado card com tags que ultrapassam a largura disponível, quando renderizado, então as tags aparecem em modo compacto sem estourar o card.
- Dado card com mais tags compactas do que a largura disponível comporta, quando renderizado, então o indicador `+N` aparece com a quantidade de tags ocultas.
- Dado lista de tags com `+N` configurado como popover, quando o usuário aciona o indicador, então a lista de tags excedentes é exibida com os labels completos.
- Dado lista de tags excedentes com ícone de tipo, quando o usuário passa o cursor sobre o ícone, então o tooltip do tipo da tag é exibido.

**Cobertura:** `coberto` (`src/components/custom/TagChipList.test.tsx`)

---

### RN-CT-10: Contraste visual da cor da tag

**Descrição:** Sempre que a cor de uma tag for exibida sobre fundo claro, o sistema deve aplicar contorno automático quando a cor tiver baixo contraste contra esse fundo.

**Condição:** Aplica-se aos indicadores visuais de cor da tag no dropdown de categorias, na lista de gerenciamento, no seletor de criação/edição e nos chips renderizados.

**Comportamento:** O contorno protege a legibilidade da cor escolhida sem alterar a cor salva da tag. A regra não impede o usuário de escolher cor de fonte igual ou próxima da cor da tag; essa decisão permanece sob responsabilidade do usuário.

**Casos de teste:**
- Dado tag com cor branca, quando sua cor é exibida em fundo claro, então o sistema aplica contorno escuro.
- Dado tag com cor clara de baixo contraste, quando sua cor é exibida em fundo claro, então o sistema aplica contorno escuro.
- Dado tag com cor de contraste suficiente, quando sua cor é exibida, então o sistema não adiciona contorno.

**Cobertura:** `coberto` (`src/components/custom/tagColorVisual.test.ts`)

---

### Relacionamentos — Categorias e Tags

- **Filtros:** O filtro "Categoria" no modal de filtros usa os chips do `processChipsMap`/`taskChipsMap` para construir as opções disponíveis dinamicamente.
- **Contadores:** Tags não afetam contadores de abas ou sidebar diretamente — apenas o filtro por categoria afeta a contagem de resultados filtrados.
- **Tags pessoais:** Gerenciadas globalmente via `CategoriasProvider` (transversal a processos e tarefas). Uma tag pessoal criada na fila de processos também estará disponível na fila de tarefas.

---

### Pendências — Categorias e Tags

- Tags hoje são da sessão (não persistem). Na API, chips aplicados serão persistidos por item.
- A distinção entre tags automáticas do sistema e aplicadas pelo usuário pode precisar de campos adicionais na entidade (ex: `origem: 'sistema' | 'usuario'`).
- Tags do tipo `ORGAO` representam classificações de órgão externo — sua semântica precisa ser definida no contexto real do Solar BPM.
- O comportamento indeterminado no dropdown de seleção múltipla ([RN-CT-05](#rn-ct-05)) precisa de especificação funcional antes de ser implementado.
