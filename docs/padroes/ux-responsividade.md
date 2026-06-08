# UX, UI e Responsividade

Toda tela deve nascer responsiva. Responsividade não deve ser tratada como ajuste final.

## Larguras a considerar

- desktop amplo
- notebook
- telas médias
- telas reduzidas
- janelas redimensionadas manualmente

## Critérios mínimos

- nenhum conteúdo estoura o container
- botões continuam acessíveis
- modais respeitam a viewport
- painéis e drawers adaptam largura/altura
- não há scroll horizontal indevido
- textos longos truncam corretamente
- todo texto truncado com reticências (`...`) exibe hint tooltip com o conteúdo completo — usar `<Tooltip content="...">`, nunca `title=` nativo
- chips se comportam de forma previsível
- barras de ações quebram linha sem perder hierarquia
- cards preservam legibilidade

## Estados obrigatórios quando aplicáveis

- inicial
- loading
- vazio
- erro
- sucesso
- seleção
- expansão/retração
- edição
- leitura
- disabled
- hover
- focus
- dados longos
- muitos itens
- permissões ou ações indisponíveis

## Boas práticas

- preserve a hierarquia visual do Figma
- priorize conteúdo principal em telas menores
- use truncamento quando o texto puder ser longo e aplique `TruncatedText` ou equivalente — exibir hint apenas quando realmente truncado
- mantenha ações críticas visíveis
- evite flicker e reflow brusco
- garanta transições suaves quando houver mudança de estado relevante

## Espaçamento de layout

O espaçamento entre blocos deve ser responsabilidade do container que organiza esses blocos. Os filhos devem cuidar apenas do próprio padding interno.

Padrão recomendado:

- container de seções usa `display: flex` ou `grid` com `gap`
- lista de cards/itens usa `gap` para definir a distância entre itens
- card, botão, input e chip definem somente padding interno
- paginação, filtros e lista devem ser irmãos dentro do mesmo stack visual
- wrappers técnicos para sombra, foco ou scroll devem ser documentados e não usados como espaçamento visual
- evite somar `gap`, `padding-top`, `margin-top` e padding do item para criar o mesmo respiro

Use `src/styles/tokens/layout.ts` para os valores estruturais. Evite declarar novos números em telas específicas quando existir token semântico equivalente.

[Voltar ao índice](../orientacoes.md)
