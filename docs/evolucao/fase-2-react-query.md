# Fase 2 — React Query

**Status:** ⏳ PENDENTE — executar quando houver primeiro endpoint de API real
**Dependências:** Fase 1 (Services — concluída)
**Próxima fase:** Dados reais (Supabase ou API REST — decisão futura)

---

## Objetivo

Instalar e configurar `@tanstack/react-query` para gerenciar estado assíncrono de dados,
preparando o projeto para a integração com API real sem alterar as páginas.

---

## O que foi feito

### 1. Instalação

```bash
npm install @tanstack/react-query
npm install --save-dev @tanstack/react-query-devtools
```

### 2. QueryClient configurado

```ts
// src/application/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s — dados frescos sem refetch
      gcTime:    5 * 60_000,    // 5min — cache mantido após componente desmontar
      retry: 1,                 // 1 retry em caso de erro de rede
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.error('[mutation error]', error);
      },
    },
  },
});
```

### 3. Provider adicionado em `src/index.tsx`

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './application/queryClient';

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
```

### 4. Convenção de query keys

```ts
// src/application/queryKeys.ts
export const queryKeys = {
  processos: {
    all:   ['processos'] as const,
    fila:  ['processos', 'fila'] as const,
    byId:  (id: string) => ['processos', id] as const,
  },
  tarefas: {
    all:      ['tarefas'] as const,
    visiveis: ['tarefas', 'visiveis'] as const,
    byId:     (id: string) => ['tarefas', id] as const,
  },
} as const;
```

---

## Padrão de hook com React Query

```ts
// src/modules/fila-trabalho/hooks/useProcessos.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/application/queryKeys';
import { getProcessosParaFila } from '../services/processos.service';

export function useProcessos() {
  return useQuery({
    queryKey: queryKeys.processos.fila,
    queryFn:  getProcessosParaFila,
    staleTime: 30_000,
  });
}
```

```tsx
// Uso na página
export function FilaDeProcessos() {
  const { data: processos = [], isLoading, error } = useProcessos();

  if (isLoading) return <Loading />;
  if (error)     return <ErrorState />;

  return <WorkQueue items={processos} />;
}
```

---

## Padrão de mutation (ações que alteram dados)

```ts
// src/modules/fila-trabalho/hooks/useAtribuirTarefa.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/application/queryKeys';
import { atribuirTarefa } from '../services/tarefas.service';

export function useAtribuirTarefa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tarefaId: string) => atribuirTarefa(tarefaId),
    onSuccess: () => {
      // Invalida o cache → próxima leitura vai buscar dados atualizados
      queryClient.invalidateQueries({ queryKey: queryKeys.tarefas.all });
    },
  });
}
```

---

## Migração gradual das páginas existentes

Não é necessário migrar tudo de uma vez. O padrão é:

1. O service já existe (Fase 2)
2. Criar o hook com `useQuery` envolvendo o service
3. A página troca `const processos = getProcessosWorkQueueCards()` por `const { data: processos } = useProcessos()`
4. Adicionar loading/error states na página

Com mocks síncronos, `useQuery` funciona perfeitamente — `isLoading` será sempre `false` e `data` sempre preenchida. A diferença aparece quando o repository for async (API real).

---

## O que NÃO fazer com React Query

- **Não usar para estado de UI** (modal aberto, tab ativa) — isso é `useState`
- **Não duplicar dados** em Context E React Query — escolha um
- **Não chamar `queryClient.setQueryData` como substituto de mutation** — use `useMutation`
- **Não usar `enabled: false` como padrão** — só quando a query genuinamente não deve rodar

---

## Devtools

Em desenvolvimento, o React Query Devtools aparece no canto inferior direito.
Mostra todas as queries ativas, seu estado (fresh/stale/fetching/error) e os dados cached.
É a ferramenta mais útil para debugar problemas de dados.

---

## Invalidação de cache quando a API estiver conectada

```ts
// Após uma mutação bem-sucedida:
queryClient.invalidateQueries({ queryKey: queryKeys.processos.all });

// Após uma ação local (ex: receber um processo):
queryClient.setQueryData(queryKeys.processos.fila, (old: WorkQueueCard[]) =>
  old.map(p => p.id === id ? { ...p, bgColor: '#FFFFFF' } : p)
);
```
