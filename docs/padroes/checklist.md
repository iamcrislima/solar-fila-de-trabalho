# Checklist Antes de Implementar

Use este checklist antes de qualquer alteração relevante.

## Análise técnica

- [ ] Quais arquivos serão impactados?
- [ ] Existe componente equivalente em `ds/`, `app/` ou `custom/`?
- [ ] Existe token equivalente?
- [ ] Existe padrão semelhante no projeto?
- [ ] A mudança afeta regras de negócio documentadas (`regras-*.md`)?
- [ ] A mudança afeta estados compartilhados?
- [ ] Há risco de regressão visual?
- [ ] Há risco de regressão funcional?
- [ ] A camada correta foi escolhida? (`shell` / `modules` / `app` / `ds` / `domain`)

## Figma e UI

- [ ] O node Figma foi analisado?
- [ ] Layout, espaçamento e grid foram comparados?
- [ ] Tokens de `src/styles/tokens/layout.ts` foram usados para estrutura visual.
- [ ] Header, toolbar, paginação e lista foram organizados por `gap` do container pai.
- [ ] Não há soma indevida de `gap`, `margin`, padding de wrapper e padding de item.
- [ ] Estados visuais foram considerados?
- [ ] Hover, focus e disabled foram considerados?
- [ ] Textos longos foram considerados?
- [ ] Textos truncados com `...` exibem `<Tooltip content="...">` com o conteúdo completo.
- [ ] Responsividade foi considerada?

## Tokens e Design System

- [ ] Nenhuma cor hardcoded (`'#XXXXXX'`, `'white'`, `'gray'`) — usar `colors.*`.
- [ ] Nenhuma sombra hardcoded — usar `shadows.*`.
- [ ] Nenhum radius hardcoded — usar `borders.radius.*`.
- [ ] Nenhum espaçamento estrutural hardcoded — usar `spacing.*` ou `layout.*`.
- [ ] Nenhum valor de tipografia hardcoded — usar `typography.styles.*` ou `typography.fontSize.*`.
- [ ] Componentes DS existentes foram verificados antes de criar algo novo?

## Dados e fluxo arquitetural

- [ ] O fluxo respeita Page → Hook → Service → Repository → DataSource?
- [ ] A página não chama repository ou service diretamente?
- [ ] O hook encapsula `useQuery` / `useMutation` corretamente?
- [ ] O service é uma função pura sem React, sem `useState`, sem imports de componentes?
- [ ] O mock está fora do componente?
- [ ] Existe adapter quando a transformação domínio → UI é necessária?
- [ ] Labels e campos estão centralizados em `fields/`?
- [ ] Config controla apenas comportamento/conteúdo — não layout?

## Componentização e arquitetura

- [ ] A solução é reutilizável?
- [ ] Lógica e apresentação estão separadas?
- [ ] O componente custom recebe contexto por props?
- [ ] Não há import indevido de config de módulo em componente genérico?
- [ ] Módulos não criam dependência direta entre si?
- [ ] `domain/` não importa React nem UI?
- [ ] `components/ds/` não importa `domain/` nem `modules/`?
- [ ] Service não importa hooks nem componentes React?

## Storybook — criação de componente novo

- [ ] Arquivo `*.stories.tsx` criado ao lado do componente?
- [ ] O `title:` usa o prefixo correto (`01-DS/Atoms/`, `02-App/`, `03-Custom/`)?
- [ ] DS atom: tem `EstaticoFigma` (ou `Estados`), `Controlado` e `TodasAsVariantes`?
- [ ] Custom/App: tem ao menos a story do estado padrão?
- [ ] Toda story exportada tem `.storyName` em português?
- [ ] Stories de tokens/foundations estão em `src/stories/foundations/` (não em `src/styles/tokens/`)?
- [ ] SVG customizado dentro de `<IconButton>` usa `<IconBox>`?
- [ ] Hints/tooltips usam `<Tooltip content="...">` — nunca `HintMain` manual nem `title=` nativo?

## Storybook — alteração de componente existente

- [ ] Props adicionadas ou removidas → story atualizada para refletir?
- [ ] Novo estado visual → adicionado na story `EstaticoFigma` ou `Estados`?
- [ ] Comportamento interativo alterado → story `Controlado` atualizada?
- [ ] Componente movido de pasta → `title:` da story atualizado?
- [ ] A story ainda mostra o comportamento real atual?

## TypeScript

- [ ] Arquivos novos usam `.ts` (domínio, utils, services, hooks) ou `.tsx` (componentes React)?
- [ ] Props interfaces declaradas? (sem implicit `any`)
- [ ] Adapters retornam tipos de domínio reais (ex.: `WorkQueueCard`), não `Record<string, unknown>`?
- [ ] `npx tsc --noEmit` retorna 0 erros?
- [ ] `npm run lint` retorna 0 erros e 0 warnings?
- [ ] Nenhum `// @ts-nocheck` foi adicionado ao código funcional?

## Documentação — pré-implementação

- [ ] O `mapa-funcional.md` do módulo foi consultado antes de alterar arquivos existentes?
- [ ] O `regras-*.md` do módulo foi verificado para garantir que a mudança não contradiz regra documentada?

## Documentação — pós-implementação (obrigatório ao encerrar)

- [ ] Arquivo criado/movido/renomeado → `mapa-funcional.md` atualizado?
- [ ] Nova tela ou fluxo criado → entrada adicionada em `mapa-funcional.md`?
- [ ] Regra de negócio criada/alterada → `regras-*.md` atualizado + teste `it('RN-XX-YY: ...')` criado?
- [ ] Padrão novo adotado → `docs/padroes/` atualizado + decisão em `docs/learnings.md`?
- [ ] Fluxo de dados alterado → `docs/architecture/data-flow.md` atualizado?
- [ ] Estrutura de pastas alterada → `docs/architecture/project-structure.md` atualizado?
- [ ] Novo doc criado → caminho adicionado em `scripts/validate-docs.js` (`DOC_FILES`) + entrada em `docs/README.md`?
- [ ] `npm run validate:docs` executado e passou com 0 erros?

## Validação final

- [ ] Build executado (`npx vite build`).
- [ ] Fluxos principais testados manualmente.
- [ ] Responsividade validada.
- [ ] Estados principais validados.
- [ ] Riscos remanescentes comunicados.

[Voltar ao índice](../orientacoes.md)
