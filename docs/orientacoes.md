# Orientações para Trabalhar no Projeto

Este guia é o ponto de entrada obrigatório para qualquer pessoa — humana ou IA —
que vá interagir com o projeto `frontend-solarbpm`. Leia antes de implementar
qualquer coisa.

---

## O que é este projeto

`frontend-solarbpm` é o front-end do sistema SolarBPM, nascendo como protótipo da
Fila de Trabalho e evoluindo gradualmente para o Solar BPM 2.0.

O projeto usa mocks em vez de API real. Quando a API existir, apenas a camada de
`repositories` muda — o restante do código permanece intacto.

---

## Stack e ambiente de desenvolvimento

| Camada | Tecnologia |
|---|---|
| Build / Dev server | **Vite v6** (`npm start` → `localhost:3000`) |
| Framework | **React 19** |
| Linguagem | **TypeScript 6** strict — 0 erros, 0 `@ts-nocheck` no código funcional |
| Dados assíncronos | **React Query** (`@tanstack/react-query`) — ⏳ pendente (ver `docs/evolucao/`) |
| Roteamento | **React Router v7** — ⏳ pendente (ver `docs/evolucao/`) |
| UI library | **MUI v9** + Emotion (sempre via camada `components/ds/` — nunca diretamente) |
| CSS utilitário | **Tailwind CSS v4** (config via `@theme {}` em `src/styles/globals.css`) |
| Design tokens | `src/styles/tokens/` — cores, tipografia, sombras, bordas, espaçamentos |
| Storybook | v8 com builder Vite (`npm run storybook` → `localhost:6006`) |
| Qualidade | **ESLint v9** + **Prettier 3** — 0 erros e 0 warnings antes de qualquer commit |
| Testes | Vitest · React Testing Library · Playwright · Chromatic |
| Node | **22 LTS** (`.nvmrc` na raiz) |

```bash
npm start          # dev server em localhost:3000
npm run build      # build de produção
npm run lint       # ESLint — deve retornar 0 erros e 0 warnings
npm run format     # Prettier
npm test           # Vitest (unit + integration)
npm run test:e2e   # Playwright (E2E)
npm run storybook  # Storybook em localhost:6006
```

### Path alias

```ts
// correto
import { colors } from '@/styles/tokens/colors';

// evitar — frágil a movimentações de arquivo
import { colors } from '../../../styles/tokens/colors';
```

---

## Como a IA deve se comportar neste projeto

**Antes de qualquer implementação, a IA deve:**

1. Ler este arquivo (`docs/orientacoes.md`).
2. Ler `docs/architecture/project-structure.md`.
3. Ler `docs/padroes/checklist.md`.
4. Se a tarefa envolve dados: ler `docs/architecture/data-flow.md`.
5. Se o módulo tem `mapa-funcional.md`: consultar antes de alterar qualquer arquivo.
6. Se o módulo tem `regras-*.md`: verificar se a mudança contradiz regra documentada.
7. Executar análise de impacto transversal (ver seção abaixo).

**A IA não deve:**

- Colocar lógica de domínio dentro de componentes de UI.
- Criar componentes específicos de módulo em `components/custom/` ou `components/ds/`.
- Criar imports entre módulos (ex.: fila-trabalho importando de solar diretamente).
- Colocar layout estrutural (padding, gap, cores de fundo) em arquivos de config.
- Usar valores hardcoded de cor, sombra, radius ou espaçamento — sempre tokens.
- Importar `domain/` dentro de `components/ds/`.
- Implementar sem verificar se o Figma existe como referência visual.
- Commitar com erros de ESLint, TypeScript ou build quebrado.

---

## Fluxo de dados — resumo

**Estado atual do fluxo (enquanto as Fases 1-3 não são executadas):**
```
Page → Repository / Selector → Mock
```

**Estado alvo após execução do plano arquitetural:**
```
Page → Hook (React Query) → Service → Repository → DataSource
```

- **Page/Component:** só recebe dados via hook, nunca chama repository diretamente
- **Hook:** encapsula `useQuery`/`useMutation`, expõe loading/error/data
- **Service** (`modules/{mod}/services/`): orquestra repositories + adapters, sem React
- **Repository** (`domain/{entidade}/repositories/`): único ponto de acesso a dados
- **DataSource:** mock hoje → Supabase / API REST futuramente (só repository muda)

> ⏳ A regra "Pages não chamam repositories diretamente" (regra 12) é o **estado alvo**, não o atual. Hoje as páginas ainda chamam selectors e repositories diretamente — isso muda após a execução das Fases 1-3.

Guia completo: [`docs/architecture/data-flow.md`](./architecture/data-flow.md)
Padrão de services e quando criar cada camada: [`docs/architecture/data-flow.md`](./architecture/data-flow.md)

