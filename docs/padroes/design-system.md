# Design System e Tokens

Use o design system como fonte principal para UI.

## Componentes

Priorize:

- atoms em `src/components/ds`;
- componentes custom reutilizaveis em `src/components/custom`;
- composicoes existentes dentro de modulos.

Crie componente novo apenas quando:

- nao houver equivalente;
- a composicao for recorrente;
- o Figma exigir comportamento ou estado proprio;
- a solucao puder ser reutilizada.

## Tokens

Use tokens para:

- cores;
- tipografia;
- sombras;
- bordas;
- radius;
- espacamentos quando existirem tokens disponiveis.

**Nunca use valores hardcoded.** Para cada valor, há um token equivalente:

| Em vez de… | Use |
|---|---|
| `'#0059DB'` | `colors.primary.main` |
| `'#616161'` | `colors.surface.main` |
| `'#9E9E9E'` | `colors.surface.medium` |
| `'#E0E0E0'` | `colors.surface.light` |
| `'#F5F5F5'` | `colors.surface.xl` |
| `'#FFFFFF'` | `colors.surface.xxxl` |
| `'#212121'` | `colors.surface.dark` |
| `'8px'` (radius) | `borders.radius.lg` |
| `'4px'` (radius) | `borders.radius.md` |
| `'0px 2px 4px ...'` | `shadows.level1` |
| `'16px'` (espaçamento) | `spacing.sm` |
| `'8px'` (espaçamento) | `spacing.xs` |

Imports padrão para qualquer componente novo:

```ts
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { spacing }    from '@/styles/tokens/spacing';
import { layout }     from '@/styles/tokens/layout';
import { shadows }    from '@/styles/tokens/shadows';
import { borders }    from '@/styles/tokens/borders';
```

Evite:

- cores diretas (`'#XXXXXX'` ou nomes CSS como `'white'`, `'gray'`);
- `font-size` hardcoded;
- `font-weight` hardcoded;
- `line-height` hardcoded;
- sombras manuais (`'0px 2px 4px rgba(...)'`);
- radius arbitrario (`'8px'`, `'50%'` sem ser `borders.radius.circular`);
- espacamentos sem referencia (`'12px'`, `'24px'` avulsos).

## Excecoes

Uma excecao local e aceitavel quando:

- o Figma define valor especifico ainda sem token;
- o componente existente nao expoe a variacao necessaria;
- a decisao fica documentada ou claramente isolada.

Mesmo em excecoes, prefira criar um ponto unico de ajuste, nao espalhar
hardcodes por varios componentes.

## Componentes custom

Componentes custom devem receber por props:

- dados;
- textos;
- callbacks;
- estados;
- slots;
- pequenas variacoes semanticas.

Componentes custom nao devem importar configs de pagina ou dados de modulo.

[Voltar ao índice](../orientacoes.md)
