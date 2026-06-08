# SolarBPM Frontend — Contexto do Projeto

> **Leia este arquivo inteiro antes de qualquer ação.**
> O usuário deste projeto não é desenvolvedor e depende exclusivamente de IA para
> todo o desenvolvimento. A documentação é a fonte de verdade do projeto.

---

## O projeto

Frontend do sistema SolarBPM. Usa mocks em vez de API real. Quando a API existir,
apenas a camada de `repositories` muda.

**Stack:**

| Camada | Tecnologia |
|---|---|
| Build | Vite v6 — `npm start` → `localhost:3000` |
| Framework | React 19 |
| Linguagem | TypeScript 6 strict — 0 erros, 0 `@ts-nocheck` no código funcional |
| UI | MUI v9 via `components/ds/` — nunca importar MUI diretamente nas páginas |
| Tokens | `src/styles/tokens/` — nunca valores hardcoded de cor/sombra/radius/espaçamento |
| Qualidade | ESLint v9 + Prettier 3 — 0 erros e 0 warnings antes de qualquer commit |
| Node | 22 LTS |

---

## Antes de qualquer implementação — OBRIGATÓRIO

Leia os seguintes arquivos nesta ordem:

1. **`docs/orientacoes.md`** — regras, stack completa, onde cada coisa mora, fluxo de dados
2. **`docs/architecture/project-structure.md`** — estrutura real de pastas e camadas
3. **`docs/padroes/checklist.md`** — checklist pré-implementação

Se a tarefa envolve o módulo `fila-trabalho`:
4. **`src/modules/fila-trabalho/docs/mapa-funcional.md`** — onde cada funcionalidade está implementada

Se a tarefa envolve dados ou arquitetura:
5. **`docs/architecture/data-flow.md`** — fluxo Page → Hook → Service → Repository

---

## Regras críticas (resumo)

- `domain/` não importa React. `components/ds/` não importa `domain/` nem `modules/`.
- Módulos não se importam entre si — dados compartilhados passam por `domain/`.
- Tokens de design são obrigatórios — zero valores hardcoded de cor, sombra, radius ou espaçamento.
- Zero erros de TypeScript, zero warnings de ESLint antes de encerrar.
- Documentação atualizada no mesmo commit que o código (ver protocolo abaixo).

---

## Ao encerrar qualquer implementação — PROTOCOLO OBRIGATÓRIO

**Execute este protocolo antes de considerar a sessão concluída.**
Percorra cada gatilho e execute a ação correspondente se aplicável.

### Gatilho 1 — Arquivo criado, movido ou renomeado
- [ ] Atualizar `mapa-funcional.md` do módulo afetado
- [ ] Executar `npm run validate:docs` — deve passar com 0 erros

### Gatilho 2 — Nova tela, modal, painel ou fluxo funcional criado
- [ ] Adicionar entrada na seção correspondente de `mapa-funcional.md` com arquivo principal, providers, selectors e componentes DS usados
- [ ] Se o comportamento tem regra não-óbvia: criar ou atualizar `regras-*.md` com código `RN-SIGLA-SEQ`

### Gatilho 3 — Regra de negócio criada ou alterada
- [ ] Atualizar `src/modules/{mod}/docs/regras-*.md`
- [ ] Garantir que existe `it('RN-XX-YY: ...')` no arquivo de testes correspondente

### Gatilho 4 — Padrão de código novo (nova convenção, novo padrão de componente, nova prática adotada)
- [ ] Atualizar o doc correspondente em `docs/padroes/`
- [ ] Se for decisão arquitetural não-óbvia: registrar em `docs/learnings.md`

### Gatilho 5 — Fluxo de dados ou estrutura de camadas alterados
- [ ] Atualizar `docs/architecture/data-flow.md`
- [ ] Atualizar `docs/architecture/project-structure.md` se estrutura de pastas mudou

### Gatilho 6 — Fase de evolução arquitetural concluída (React Router / Services / React Query)
- [ ] Atualizar status para ✅ em `docs/evolucao/plano.md`
- [ ] Atualizar tabela de stack em `docs/orientacoes.md`
- [ ] Seguir checklist pós-execução descrito em `docs/evolucao/plano.md`

### Gatilho 7 — Nova regra global que toda IA/dev sempre precisa saber
- [ ] Adicionar em `docs/orientacoes.md` na seção "Regras invioláveis"

### Gatilho 8 — Novo arquivo de documentação criado
- [ ] Adicionar o caminho no array `DOC_FILES` em `scripts/validate-docs.js`
- [ ] Adicionar entrada no índice de `docs/README.md`

---

## Validação obrigatória antes de encerrar

```bash
npm run validate:docs   # links de docs — deve passar com 0 erros
npm run lint            # 0 erros e 0 warnings
npx tsc --noEmit        # 0 erros de TypeScript
npx vite build          # build deve passar
```

---

## Onde a documentação completa está

`docs/orientacoes.md` é o ponto de entrada para toda a documentação.
`docs/README.md` lista todos os documentos disponíveis.
