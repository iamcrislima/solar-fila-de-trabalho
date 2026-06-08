# Estrutura Arquitetural do Projeto

## Visão geral

`frontend-solarbpm` é o front-end do Portal de Aplicações SolarBPM.
É um protótipo arquitetural funcional que serve simultaneamente como:

- prova de conceito de design system aplicado;
- base modular escalável para acoplamento com back-end real;
- referência de padrões de componentização, separação de camadas e organização de código.

---

## Camadas

```
src/
  shell/              # shell global do portal (layout fixo: header, icon bar, sidebar, content)
    AppShell.tsx
    assets.tsx
    config/
      header.config.ts
      sidebar-icons.config.ts
      sidebar.config.ts

  modules/            # módulos funcionais da aplicação
    fila-trabalho/    # visão operacional de processos e tarefas
      FilaModule.tsx        # entry point do módulo (lazy-loaded pelo App.tsx)
      WorkQueue.tsx         # estrutura de lista compartilhada pelas duas filas
      types.ts              # WorkQueueCard, ProcessQueueFilters, TarefaQueueFilters, FieldOverrideMap
      providers/            # CustomViewsProvider (estado de visualizações por fila)
      components/           # FiltersModal, PersonalizarCardsModal, VisualizacaoPersonalizadaModal, TarefaDetalhePanel
      pages/
        fila-processos/     # FilaDeProcessos.tsx + config.processos.ts
        fila-tarefas/       # FilaDeTarefas.tsx + config.tarefas.ts
      fields/               # labels, aliases, campos de personalização e ordenação (.ts)
      selectors/            # leitura derivada de dados do domínio (.ts)
      adapters/             # transformação ProcessoDigital/Tarefa → WorkQueueCard (.ts)
      config/               # configurações compartilhadas entre as duas filas (.ts)
      utils/                # workQueueUtils.ts — filtragem, ordenação, normalização
      shell/                # WorkQueueShell.tsx, assets.ts
      docs/                 # mapa-funcional.md, regras-fila-trabalho.md
      services/             # processos.service.ts, tarefas.service.ts — orquestração de dados
      hooks/                # useProcessos.ts, useTarefas.ts — ⏳ React Query na Fase 2

    solar/            # módulo SOLAR
      processos/
        components/         # ProcessoDetalhePanel.tsx

    org/              # módulo ORG
      OrgModule.tsx         # entry point do módulo
      OrgSidebar.tsx        # navegação lateral do módulo
      pages/                # EstruturasOrganizacionaisPage.tsx
      docs/                 # mapa funcional e regras de estrutura organizacional

  components/
    ds/               # design system puro: Button, Modal, DatePicker, tokens…
                      # NÃO importa domain, modules ou configs de produto.
    app/              # componentes de aplicação reutilizáveis entre módulos
      filters/        # DateRangeInput, FiltroDropdown
    custom/           # componentes compartilhados ainda não promovidos ao DS

  domain/             # modelagem de dados e regras de negócio puras (sem React, sem UI)
    processos/        # entidade central: mocks, adapters, repositories, selectors, tarefas
    filtros/          # utilitários: dateRange.ts, filterModel.ts
    categorias/       # tags/categorias (transversal)
    org/              # estruturas organizacionais (mocks/modelos)
    shared.types.ts   # tipos compartilhados entre domínios (ex.: interface Chip)
    usuario/          # usuario.mock.ts

  application/
    providers/        # providers React transversais (CategoriasProvider, TarefasProvider, FavoritesProvider)
                      # CustomViewsProvider pertence ao módulo fila-trabalho/providers/
    # queryClient.ts  # ⏳ Fase 2 — configuração do React Query
    # queryKeys.ts    # ⏳ Fase 2 — convenção de query keys
    # http/           # ⏳ quando API existir — cliente HTTP abstrato

  styles/
    tokens/           # cores, tipografia, sombras, bordas, espaçamentos, layout (.ts)
```

---

## Regras de dependência

| Camada | Pode importar de |
|---|---|
| `shell/` | `components/ds`, `components/app`, `components/custom`, `styles/tokens` |
| `modules/X/` | `domain/`, `components/ds`, `components/app`, `components/custom`, `application/providers`, `styles/tokens` |
| `components/app/` | `components/ds`, `domain/`, `styles/tokens` |
| `components/ds/` | `styles/tokens` apenas |
| `domain/` | Nada de UI, modules ou providers React |
| `application/providers/` | `domain/`, `styles/tokens` |

**Módulos não se importam diretamente entre si.**
Se um módulo precisar de dados de outro, o caminho correto é via `domain/`.

---

## Shell vs Módulo

O **shell** é o layout fixo do portal. Ele:
- renderiza o header, a barra de ícones de módulos e o painel lateral;
- recebe `sidebarContent` como prop (conteúdo do módulo ativo);
- recebe `children` como prop (área de conteúdo do módulo ativo);
- não conhece nenhum módulo específico.

