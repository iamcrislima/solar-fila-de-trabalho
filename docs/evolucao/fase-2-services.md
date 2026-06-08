# Fase 1 — Camada de Services

**Status:** ✅ CONCLUÍDA — 2026-06
**Dependências:** nenhuma
**Próxima fase:** [Fase 2 — React Query](./fase-2-react-query.md)

---

## Objetivo

Introduzir a camada de `services/` entre os módulos e os repositories, eliminando
o acesso direto de páginas a repositories e criando o ponto correto para orquestração
de dados, regras de aplicação e transformações.

---

## O que foi feito

### Padrão estabelecido

```
Page → Hook → Service → Repository → DataSource
```

A camada de serviço é o único lugar onde:
- múltiplos repositories são combinados
- regras de aplicação são aplicadas (ex: "só retornar processos visíveis para este usuário")
- adapters são chamados para transformar dados

### Estrutura criada em fila-trabalho (módulo de referência)

```
src/modules/fila-trabalho/
  services/
    processos.service.ts    ← orquestra processos para a fila
    tarefas.service.ts      ← orquestra tarefas para a fila
  hooks/
    useProcessos.ts         ← hook de dados (wrap do service)
    useTarefas.ts           ← hook de dados
```

### Regras do service

- **Nunca importa React** (sem hooks, sem JSX, sem useState)
- **Funções puras** ou classes com injeção de dependência
- **Pode chamar múltiplos repositories**
- **Chama adapters** para transformar o formato do domínio para o formato da UI
- **Testável isoladamente** com mocks dos repositories

---

## Exemplo de service (referência)

```ts
// src/modules/fila-trabalho/services/processos.service.ts
import { getProcessosEmAndamento } from '@/domain/processos/repositories/processos.repository';
import { processosToWorkQueueCards } from '../adapters/processoToWorkQueue.adapter';
import type { WorkQueueCard } from '../types';

/** Retorna os processos formatados para a fila de trabalho. */
export function getProcessosParaFila(): WorkQueueCard[] {
  const processos = getProcessosEmAndamento();
  return processosToWorkQueueCards(processos);
}

/** Retorna contagem de processos por status para o badge da sidebar. */
export function getProcessosCounts() {
  const todos = getProcessosParaFila();
  return {
    total:    todos.length,
    foraFila: todos.filter(p => p.foraFila).length,
    naFila:   todos.filter(p => !p.foraFila).length,
  };
}
```

---

## Padrão para novos módulos

Ao criar um novo módulo, criar os services antes das páginas:

```
src/modules/{novo-modulo}/
  services/
    {entidade}.service.ts
  hooks/
    use{Entidade}.ts
```

O service recebe os dados do repository e os transforma/orquestra.
O hook chama o service (via React Query na Fase 3).

---

## O que NÃO colocar no service

- Lógica de UI (estilos, estados visuais, refs)
- Chamadas diretas ao DataSource (isso é responsabilidade do repository)
- Estado React (useState, useContext)
- Regras de domínio puro (essas ficam em `domain/`)

---

## Migração gradual

Não é necessário migrar todas as páginas de uma vez. O padrão é:
1. Criar o service para o módulo sendo desenvolvido
2. A página existente pode continuar chamando o selector/repository diretamente durante a transição
3. Quando React Query for adicionado (Fase 3), o hook envolve o service

---

## Teste do service

```ts
// src/modules/fila-trabalho/services/processos.service.test.ts
import { getProcessosParaFila } from './processos.service';
import { vi } from 'vitest';
import * as repo from '@/domain/processos/repositories/processos.repository';

describe('processos.service', () => {
  it('deve retornar WorkQueueCard[] com campos preenchidos', () => {
    vi.spyOn(repo, 'getProcessosEmAndamento').mockReturnValue([mockProcesso]);
    const result = getProcessosParaFila();
    expect(result[0].id).toBe(mockProcesso.id);
    expect(result[0].fields).toHaveLength(4);
  });
});
```
