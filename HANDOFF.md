# HANDOFF — SolarBPM Fila de Trabalho

> Data: 2026-06-25
> Stack: React 19 + Vite v6 + TypeScript 6 strict + MUI v9 (somente via `components/ds/`) + Tailwind CSS v4 + tokens em `src/styles/tokens/`
> Node: 22 LTS (`.nvmrc` na raiz — valor `22`)

---

## O que é esse projeto

Frontend do sistema **SolarBPM**, nascendo como protótipo funcional da Fila de Trabalho e evoluindo para o Solar BPM 2.0. O produto exibe filas de processos e tarefas para servidores públicos, com filtragem, ordenação, categorização por tags, painel lateral de detalhes, visualizações personalizadas e ações em lote (receber, atribuir, agendar, colocar fora da fila). **Todo o backend é mock** — não existe API real em nenhuma camada.

---

## Como rodar localmente

```bash
# Pré-requisito: Node 22 LTS (use nvm use ou instale diretamente)
npm install
npm start
# Abre automaticamente em http://localhost:3000
```

Não há variáveis de ambiente necessárias neste estágio — veja a seção abaixo.

Outros comandos úteis:
```bash
npm run build          # build de produção (saída em dist/)
npm test               # 222 testes unitários + integração (Vitest)
npm run test:e2e       # 10 testes E2E (Playwright, headless)
npm run storybook      # Storybook em localhost:6006 — 51 stories do DS
npm run lint           # ESLint v9 — deve retornar 0 erros e 0 warnings
npx tsc --noEmit       # TypeScript strict — deve retornar 0 erros
npm run validate:docs  # valida links internos da documentação (31 links)
```

---

## Variáveis de ambiente

**Nenhuma variável de ambiente está em uso neste estágio.** Não há `VITE_*` referenciado no código, e não existe arquivo `.env.example` na raiz.

> ⚠️ a confirmar: quando a integração com a API real começar, será necessário criar `.env.example` com as variáveis do backend (URL base, chaves de auth, etc.). Isso ainda não foi definido. O arquivo deve ser criado e commitado nesse momento.

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| *(nenhuma no momento)* | — | — |

**Chromatic** (regressão visual do DS): requer `CHROMATIC_PROJECT_TOKEN` como secret no GitHub Actions. Veja `TESTES.md` para instruções de configuração inicial.

---

## Estrutura do projeto

