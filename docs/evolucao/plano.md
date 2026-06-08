# Plano de Evolução Arquitetural — Solar BPM Frontend

> **Para agentes de IA:** Este documento é autocontido. Um agente sem histórico de conversa
> consegue executar este plano lendo apenas os arquivos listados abaixo.
> Leia a seção "Contexto necessário" antes de qualquer ação.

**Atualizado em:** 2026-06

---

## Status das fases

| Fase | O que é | Status |
|---|---|---|
| **Fase 1** | Camada de Services | ✅ **CONCLUÍDA** — 2026-06 |
| **Fase 2** | React Query | ⏳ **PENDENTE** — executar quando houver primeiro endpoint de API real |
| **Fase 3** | React Router v7 | ⏳ **PENDENTE** — executar quando houver usuários reais ou URLs compartilháveis |

> Ao concluir cada fase, atualizar ⏳ para ✅ nesta tabela e em `docs/orientacoes.md`.

**Sobre os mocks:** os arquivos em `src/domain/*/mocks/` simulam o banco de dados.
Não mudam durante nenhuma das fases. Quando a API real chegar, só os `repositories/`
mudam — tudo acima (services, hooks, páginas) continua intacto.

---

## Contexto necessário antes de executar

**Um agente que receber este plano deve ler os seguintes arquivos antes de qualquer implementação:**

### Obrigatório — ler sempre

1. `docs/orientacoes.md` — regras do projeto, stack, onde cada coisa mora
2. `docs/architecture/project-structure.md` — estrutura real de pastas
3. `docs/architecture/data-flow.md` — fluxo de dados alvo (o que as fases implementam)
4. `docs/architecture/services-pattern.md` — como criar services corretamente
5. `docs/padroes/checklist.md` — checklist antes de qualquer implementação
6. `docs/padroes/dados-e-integracao.md` — estrutura de dados e responsabilidades

### Obrigatório — ler antes de cada fase

- **Fase 1 (concluída):** `docs/evolucao/fase-2-services.md`
- **Fase 2:** `docs/evolucao/fase-2-react-query.md`
- **Fase 3:** `docs/evolucao/fase-3-react-router.md`

### Contexto do módulo de referência (fila-trabalho)

- `src/modules/fila-trabalho/docs/mapa-funcional.md` — onde cada funcionalidade está implementada
- `src/App.tsx` — navegação atual (a ser migrada na Fase 1)
- `src/modules/fila-trabalho/FilaModule.tsx` — entry point do módulo principal
- `src/modules/fila-trabalho/pages/fila-processos/FilaDeProcessos.tsx` — página principal
- `src/modules/fila-trabalho/selectors/processoQueue.selectors.ts` — acesso a dados atual

### O que o agente precisa saber sobre o projeto

O projeto é um front-end React para o sistema SolarBPM. Usa:
- **Vite v6** + **React 19** + **TypeScript 6 strict**
- **MUI v9** via camada própria `components/ds/` (nunca importar MUI diretamente nas páginas)
- **Design tokens** em `src/styles/tokens/` (nunca valores hardcoded de cor/espaçamento)
- Hoje: navegação por `useState` em `App.tsx`, repositories chamados diretamente nas páginas
- Objetivo: `Page → Hook → Service → Repository → DataSource`

**Regra de ouro:** `npx tsc --noEmit` e `npm run lint` devem retornar 0 erros ao final de cada fase. `npx vite build` deve passar. Sem esses critérios, a fase não está concluída.

---

## O que estas fases resolvem

A análise arquitetural de 2026-06 identificou 3 peças faltantes para escalar o projeto:

1. **React Router v7** — navegação atual por `useState` em `App.tsx` não suporta URLs reais, deep linking, back/forward do navegador ou lazy loading nativo por módulo
2. **Camada de Services** — páginas hoje chamam repositories diretamente; falta a camada que orquestra múltiplos repositories, aplica regras de aplicação e chama adapters
3. **React Query** — sem gerenciamento de estado assíncrono; quando a API chegar, cada página vai reinventar loading/error/retry

