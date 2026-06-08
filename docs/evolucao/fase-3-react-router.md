# Fase 3 — React Router v7

**Status:** ⏳ PENDENTE — executar quando houver usuários reais ou necessidade de URLs compartilháveis
**Dependências:** nenhuma técnica — decisão de produto
**Próxima fase:** Dados reais (Supabase ou API REST)

---

## Objetivo

Substituir a navegação por `useState` em `App.tsx` por React Router v7 com URLs reais,
permitindo deep linking, back/forward do navegador e lazy loading de módulos.

---

## Guia de execução

### 1. Instalação

```bash
npm install react-router
```

### 2. Estrutura de rotas criada

```
/                     → redirect para /fila
/fila                 → FilaModule (lazy)
  /fila               → FilaDeProcessos (index)
  /fila/tarefas       → FilaDeTarefas
/solar/*              → SolarModule (lazy — stub)
/seg/*                → SegModule (lazy — stub)
/org/*                → OrgModule (lazy — stub)
... demais módulos
```

### 3. Arquivos alterados

- `src/App.tsx` — substituído por `createBrowserRouter` + `RouterProvider`
- `src/shell/AppShell.tsx` — navegação usa `useNavigate` / `<Link>` em vez de callbacks
- `src/modules/fila-trabalho/FilaModule.tsx` — usa `<Outlet>` para subrotas
- `src/shell/config/sidebar.config.ts` — itens usam `path` em vez de `id`

### 4. Padrão estabelecido para novos módulos

Cada novo módulo deve:
1. Exportar um componente raiz compatível com `<Outlet>` para subrotas
2. Ser registrado em `src/App.tsx` com `lazy(() => import(...))`
3. Ter suas subrotas definidas como `children` da rota do módulo

---

## Padrão de rotas para novos módulos

```tsx
// src/App.tsx
{
  path: 'novo-modulo',
  lazy: async () => {
    const { NovoModulo } = await import('./modules/novo-modulo/NovoModulo');
    return { Component: NovoModulo };
  },
  children: [
    { index: true, lazy: async () => { ... } },
    { path: 'sub-pagina', lazy: async () => { ... } },
  ]
}
```

```tsx
// src/modules/novo-modulo/NovoModulo.tsx
import { Outlet } from 'react-router';

export function NovoModulo() {
  return (
    <div>
      {/* sidebar e layout do módulo */}
      <Outlet />
    </div>
  );
}
```

---

## Navegação entre módulos

```tsx
// De dentro de um componente
import { useNavigate } from 'react-router';
const navigate = useNavigate();
navigate('/fila/tarefas');

// Link declarativo
import { Link } from 'react-router';
<Link to="/fila">Ir para Fila</Link>
```

---

## Notas importantes

- O shell (`AppShell`) controla o layout — os módulos renderizam dentro do `<Outlet>` do shell
- URLs são `hash-free` (sem `#`) — o Vite serve via `--history-api-fallback` em dev e o servidor de produção precisa configurar o fallback
- O `basename` pode ser configurado no router se o app rodar num subpath (ex: `/solar-bpm/`)
