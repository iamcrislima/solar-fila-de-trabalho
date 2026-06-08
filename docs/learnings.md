# Aprendizados e Decisões Arquiteturais

Registra decisões não-óbvias tomadas durante o desenvolvimento.
Cada entrada explica **o que foi feito**, **por que**, e **o que fazer no futuro**.

A IA deve atualizar este arquivo ao final de qualquer sessão em que uma decisão arquitetural não-trivial foi tomada.

Não registra bugs visuais simples nem mudanças de texto. Registra padrões, fronteiras e armadilhas.

---

## 2026-06 — Auditoria de DS e Storybook: estrutura e padrões

### Reorganização da arquitetura de componentes e Storybook

**O que:** Auditoria completa do Design System e Storybook identificou os seguintes padrões obrigatórios a partir desta data:

1. **Prefixos de Storybook padronizados:** `00-Foundations/`, `01-DS/Atoms/`, `02-App/`, `03-Custom/`. O prefixo `04-Custom` que existia antes está depreciado.
2. **Cobertura mínima de stories por camada:** DS atom exige `EstaticoFigma`, `Controlado` e `TodasAsVariantes`; Custom exige ao menos o estado padrão.
3. **`IconBox` para SVGs customizados dentro de `IconButton`:** garante área 24×24 e botão 32×32 consistente. MUI icons com `fontSize={24}` usam `<IconButton>` direto.
4. **Hierarquia DS:** tudo em `atoms/` hoje; quando camada `molecules/` for criada, compostos como `Header`, `SideMenu`, `Table`, `Filter` migram para lá.
5. **Critério DS/App/Custom:** DS = sem domínio; App = convenções da aplicação sem dados; Custom = dados/regras do SolarBPM.

**Por quê:** O projeto acumulou 40+ componentes DS sem critério explícito de organização, com gap numérico nos prefixos Storybook (01 → 04, sem 02 e 03), histórico de duplicações (re-exports mortos em `custom/`), e ausência de stories para `Tooltip`, `Overlay`, `TruncatedText` e `ExpandRetractButton`.

**No futuro:**
- Todo novo componente consulta o critério DS/App/Custom antes de escolher onde viver.
- Todo `title:` de story verifica o prefixo antes de salvar.
- SVGs customizados sempre usam `<IconBox>` dentro de `<IconButton>`.
- A camada `molecules/` será criada quando 3+ compostos existirem com necessidade comprovada — não antes.

---

## 2026-06 — Dois padrões de scroll no PortalContent

### Página inteira rola vs. containers internos com scroll próprio

**O que:** Estabelecido que o `PortalContent` suporta dois padrões de scroll distintos, usados por páginas com propósitos diferentes:

**Padrão A — Scroll da página inteira** (ex.: detalhe de estrutura organizacional):
```tsx
<PortalContent frameStyle={{ overflowY: 'auto', gap: ..., padding: ... }}>
  {/* todos os filhos com altura natural — nenhum flex: 1, nenhum minHeight: 0 */}
```
O card branco (section) rola como um todo. Corresponde ao modelo Figma onde `Container = fixed` e `Content = hug`: o card cresce com o conteúdo e o usuário rola a página inteira.

**Padrão B — Viewport fixo com scroll interno** (ex.: fila de trabalho, painel lista+detalhe):
```tsx
<PortalContent>
  {/* filhos principais usam flex: 1, minHeight: 0 e gerenciam scroll individualmente */}
```
O card branco (section) preenche o viewport. Cada container interno que precisa de scroll define `overflowY: 'auto'` e `flex: 1, minHeight: 0` individualmente. Nada transborda o card.

**Por quê:** O PortalContent tem por padrão `overflow: hidden` na section (`flex: 1, minHeight: 0`). Passar `overflowY: 'auto'` via `frameStyle` transforma a section em área scrollável sem mudar o PortalContent globalmente. A confusão comum é remover o `overflowY: 'auto'` achando que o scroll correto seria via containers internos — isso resulta em nenhum scroll e conteúdo clipado.

**No futuro:**
- Telas de detalhe / formulários / conteúdo variável → Padrão A: `frameStyle={{ overflowY: 'auto' }}` + filhos com altura natural.
- Telas de lista / fila / painel fixo → Padrão B: PortalContent padrão + filhos com `flex: 1, minHeight: 0`.
- Nunca misturar: não colocar `overflowY: 'auto'` na section E `flex: 1` nos filhos ao mesmo tempo — gera scroll duplo (section + container) ou nenhum scroll efetivo.
- Verificar no Figma: se o frame do conteúdo tem `vertical: hug` → Padrão A. Se tem `vertical: fill` → Padrão B.

---

## 2026-06 — Tooltip: clamp de viewport corrigido para bordas reais

### Posicionamento de tooltip com `useLayoutEffect` para medir largura real

**O que:** Refatorado `src/components/ds/atoms/Tooltip/Tooltip.tsx`. O conteúdo do portal foi extraído para um subcomponente `TooltipPortal` que usa `useLayoutEffect` para medir a largura real do tooltip após renderização e recalcula `left` com clamp nas duas bordas (`min(max(center, margin + w/2), viewport - margin - w/2)`). O clamp anterior se aplicava ao ponto central, não às bordas — tooltips longos próximos à borda direita transbordavam a viewport.

**Por quê:** O código anterior fazia `left = min(center, viewport - margin)` e depois `transform: translateX(-50%)`. Isso clampava o ponto central, mas a borda direita real ficava em `left + w/2`, que excedia `viewport` para textos longos (ex.: "Visualização disponível apenas para estrutura em uso" na última coluna da tabela de estruturas organizacionais). Como o tooltip usa `whiteSpace: nowrap`, textos longos produzem tooltips largos que o clamp simples não continha.

**No futuro:** Sempre que um componente precisar se posicionar dentro da viewport sem conhecer sua largura antecipadamente, usar o padrão: renderizar → medir com `useLayoutEffect` em um subcomponente → ajustar posição. `useLayoutEffect` é síncrono antes do paint — sem flash visível. O clamp correto é sempre sobre as bordas reais, nunca sobre o ponto central.

---

## 2026-06 — Encoding UTF-8: padrão obrigatório e `.editorconfig`

### Mojibake em strings literais de fieldOverrideMap

**O que:** Seis strings literais em `FilaDeTarefas.tsx` (linhas do `effectiveFieldOverrideMap` e do bloco `desatribuirTarefa`) estavam com Mojibake — bytes UTF-8 de caracteres acentuados portugueses interpretados como Latin-1: `'AtribuÃ­do a'`, `'Data atribuiÃ§Ã£o'`, `'Data de atribuiÃ§Ã£o'`. Corrigidas para `'Atribuído a'`, `'Data atribuição'`, `'Data de atribuição'`. Criado `.editorconfig` na raiz com `charset = utf-8` e `end_of_line = lf`, consistente com o `.prettierrc` existente.