---

## Estrutura do projeto

```
src/
  shell/              # AppShell, assets, config de header/sidebar
  modules/            # Um diretório por módulo funcional
    fila-trabalho/    # pages/, components/, providers/, adapters/, selectors/,
                      # fields/, config/, utils/, docs/
                      # ⏳ services/ e hooks/ criados nas Fases 2-3
    solar/            # painel de detalhe de processo/documento
    [outros módulos]  # estrutura idêntica ao fila-trabalho
  components/
    ds/               # Design System puro — nunca importa domain/ ou modules/
    app/              # Componentes compartilhados com convenções da app
    custom/           # Componentes em transição (promover ou mover ao usar)
  domain/             # Regras e dados de negócio — nunca importa React
    processos/        # mocks/, models/, repositories/, adapters/, selectors/
    filtros/          # dateRange.ts, filterModel.ts
    categorias/       # tipos e mocks de tags
  application/
    providers/        # Providers React transversais (Categorias, Tarefas, Favorites)
    # queryClient.ts  # ⏳ criado na Fase 3 (React Query)
    # queryKeys.ts    # ⏳ criado na Fase 3 (React Query)
    # http/           # ⏳ criado quando API existir
  styles/tokens/      # colors, typography, shadows, borders, spacing, layout
```

Detalhes completos: [`docs/architecture/project-structure.md`](./architecture/project-structure.md)

---

## Onde cada coisa mora — referência rápida

| O que | Onde fica |
|---|---|
| Shell do portal | `src/shell/AppShell.tsx` |
| Fila de processos | `src/modules/fila-trabalho/pages/fila-processos/` |
| Fila de tarefas | `src/modules/fila-trabalho/pages/fila-tarefas/` |
| Modais da fila | `src/modules/fila-trabalho/components/` |
| Painel de detalhe de processo | `src/modules/solar/processos/components/ProcessoDetalhePanel.tsx` |
| Providers de estado global | `src/application/providers/` |
| Hooks de dados | `src/modules/{modulo}/hooks/` — ⏳ criados na Fase 3 |
| Services | `src/modules/{modulo}/services/` — ⏳ criados na Fase 2 |
| Repositories | `src/domain/{entidade}/repositories/` |
| Design system | `src/components/ds/atoms/` |
| Tokens de cor | `src/styles/tokens/colors.ts` |
| Tokens de espaçamento | `src/styles/tokens/spacing.ts` |
| Tokens de layout | `src/styles/tokens/layout.ts` |
| Mapa funcional da fila | `src/modules/fila-trabalho/docs/mapa-funcional.md` |
| Regras de negócio da fila | `src/modules/fila-trabalho/docs/regras-fila-trabalho.md` |
| Plano de evolução arquitetural | `docs/evolucao/plano.md` |

---

## Regras invioláveis

1. **`domain/` não tem React.** Nenhum import de React, hooks, componentes ou providers.
2. **`components/ds/` não conhece o produto.** Sem imports de `domain/`, `modules/` ou configs de feature.
3. **Módulos não se importam entre si.** Dados compartilhados vêm de `domain/`.
4. **Config não controla layout.** Padding, gap, cores e sombras ficam nos componentes.
5. **Tokens primeiro — sem exceção.** Nenhum valor hardcoded de cor, sombra, radius ou espaçamento. Ver [`docs/padroes/design-system.md`](./padroes/design-system.md).
6. **Figma é a referência visual.** Quando houver dúvida sobre layout, cor ou comportamento, o Figma decide.
7. **Re-exports de compatibilidade não são fonte canônica.** Arquivos com `// Movido para...` são pontes temporárias.
8. **Nenhuma inconsistência fica para trás.** Documentação desatualizada, padrões antigos que contradizem o novo e arquivos órfãos devem ser corrigidos no mesmo commit.
9. **Todo componente novo vai para o Storybook.** Ver [`docs/padroes/storybook.md`](./padroes/storybook.md).
10. **Texto em português com acentuação correta.** Nunca `"Descricao"`, `"Orgao"` — sempre `"Descrição"`, `"Órgão"`.
11. **Tooltip nunca pode transbordar a viewport.** Sempre usar `<Tooltip content="...">` — nunca `position: fixed` manual.
12. **Pages não chamam repositories diretamente.** O fluxo alvo é Page → Hook → Service → Repository. ⏳ Hoje as páginas ainda chamam selectors diretamente — isso muda após as Fases 1-3.

---

## Sinais de que a arquitetura está sendo violada