Um **módulo** é uma experiência de tela com estado próprio:
- renderiza seu conteúdo dentro da área `children` do AppShell;
- passa seu `sidebarContent` (navegação interna) ao AppShell;
- tem providers, pages, components, fields, selectors e config próprios.

---

## Navegação do Portal

O Portal de Aplicações é um único sistema. Os módulos são agrupamentos
funcionais dentro desse sistema, não aplicações independentes.

A navegação deve separar dois estados:

- `activeModuleId` — controla apenas qual menu lateral de módulo está visível.
- `activeFeatureId` — controla qual funcionalidade está renderizada no conteúdo principal.

**Trocar de módulo não troca o conteúdo principal.** O clique em um ícone da
barra de módulos deve trocar somente o menu lateral/contexto disponível. O
conteúdo principal só muda quando o usuário seleciona uma funcionalidade do
menu do módulo.

Exemplo: se o usuário está em `Fila de Trabalho > Processos/Documentos` e clica
em `ORG`, o menu lateral passa a exibir as funcionalidades do ORG, mas a Fila de
Trabalho continua renderizada. O conteúdo muda apenas quando o usuário clica em
`ORG > Estruturas organizacionais`.

Funcionalidades devem ser registradas por identificadores estáveis no formato
`modulo.funcionalidade` (ex.: `org.estruturasOrganizacionais`). Esses
identificadores são a fonte de verdade para renderizar conteúdo, marcar itens
ativos e, futuramente, mapear rotas reais.

**Exceção — FILA:** o módulo FILA é a própria funcionalidade de fila de
trabalho. Ao selecionar `FILA` na barra de módulos, o Portal deve ativar
diretamente `fila.trabalho`, com entrada em `Processos/Documentos > Visualização
padrão`. `Processos/Documentos` e `Tarefas` são páginas/visões internas dessa
funcionalidade e continuam sendo controladas pelo `FilaModule`, não pelo menu
global de funcionalidades.

## Content padrão do Portal

O shell fornece o slot de conteúdo e o componente `PortalContent` define o frame
estrutural padrão da área principal:

- fundo da área de conteúdo;
- padding externo;
- card/frame principal;
- largura útil;
- radius, sombra e overflow;
- responsividade do container.

Funcionalidades não devem recriar esse layout principal com `main`, `section`,
background, padding externo, radius ou sombra próprios. Elas devem renderizar
apenas o conteúdo funcional dentro do `PortalContent`.

---

## Domínio vs Módulo

| Domínio | Módulo |
|---|---|
| Dados e regras semânticas do produto | Experiência/tela |
| processo, tarefa, categoria, status | fila de trabalho, detalhe do processo |
| Fonte de verdade de uma entidade | Visão operacional de entidades |
| `domain/` | `modules/` |

Uma fila, painel ou modal **nunca é fonte de verdade** de uma entidade. Ela consume dados derivados do domínio.

---

## components/custom/ — regra de convivência

`components/custom/` contém componentes compartilhados que ainda não foram promovidos ao DS nem movidos para um módulo específico. Ex.: `ButtonHint`, `UserSelector`, `TagChip`, `KeywordSearch`.

Quando um componente de `custom/` ficar específico de um módulo, ele deve **migrar para `modules/<modulo>/components/`**.

Os arquivos já migrados em `custom/` contêm apenas um `export` de compatibilidade apontando para a nova localização. Novos imports devem usar o caminho canônico, não o de compatibilidade.

---

## Fluxo de dados

**Estado atual:**
```
mock
  ↓
repository (domain/)
  ↓
selector / adapter
  ↓
página (chama diretamente)
  ↓
componente
```

**Estado alvo (após execução das Fases 1-3 em `docs/evolucao/`):**
```
mock / API
  ↓
repository (domain/)
  ↓
service (modules/{mod}/services/)
  ↓
hook useQuery/useMutation (modules/{mod}/hooks/)
  ↓
página
  ↓
componente
```

Hoje os repositories consomem mocks. Quando a API real existir, somente os repositories mudam.

---

## Configuração de módulo

Configs controlam **conteúdo e comportamento**, nunca layout estrutural.

Permitido em config:
- textos, labels, tooltips;
- opções de filtro e ordenação;
- ações disponíveis;
- campos visíveis e sua ordem inicial.

Proibido em config:
- padding, gap, grid, sombra, border-radius;
- tipografia estrutural;
- cores estruturais de tela;
- arrays de entidades como fonte de verdade.

---

## Antes de criar algo novo

1. O dado pertence ao `domain/`? Se sim, coloque lá.
2. A UI é genérica (DS)? → `components/ds/`
3. A UI é compartilhada entre módulos mas tem convenções da aplicação? → `components/app/`
4. A UI é específica de um módulo? → `modules/<modulo>/components/`
5. Existe token ou componente existente que atende? Use-o.
6. Rodar build e validar visualmente antes de concluir.
