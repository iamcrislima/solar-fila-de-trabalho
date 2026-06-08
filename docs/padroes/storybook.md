# Padrão do Storybook

> Referenciado por `docs/orientacoes.md`. Leia antes de criar ou alterar qualquer story.

---

## Grupos e prefixos obrigatórios

| Prefixo | Conteúdo | Exemplos |
|---|---|---|
| `00-Foundations/` | Tokens visuais do projeto (referência, não componentes) | Colors, Typography, Icons |
| `01-DS/` | Componentes do design system puro (`components/ds/`) | `01-DS/Atoms/Button` |
| `02-App/` | Componentes com convenções da app (`components/app/`) | `02-App/FiltroDropdown` |
| `03-Custom/` | Componentes de produto (`components/custom/`) | `03-Custom/WorkQueue/SelectAll` |

**Regra:** o campo `title:` de toda story deve começar com um desses prefixos. Nunca criar grupos fora dessa hierarquia.

---

## Formato do título

```ts
// DS atom
title: '01-DS/Atoms/NomeDoComponente'

// DS grupo de sub-componentes (ex.: Header, SideMenu, Table)
title: '01-DS/Atoms/Header'   // todos os sub-componentes na mesma story

// App
title: '02-App/NomeDoComponente'

// Custom — sem subgrupo se for componente isolado
title: '03-Custom/NomeDoComponente'

// Custom — com subgrupo quando fizer parte de um conjunto funcional
title: '03-Custom/WorkQueue/SelectAll'
title: '03-Custom/Tags/TagChip'
title: '03-Custom/Cards/AttachmentCardProcesso'
```

---

## Cobertura mínima obrigatória por camada

**DS atom (`01-DS/`):**

| Story | O que mostra |
|---|---|
| `EstaticoFigma` (ou `Estados`) | Estados visuais estáticos fiéis ao Figma |
| `Controlado` (ou `Interativo`) | Exemplo interativo com `useState` |
| `TodasAsVariantes` | Página de referência visual com todas as variantes |

**App e Custom (`02-App/`, `03-Custom/`):**

| Story | O que mostra |
|---|---|
| Story principal | Estado padrão com dados representativos (pode usar mock) |
| Story de estados | Variantes relevantes (selected, empty, disabled…) se aplicável |

---

## SVGs customizados dentro de IconButton

Todo SVG não-MUI dentro de `<IconButton>` **deve** usar `<IconBox>` para garantir a área padrão de 24×24 (resultando em botão 32×32):

```tsx
import { IconButton, IconBox } from '@/components/ds/atoms/Icon/IconButton';

<IconButton aria-label="Ação">
  <IconBox>
    <svg viewBox="0 0 20 20" style={{ width: 20, height: 20 }}>...</svg>
  </IconBox>
</IconButton>
```

Ícones MUI com `fontSize={24}` já respeitam a área — usam `<IconButton>` direto sem `<IconBox>`.

---

## Hint/Tooltip — padrão único

**Sempre usar `<Tooltip content="...">` para hints visuais.** Nunca criar `HintMain` manual, `title=` nativo ou helpers privados. Ver `docs/learnings.md` — entrada "Tooltip: componente único obrigatório".

---

## Localização dos arquivos de story

| Tipo | Onde fica o `*.stories.tsx` |
|---|---|
| DS atoms (`01-DS/`) | Ao lado do componente — `src/components/ds/atoms/NomeDoComponente/` |
| App (`02-App/`) | Ao lado do componente — `src/components/app/` |
| Custom (`03-Custom/`) | Ao lado do componente — `src/components/custom/` |
| Foundations (`00-Foundations/`) | **Exceção:** `src/stories/foundations/` — nunca dentro de `src/styles/tokens/` |

Nunca colocar story de Foundation dentro da pasta de tokens — o Storybook geraria um grupo fantasma baseado no nome da pasta.

---

## Nomeação das stories exportadas

Toda story exportada deve ter `.storyName` em português e descritivo:

```ts
export const EstaticoFigma = () => (...);
EstaticoFigma.storyName = 'Estático (Figma)';

export const Controlado = () => (...);
Controlado.storyName = 'Controlado (interativo)';

export const TodasAsVariantes = () => (...);
TodasAsVariantes.storyName = 'Todas as variantes';
```

Nomes genéricos como `"Story1"`, `"Default"` ou nomes em inglês sem `.storyName` são proibidos.

---

## Quando atualizar uma story existente

**A story deve ser atualizada no mesmo commit que altera o componente**, sempre que:

| O que mudou no componente | O que atualizar na story |
|---|---|
| Nova prop adicionada | Adicionar story ou variante mostrando a nova prop |
| Prop removida ou renomeada | Remover/renomear o uso na story |
| Novo estado visual (ex.: disabled, loading, erro) | Adicionar esse estado na story `EstaticoFigma` ou `Estados` |
| Comportamento interativo mudou | Atualizar a story `Controlado` |
| Componente movido de pasta | Atualizar o `title:` para o novo prefixo correto |
| Componente renomeado | Atualizar `title:` e `storyName` |
| Bug visual corrigido | Atualizar story se o estado exibido estava errado |

**Story desatualizada = documentação mentirosa.** Se o Storybook mostra um comportamento que o componente não tem mais, qualquer dev vai implementar errado baseado na referência visual incorreta.

---

## Ordenação do Storybook

O `storySort` já está configurado em `.storybook/preview.js` com `method: 'alphabetical'` e `order` explícito. Não é necessário nenhuma configuração adicional — basta usar os prefixos corretos (`00-`, `01-`, `02-`, `03-`) para que a ordem seja respeitada automaticamente.