- `components/ds/` importando de `modules/` ou `domain/`
- Uma página importando diretamente de outra página de módulo diferente
- Lógica de filtragem ou ordenação dentro de JSX
- Config com valores de padding, gap ou cor de background
- Strings de cor hexadecimal (`'#XXXXXX'`) ou pixels soltos (`'8px'`) no código
- Service importando hooks ou componentes React
- Hook chamando repository diretamente (sem service)
- Labels com palavras portuguesas sem acento

---

## Análise de Impacto — Diretriz Obrigatória

Toda criação ou alteração exige identificar o que mais no sistema é afetado **antes** de implementar.

| O que muda | Onde buscar impacto |
|---|---|
| Componente DS ou App | Todos os módulos que importam o componente |
| Entidade de domínio | Adapters, selectors, repositories, mocks e páginas |
| Service ou Repository | Todos os hooks que os chamam |
| Token de design | Componentes que referenciam o token |
| Shell ou PortalContent | Todas as funcionalidades |

**Após implementar:** atualizar `mapa-funcional.md` do módulo e `regras-*.md` se o impacto envolver regra de negócio.

---

## Mapa Funcional — Diretriz Obrigatória

Cada módulo tem `src/modules/{modulo}/docs/mapa-funcional.md` com o DE/PARA entre nome funcional e arquivos do código.

A IA deve consultar o mapa antes de alterar funcionalidades existentes e atualizar o mapa ao concluir qualquer implementação que mude caminhos ou responsabilidades.

| Módulo | Mapa |
|---|---|
| Fila de Trabalho | `src/modules/fila-trabalho/docs/mapa-funcional.md` |

---

## Documentação de regras de negócio

Guia completo: [`docs/padroes/regras-de-negocio.md`](./padroes/regras-de-negocio.md)

Resumo obrigatório:
- Toda funcionalidade com comportamento não-óbvio tem `regras-{funcionalidade}.md` dentro do módulo
- Cada regra tem código `RN-{SIGLA}-{SEQ}` e ao menos um teste com `it('RN-XX-YY: ...')`
- `Cobertura: pendente` = dívida técnica visível; `Cobertura: coberto` = teste existe e passa

---

## Testes automatizados

Guia completo: [`docs/padroes/testes.md`](./padroes/testes.md)

Cadeia obrigatória:
```
Funcionalidade → Regra RN-* documentada → Casos de teste → .test.ts com it('RN-*') → CI verde
```

Cobertura esperada: `domain/` 100% · `providers/` ≥ 90% · componentes com regra ≥ 70%.

---

## Storybook

Guia completo: [`docs/padroes/storybook.md`](./padroes/storybook.md)

Prefixos obrigatórios: `00-Foundations/` · `01-DS/` · `02-App/` · `03-Custom/`
Story desatualizada = documentação mentirosa — atualizar no mesmo commit que o componente.

---

## Evolução arquitetural

O projeto tem um plano de evolução com 3 fases arquiteturais **pendentes de implementação**:

| Fase | O que é | Status |
|---|---|---|
| Fase 1 | Camada de Services | ✅ Concluída |
| Fase 2 | React Query | ⏳ Pendente |
| Fase 3 | React Router v7 | ⏳ Pendente |

Plano completo com contexto, guias de execução e pós-execução: [`docs/evolucao/plano.md`](./evolucao/plano.md)

---

## Manutenção automática dos docs — validação de links

O CI valida automaticamente que todos os links locais dentro dos arquivos de
documentação apontam para arquivos que existem:

```bash
npm run validate:docs   # passa: todos os links resolvem para arquivos reais
                        # falha: algum link está quebrado (arquivo movido/renomeado/removido)
```

**O que isso detecta:** arquivo movido ou renomeado sem atualizar o doc que o referencia.
**O que isso NÃO detecta:** conteúdo semanticamente desatualizado (ex.: nome de função renomeado mas doc não atualizado). Para esse caso, a regra 8 é a salvaguarda.

**Quando adicionar ao script:** ao criar um novo arquivo de documentação, adicionar o
caminho em `scripts/validate-docs.js` no array `DOC_FILES`.

---

## Onde cada aprendizado novo vai — decisão obrigatória

A documentação cresce junto com o projeto — mas só o que pertence a cada lugar. Esta tabela é a regra de decisão:

| Tipo de aprendizado | Onde registrar |
|---|---|
| Decisão arquitetural não-óbvia, padrão novo, armadilha evitada | `docs/learnings.md` |
| Regra de negócio nova ou alterada em um módulo | `src/modules/{mod}/docs/regras-*.md` |
| Arquivo movido, renomeado ou com nova responsabilidade | `src/modules/{mod}/docs/mapa-funcional.md` |
| Padrão global de Storybook alterado | `docs/padroes/storybook.md` |
| Padrão global de testes alterado | `docs/padroes/testes.md` |
| Regra do fluxo de dados alterada (service, hook, repo) | `docs/architecture/data-flow.md` |
| Mudança na estrutura de pastas do projeto | `docs/architecture/project-structure.md` |
| Fase de evolução concluída | `docs/evolucao/plano.md` (atualizar status) |
| Nova regra que todo dev/IA precisa saber sempre | `docs/orientacoes.md` |

