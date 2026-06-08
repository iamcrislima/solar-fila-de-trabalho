# Componentes e Telas

> Guia de decisão para criar, localizar e organizar componentes e telas.

---

## Onde cada componente deve viver

| Tipo | Localização | Storybook |
|---|---|---|
| Átomo do DS — sem conhecimento de domínio (Button, Modal, DatePicker) | `src/components/ds/atoms/` | `01-DS/Atoms/Nome` |
| Componente compartilhado com convenções da app (FiltroDropdown, DateRangeInput) | `src/components/app/` | `02-App/Nome` |
| Componente de produto compartilhado, ainda não categorizado | `src/components/custom/` | `03-Custom/Nome` |
| Componente específico de um módulo | `src/modules/<modulo>/components/` | sem story obrigatória |

**Critério de decisão:**

```
Sem conhecimento de domínio, reutilizável em qualquer projeto  → DS
Convenções da aplicação SolarBPM, sem dados de negócio         → App
Depende de dados, regras ou conceitos do SolarBPM              → Custom
Só faz sentido dentro de um módulo específico                  → modules/<mod>/components/
```

Quando um componente de `custom/` ficar específico de um módulo, migre-o para
`modules/<modulo>/components/`. Deixe em `custom/` apenas um re-export de compatibilidade temporário.

---

## Hierarquia dentro do DS

Hoje tudo vive em `atoms/`. A distinção prática:

- **Atom simples** — elemento visual único (Button, Chip, TextField)
- **Atom composto** — família de sub-componentes sob o mesmo escopo (Header, SideMenu, Table) — documentados como grupo único no Storybook
- **Molecule** — composição com comportamento próprio — camada ainda não criada; quando criada, compostos migram para ela

---

## Estrutura esperada para novas telas e módulos

```
src/modules/<modulo>/
  pages/          # telas
  components/     # modais, painéis, sub-componentes do módulo
  hooks/          # useQuery/useMutation encapsulando o service  ⏳ Fase 3
  services/       # orquestra repositories + adapters, sem React  ⏳ Fase 2
  providers/      # estado React local do módulo (se necessário)
  config/         # textos, opções, comportamento — nunca layout
  fields/         # labels, aliases, campos de personalização
  adapters/       # transformação domínio → formato da UI
  selectors/      # leitura derivada de dados do domínio
  types.ts        # tipos do módulo
  utils/          # helpers de filtragem, ordenação, formatação
  docs/           # mapa-funcional.md + regras-*.md
```

Crie apenas as pastas que removem acoplamento real. Não criar pasta vazia "por padrão".

---

## Implementando um frame do Figma

Antes de codar, classifique o node:

- componente DS / componente app / componente de módulo
- tela / frame completo
- modal
- painel / drawer
- estado ou variação visual

**Fluxo recomendado:**

1. Leia o Figma — identifique o node e sua classificação
2. Liste componentes existentes que podem ser reutilizados
3. Identifique dados, ações e estados; mapeie o fluxo (Page → Hook → Service → Repository)
4. Defina onde fica a estrutura compartilhada vs. o que é específico do contexto
5. Verifique responsividade antes de codar
6. Implemente no nível mais reutilizável possível
7. Valide visualmente e com build

**Quando houver divergência entre Figma e código existente:**

1. Figma oficial da funcionalidade
2. Componente equivalente já implementado no design system
3. Tokens oficiais do projeto
4. Ajuste local justificado e documentado

Não inventar variações visuais que não existam no Figma sem validação.

---

## Layout e espaçamento

O espaçamento entre blocos é responsabilidade do **container pai**, não dos filhos.

Tokens semânticos de `src/styles/tokens/layout.ts`:

| Token | Uso |
|---|---|
| `pagePadding` | Respiro externo da área cinza da tela |
| `containerPaddingX` / `containerPaddingY` | Padding do container branco principal |
| `blockGap` | Distância entre blocos irmãos (header, tabs, toolbar, paginação, lista) |
| `sectionGap` | Distância entre seções maiores ou separadores |
| `actionGap` | Distância entre botões/ações agrupadas |
| `listGap` | Distância entre cards ou linhas de uma lista |
| `listShadowGuard` | Área mínima para preservar sombra/foco dos cards |

**Regras:**
- frame/tela: controla o `gap` entre header, toolbar, paginação, conteúdo e rodapé
- lista: controla o `gap` entre cards
- componente: controla apenas seu padding interno
- não somar `gap` + `margin-top` + `padding-top` para criar o mesmo respiro

---

## Modais e painéis

Modais e painéis devem ser reutilizáveis quando a estrutura base for a mesma.
O conteúdo varia por props/config — não crie modal separada por contexto quando
apenas labels, filtros ou ações mudam.

**Onde criar:**

- Modal genérica do DS: `src/components/ds/atoms/Modal/`
- Modal específica de módulo: `src/modules/<modulo>/components/`

Modal de módulo **não deve importar config de página** diretamente — recebe tudo por props.

---

## Textos truncados

Todo texto que possa ser cortado com reticências (`...`) deve expor o conteúdo
completo via tooltip. Usar o atom `TruncatedText` (aplica ellipsis e mostra hint
somente quando realmente truncado). Nunca usar `title=` nativo.

---

## Regras

- Componente `custom/` não conhece página, módulo ou config específica
- `components/ds/` não importa `domain/`, `modules/` ou configs de produto
- Módulos não se importam entre si — dados compartilhados vêm de `domain/`
- Config controla conteúdo e comportamento — nunca padding, gap, sombra ou cores estruturais
