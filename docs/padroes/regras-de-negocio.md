# Documentação de Regras de Negócio

> Referenciado por `docs/orientacoes.md`. Leia antes de implementar qualquer funcionalidade nova.

---

## Quando documentar

Sempre que qualquer um destes eventos ocorrer:

- uma funcionalidade nova for criada;
- uma funcionalidade existente for alterada;
- uma regra de negócio for descoberta ou refinada;
- um comportamento importante for definido;
- um fluxo funcional for estabelecido ou modificado.

A documentação deve ser criada ou atualizada **no mesmo momento** em que a implementação ocorre — nunca depois.

---

## Onde documentar

As regras ficam **dentro do módulo** que descrevem, em `src/modules/{modulo}/docs/`, em **um arquivo por funcionalidade**:

```
src/modules/fila-trabalho/docs/
  regras-fila-trabalho.md        ← funcionalidade "Fila de Trabalho"

src/modules/solar/docs/
  regras-licenciamento.md        ← funcionalidade "Licenciamento"
  regras-acompanhamento.md       ← funcionalidade "Acompanhamento"

src/modules/{modulo}/docs/
  regras-{funcionalidade}.md
```

**O que é uma funcionalidade:**
Uma funcionalidade é uma área coesa do produto com identidade própria para o usuário (ex: "Fila de Trabalho", "Licenciamento Ambiental", "Relatórios de Processos"). Sub-features da mesma funcionalidade — como "Fila de Processos" e "Fila de Tarefas" dentro da "Fila de Trabalho" — são **seções** dentro do mesmo arquivo, não arquivos separados.

**Estrutura interna do arquivo:**
```markdown
# Regras de Negócio — {Nome da Funcionalidade}

## Índice
- [Sub-feature A](#sub-feature-a) — RN-XX-01 a RN-XX-05
- [Sub-feature B](#sub-feature-b) — RN-XX-06 a RN-XX-10

---

## Sub-feature A
### RN-XX-01: ...
...

## Sub-feature B
### RN-XX-06: ...
...
```

**Regra de referências cruzadas:** âncoras internas (`[RN-FP-09](#rn-fp-09)`) para regras no mesmo arquivo; link para o arquivo externo quando a regra está em outro módulo/funcionalidade. Funcionalidades transversais a múltiplos módulos ficam no arquivo do módulo que as origina.

---

## O que é regra de negócio

Documenta-se quando a frase começa com "o sistema deve..." e termina com algo que um analista ou testador precisaria saber.

**É regra funcional:**
- Critério de visibilidade de dados
- Critério de filtro ou exibição
- Relacionamento entre entidades
- Estado obrigatório (ex: chip obrigatório por condição)
- Restrição de ação (ex: ação em lote apenas na página atual)
- Comportamento dependente de contexto do usuário

**Não é regra funcional (não documentar aqui):**
- Comportamento visual/animação
- Detalhe de implementação técnica
- Escolha de componente ou token
- Lógica de performance ou renderização

---

## Template obrigatório

```markdown
# Regras de Negócio — {Nome da Funcionalidade}

**Módulo:** {nome}
**Atualizado em:** {mês/ano}

---

## Contexto

{2-3 frases sobre o que a funcionalidade faz e por que existe.}

## Entidades envolvidas

- `{Entidade}` — {papel}

## Regras

### RN-{SIGLA}-{SEQ}: {Título curto}

**Descrição:** {O que o sistema deve fazer.}
**Condição:** {Quando se aplica, se houver.}
**Exceção:** {Caso especial, se houver.}

**Casos de teste:**
- Dado {contexto}, quando {ação}, então {resultado esperado}
- Dado {contexto de exceção}, quando {ação}, então {resultado diferente}

**Cobertura:** `pendente`

## Relacionamentos

{Dependências com outras features que afetam esta regra.}

## Pendências e observações futuras

{Comportamentos a revisar na integração com API ou ainda indefinidos.}
```

---

## Convenção de códigos

| Sigla | Escopo |
|---|---|
| `RN-FP` | Fila de Processos |
| `RN-FT` | Fila de Tarefas |
| `RN-VP` | Visualizações Personalizadas |
| `RN-CT` | Categorias/Tags |
| `RN-PROC` | Solar — Processos/Documentos |
| `RN-{MÓDULO}` | Novos módulos seguem o padrão |

---

## O que não documentar

- O que o código já deixa explícito por si só (nomes de campos, tipos, formatos)
- Duplicação do que já está em `learnings.md` (decisões arquiteturais)
- Comportamentos que são expectativa universal de UI

---

## Fluxo obrigatório ao implementar

```
1. Implementar a funcionalidade
2. Perguntar: isso tem regra funcional não-óbvia?
3. Se sim → criar ou atualizar regras-{feature}.md no módulo
       incluindo os Casos de teste e marcando Cobertura: pendente
4. Criar ou atualizar os testes nomeados com os códigos RN-* das regras afetadas
       marcar Cobertura: coberto ao concluir
5. Build passa + testes passam → Concluído
```

A documentação não é opcional. Regras implícitas no código se perdem com o tempo e bloqueiam integrações futuras.