**O que NÃO fazer:**
- Criar um doc novo quando o aprendizado se encaixa em um doc já existente
- Registrar em `learnings.md` algo que pertence a `regras-*.md` (aprend. arquitetural ≠ regra funcional)
- Deixar de registrar porque "parece óbvio" — o que é óbvio hoje não será em 6 meses

## Protocolo de encerramento — obrigatório após qualquer implementação

Execute este protocolo antes de considerar uma sessão concluída.
Percorra cada gatilho e execute a ação se aplicável.

| Gatilho | Ação obrigatória |
|---|---|
| Arquivo criado, movido ou renomeado | Atualizar `mapa-funcional.md` do módulo + rodar `npm run validate:docs` |
| Nova tela, modal, painel ou fluxo criado | Adicionar entrada em `mapa-funcional.md` com arquivo principal, providers e componentes DS |
| Regra de negócio criada ou alterada | Atualizar `regras-*.md` do módulo + garantir `it('RN-XX-YY: ...')` no teste |
| Padrão de código novo adotado | Atualizar doc em `docs/padroes/` + registrar decisão em `docs/learnings.md` |
| Fluxo de dados ou camadas alterados | Atualizar `docs/architecture/data-flow.md` + `project-structure.md` se pastas mudaram |
| Fase de evolução concluída | Atualizar ✅ em `docs/evolucao/plano.md` + tabela de stack em `docs/orientacoes.md` |
| Nova regra global (toda IA/dev precisa saber) | Adicionar em `docs/orientacoes.md` — seção "Regras invioláveis" |
| Novo arquivo de documentação criado | Adicionar em `scripts/validate-docs.js` → `DOC_FILES` + entrada em `docs/README.md` |

**Validação final obrigatória antes de encerrar:**

```bash
npm run validate:docs   # links de docs — 0 erros
npm run lint            # 0 erros e 0 warnings
npx tsc --noEmit        # 0 erros de TypeScript
```

---

## Protocolo de aprendizado contínuo

Registrar em `docs/learnings.md` ao final de qualquer sessão em que:
- uma decisão arquitetural não-óbvia foi tomada
- um padrão novo foi estabelecido
- uma fronteira de camada foi aplicada de forma não-trivial
- uma armadilha foi identificada e evitada

Não registrar: bugs visuais, ajustes de padding, features comuns sem decisão estrutural.

---

## Documentação completa — índice

| Documento | O que contém |
|---|---|
| [`docs/orientacoes.md`](./orientacoes.md) | **Este arquivo** — regras, princípios, referências rápidas |
| [`docs/learnings.md`](./learnings.md) | Decisões arquiteturais históricas (atualizar a cada sessão relevante) |
| [`docs/architecture/project-structure.md`](./architecture/project-structure.md) | Estrutura de pastas e camadas detalhada |
| [`docs/architecture/data-flow.md`](./architecture/data-flow.md) | Fluxo Page→Hook→Service→Repository, quando criar cada camada, testes |
| [`docs/evolucao/plano.md`](./evolucao/plano.md) | Plano das 3 fases arquiteturais + status |
| [`docs/evolucao/fase-2-services.md`](./evolucao/fase-2-services.md) | Fase 1 ✅ — Services (concluída) |
| [`docs/evolucao/fase-2-react-query.md`](./evolucao/fase-2-react-query.md) | Fase 2 — React Query |
| [`docs/evolucao/fase-3-react-router.md`](./evolucao/fase-3-react-router.md) | Fase 3 — React Router v7 |
| [`docs/padroes/checklist.md`](./padroes/checklist.md) | ✅ Checklist pré e pós-implementação |
| [`docs/padroes/componentes-e-telas.md`](./padroes/componentes-e-telas.md) | Onde cada componente vive, como implementar telas e modais |
| [`docs/padroes/design-system.md`](./padroes/design-system.md) | Tokens e DS — tabela hardcode→token |
| [`docs/padroes/ux-responsividade.md`](./padroes/ux-responsividade.md) | UX, responsividade, estados obrigatórios |
| [`docs/padroes/storybook.md`](./padroes/storybook.md) | Convenções do Storybook |
| [`docs/padroes/testes.md`](./padroes/testes.md) | Estratégia e convenções de testes |
| [`docs/padroes/regras-de-negocio.md`](./padroes/regras-de-negocio.md) | Template e convenção de RN-* |