**Por quê:** O Mojibake surgiu provavelmente de um paste de fonte mal-codificada. Como essas strings são chaves do `FieldOverrideMap` (um `Map<cardId, { [label]: value }>`), a chave errada nunca casava com os labels reais de `tarefaQueueFields.ts`, quebrando silenciosamente a exibição dos campos de atribuição nos cards de tarefa após atribuir ou desatribuir. O projeto não tinha `.editorconfig`, então editores diferentes podiam salvar com codificações distintas sem nenhuma proteção.

**No futuro:**
- O `.editorconfig` na raiz garante que qualquer editor compatível salve em UTF-8 + LF automaticamente. Nunca remover esse arquivo.
- Se um arquivo abrir com caracteres estranhos (`Ã­`, `Ã§`, `Ã£`, `Ã³`, `Ã¡`, `â€`, `Â`), é Mojibake de UTF-8 mal interpretado como Latin-1. O padrão de decode é: `í→Ã­`, `ç→Ã§`, `ã→Ã£`, `ó→Ã³`, `á→Ã¡`.
- Atenção: `Ã` sozinho (maiúsculo) é o caractere português legítimo Ã (ocorre em NÃO, CONFIGURAÇÃO) — não é Mojibake. Apenas as sequências de dois caracteres `Ã­`, `Ã§`, etc. são.
- Chaves de `FieldOverrideMap` devem sempre usar os mesmos strings que os labels definidos em `*QueueFields.ts`. Preferir importar a constante em vez de reescrever a string literal.

---

## 2026-06 — Tooltip: componente único obrigatório

### Unificação de todos os mecanismos de hint/tooltip no DS

**O que:** Criado `src/components/ds/atoms/Tooltip/Tooltip.tsx` como fonte única de verdade para qualquer hint/tooltip visual do projeto. Removidos: `ResponsiveTooltip` (custom/), `WithTooltip` (privado em AttachmentCardProcesso), `FlowIndicator` (privado em AttachmentCardTarefa), `TooltipIcon` (privado em ProcessTaskCard). Substituídos todos os `title=` em contextos de UI. Migrados: `TagChip`, `TagListItem`, `TagChipList`, `AttachmentCardTarefa`, `AttachmentCardProcesso`, `ProcessTaskCard`, `ExpandRetractButton`, `ButtonHint`.

**Por quê:** O projeto acumulou 5+ mecanismos diferentes para a mesma necessidade (posicionar um hint visual sobre um elemento): `title=` nativo (visual de OS, sem DS), `HintMain` + portal inline em cada componente, `ResponsiveTooltip`, e três helpers privados duplicados. Cada um tinha delay diferente, visual diferente e lógica de posicionamento diferente. Qualquer novo componente replicava uma dessas abordagens à sua escolha. O resultado era inconsistência visual (tooltip de OS vs DS HintMain) e código duplicado em 6+ arquivos.

**No futuro:** Todo hint/tooltip usa `<Tooltip content="...">elemento</Tooltip>`. O componente vive em `components/ds/atoms/Tooltip/Tooltip.tsx` — é puramente visual, sem conhecimento de produto. **Delay padrão: 750ms** (calibrado para não poluir visualmente movimentos de mouse sem intenção). Nunca criar helpers privados de tooltip dentro de componentes — se precisar de tooltip, importe `Tooltip`. `ButtonHint` usa `Tooltip` internamente — o hover imediato no fundo do botão é estado separado (UX de feedback), não tooltip.

---

## 2026-05 — Refatoração arquitetural completa

### Shell extraído do módulo fila-trabalho

**O que:** `WorkQueueShell.jsx` movido para `src/shell/AppShell.jsx`. Configs de header, sidebar icons e sidebar movidas para `src/shell/config/`.

**Por quê:** O shell era genérico (servia qualquer módulo) mas vivia dentro do módulo `fila-trabalho`. Qualquer novo módulo precisaria importar do shell de uma fila específica — acoplamento errado.

**No futuro:** Novos módulos usam `AppShell` diretamente de `src/shell/AppShell.jsx`. Nunca criar outro componente de shell dentro de um módulo.

---

### Utilitários de domínio extraídos de componentes UI

**O que:** `copyFilters`, `filtersEqual`, `hasAppliedFilters` → `src/domain/filtros/filterModel.js`; funções de data BR → `src/domain/filtros/dateRange.js`.

**Por quê:** Essas funções viviam dentro de componentes visuais (`FiltersModal.jsx`, `DateRangeInput.jsx`). Lógica pura sem React não deve morar em UI — dificulta teste, gera duplicação e viola a regra de `domain/` sem React.

**No futuro:** Qualquer utilitário de data, filtragem ou regra de negócio sem React → `src/domain/`. Componentes UI podem re-exportar do domain para conveniência de quem importa.

---

### CustomViewsProvider pertence ao módulo, não à aplicação

**O que:** `src/application/providers/CustomViewsProvider.jsx` → `src/modules/fila-trabalho/providers/CustomViewsProvider.jsx`.

**Por quê:** O provider gerencia estado exclusivo da fila de trabalho (visualizações personalizadas, filtros aplicados). Não é transversal à aplicação — colocá-lo em `application/providers/` criava a impressão errada de que ele serve todos os módulos.

**No futuro:** Providers que gerenciam estado de um único módulo ficam em `modules/<modulo>/providers/`. Providers transversais (ex.: `CategoriasProvider`) ficam em `application/providers/`.

---

### Re-exports de compatibilidade como pontes temporárias

**O que:** Arquivos antigos substituídos por stubs de re-export com comentário `// Movido para...`.

**Por quê:** Permite migração gradual sem quebrar imports não mapeados. O stub documenta o movimento e não quebra o build.

**No futuro:** Novos imports devem usar o caminho canônico, não o stub. Stubs podem ser removidos quando todos os imports forem atualizados. Nunca criar novo código que importe de um stub.

---

### sidebarConfig vs sidebarCategoriasConfig

**O que:** No caminho canônico (`src/shell/config/sidebar.config.js`) o export usa o nome `sidebarConfig`. O stub no local antigo re-exporta como `sidebarCategoriasConfig` para compatibilidade.

**Por quê:** O nome antigo era específico demais para uma config global do shell.

**No futuro:** Novos imports usam `{ sidebarConfig }` de `src/shell/config/sidebar.config.js`.

---

---

## 2026-05 — Portal de Aplicações: inversão de controle do shell

### AppShell passou a ser o nó raiz da aplicação

**O que:** `App.js` passou a renderizar `<AppShell>` no topo, com `activeModuleId`, `onModuleChange` e `sidebarContent` como props. O módulo fila (e demais módulos) renderizam **dentro** do `AppShell`, não ao redor dele.

**Por quê:** O `WorkQueue` (componente de layout da fila) envolvia o `AppShell` — o shell vivia dentro de um módulo. Isso tornava impossível trocar de módulo sem desmontar e remontar o shell inteiro, e impedia que outros módulos usassem o mesmo portal.

**No futuro:** Qualquer novo módulo é renderizado como `children` do `AppShell`, nunca como seu pai. O módulo não sabe que existe um shell.