```
src/
  App.tsx                         # Roteamento por estado (sem React Router) — monta FilaModule
  index.tsx                       # Entry point

  shell/                          # AppShell, HeaderBar, SideMenu, config de sidebar e header
    AppShell.tsx                  # Layout principal: header fixo + sidebar + conteúdo
    config/
      sidebar.config.ts           # ⚠️ Contém nome real hardcoded (ver Segurança)

  modules/                        # Um diretório por módulo funcional
    fila-trabalho/                # Módulo principal — única funcionalidade implementada de fato
      FilaModule.tsx              # Ponto de entrada do módulo; monta providers e seleciona aba
      WorkQueue.tsx               # Layout compartilhado das duas filas (toolbar, paginação, slots)
      pages/
        fila-processos/
          FilaDeProcessos.tsx     # 1428 linhas — fila de processos/documentos
        fila-tarefas/
          FilaDeTarefas.tsx       # 1266 linhas — fila de tarefas
      components/                 # Modais e painéis do módulo (filtros, visualização, personalizar)
      providers/                  # CustomViewsProvider — filtros e visualizações persistidas
      adapters/                   # processoToWorkQueue, tarefaToWorkQueue
      selectors/                  # Filtros e queries sobre os mocks de domínio
      services/                   # processos.service.ts, tarefas.service.ts (Fase 1 ✅)
      config/                     # Configuração de campos, labels e comportamentos das filas
      docs/                       # mapa-funcional.md, regras-fila-trabalho.md
      hooks/                      # ⏳ criados na Fase 2 (React Query — pendente)

    solar/                        # Painel de detalhe de processo
      processos/
        components/
          ProcessoDetalhePanel.tsx  # 987 linhas — overlay de detalhe com tabs, lembretes, tarefas
          processo-detalhe/
            ProcessoTarefasTab.tsx  # 862 linhas — tab de tarefas do painel de detalhe

    _shared/                      # PlaceholderModule para módulos não implementados
    bpm/ busca/ ces/ ecm/ fav/ org/ seg/ wflow/  # Módulos placeholder (sidebars apenas)

  components/
    ds/atoms/                     # Design System puro — Button, Card, Modal, Table, Steps, etc.
                                  # Nunca importa domain/ nem modules/
    app/                          # Componentes compartilhados com convenções da app
    custom/                       # Componentes em transição (promover ou mover ao usar)
      ProcessoDetalhePanel.tsx    # Re-export de modules/solar — existe mas NÃO é usado pelas páginas

  domain/                         # Regras e dados de negócio — sem React
    processos/
      mocks/                      # Dados mock de processos
      models/                     # Tipos TypeScript do domínio
      repositories/               # Único ponto de acesso a dados — aqui que a API entra
      adapters/                   # Transformação de dados entre domínio e UI
      selectors/                  # Queries e filtros sobre os mocks
      tarefas/                    # Estrutura espelhada para tarefas

    categorias/                   # Tipos e mocks de tags/categorias
    filtros/                      # dateRange.ts, filterModel.ts
    usuario/                      # usuario.mock.ts

  application/
    providers/                    # Providers React transversais
      CategoriasProvider.tsx      # Tags e categorias — compartilhado entre processos e tarefas
      TarefasProvider.tsx         # Estado de atribuição de tarefas
      FavoritesProvider.tsx       # Favoritos

  shared/
    hooks/
      useViewportWidth.ts         # Hook compartilhado de largura da janela

  styles/
    tokens/                       # colors.ts, typography.ts, shadows.ts, spacing.ts,
                                  # borders.ts, layout.ts, size.ts, opacity.ts
    globals.css                   # Tailwind CSS v4 via @theme {}

docs/
  orientacoes.md                  # LEIA PRIMEIRO — regras, stack, fluxo de dados, checklist
  architecture/
    project-structure.md          # Estrutura de pastas e camadas detalhada
    data-flow.md                  # Fluxo Page→Hook→Service→Repository
  evolucao/
    plano.md                      # Plano das 3 fases arquiteturais + status
    fase-2-services.md            # Fase 1 ✅ concluída
    fase-2-react-query.md         # Fase 2 ⏳ pendente
    fase-3-react-router.md        # Fase 3 ⏳ pendente
  padroes/                        # checklist.md, design-system.md, testes.md, storybook.md
  learnings.md                    # Decisões arquiteturais históricas

tests/
  support/render.tsx              # Wrapper RTL com todos os providers (usar em novos testes)
  support/fixtures/               # Mocks do domínio reutilizáveis
  e2e/                            # 10 testes Playwright
```

---

## O que está implementado

- ✅ **Fila de Processos/Documentos** — listagem com filtros, ordenação, paginação, seleção em lote, expansão de cards, campos configuráveis, recebimento em lote
- ✅ **Fila de Tarefas** — listagem com filtros, ordenação, paginação, atribuição/desatribuição, agendamento, expansão de cards
- ✅ **Painel lateral de tarefa** — detalhes, ações (atribuir, agendar, editar, cancelar)
- ✅ **Painel de detalhe de processo** — overlay de tela cheia com tabs (detalhes, documentos, tarefas, lembretes, histórico), navegação prev/next entre processos
- ✅ **Modal de filtros** — filtros avançados com suporte a filtros travados por visualização ativa
- ✅ **Visualizações personalizadas** — criação, edição, fixação na sidebar, filtros pré-aplicados
- ✅ **Personalização de campos do card** — escolha de campos principais e extras por fila
- ✅ **Categorias e Tags** — criação, aplicação, exclusão de tags por processo e por tarefa
- ✅ **Fora da fila / Prazo** — mover processos com data de retorno
- ✅ **Lembretes de processo** — exibição via modal a partir do card
- ✅ **Design System** — 51 stories no Storybook, componentes DS isolados em `components/ds/atoms/`
- ✅ **Testes** — 222 testes unitários/integração + 10 E2E Playwright + CI/CD no GitHub Actions
- ✅ **Camada de Services** (Fase 1) — `processos.service.ts` e `tarefas.service.ts` criados

