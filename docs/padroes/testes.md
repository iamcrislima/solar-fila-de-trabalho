# Testes Automatizados

> Referenciado por `docs/orientacoes.md`. Leia antes de criar ou alterar qualquer teste.

---

## Filosofia

Testes não são uma fase separada do desenvolvimento — são a consequência natural de uma funcionalidade bem documentada. O projeto adota a seguinte cadeia como lei:

```
Funcionalidade implementada
  → Regras documentadas com código RN-*
      → Casos de teste escritos na regra (Dado/Quando/Então)
          → Arquivo .test.ts criado com it('RN-XX-YY: ...')
              → CI passa → Cobertura: coberto
```

O código da regra **é o nome do teste**. Quando um teste falha no CI, a mensagem `RN-FP-09 FAILED` aponta diretamente para o documento `regras-fila-trabalho.md`, seção `RN-FP-09`. Sem ambiguidade, sem arqueologia de código.

Toda regra com código `RN-*` deve ter ao menos um `it('RN-XX-YY: ...')` em algum arquivo `.test.ts`. Regras sem cobertura ficam marcadas com `Cobertura: pendente` no documento — isso é o sinal visual de dívida técnica.

---

## O que testar com cada ferramenta

| O que | Ferramenta | Onde fica o arquivo |
|---|---|---|
| Funções puras: utils, adapters, selectors, repositories | **Vitest** | Ao lado do arquivo testado (`*.test.ts`) |
| Hooks e providers com regras de estado | **Vitest + renderHook** | Ao lado do provider/hook (`*.test.tsx`) |
| Componentes com interação: filtros, formulários, modais | **React Testing Library** | Ao lado do componente (`*.test.tsx`) |
| Fluxos completos de usuário | **Playwright** | `tests/e2e/*.spec.ts` |
| Regressão visual do Design System | **Chromatic** | Integrado ao Storybook — automático |

---

## O que NÃO testar

- **DS atoms sem lógica** (Button, Card, ícones): cobertos pelo Chromatic via Storybook. Não criar testes RTL para eles.
- **Design tokens** (`colors.ts`, `typography.ts`): dados estáticos sem lógica testável.
- **Componentes de layout puro**: sem comportamento, sem regra funcional.
- **Stories do Storybook**: são documentação, não código de produto.

---

## Convenção de nomenclatura

```ts
// Lógica pura e providers — o código RN-* vai no it()
describe('processos.repository', () => {
  it('RN-FP-09: processo interpessoal não deve ser visível para usuário não atribuído', () => { ... })
  it('RN-FP-10: processo setorial não deve ser visível fora do departamento do usuário', () => { ... })
})

// Componentes — descrição funcional do comportamento
describe('FiltroDropdown', () => {
  it('deve exibir itens filtrados ao digitar no campo de busca', () => { ... })
  it('deve selecionar todos os itens ao clicar em "Selecionar todos"', () => { ... })
})

// E2E — código RN-* quando a regra é crítica de negócio
test('RN-FT-07: usuário não pode atribuir tarefa com status concluído', async ({ page }) => { ... })
```

Regras com código `RN-*` → código vai no `it`. Comportamentos de UI sem regra explícita → descrição funcional direta.

---

## Estrutura de arquivos de teste

```
src/
  domain/
    processos/
      repositories/
        processos.repository.ts
        processos.repository.test.ts       ← ao lado
      adapters/
        processoToWorkQueue.adapter.ts
        processoToWorkQueue.adapter.test.ts
      selectors/
        processoQueue.selectors.ts
        processoQueue.selectors.test.ts
  shared/
    utils/
      filterUtils.ts
      filterUtils.test.ts
  application/
    providers/
      TarefasProvider.tsx
      TarefasProvider.test.tsx
  components/
    app/
      filters/
        FiltroDropdown.tsx
        FiltroDropdown.test.tsx
  modules/
    fila-trabalho/
      pages/
        fila-tarefas/
          FilaDeTarefas.tsx
          FilaDeTarefas.test.tsx           ← integração RTL

tests/
  e2e/                                     ← Playwright (fora do src/)
    fila-tarefas.spec.ts
    fila-processos.spec.ts
  support/
    render.tsx                             ← wrapper com todos os providers
    fixtures/                              ← mocks reutilizáveis entre testes
```

---

## Cobertura esperada

| Camada | Meta |
|---|---|
| `domain/` — utils, adapters, selectors, repositories | 100% |
| `application/providers/` | ≥ 90% |
| Componentes com regra de negócio | ≥ 70% |
| Fluxos E2E críticos | Happy path + principais edge cases |
| DS atoms | Não medido — coberto pelo Chromatic |

---

## Sinais de que os testes estão sendo ignorados

- Um arquivo `regras-*.md` tem regras sem `Cobertura: coberto` → dívida técnica visível.
- Um teste tem nome genérico ("deve funcionar", "renderiza corretamente") sem vincular ao código RN-* → provavelmente testa implementação, não comportamento.
- Novo arquivo em `domain/` sem `.test.ts` ao lado → regra de negócio exposta sem proteção.
- `npm test` nunca foi executado no projeto → nenhuma das garantias acima existe.

---

## Comandos

```bash
npm test                    # Vitest — executa todos os unit/integration tests
npm run test:watch          # Vitest em modo watch
npm run test:ui             # Vitest com interface visual
npm run test:coverage       # Relatório de cobertura
npm run test:e2e            # Playwright E2E
npm run storybook           # Storybook local (Chromatic integrado ao CI)
```