---

## Ordem obrigatória de execução

```
Fase 1 (Router) → Fase 2 (Services) → Fase 3 (React Query)
```

- Fase 2 depende de Fase 1 (hooks ficam nos módulos, que precisam de rotas definidas)
- Fase 3 depende de Fase 2 (React Query envolve os services, não os repositories diretamente)

---

## Critérios de conclusão de cada fase

Antes de marcar uma fase como concluída e avançar:

- [ ] `npx tsc --noEmit` retorna 0 erros
- [ ] `npm run lint` retorna 0 erros e 0 warnings
- [ ] `npx vite build` passa sem erros
- [ ] Navegação existente continua funcionando (fila de processos e tarefas abrem corretamente)
- [ ] Commit feito com mensagem descritiva em português
- [ ] `git push origin main` executado
- [ ] Status desta fase atualizado para ✅ nesta tabela e em `docs/orientacoes.md`

---

## Guias detalhados de execução

- [Fase 1 — Camada de Services ✅](./fase-2-services.md)
- [Fase 2 — React Query](./fase-2-react-query.md)
- [Fase 3 — React Router v7](./fase-3-react-router.md)

---

## O que NÃO fazer durante as fases

- Não refatorar funcionalidades existentes além do necessário para a fase
- Não adicionar features de produto durante a execução
- Não trocar bibliotecas além das especificadas em cada fase
- Não mudar o Design System ou tokens durante as fases
- Não instalar Zustand, Jotai ou outros gerenciadores de estado global — Context é suficiente
- Não integrar Supabase — isso é uma decisão futura separada

---

## Pós-execução obrigatória: revisão de docs e limpeza

**Após concluir as 3 fases**, executar obrigatoriamente:

### 1. Revisar toda a documentação

Verificar se algum doc ficou desatualizado com a nova estrutura. Percorrer:

- [ ] `docs/orientacoes.md` — atualizar tabela de stack (confirmar React Router e React Query na tabela), atualizar status das fases para ✅, remover seção "Evolução arquitetural" ou marcá-la como concluída
- [ ] `docs/architecture/project-structure.md` — confirmar que `application/queryClient.ts`, `application/queryKeys.ts`, `modules/{mod}/hooks/` e `modules/{mod}/services/` estão na estrutura documentada
- [ ] `docs/architecture/data-flow.md` — verificar se o fluxo descrito corresponde ao implementado
- [ ] `docs/padroes/dados-e-integracao.md` — verificar se a seção de fluxo está correta
- [ ] `src/modules/fila-trabalho/docs/mapa-funcional.md` — atualizar com os novos hooks/ e services/ criados
- [ ] `docs/learnings.md` — registrar as decisões arquiteturais tomadas durante a execução

### 2. Remover a pasta `docs/evolucao/`

Após todas as fases concluídas e docs revisados, esta pasta perde a razão de existir:

```bash
git rm -r docs/evolucao/
git commit -m "chore: remove docs/evolucao/ após conclusão das 3 fases arquiteturais"
git push origin main
```

Remover também as referências a `docs/evolucao/` em:
- `docs/orientacoes.md` — seção "Evolução arquitetural" e linha do índice
- `docs/README.md` — bloco `evolucao/` na estrutura de docs

### 3. Atualizar `docs/orientacoes.md` — seção "Evolução arquitetural"

Substituir a tabela de fases por uma nota histórica simples:

```markdown
## Evolução arquitetural

React Router v7, camada de Services e React Query foram adicionados em 2026-06.
Ver `docs/learnings.md` para as decisões tomadas durante a implementação.
```

---

## Referências

- Fluxo de dados alvo: `docs/architecture/data-flow.md`
- Padrão de services: `docs/architecture/services-pattern.md`
- Estrutura do projeto: `docs/architecture/project-structure.md`
- Regras gerais: `docs/orientacoes.md`