---

## O que ainda é mock — ATENÇÃO: 100% MOCK, SEM API REAL

> Esta é a armadilha mais comum para quem herda o projeto. O frontend funciona completamente, as interações respondem, os dados aparecem — mas tudo vem de arquivos TypeScript estáticos em `src/domain/*/mocks/`. Não existe backend, não existe API, não existe autenticação.

| O que parece funcional | Onde está o mock | O que conectar |
|------------------------|-----------------|----------------|
| Lista de processos | `src/domain/processos/mocks/processosBase.mock.ts` | Substituir `ProcessosRepository` por chamada real |
| Lista de tarefas | `src/domain/processos/tarefas/` (mocks internos) | Substituir `TarefasRepository` por chamada real |
| Dados do usuário logado | `src/domain/usuario/usuario.mock.ts` + default hardcoded | Integrar com auth real |
| Receber processos | Estado local em `FilaDeProcessos.tsx` via `fieldOverrideMap` | Persistir via API |
| Atribuição de tarefas | `TarefasProvider.tsx` em memória | Persistir via API |
| Agendamento de tarefas | Estado local em `FilaDeTarefas.tsx` | Persistir via API |
| Tags e categorias | `CategoriasProvider.tsx` em memória | Persistir via API |
| Visualizações personalizadas | `CustomViewsProvider.tsx` em memória | Persistir no backend ou localStorage |
| Lembretes | Campo `indicadores.lembretes` nos mocks de processo | Conectar com backend |
| Favoritos | `FavoritesProvider.tsx` em memória | Persistir no backend ou localStorage |

**Onde a troca acontece:** exclusivamente nos `repositories/` em `src/domain/*/repositories/`. Tudo acima (services, providers, páginas) permanece intacto na troca mock → API real. Isso é uma garantia contratual de arquitetura — não criar atalhos.

**Fluxo alvo após integração com API:**
```
Page → Hook (React Query) → Service → Repository → API real
```

As Fases 2 e 3 (React Query e React Router v7) estão documentadas e prontas para execução em `docs/evolucao/plano.md`.

---

## Decisões técnicas tomadas

- **MUI v9 exclusivamente via `components/ds/`** — nenhuma página importa `@mui/material` diretamente. A camada DS isola o produto de mudanças de versão da biblioteca. Violá-la cria dependência oculta que explode na primeira atualização.

- **Tokens de design obrigatórios** — nenhum valor hardcoded de cor, sombra, radius ou espaçamento. Os tokens vivem em `src/styles/tokens/`. Já existem violações residuais em `ProcessoDetalhePanel.tsx` (~20 hexcodes em `PILL_STYLES` e mini-componentes) que precisam ser corrigidas ao tocar no arquivo.

- **Módulos não se importam entre si** — dados compartilhados passam por `domain/`. Existe uma violação conhecida e documentada: `FilaDeProcessos.tsx` e `FilaDeTarefas.tsx` importam `ProcessoDetalhePanel` diretamente de `modules/solar/processos/` em vez do re-export em `components/custom/ProcessoDetalhePanel.tsx`. Deve ser resolvido antes de qualquer nova funcionalidade cross-module.

- **Sem React Router** — roteamento por `useState` em `App.tsx`. As abas "Processos" e "Tarefas" são estados internos do `FilaModule`, não URLs. Isso muda na Fase 3.