---

### Comunicação de sidebar via callback (onSidebarChange)

**O que:** `FilaDeProcessos` e `FilaDeTarefas` recebem `onSidebarChange` como prop. Elas chamam `onSidebarChange(sidebarContent)` via `useEffect` sempre que o conteúdo da sidebar muda. O `App.js` guarda o resultado em `filaSidebar` e repassa ao `AppShell.sidebarContent`.

**Por quê:** O conteúdo da sidebar da fila depende de estado interno do módulo (visualização ativa, views fixadas, `foraFilaIds`). Não é possível calcular esse conteúdo no `App.js` sem vazar lógica de módulo para cima. O callback inverte o controle: o módulo "empurra" sua sidebar sem precisar saber que o shell existe.

**No futuro:** Todo módulo que tem sidebar dinâmica (dependente de estado interno) usa o padrão `onSidebarChange`. Módulos com sidebar estática passam um elemento JSX estático direto do `App.js`.

---

### useMemo para sidebarContent previne loops de renderização

**O que:** O `sidebarContent` em `FilaDeProcessos` e `FilaDeTarefas` foi convertido de JSX inline para `useMemo` com deps declaradas. O `useEffect` que chama `onSidebarChange` depende de `sidebarContent` — sem o memo, cada render geraria um novo objeto JSX e o effect dispararia em loop.

**Por quê:** `useEffect` compara referências de `deps`. JSX inline cria um novo objeto a cada render; `useMemo` mantém a mesma referência enquanto as deps não mudam. Sem isso, o `App.js` entraria em loop: mudança de sidebar → re-render → nova referência → `useEffect` dispara → mudança de sidebar…

**No futuro:** Sempre que um `useEffect` depender de JSX calculado, use `useMemo` para estabilizar a referência. Os callbacks dentro do JSX memoizado podem ser closures simples (não precisam de `useCallback`) desde que só chamem setters de `useState` ou de contexto — esses são estáveis por natureza.

---

### UserSelector migrou para o sidebar do módulo fila

**O que:** `<UserSelector />` foi removido do `AppShell.jsx` (linha hardcoded) e passou a ser incluído no início do `sidebarContent` produzido por `FilaDeProcessos` e `FilaDeTarefas`.

**Por quê:** O seletor de usuário é específico da fila de trabalho — outros módulos (SOLAR, SEG, etc.) não exibem esse campo. Manter no shell genérico vazava conceito de módulo para a camada de portal.

**No futuro:** Qualquer elemento do painel lateral que seja específico de um módulo fica dentro do `sidebarContent` desse módulo, não no `AppShell`.

---

### sidebar-icons.config.js unificado com IDs por módulo

**O que:** `textos.fixos` (FAV, BUSCA, FILA como strings) e `dados.modulos` (array sem ID) foram substituídos por um único `dados.modulos` com `id`, `label`, `fav` e `hasDivider`. `MODULO_ICONS` (array indexado por posição) foi complementado com `MODULE_ICON_MAP` (objeto indexado por ID).

**Por quê:** O mapeamento por índice numérico era frágil: reordenar ou inserir um módulo exigia atualizar tanto o config quanto o array de ícones. O mapeamento por ID é explícito e imune a reordenação.

**No futuro:** Novos módulos são adicionados em `dados.modulos` com um `id` único. O ícone vai em `MODULE_ICON_MAP[id]`. Não usar índice numérico para mapear ícone a módulo.

---

### Módulos não-fila usam PlaceholderModule + sidebars estáticas

**O que:** Criados `src/modules/_shared/PlaceholderModule.jsx` (conteúdo genérico "em desenvolvimento") e sidebars estáticas para FAV, BUSCA, SOLAR, WFLOW, ECM, CES, BPM, ORG e SEG. O `App.js` monta o sidebar estático via objeto `STATIC_SIDEBAR[id]`.

**Por quê:** A funcionalidade real de cada módulo não existe ainda. O placeholder permite que a troca de módulo via ícone funcione visualmente sem código morto ou condicionais espalhados.

**No futuro:** Quando um módulo for implementado, substitui-se `PlaceholderModule` pelo componente real e `STATIC_SIDEBAR[id]` pelo padrão `onSidebarChange` se a sidebar for dinâmica.

---

### Componentes específicos de módulo não pertencem a components/custom/

**O que:** `FiltersModal`, `VisualizacaoPersonalizadaModal`, `PersonalizarCardsModal`, `TarefaDetalhePanel` movidos de `components/custom/` para `modules/fila-trabalho/components/`.

**Por quê:** `components/custom/` deve conter apenas componentes verdadeiramente genéricos (sem dependência de módulo). Modais e painéis que conhecem a fila de trabalho são componentes de módulo, não de aplicação.

**No futuro:** Ao criar um modal ou painel novo, perguntar: "isso pode ser usado em outro módulo sem mudança?" Se não, vai em `modules/<modulo>/components/`.

---

## 2026-05 — Sidebars dos módulos: implementação fiel ao Figma

### Padrão de estrutura por módulo (baseado nos designs do Figma)

**O que:** As sidebars de cada módulo foram reescritas com base nos layouts do Figma. Três padrões distintos emergem:

1. **Itens planos com estrela (CES, ECM, WFLOW):** Apenas `SideMenuItem` com `showFavIcon=true`, sem seção/header agrupadora. Cada item é uma entrada de nível raiz navegável.
2. **Headers sem filhos (SEG):** Apenas `SideMenuHeader` para cada entrada — sem `SideMenuItem` abaixo. Cada header é um item autônomo (não agrupa filhos).
3. **Texto sem estrutura de menu (FAV):** Apenas um `<span>` com `typography.styles.overlineBold` (Montserrat Bold 12px) quando não há itens.

**Por quê:** Os designs do Figma mostram estruturas muito diferentes por módulo. Tratar todos com o mesmo padrão header+filhos produz hierarquias incorretas.

**No futuro:**
- Para módulos com itens diretos (sem hierarquia): `SideMenuItem showFavIcon={true/false}` sem header.
- Para módulos com navegação hierárquica: `SideMenuHeader` + `SideMenuItem` abaixo.
- Para estados vazios: `typography.styles.overlineBold`, `color: colors.surface.dark`, sem ícone.

---

### Arquivo Figma correto do Portal de Aplicações

**O que:** Os nodes que falhavam (SOLAR, BPM, ORG) usavam o file key errado (`iDR1M4VRbFljLjmrLwkRe8`). O file key correto é `pWtm2T32FK0Xz5qj9xs9T9`.

**Por quê:** A sessão anterior assumiu o file key a partir de outra URL que não era o arquivo vigente do Portal de Aplicações.

**No futuro:** URL canônica do arquivo: `https://www.figma.com/design/pWtm2T32FK0Xz5qj9xs9T9/Portal-de-aplica%C3%A7%C3%B5es`. Extrair sempre o fileKey da URL fornecida pelo usuário — nunca reutilizar de sessões anteriores.

---

---

## 2026-05 — Migração CRA → Vite + lazy loading por módulo

