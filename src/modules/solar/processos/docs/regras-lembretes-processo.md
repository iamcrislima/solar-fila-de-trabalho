# Regras de Negócio — Lembretes no Processo

**Módulo:** solar/processos
**Atualizado em:** 2026-06

---

## Contexto

Processos/documentos podem possuir lembretes associados. A fila de trabalho apenas sinaliza a existência desses lembretes; o detalhe do processo é responsável por exibir, na aba Dados, os lembretes marcados como destaque.

## Entidades envolvidas

- `ProcessoDigital` — entidade principal do domínio de processos
- `ProcessoLembrete` — lembrete associado a um processo/documento (`id`, `texto`, `destaque`, `origem`, `criadoEm`, `autor`)
- `Fila de processos` — visão operacional que sinaliza se um processo possui lembretes

---

## Regras

### RN-PROC-01: Lembretes pertencem ao processo

**Descrição:** O sistema deve tratar lembretes como dados do domínio de processos, não como dados próprios da fila de trabalho.

**Condição:** Sempre que um processo possuir lembretes associados.

**Exceção:** Nenhuma.

**Casos de teste:**
- Dado processo com lembretes associados, quando `processoPossuiLembretes(processo)` é chamado, então retorna `true`
- Dado processo sem lembretes, quando `processoPossuiLembretes(processo)` é chamado, então retorna `false`

**Cobertura:** `coberto` — `processoSelectors.test.ts › processoPossuiLembretes`

---

### RN-PROC-02: Indicador de lembrete na fila

**Descrição:** O sistema deve exibir o indicador de lembretes na fila de processos quando o processo possuir ao menos um lembrete associado.

**Condição:** `processo.lembretes.length > 0`.

**Exceção:** Nenhuma.

**Casos de teste:**
- Dado processo com `lembretes: [{ texto: 'Revisar', destaque: false }]`, quando `processoPossuiLembretes(processo)` é chamado, então retorna `true`
- Dado processo com `lembretes: []`, quando `processoPossuiLembretes(processo)` é chamado, então retorna `false`

**Cobertura:** `coberto` — `processoSelectors.test.ts › processoPossuiLembretes`

---

### RN-PROC-03: Observações exibem apenas lembretes em destaque

**Descrição:** O sistema deve exibir na seção "Observações" do detalhe do processo apenas os lembretes marcados com `destaque: true`.

**Condição:** Ao abrir a aba "Dados" de um processo/documento.

**Exceção:** Lembretes sem destaque podem existir para a funcionalidade futura de lembretes, mas não aparecem em "Observações".

**Casos de teste:**
- Dado processo com lembretes mistos (alguns com `destaque: true`, outros com `destaque: false`), quando `getProcessoLembretesEmDestaque(processo)` é chamado, então retorna apenas os com `destaque: true`
- Dado processo sem nenhum lembrete em destaque, quando `getProcessoLembretesEmDestaque(processo)` é chamado, então retorna array vazio

**Cobertura:** `coberto` — `processoSelectors.test.ts › getProcessoLembretesEmDestaque`

---

## Relacionamentos

A fila de processos consome os lembretes do domínio apenas para sinalização visual. O detalhe do processo consome a mesma fonte para renderizar as observações destacadas.

## Pendências e observações futuras

Quando a funcionalidade completa de lembretes for criada, ela deve persistir os lembretes no domínio/API de processos mantendo o campo `destaque` para controlar quais itens aparecem em "Observações".