- **`display:none` nas filas** — `FilaDeProcessos` e `FilaDeTarefas` são montadas simultaneamente no DOM com `display:none` alternando entre elas. Os testes E2E precisam tratar esse detalhe (ver `TESTES.md`, seção "Particularidade dos testes E2E").

- **Tailwind CSS v4** — configurado via `@theme {}` em `src/styles/globals.css`, sem `tailwind.config.js`. Está no projeto como utilitário, mas os tokens do DS têm precedência.

- **Storybook v10 + Vite builder** — 51 stories cobrindo todos os componentes DS. Regressão visual via Chromatic (requer configuração de token — veja `TESTES.md`).

- **TypeScript strict** — `noUnusedLocals: true`, `noUnusedParameters: true` no `tsconfig.json`. 0 erros exigidos antes de qualquer commit.

---

## O que o time tech precisa fazer primeiro

### 1. `npm audit fix` — executar agora (5 minutos)

Quatro CVEs ativos identificados na auditoria:

| Pacote | Advisory | Severidade | Impacto |
|--------|----------|-----------|---------|
| `vite <=6.4.2` | GHSA-v6wh-96g9-6wx3 | **High** | Vazamento de hash NTLMv2 via UNC no Windows (ambiente de dev atual) |
| `vite <=6.4.2` | GHSA-fx2h-pf6j-xcff | **High** | Bypass de `server.fs.deny` via caminhos alternativos no Windows |
| `@babel/core <=7.29.0` | GHSA-4x5r-pxfx-6jf8 | Low | Leitura arbitrária de arquivos no processo de build |
| `js-yaml <=4.1.1` | GHSA-h67p-54hq-rp68 | Moderate | DoS no tooling (ESLint/Storybook) |

```bash
npm audit fix
```

Os três últimos afetam apenas o tooling, não o bundle de produção. Os dois do Vite afetam o ambiente de desenvolvimento em Windows — que é exatamente onde o time trabalha.

### 2. Remover nome real hardcoded do código

Nome `'Rafael Vitorino'` aparece como valor default em dois arquivos e vai para o bundle de produção:

- `src/components/custom/UserSelector.tsx:9` — `nome = 'Rafael Vitorino'` → substituir por `''`
- `src/shell/config/sidebar.config.ts:6` — `nome: 'Rafael Vitorino'` → substituir por `''`

O mock em `src/domain/usuario/usuario.mock.ts` pode permanecer — está no contexto correto de dados fictícios.

### 3. Criar `vercel.json` com headers de segurança mínimos

O arquivo não existe. Para um sistema BPM com dados de processos de órgão público, os headers básicos são inegociáveis antes do primeiro deploy real:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

CSP pode vir na sequência — requer alinhamento sobre fontes externas carregadas (MUI, Emotion, Google Fonts). Os três headers acima são seguros e não quebram nada.

---

## Limitações conhecidas

- ⚠️ **Autenticação: inexistente** — não foi implementada nem projetada. É a maior lacuna funcional do projeto. Quando chegar, os casts `as never` em `FilaModule.tsx:88` e `as unknown as ProcessoDigital` / `as unknown as Tarefa` em `ProcessoDetalhePanel.tsx:449,461` vão surfaçar incompatibilidades de tipo com dados reais. Esses pontos precisam de revisão no momento da integração.

- ⚠️ **Componentes grandes** — quatro arquivos concentram lógica densa: `FilaDeProcessos.tsx` (1428 linhas), `FilaDeTarefas.tsx` (1266 linhas), `ProcessoDetalhePanel.tsx` (987 linhas), `ProcessoTarefasTab.tsx` (862 linhas). Estão cobertos por testes de integração RTL (happy path + empty state), mas qualquer refatoração exige rodar o CI completo.

- ⚠️ **Violação arquitetural conhecida** — `FilaDeProcessos.tsx` e `FilaDeTarefas.tsx` importam `ProcessoDetalhePanel` diretamente de `modules/solar/processos/`, violando a regra "módulos não se importam entre si". O re-export correto existe em `components/custom/ProcessoDetalhePanel.tsx` mas não é usado por nenhum consumidor. Deve ser resolvido antes de nova funcionalidade cross-module.