### Migração de Create React App para Vite

**O que:** Removido `react-scripts`. Instalado `vite` + `@vitejs/plugin-react`. Criado `vite.config.js` na raiz com plugin para tratar `.js` como JSX (padrão herdado do CRA), alias `@/` → `src/`, e configuração Vitest. Criado `index.html` na raiz (ponto de entrada Vite). `tailwind.config.js` convertido para ESM. Storybook migrado para `@storybook/react-vite`.

**Por quê:** O CRA está descontinuado e usa webpack, que é ~10× mais lento que Vite no dev server. A startup que levava 10s+ passou a levar ~600ms.

**No futuro:** Nunca voltar para `react-scripts`. Qualquer ajuste de build é feito em `vite.config.js`. O plugin `treat-js-files-as-jsx` é obrigatório enquanto os arquivos de componentes usarem extensão `.js`.

---

### Lazy loading de módulos com React.lazy

**O que:** `FilaModule` e `PlaceholderModule` passaram a ser carregados com `React.lazy` + dynamic import. `<Suspense fallback={null}>` envolve a área de conteúdo no `App.js`. O bundle inicial caiu de **502KB → 255KB** (–50%); `FilaModule` virou chunk separado de 247KB carregado sob demanda.

**Por quê:** O bundle único de 502KB bloqueava o primeiro render. Com lazy loading, o shell + MUI carregam em 255KB e o módulo fila só é baixado quando o usuário acessa a fila.

**No futuro:** Todo módulo novo (`modules/<nome>/`) deve ser adicionado ao `App.js` com `React.lazy`. Nunca importar módulos diretamente no topo do `App.js`.

---

### Providers da fila movidos para dentro de FilaModule

**O que:** `TarefasProvider`, `CategoriasProvider` e `CustomViewsProvider` — que antes envolviam `FilaModule` no `App.js` — foram movidos para dentro de `FilaModule.jsx`. O `App.js` parou de importar seletores internos da fila (`getProcessosWorkQueueCards`, `getTarefasWorkQueueCards`).

**Por quê:** `App.js` (que é o orquestrador de alto nível, equivalente ao shell) não deve conhecer internals de módulo. Importar seletores de `modules/fila-trabalho/selectors/` direto no `App.js` era uma violação da regra "o shell não conhece nenhum módulo". Além disso, é pré-requisito para o lazy loading funcionar: se o `App.js` importar código do módulo, esse código entra no bundle principal mesmo com `React.lazy`.

**No futuro:** Todo módulo que precisa de providers de inicialização deve encapsulá-los internamente. O `App.js` só conhece o componente do módulo e seus props públicos.

---

### Path alias @/ configurado

**O que:** `vite.config.js` com `resolve.alias { '@': src/ }`. `jsconfig.json` com `paths { "@/*": ["src/*"] }` para autocompletar no VS Code.

**Por quê:** Imports relativos com `../../../` são frágeis — quebram ao mover arquivos. O alias torna os imports legíveis e robustos.

**No futuro:** Todos os imports novos usam `@/`. Não criar novos imports com `../../`.

---

## 2026-05 — Módulo processos dentro do módulo solar

### processos migrou para src/modules/solar/processos/

**O que:** O diretório `src/modules/processos/` foi movido para `src/modules/solar/processos/`. Todos os imports internos do módulo (3 a 4 níveis acima) foram incrementados em um nível. Os 3 pontos de entrada externos foram atualizados:
- `FilaDeProcessos.jsx` e `FilaDeTarefas.jsx` → importam agora de `../../../solar/processos/components/ProcessoDetalhePanel`
- `src/components/custom/ProcessoDetalhePanel.jsx` (re-export stub) → aponta para `../../modules/solar/processos/components/ProcessoDetalhePanel`

**Por quê:** Processo/documento é uma funcionalidade específica do módulo SOLAR. Manter como módulo irmão de solar criava a impressão errada de que é um módulo de portal de mesmo nível. A fila de trabalho pode consumir o painel de detalhe de processo porque o faz via componente, não via acoplamento de módulo — o painel é uma feature de SOLAR que a fila reutiliza.

**No futuro:** Quando um módulo for sub-funcionalidade de outro módulo, ele fica em `modules/<pai>/<filho>/`. Imports cross-módulo de componentes UI são aceitáveis quando feitos via re-export stub em `components/custom/` — o stub documenta a dependência.

---

## 2026-05 — Modernização da stack (Sessão 1)

### Migração CRA → Vite, React 19, Tailwind v4, TypeScript 6, Node 22

**O que:** Substituição completa da stack de build e desenvolvimento:
- CRA (react-scripts + webpack) → Vite v6 com plugin JSX para `.js` legados
- React 18 → React 19 (com MUI v9 que já suporta)
- Tailwind v3 + PostCSS → Tailwind v4 via `@tailwindcss/vite` (sem postcss.config.js)
- Tokens Tailwind em `tailwind.config.js` → bloco `@theme {}` em `globals.css`
- TypeScript 6 adicionado com `allowJs: true`, `checkJs: false` (adoção gradual)
- Node 18 (EOL) → Node 22 LTS (obrigatório para Tailwind v4)

**Por quê:** O projeto estava nascendo com stack obsoleta. CRA foi descontinuado; Node 18 está em EOL desde abril/2025. Tailwind v4 requer Node 20+ e é dramaticamente mais rápido (1.8s vs 7s de build). Migrar cedo quando o projeto é pequeno custa 10x menos do que depois.

**No futuro:** Toda sessão deve rodar em Node 22+ (`nvm use 22` ou `.nvmrc`). Tailwind v4 é configurado exclusivamente via `@theme {}` em `src/styles/globals.css` — nunca criar um `tailwind.config.js`. Os tokens JS em `src/styles/tokens/` continuam existindo para uso com MUI; são fontes separadas que devem estar sincronizadas.

---

### ESLint v9 + Prettier — base de qualidade

**O que:** ESLint v9 com flat config (`eslint.config.js`) + Prettier 3. Regras separadas por tipo de arquivo: JS recebe regras base, TS recebe regras TypeScript. `react/no-unescaped-entities` desligada (textos em português). `_`-prefixo aceito para variáveis intencionalmente não usadas.

**Por quê:** Sem linting, imports mortos e bugs de React (jsx-key, hooks) acumulam silenciosamente. Com TypeScript em adoção gradual, o ESLint é a principal barreira de qualidade para os arquivos `.js` legados.

**No futuro:** `npm run lint` deve passar com 0 erros antes de qualquer commit. Os 24 warnings `react-refresh` em arquivos de config são esperados e não precisam ser corrigidos — são informativos.

---

## 2026-05 — Sessão 2: Migração TypeScript (tokens, domínio, shell, providers)

### TypeScript zero-erros com tsc --noEmit

**O que:** Migração de ~50 arquivos para TypeScript: todos os tokens (9), domínio completo (27 arquivos), providers de aplicação (3), shell (5) e entry points (App.tsx, index.tsx).

