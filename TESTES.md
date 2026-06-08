# Guia de Testes — frontend-solarbpm

Referência rápida para executar, acompanhar e entender os testes do projeto.
Leia este arquivo antes de perguntar sobre testes.

---

## Comandos disponíveis

| Comando | O que faz | Quando usar |
|---|---|---|
| `npm test` | Roda todos os testes uma vez e encerra | Antes de commitar / verificação rápida |
| `npm run test:watch` | Re-executa testes ao salvar arquivos (terminal) | Durante desenvolvimento no terminal |
| `npm run test:ui` | Abre interface visual no browser (Vitest UI) | Quando quiser ver testes graficamente |
| `npm run test:coverage` | Gera relatório de cobertura em `coverage/index.html` | Para ver quais linhas estão descobertas |
| `npm run test:coverage:ui` | Cobertura + interface visual no browser | Visão completa de cobertura |
| `npm run chromatic` | Envia stories ao Chromatic para regressão visual | Manual, quando necessário |
| `npm run test:e2e` | Roda todos os testes E2E (Playwright, headless) | Antes de push para main |
| `npm run test:e2e:ui` | Interface visual do Playwright no browser | Para debugar testes E2E |
| `npm run test:e2e:headed` | Testes E2E com browser visível (você vê o Chromium) | Para acompanhar a execução |
| `npm run test:e2e:report` | Abre o relatório HTML da última execução E2E | Para analisar falhas E2E |

---

## Onde ver os resultados

### Terminal
Resultado imediato após `npm test`. Formato:
```
✓ filterUtils.test.ts (34 tests)
✓ processos.repository.test.ts (13 tests)
...
Test Files  15 passed (15)
Tests       222 passed (222)
```
Se falhar, o teste vermelho aparece com o nome do arquivo, linha e mensagem de erro.

### Browser — Vitest UI
```bash
npm run test:ui
```
Abre automaticamente em `localhost` com:
- Lista de todos os arquivos de teste
- Cada `describe` / `it` com ícone verde ✓ ou vermelho ✗
- Stack trace completo ao clicar em qualquer falha
- Re-executa automaticamente ao salvar qualquer arquivo

### Relatório E2E — Playwright
```bash
npm run test:e2e:headed   # abre o Chromium e você vê cada passo sendo executado
npm run test:e2e:ui       # interface visual do Playwright (recomendado para debug)
npm run test:e2e:report   # abre o relatório HTML da última execução
```
O relatório HTML fica em `playwright-report/index.html` com:
- Screenshot de cada falha
- Vídeo da execução (se configurado)
- Trace para inspecionar ações passo a passo

### Relatório de cobertura HTML
```bash
npm run test:coverage
```
Gera `coverage/index.html`. Abra no browser para ver:
- Percentual por arquivo (statements, branches, functions, lines)
- Linhas cobertas em verde, descobertas em vermelho

### GitHub Actions (automático no push — somente quando código muda)

O CI **não roda em todo push**. Ele só dispara quando arquivos de código mudam:

| Mudança | CI roda? |
|---|---|
| `src/**`, `tests/**` | ✅ Sim |
| `package.json`, `tsconfig.json`, configs | ✅ Sim |
| `README.md`, `TESTES.md`, `docs/**` | ❌ Não |
| `.claude/**`, `*.md` na raiz | ❌ Não |

Commits locais nunca disparam nada — só o `git push` para o GitHub.

**Como acompanhar:**
1. Faça `git push`
2. Acesse `github.com/rfvitorino/design-system-solarbpm` → aba **Actions**
3. Clique no workflow em execução para acompanhar em tempo real
4. Se falhar, o passo vermelho mostra o erro exato

**Pipeline:** Lint → Type check → Tests+Coverage → Build → E2E (job separado, roda após o anterior passar)

---

## Regressão visual — Chromatic

O Chromatic protege o Design System contra mudanças visuais acidentais.
Usa as 51 stories do Storybook como referência.

### Como funciona
1. Após cada push/PR, o GitHub Actions envia as stories ao Chromatic
2. O Chromatic compara com o build anterior (screenshot por screenshot)
3. Se algo mudou visualmente, aparece no dashboard para aprovação manual
4. Mudanças intencionais: você aprova no dashboard → nova baseline
5. Mudanças acidentais: você rejeita → dev corrige antes de mergear

### Configuração inicial (única vez)
Você precisa criar a conta e conectar o repositório:

1. Acesse [chromatic.com](https://www.chromatic.com) e faça login com GitHub
2. Clique em **Add project** e selecione `design-system-solarbpm`
3. Copie o **Project Token** gerado
4. No GitHub: repositório → **Settings → Secrets and variables → Actions**
5. Clique em **New repository secret**
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: cole o token copiado
6. Pronto — o workflow `.github/workflows/chromatic.yml` já está configurado

### Acessar o dashboard
Após a primeira execução, acesse `chromatic.com` → seu projeto para:
- Ver diffs visuais de cada story
- Aprovar ou rejeitar mudanças
- Ver histórico de builds

---

## Estrutura dos arquivos de teste

```
src/
  shared/utils/
    filterUtils.test.ts              ← utils de busca e normalização
  domain/processos/
    repositories/
      processos.repository.test.ts   ← RN-FP-09, RN-FP-10
    adapters/
      processoToDetail.adapter.test.ts
    selectors/
      processoSelectors.test.ts
    tarefas/
      repositories/
        tarefas.repository.test.ts   ← RN-FT-10
      selectors/
        processoTarefa.selectors.test.ts
  application/providers/
    FavoritesProvider.test.tsx
    TarefasProvider.test.tsx         ← RN-FT-06
    CategoriasProvider.test.tsx      ← RN-CT-04, RN-CT-06
  modules/fila-trabalho/
    utils/
      workQueueUtils.test.ts
    adapters/
      processoToWorkQueue.adapter.test.ts
      tarefaToWorkQueue.adapter.test.ts
    providers/
      CustomViewsProvider.test.tsx   ← RN-VP-01, RN-VP-04, RN-VP-07, RN-VP-08
    pages/
      fila-processos/
        FilaDeProcessos.test.tsx     ← integração RTL
      fila-tarefas/
        FilaDeTarefas.test.tsx       ← integração RTL

tests/
  support/
    render.tsx    ← wrapper com todos os providers (usar em novos testes de componente)
    fixtures/     ← mocks do domínio reutilizáveis
  e2e/
    fila-tarefas.spec.ts   ← smoke, abas, busca, empty state
    fila-processos.spec.ts ← smoke, abas, busca, empty state
```

---

## Convenção de nomenclatura dos testes

### Regras de negócio (código RN-*)
```ts
describe('processos.repository', () => {
  it('RN-FP-09: processo Interpessoal não visível para usuário não destinatário', () => { ... })
  it('RN-FP-10: processo Setorial não visível para usuário de outra unidade', () => { ... })
})
```
O código da regra é o nome do `it`. Quando o teste falha no CI,
a mensagem aponta diretamente para a seção correspondente em
`src/modules/fila-trabalho/docs/regras-fila-trabalho.md`.

### Componentes e comportamentos de UI
```ts
describe('FilaDeTarefas', () => {
  it('exibe as três abas de atribuição', () => { ... })
  it('exibe mensagem de vazio quando busca não tem resultados', () => { ... })
})
```

---

## Cobertura esperada por camada

| Camada | Meta |
|---|---|
| `domain/` — utils, adapters, selectors, repositories | 100% |
| `application/providers/` | ≥ 90% |
| Componentes de página (integração RTL) | Happy path + empty state |
| DS atoms | Não medido aqui — coberto pelo Chromatic |

---

## O que NÃO tem teste (e por quê)

| O que | Por quê |
|---|---|
| DS atoms (Button, Card, TextField...) | Cobertos pelo Chromatic (regressão visual) |
| Design tokens (`colors.ts`, `typography.ts`) | Dados estáticos, sem lógica testável |
| Stories do Storybook | São documentação, não código de produto |
| `App.tsx` e shell | Comportamento testado via integração |

---

## Quando escrever novos testes

O fluxo obrigatório ao implementar uma funcionalidade:

```
1. Implementar a funcionalidade
2. Verificar se há regra funcional não-óbvia
3. Se sim → criar/atualizar regras-{funcionalidade}.md
              incluindo Casos de teste e marcando Cobertura: pendente
4. Criar arquivo .test.ts nomeado com os códigos RN-* das regras
              marcar Cobertura: coberto ao concluir
5. npm test passa → Concluído
```

Novos testes de componente devem usar o wrapper de `tests/support/render.tsx`:
```ts
import { render, screen } from '../../../tests/support/render';
// O wrapper já inclui todos os providers necessários
```

---

## Particularidade dos testes E2E — arquitetura display:none

A `FilaDeProcessos` e a `FilaDeTarefas` são montadas **simultaneamente** no DOM
(com `display:none` alternando entre elas). Isso tem impacto direto nos seletores:

- `getByPlaceholder('Palavra-chave')` resolve para **2 elementos** — um de cada fila
- Sempre use `.first()` para o elemento da fila ativa, ou `.nth(1)` quando tarefas é a ativa
- A app abre em **processos** por padrão (`useState('processos')` no FilaModule)
- Para testar tarefas no E2E, navegue via sidebar: `page.getByText('Visualização padrão').nth(1).click({ force: true })`
- Após a navegação, tarefas fica visible (index 1 no DOM) e processos fica hidden (index 0)

Quando adicionar novos testes E2E de componentes que existem em ambas as filas,
lembre de considerar qual fila está ativa e usar o índice correto.

---

## Se um teste falhar

### Localmente
1. `npm test` mostra o arquivo, linha e mensagem de erro
2. `npm run test:ui` abre o browser — clique no teste vermelho para ver o stack trace completo
3. Corrija o código ou o teste, salve, e o resultado aparece automaticamente

### No GitHub Actions (após push)
1. Aba **Actions** → clique no workflow falhado
2. Expanda o step **Tests** para ver qual teste quebrou
3. O nome do teste (`RN-FP-09: ...`) aponta para a regra no documento de regras
4. Baixe o artefato **coverage-report** para ver cobertura visual em HTML

### Regra geral
Se o teste falha por mudança intencional de comportamento:
→ Atualize o teste E o documento de regras (`Cobertura: coberto`)

Se o teste falha porque o código regrediu:
→ Corrija o código, não o teste

---

## Etapas de testes ainda pendentes

| # | Etapa | Status |
|---|---|---|
| 1 | Limpeza + infraestrutura | ✅ Concluída |
| 2 | Testes de lógica pura (222 testes) | ✅ Concluída |
| 3 | Providers e hooks | ✅ Concluída |
| 4 | Integração de módulos (RTL) | ✅ Concluída |
| 5 | Chromatic (regressão visual DS) | ✅ Configurado — requer token (ver acima) |
| 6 | E2E com Playwright | ✅ Concluída (10 testes) |
| 7 | CI/CD completo | ✅ Concluído (CI + E2E job separado) |