- ⚠️ **Hexcodes fora dos tokens** — `ProcessoDetalhePanel.tsx` tem ~20 literais de cor em `PILL_STYLES` (linhas 46–50) e mini-componentes `SmallIconBtn`/`CloseBtnX` (linhas 112–148) que não existem nos tokens. Se o design system mudar a paleta, esses valores ficam para trás silenciosamente.

- ⚠️ **`eslint-disable-next-line react-hooks/exhaustive-deps`** em `FilaDeTarefas.tsx:935` — o `useMemo` da sidebar tem supressão de regra de hooks. Pode ser falso positivo ou stale closure real. Não quebra nada hoje, mas requer revisão antes de adicionar lógica nessa vizinhança.

- ⚠️ **`README.md` ausente na raiz** — quem clona o repositório não vê instruções imediatamente. `docs/orientacoes.md` cumpre esse papel internamente, mas exige saber que o arquivo existe.

- ⚠️ **`.env.example` ausente** — não há variáveis de ambiente agora, mas o template deveria ser criado antes de começar a integração com a API.

- ⚠️ **Fases 2 e 3 pendentes** — React Query (Fase 2) e React Router v7 (Fase 3) estão planejadas e documentadas em `docs/evolucao/plano.md`, mas não executadas. O fluxo atual `Page → Selector → Mock` muda para `Page → Hook → Service → Repository` após a Fase 2.

---

## Segurança

**Estado geral:** limpo para um frontend de mock. Nenhuma vulnerabilidade crítica em produção.

| Área | Estado |
|------|--------|
| `dangerouslySetInnerHTML` | Zero ocorrências em todo `src/` |
| `eval()` / `document.write` / `innerHTML` direto | Nenhum encontrado |
| `.env*` commitados | Nenhum — `.gitignore` cobre corretamente |
| `VITE_*` no bundle | Nenhuma variável exposta |
| CPF, RG, email real, senha nos mocks | Não encontrados (exceto nome real abaixo) |
| `console.log` com dados de usuário | Nenhum encontrado |
| `localStorage`/`sessionStorage` com tokens | Nenhum uso encontrado |
| Headers de segurança HTTP | **Ausentes** — `vercel.json` não existe |
| Nome real no código | **`'Rafael Vitorino'`** em `UserSelector.tsx:9` e `sidebar.config.ts:6` — vai para o bundle |
| CVEs de tooling | **4 CVEs ativos** — `npm audit fix` resolve todos |
| Autenticação | **Não existe** — frontend de mock puro; o risco virá na integração com API real |

---

## Onde a documentação completa está

| Documento | O que contém |
|-----------|-------------|
| `docs/orientacoes.md` | **Ponto de entrada obrigatório** — regras invioláveis, stack, fluxo de dados |
| `docs/architecture/project-structure.md` | Estrutura de pastas e camadas detalhada |
| `docs/architecture/data-flow.md` | Fluxo Page→Hook→Service→Repository, quando criar cada camada |
| `docs/evolucao/plano.md` | Plano das 3 fases arquiteturais + status atual |
| `src/modules/fila-trabalho/docs/mapa-funcional.md` | DE/PARA entre funcionalidade e arquivo no módulo principal |
| `src/modules/fila-trabalho/docs/regras-fila-trabalho.md` | Regras de negócio com código RN-* |
| `TESTES.md` | Como rodar, estrutura, cobertura esperada, E2E, Chromatic |
| `docs/learnings.md` | Decisões arquiteturais históricas |

---

## Contato

> ⚠️ a confirmar — preencher antes de enviar o handoff.

| Papel | Contato |
|-------|---------|
| Decisões de produto/design | a confirmar |
| Responsável técnico do DS | rfvitorino (GitHub) — a confirmar canal de contato |
| Repositório | https://github.com/rfvitorino/design-system-solarbpm |