**Por quê:** O projeto nasceu em JS. Com TypeScript instalado mas sem arquivos `.ts`, o `tsc --noEmit` não detectava erros. A migração garante que os tipos do domínio protegem a cadeia inteira de dados (mock → repository → selector → componente).

**No futuro:** Todo novo arquivo deve ser `.ts` ou `.tsx`. O `npx tsc --noEmit` deve passar com zero erros antes de qualquer commit.

---

### Interfaces de domínio como contrato entre camadas

**O que:** Criados `ProcessoDigital`, `Tarefa`, `Categoria`, `DateRange`, `Chip` e demais tipos em arquivos de modelo. Os mocks ficam tipados contra essas interfaces, selectors e adapters têm parâmetros tipados.

**Por quê:** Sem tipos no domínio, qualquer mudança na estrutura de dados passa despercebida até runtime. Com interfaces, o TypeScript detecta incompatibilidades em tempo de compilação.

**No futuro:** Quando a API real substituir os mocks, apenas o `repository` muda. Os tipos do modelo ficam — eles documentam o contrato esperado da API.

---

### @ts-expect-error vs @ts-ignore para componentes JS

**O que:** Componentes DS ainda em JS (HeaderBar, SideMenuIconItem) às vezes inferem props incompatíveis. Usado `onMenuToggle={() => {}}` e `userSlot={null}` para satisfazer TypeScript com valores válidos — sem suppressores.

**Por quê:** `@ts-ignore` silencia erros futuros também; `@ts-expect-error` falha se o erro for resolvido. Passar props com valores neutros é mais honesto que suprimir.

**No futuro:** Na Sessão 3, esses componentes receberão props interfaces TypeScript com opcionais (`?`) — e esses props neutros serão removidos.

---

## 2026-05 — Sessão 3: Migração TypeScript completa (componentes e módulos)

### @ts-nocheck como scaffold de migração em larga escala

**O que:** 219 arquivos renomeados de .jsx/.js para .tsx/.ts. Para 145 arquivos que ainda não têm Props interfaces, adicionado `// @ts-nocheck` como scaffold. 10 DS components + providers + app/ components têm Props interfaces completas.

**Por quê:** Converter Props interfaces de 145 componentes em uma sessão é inviável. O scaffold permite que: (a) o projeto esteja 100% em TypeScript por extensão, (b) `tsc --noEmit` passe com zero erros, (c) a migração seja incremental — cada componente tocado para features futuras recebe a interface.

**No futuro:** Ao modificar qualquer componente com `// @ts-nocheck`: (1) remover o pragma, (2) adicionar Props interface, (3) corrigir os erros TypeScript. Não criar novos componentes com `@ts-nocheck` — novos arquivos devem ser totalmente tipados desde o início.

---

### ESLint: @typescript-eslint/ban-ts-comment configurado para migração

**O que:** Adicionada regra `'@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': false }]` para permitir `// @ts-nocheck` como scaffold legítimo de migração.

**Por quê:** Sem essa configuração, ESLint impede o uso de `@ts-nocheck` mesmo quando é a única estratégia viável para uma migração em larga escala sem quebrar o projeto.

**No futuro:** Quando todos os `// @ts-nocheck` forem removidos (Sessão 4), remover essa exceção da config ESLint para ter proteção máxima.

---

## 2026-05 — Sessão 4: Remoção de @ts-nocheck (DS core + sidebars)

### Props interfaces adicionadas em ~45 componentes DS

