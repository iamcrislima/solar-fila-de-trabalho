# Fluxo de Dados — Solar BPM Frontend

> Este documento descreve o fluxo completo de dados desde a UI até a fonte de dados,
> e como cada camada se relaciona. Leia antes de criar qualquer serviço, hook ou repositório.

---

## O fluxo completo

```
┌─────────────────────────────────────────────────────────────┐
│  Pages / Components                                         │
│  → nunca chamam repository ou service diretamente          │
│  → recebem dados via props ou hooks                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ usam
┌─────────────────────▼───────────────────────────────────────┐
│  Custom Hooks  (useProcessos, useTarefas, useFilters…)      │
│  → encapsulam: loading, error, cache, retry                │
│  → usam React Query internamente                           │
│  → ficam em modules/{modulo}/hooks/                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ chamam
┌─────────────────────▼───────────────────────────────────────┐
│  Services  (processos.service.ts, tarefas.service.ts…)      │
│  → orquestram: combinam repositories, aplicam regras        │
│  → transformam: chamam adapters se necessário               │
│  → ficam em modules/{modulo}/services/                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ chamam
┌─────────────────────▼───────────────────────────────────────┐
│  Repositories  (processos.repository.ts…)                   │
│  → único ponto de acesso ao DataSource                     │
│  → hoje retorna mock; amanhã retorna API — sem mudar acima  │
│  → ficam em domain/{entidade}/repositories/                │
└─────────────────────┬───────────────────────────────────────┘
                      │ acessa
┌─────────────────────▼───────────────────────────────────────┐
│  DataSource  (plugável — nada acima sabe qual é)            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Mock    │ │ Supabase │ │ API REST │ │  Backend     │  │
│  │ (atual)  │ │ (fase 3) │ │ (fase 4) │ │ corporativo  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsabilidade de cada camada

### Pages / Components
- Renderizam dados
- Disparam ações do usuário (cliques, formulários)
- Nunca conhecem o formato bruto da API ou do mock
- Nunca importam repositories ou services diretamente

### Custom Hooks
- Único ponto de contato entre UI e dados
- Gerenciam `loading`, `error`, `data` (via React Query)
- Encapsulam a lógica de cache e sincronização
- Padrão de nomenclatura: `use{Entidade}` ou `use{Ação}{Entidade}`
- Exemplo: `useProcessos()`, `useTarefaById(id)`, `useAtribuirTarefa()`

### Services
- Orquestram operações que envolvem múltiplos repositories
- Aplicam regras de negócio de aplicação (não de domínio)
- Chamam adapters para transformar dados quando necessário
- Nunca conhecem React (sem hooks, sem estado)
- São funções puras ou classes com injeção de dependência
- Padrão de nomenclatura: `{entidade}.service.ts`

### Repositories
- Abstração da fonte de dados
- Interface pública estável — a implementação muda, a assinatura não
- Hoje: retorna mock. Amanhã: chama Supabase/API REST
- Nunca contêm lógica de negócio
- Padrão de nomenclatura: `{entidade}.repository.ts`

### DataSource
- Substituído por configuração sem alterar as camadas acima
- A troca é feita apenas no repository

---

## Estado atual vs. estado alvo

### Estado atual (sem Services e React Query)

```
Page → Repository → Mock
```

Funciona com mocks síncronos. Não escala para API assíncrona.

### Estado alvo (com Services e React Query)

```
Page → Hook (React Query) → Service → Repository → DataSource
```

Cada camada pode ser testada independentemente.
Trocar o DataSource não afeta nenhuma linha acima do repository.

---

## Exemplo prático — Fila de Processos

```ts
// 1. Repository (domain/processos/repositories/processos.repository.ts)
export function getProcessosEmAndamento(): ProcessoDigital[] {
  return mockProcessos.filter(isProcessoEmAndamento);
  // Fase 3: return await supabase.from('processos').select('*').eq('status', 'em_andamento')
  // Fase 4: return await api.get('/processos?status=em_andamento')
}

// 2. Service (modules/fila-trabalho/services/processos.service.ts)
export function getProcessosParaFila(): WorkQueueCard[] {
  const processos = getProcessosEmAndamento();
  return processosToWorkQueueCards(processos);
}

// 3. Hook (modules/fila-trabalho/hooks/useProcessos.ts)
export function useProcessos() {
  return useQuery({
    queryKey: ['processos', 'fila'],
    queryFn: getProcessosParaFila,
    staleTime: 30_000,
  });
}

// 4. Page (modules/fila-trabalho/pages/fila-processos/FilaDeProcessos.tsx)
export function FilaDeProcessos() {
  const { data: processos = [], isLoading, error } = useProcessos();
  // ...
}
```

---

## Regras de dependência entre camadas

| Camada | Pode importar de |
|---|---|
| Pages/Components | Hooks, componentes DS/app/custom, tokens |
| Hooks | Services, React Query |
| Services | Repositories, domain (adapters, models, types) |
| Repositories | DataSource (Supabase SDK, fetch, mock) |
| Domain | Nada de UI, React ou providers |

**Proibido:**
- Page importar repository diretamente
- Service importar hooks ou componentes React
- Repository importar service
- Domain importar React

---

## Quando criar service vs. usar selector direto

| Situação | Onde colocar |
|---|---|
| Leitura simples de uma entidade sem transformação | Selector do `domain/` diretamente |
| Leitura com transformação para formato de card/UI | Service do módulo |
| Combinação de múltiplos repositories | Service do módulo |
| Regra de acesso/visibilidade (quem vê o quê) | Service do módulo |
| Regra de negócio pura, independente de UI | `domain/` |

---

## Responsabilidades resumidas por tipo de arquivo

| Arquivo | Responsabilidade |
|---|---|
| `.mock.ts` | Dados simulados, substituíveis por API |
| `.model.ts` | Contrato TypeScript da entidade |
| `.repository.ts` | Fachada de acesso — hoje mock, amanhã API |
| `.service.ts` | Orquestração: combina repositories, chama adapters |
| `use{Entidade}.ts` | Hook React Query: loading, error, cache |
| `.config.ts` | Textos, opções, ações, filtros — nunca layout |
| `Fields.ts` | Labels, aliases, campos de personalização/ordenação |
| `.adapter.ts` | Transformação do formato da entidade para o formato da UI |
| `.selectors.ts` | Leitura centralizada de campos e valores derivados |

---

## Testando services

```ts
// {entidade}.service.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getEntidadesParaModulo } from './{entidade}.service';
import * as repo from '@/domain/{entidade}/repositories/{entidade}.repository';

describe('{entidade}.service', () => {
  beforeEach(() => { vi.restoreAllMocks(); });

  it('deve retornar lista vazia quando repository não retornar dados', () => {
    vi.spyOn(repo, 'getEntidades').mockReturnValue([]);
    expect(getEntidadesParaModulo()).toEqual([]);
  });

  it('deve transformar cada entidade para o formato de card', () => {
    vi.spyOn(repo, 'getEntidades').mockReturnValue([mockEntidade]);
    const [card] = getEntidadesParaModulo();
    expect(card.id).toBe(mockEntidade.id);
  });
});
```

---

## HTTP Client (quando a API existir)

O cliente HTTP fica em `src/application/http/`:

```ts
// src/application/http/http.client.ts
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // redirect to login
    }
    return Promise.reject(error);
  }
);
```

Os repositories importam `httpClient` — não Axios diretamente. Se Axios for trocado por `fetch` nativo, só `http.client.ts` muda.