**O que:** Removido `// @ts-nocheck` e adicionadas Props interfaces TypeScript em ~45 arquivos: todos os componentes DS core (HeaderBar, Button, Checkbox, Modal, Chip, Card, Tabs, Radio, Accordion, DatePicker, HourPicker, TextField, Loading, Overlay, Steps, Switch, Hint, Divider, Icon, TruncatedText, Filter/*, Notification, ModalDialog, LogoHeader, SideMenu/*, Header/*), todos os sidebars de módulo, PlaceholderModule.

**Por quê:** @ts-nocheck era um scaffold temporário. Remover progressivamente, do mais usado para o menos usado, garante que os componentes mais críticos ficam tipados primeiro. HeaderBar + SideMenuIconItem + Button foram priorizados por desbloquear a remoção de workarounds no AppShell.

**No futuro:** Ao tocar qualquer arquivo com `// @ts-nocheck`: remover o pragma, adicionar Props interface, verificar que `tsc --noEmit` passa. Nunca criar novos componentes com `@ts-nocheck`.

---

### AppShell workarounds removidos

**O que:** Removidos `iconItems={headerIcons as never}`, `onMenuToggle={() => {}}` e `userSlot={null}` do AppShell — esses eram props neutras adicionadas quando HeaderBar ainda era JS. Com HeaderBar tipado (`iconItems?: ReactElement[]`), os casts não são necessários.

**Por quê:** Casts `as never` são sinais de débito técnico — indicam que o TypeScript não sabe o tipo correto. Removê-los quando a dependência é tipada é parte natural do processo de migração.

**No futuro:** Sempre que um componente JS for tipado, verificar se existem casts ou props neutras no código que o usa — e removê-los.

---

## 2026-06 — Sessão 5: Remoção de @ts-nocheck (DS simples + custom simples + módulos puros)

### Props interfaces adicionadas em ~30 arquivos

**O que:** Removido `// @ts-nocheck` e adicionadas Props interfaces em ~30 arquivos: componentes DS simples (IconInput, InputGrid, InputIconBox, InputOrdering, InputCheckboxCombo, TableAddBar, TableCaptionLine, NumberField, TextArea parcial), componentes custom simples (UserSelector, LembretesModal, SelectAll, KeywordSearch, ButtonHint), módulos (FilaModule, sidebars), funções puras de módulo com tipos `Record<string, unknown>` (adapters, selectors, utils).

**Por quê:** Progressão incremental da migração TypeScript. Arquivos com apenas Props interfaces simples foram convertidos diretamente; arquivos com erros complexos nos corpos das funções receberam `@ts-nocheck` de volta temporariamente.

**No futuro:** Ao tipar completamente um arquivo com `@ts-nocheck` — ler o arquivo, adicionar Props interface + tipos no corpo, remover pragma, confirmar `tsc --noEmit` ainda passa. Usar `Record<string, unknown>` para funções de processamento de dados onde os tipos exatos são complexos.

---

### Estratégia de remoção de @ts-nocheck em lote

**O que:** Tentativa de remover @ts-nocheck de 56 arquivos de uma vez, corrigir os ~1265 erros, e readicionar onde necessário. Resultado: ~27 arquivos com erros complexos voltaram a ter @ts-nocheck; ~29 ficaram limpos.

**Por quê:** Remover em lote e corrigir iterativamente é mais eficiente do que ler cada arquivo individualmente antes de converter. O padrão "remover todos → verificar erros → readicionar nos complexos → fixar os simples" economiza tempo.

**No futuro:** Para a Sessão 6, usar o mesmo padrão: remover @ts-nocheck de tudo, ver distribuição de erros, readicionar @ts-nocheck nos arquivos com > 15 erros no corpo, focar nos menores primeiro.

---

## 2026-06 — Sessão 6: Remoção de @ts-nocheck (DS médios + custom médios)

### Props interfaces adicionadas em ~14 arquivos

**O que:** Removido `// @ts-nocheck` e tipados: TextArea, InputRead, NumberField, TableNavBar, TableHeaderCell, TableAccordionLine, TableCaptionLine, DropdownMenu, DropdownKebabMenu, OrdenacaoDropdown, VisualizacaoDropdown; módulos FilaModule (parcial). Total: 41 → 27 arquivos com @ts-nocheck.

**Por quê:** Progresso incremental na migração TypeScript. Os arquivos de 5-20 erros foram corrigidos com patches cirúrgicos (sed/Node.js) em vez de reescritas completas, preservando mais rapidamente o código original.

**No futuro:** Padrões comuns de correção rápida: (1) remove `import React from 'react'` quando não usado; (2) adiciona `.current` generics em `useRef<HTMLDivElement>(null)`; (3) tipa `MouseEvent` em handlers de document; (4) usa `as keyof typeof OBJ` para string indexing; (5) `as const` para literais em style objects.

---

## 2026-06 — Sessão 7: Remoção de @ts-nocheck (adapters, selectors, TagChip, ProcessTaskCard)

### 7 arquivos tipados: adapters, selectors, TagChip, FilaModule, ProcessTaskCard

**O que:** Removido @ts-nocheck dos 7 arquivos com ≤ 20 erros. 20 arquivos restam (todos com > 20 erros no corpo).

**Por quê:** Os arquivos mais complexos desta leva tinham erros nos corpos das funções relacionados a: (1) `Record<string, unknown>` sem propriedades específicas → usar `as keyof typeof` ou `as Record<string, X>`; (2) função `readPath` que retorna `unknown` → acessar com cast; (3) spread de `{}` → verificar `Array.isArray` antes de espalhar; (4) `item.label` sendo `unknown` em `.find()` → cast `item.label as string`.

**No futuro:** Padrão para tipagem de funções de transformação de dados (`Record<string, unknown>` → typed): usar `(obj.field as ExpectedType)` ao acessar propriedades, e `Array.isArray()` antes de fazer spread.

---

## 2026-06 — Sessão 8: Remoção de @ts-nocheck (DS complexos + custom modais + módulos utils)

### 7 arquivos tipados: CriarTagModal, GerenciarTagsModal, AttachmentCard, InputMulti, TableColumn, workQueueUtils, ProcessoTarefasTab

**O que:** Removido @ts-nocheck de 7 arquivos com 19-25 erros. Padrões corrigidos: inner functions sem tipos, useState(null) sem genérico, `const obj = {}` sem tipo (causa indexing `{}`), FilterState vs Record<string, unknown> incompatibilidade, array spread de unknown.

**Por quê:** Esses arquivos tinham complexidade média — não era só Props interface, mas também funções utilitárias internas e acessos a propriedades dinâmicas. Exigiram leitura do código e patches cirúrgicos.

**No futuro:** Padrão chave: `const obj = {}` em TypeScript → sempre usar `const obj: Record<string, X> = {}`. Funções inner sem tipo causam TS7031; adicionar inline types como `function Inner({ x, y }: { x: string; y: number })`. Para FilterState, usar `as Record<string, Set<string> | { from: string | null; to: string | null }>` onde o tipo exato não é importável.

---

## 2026-06 — Sessão 9: Remoção de @ts-nocheck (custom components + DS extras)

### 9 arquivos tipados com Props interfaces e casts

**O que:** Removido @ts-nocheck de 9 arquivos: AttachmentCardTarefa, AttachmentCardProcesso, CategoriasDropdown (parcial), PrazoModal (props), TarefaAgendamentoModal (props), PersonalizarCardsModal, CustomViewsProvider, VisualizacaoPersonalizadaModal, WorkQueue. 11 arquivos restam (FilaDeTarefas, FilaDeProcessos, e os grandes modais).

**Por quê:** Os erros mais comuns foram: (1) icon components inline sem tipos — usar `{ style?: CSSProperties; [k: string]: unknown }`; (2) `items: unknown[]` propaga `unknown` no body — melhor usar `Array<Record<string, unknown>>` quando se acessa propriedades; (3) statusActions pattern — `(statusActions as Array<Record<string, unknown>>).find(...)`.

**No futuro:** Para components com SVG icon exports que usam `{ style, ...props }`, o tipo correto é `{ style?: React.CSSProperties; [k: string]: unknown }`. Para arrays de objetos com propriedades conhecidas, usar `Array<{ propA: TypeA; propB?: TypeB }>` em vez de `unknown[]` para evitar propagação de `unknown`.

---

## 2026-06 — Sessão 10: Migração TypeScript concluída (tipos de domínio reais)

### Os 11 arquivos finais tipados com `WorkQueueCard` em vez de casts em massa

**O que:** Removido o `// @ts-nocheck` de todos os arquivos funcionais restantes — as duas páginas grandes (FilaDeProcessos, FilaDeTarefas), os modais (FiltersModal, VisualizacaoPersonalizadaModal, PersonalizarCardsModal, PrazoModal, TarefaAgendamentoModal), CategoriasDropdown, WorkQueue, CustomViewsProvider e ProcessoDetalhePanel. Resultado final: **0 erros tsc, 0 erros ESLint, `vite build` passa**. Os únicos `// @ts-nocheck` que restam estão nas `*.stories.tsx`.

**Por quê (decisão de arquitetura):** Em vez de espalhar casts `as Record<string, unknown>` pelas páginas, criei **tipos de domínio reais** em `src/modules/fila-trabalho/types.ts`: `WorkQueueCard`, `CardField`, `StatusAction`, `ProcessQueueFilters`, `TarefaQueueFilters`, `FieldOverrideMap`. Os adapters (`processoToWorkQueue`, `tarefaToWorkQueue`) passaram a retornar `WorkQueueCard[]`, os selectors propagam esse tipo, e as páginas consomem cards já tipados. Assim o erro some na raiz (o adapter) e não em cada ponto de acesso. Isso deixa o código legível: `p.statusActions?.some(a => a.iconKey === ...)` é type-safe sem cast.

**Padrões que funcionaram:**
- **Fronteira `FilterState` ↔ `*QueueFilters`:** o estado de filtros vem do contexto como `FilterState` genérico (`Record<string, Set<string> | DateRange | …>`), mas os helpers de filtro precisam ler `.tipo.size`. Solução: cast pontual `appliedFilters as ProcessQueueFilters` **só na chamada do helper** — não no estado todo. `*QueueFilters` é um subtipo estrutural de `FilterState`, então o downcast é seguro e fica restrito à fronteira.
- **`useState`/`useRef` sem inicializador útil:** sempre anotar o genérico — `useState<string | null>(null)`, `useState<Set<string>>(new Set())`, `useRef<ReturnType<typeof setTimeout> | null>(null)`. Sem isso o TS infere `null`/`never[]` e quebra nos setters.
- **`new Map(arr.map(x => [k, v]))`:** o `.map` infere `string[]`, não a tupla `[string, string]` que o `Map` exige. Anotar a tupla: `.map(x => [x.id, x.bg] as [string, string])` (ou `as const`).
- **`reduce` com acumulador `[]`:** usar `reduce<WorkQueueCard[]>(..., [])` para não inferir `never[]`.
- **`Object.values(filters).some(v => v?.from)`:** `v` é union `Set | DateRange | null`; `.from` não existe no `Set`. Cast inline `(v as { from?: string | null } | null)?.from`.
- **Props que cruzam para componentes ainda “largos”** (ProcessoDetalhePanel/TarefaDetalhePanel esperam `Record<string, unknown>`): `processo={detail as unknown as Record<string, unknown>}` na borda — o detalhe interno é tipado, o componente receptor é genérico.

---

## 2026-06 — Infraestrutura de testes e primeiros 222 testes

### Consolidação de utils duplicados via re-export

**O que:** `workQueueUtils.ts` tinha 4 funções duplicadas de `filterUtils.ts` (`normalizeSearchText`, `textIncludesSearch`, `isPresentFilterValue`, `parseSortableValue`). Removidas as cópias; `workQueueUtils.ts` agora re-exporta de `filterUtils.ts`. Os importadores existentes não precisaram ser alterados.

**Por quê:** Duplicação silenciosa — um bug corrigido em `filterUtils` continuaria existindo em `workQueueUtils`. A re-export preserva a API pública sem custo de manutenção.

**No futuro:** `filterUtils.ts` é a fonte canônica para normalização de texto e valores de data. Qualquer novo utilitário de busca vai para lá, não para utils de módulo.

### TarefasProvider usa '-' como sentinela de valor vazio

**O que:** Ao desatribuir uma tarefa, o provider seta `atribuidoA` para `'-'` (sentinela do domínio), não para `''`.

**Por quê:** O domínio usa `'-'` como representação visual de "sem valor" em campos de card. O provider segue o mesmo padrão para consistência com o que é exibido nos cards.

**No futuro:** Ao testar campos que representam ausência de valor, aceitar tanto `''` quanto `'-'`. Usar `isPresentFilterValue()` para verificar se um valor está preenchido.

### Etapas de testes implementadas (Etapas 1–4)

**O que:** 222 testes em 15 arquivos cobrindo: filterUtils (100%), workQueueUtils (100%), repositórios com RN-FP-09/10/RN-FT-10 (100%), adapters de fila (100%), selectors de domínio (100%), 4 providers com renderHook, integração RTL de FilaDeTarefas e FilaDeProcessos (smoke + tabs + search + empty state).

**Por quê:** Base de segurança antes de qualquer nova feature. Os testes de integração RTL validam o fluxo completo desde o mock de domínio até a renderização na UI.

**No futuro:** Testes de integração RTL ficam ao lado do componente de página (`.test.tsx`). O wrapper `tests/support/render.tsx` inclui todos os providers necessários (FavoritesProvider + CategoriasProvider + TarefasProvider + CustomViewsProvider) — usar esse wrapper para qualquer novo teste de componente que precise de contexto.

---

## 2026-06 — Estratégia de testes e qualidade orientada a regras

### Cadeia regra → teste como diretriz obrigatória

**O que:** Definida a estratégia completa de testes do projeto. A cadeia obrigatória é: funcionalidade implementada → regras documentadas com código `RN-*` → casos de teste escritos na regra (formato Dado/Quando/Então) → arquivo `.test.ts` com `it('RN-XX-YY: ...')` → CI passa → `Cobertura: coberto` no doc.

**Por quê:** O projeto já tinha uma cultura de documentação de regras de negócio com códigos únicos (`RN-FP-09`, `RN-FT-07`, etc.). Usar o código da regra como nome do teste cria rastreabilidade total: quando um teste falha no CI, a mensagem de erro aponta diretamente para o documento de regra correspondente. Isso elimina o custo de investigar “o que esse teste protege?”.

**No futuro:** Toda nova funcionalidade segue o fluxo de 5 passos em `docs/orientacoes.md` (seção “Fluxo obrigatório ao implementar”). Os campos `Casos de teste` e `Cobertura: pendente/coberto` foram adicionados ao template de regras — servem como checklist de dívida técnica visível.

### Tailwind CSS — manter como gerenciador de CSS custom properties

**O que:** Tailwind v4 não está sendo usado para utility classes. O `globals.css` usa `@import “tailwindcss”` + `@theme {}` para definir CSS custom properties do DS (`--color-primary-main`, `--spacing-sm`, etc.).

**Por quê:** Remover o Tailwind exigiria substituir o `@theme {}` por `:root {}` — mudança trivial mas sem impacto visível. Manter deixa a porta aberta para consumir as variáveis via CSS puro no futuro (ex: Storybook themes, eventual migração incremental). Não adotar utility classes: conflitariam com o Emotion/MUI e criariam dois sistemas de estilo concorrentes.

**No futuro:** Não usar Tailwind utility classes em componentes. O `@theme {}` continua sendo a única fonte de CSS custom properties do DS.

### Estratégia de testes — lean e focada em lógica

**O que:** DS atoms (Button, TextField, etc.) **não** recebem testes RTL. São protegidos pelo Chromatic via Storybook (regressão visual). Testes RTL ficam restritos a componentes com lógica de interação (filtros, modais, formulários). Vitest cobre a camada de domínio (utils, adapters, selectors, repositories, providers).

**Por quê:** Testar cada átomo com RTL seria alto custo de manutenção para baixo retorno — uma regressão visual em um átomo é óbvia imediatamente para qualquer usuário. Chromatic faz isso com zero manutenção aproveitando as 51 stories já existentes.

**No futuro:** Quando o Chromatic for configurado, integrá-lo ao pipeline de PR como gate obrigatório para mudanças visuais no DS.

**No futuro:** Adapters de fila **devem** retornar `WorkQueueCard`; não voltar a usar `Record<string, unknown>` para cards/filtros. Se um campo novo surgir no card, adicioná-lo em `types.ts` (a interface tem index signature `[key: string]: unknown` como rede de segurança, mas campos conhecidos devem ser declarados). Próximo passo de tipagem são apenas as stories do Storybook.

## 2026-06 - Dialogos de confirmacao usam ModalDialog canonico

**O que:** Confirmacoes destrutivas ou sensiveis devem usar `src/components/ds/atoms/Modal/ModalDialog.tsx`, em vez de montar `Modal` manual com footer proprio. O `ModalDialog` passou a centralizar largura, footer, overlay, tipografia de mensagem em `typography.styles.body2` e aceita `children` para mensagens com conteudo composto.

**Por que:** Havia confirmacoes visualmente semelhantes com tamanhos e tipografias diferentes. Centralizar no DS evita divergencia entre "Excluir visualizacao", "Remover agendamento" e "Excluir tag pessoal", e impede que configs de modulo controlem detalhes visuais como fonte de dialogo.

**No futuro:** Para dialogos simples de confirmacao, usar largura padrao de `504px` com `maxWidth: 95vw`. Nao usar modal "hug" para confirmacoes: a largura fixa pequena estabiliza leitura, alinhamento dos botoes e comparabilidade entre fluxos. Modal "hug" fica reservado para popovers ou conteudos muito curtos e contextuais, nao para dialogos de decisao. Confirmacoes abertas a partir de uma modal devem empilhar sobre a modal de origem, preservando o contexto ao fundo; formularios ou etapas novas devem substituir a modal anterior.

---

## 2026-06 - Elegibilidade de acoes em lote na fila

**O que:** A elegibilidade de acoes em lote da Fila de Trabalho passou a usar um helper puro (`getBulkActionEligibility`) em `workQueueUtils.ts`, com dois modos: `partial` para acoes seguras que podem aplicar apenas nos itens elegiveis, e `all` para acoes criticas que exigem toda a selecao elegivel.

**Por que:** Na aba "Todos"/"Todas", a selecao pode misturar estados diferentes. Centralizar a regra evita que cada botao decida sozinho como tratar selecao mista, reduz divergencias entre fila de processos e fila de tarefas, e deixa o comportamento testavel sem depender da UI.

**No futuro:** Ao adicionar nova acao em lote, classificar primeiro se ela e `partial` ou `all`. Use `partial` para acoes idempotentes ou reversiveis com feedback de itens ignorados; use `all` para acoes destrutivas, sensiveis ou que podem gerar efeito inconsistente se aplicadas parcialmente.

---

## 2026-06 - Exibicao responsiva de tags nos cards

**O que:** A renderizacao de tags em cards de processos e tarefas foi centralizada em `TagChipList`. O componente mede a largura disponivel, mantem chips completos quando cabem em uma linha e troca para modo compacto quando ha excesso nos cards. O indicador `+N` aparece apenas se os icones compactos tambem nao couberem; em paineis de detalhe, o mesmo componente pode manter tags completas em uma linha e abrir as excedentes em popover. Esse popover deve abracar o conteudo, manter labels em `nowrap`, respeitar limite de viewport e preservar tooltip nos icones de tipo da tag.

**Por que:** Tags eram renderizadas diretamente nos cards e podiam estourar ou desaparecer quando havia muitas tags. Centralizar o comportamento evita regras diferentes entre processos e tarefas e mantem os cards com altura/leitura previsivel.

**No futuro:** Novas listas compactas de tags devem usar `TagChipList`, nao mapear `TagChip` diretamente dentro de cards ou paineis. Nao criar limite de negocio para quantidade de tags aplicadas sem decisao explicita; limitar apenas a exibicao.

---

## 2026-06 - Tooltip responsivo para textos longos

**O que:** Tooltips customizados que precisam exibir textos longos devem usar `ResponsiveTooltip`, mantendo o `HintMain` do DS, mas com quebra de linha, largura maxima baseada na viewport e posicionamento que evita corte lateral.

**Por que:** Cada componente calculava posicao e largura do tooltip localmente, o que causava corte quando o conteudo era longo ou quando o anchor estava perto da borda da tela. Centralizar evita variacoes visuais e protege labels completos em tags compactas e indicadores `+N`.

**No futuro:** Ao adicionar tooltip para conteudo dinamico ou potencialmente longo, usar `ResponsiveTooltip` em vez de portal manual com `HintMain`. Tooltips curtos e puramente DS podem continuar usando o componente DS diretamente.

---

## 2026-06 - Navegacao do portal separa modulo de funcionalidade

**O que:** A navegacao do Portal passou a separar `activeModuleId` e `activeFeatureId`. `activeModuleId` controla apenas o menu lateral/contexto do modulo selecionado; `activeFeatureId` controla o conteudo principal. O frame estrutural da area principal foi centralizado em `src/shell/PortalContent.tsx`, usado por Fila de Trabalho e ORG. Excecao: FILA e a propria funcionalidade operacional; ao clicar em FILA, o Portal ativa diretamente `fila.trabalho`, iniciando em Processos/Documentos > Visualizacao padrao.

**Por que:** O comportamento anterior fazia o clique em modulo trocar automaticamente a tela. Isso tratava os modulos como sistemas independentes e quebrava o modelo esperado do Portal de Aplicacoes: modulo e agrupamento funcional; funcionalidade e quem troca conteudo. Tambem havia containers diferentes entre Fila e ORG, com cada pagina recriando fundo, padding, radius e sombra.

**No futuro:** Clique na barra de modulos, em regra, nao deve renderizar tela nova por si so. Sidebars de modulo devem chamar uma selecao de funcionalidade, usando ids estaveis no formato `modulo.funcionalidade`. Para FILA, manter a excecao: selecionar o modulo leva direto para `fila.trabalho`; Processos/Documentos e Tarefas continuam sendo paginas internas do `FilaModule`, nao funcionalidades globais separadas. Novas telas devem usar `PortalContent` como frame principal e fornecer apenas o conteudo interno.

---

## 2026-06 - Modulo ORG com conteudo real

> Nota: esta decisao foi refinada pela entrada "Navegacao do portal separa modulo de funcionalidade". O ORG continua tendo conteudo real, mas ele nao e mais carregado apenas pela troca do modulo; depende de `activeFeatureId`.

**O que:** O modulo ORG passou a ter `OrgModule` lazy-loaded em `App.tsx`, mantendo `OrgSidebar` como sidebar estatica e renderizando a pagina `EstruturasOrganizacionaisPage` como conteudo real no lugar do placeholder.

**Por que:** O shell global ja sabe alternar modulos por `activeModuleId`; a forma mais coerente de evoluir o ORG e substituir apenas o conteudo do modulo, sem criar rota ou acoplar comportamento novo ao shell.

**No futuro:** Novas funcionalidades do ORG devem entrar em `src/modules/org/pages` ou `components`, com dados em `domain/org` quando representarem entidade de negocio. Atualizar `src/modules/org/docs/mapa-funcional.md` e `regras-*.md` no mesmo movimento.

---

## 2026-06 - Contorno automatico para cores claras de tags

**O que:** A decisao de aplicar contorno em cores de tag com baixo contraste contra fundo claro foi centralizada em `tagColorVisual.ts`. Dropdown de categorias, gerenciamento, criacao/edicao e chips passam a consumir a mesma regra.

**Por que:** Cores validas como branco ou cinzas claros desaparecem em fundos claros se cada tela renderizar apenas o preenchimento. A regra compartilhada preserva a escolha do usuario e protege a legibilidade sem criar excecoes por componente.

**No futuro:** Qualquer novo ponto que exiba a cor de uma tag deve usar `resolveTagVisualColor()` e `getTagColorBorderStyle()` ou `getTagIconOutlineStyle()`. Nao bloquear combinacoes de cor de texto e borda sem decisao de produto; por enquanto o sistema corrige apenas contraste da cor da tag contra o fundo externo.

---
