import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FavoritesProvider } from './FavoritesProvider';
import { useFavorites } from './useFavorites';

function wrapper({ children }: { children: ReactNode }) {
  return <FavoritesProvider>{children}</FavoritesProvider>;
}

describe('FavoritesProvider — useFavorites', () => {
  it('inicia com lista de favoritos vazia', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual([]);
  });

  it('isFavorite retorna false quando item não está favoritado', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.isFavorite('Fila de Tarefas', 'fila')).toBe(false);
  });

  it('toggleFavorite adiciona favorito quando não existe', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite('Fila de Tarefas', 'fila');
    });
    expect(result.current.isFavorite('Fila de Tarefas', 'fila')).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
  });

  it('toggleFavorite remove favorito quando já existe', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => result.current.toggleFavorite('Fila de Tarefas', 'fila'));
    act(() => result.current.toggleFavorite('Fila de Tarefas', 'fila'));
    expect(result.current.isFavorite('Fila de Tarefas', 'fila')).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it('favoritos de módulos diferentes são independentes', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => result.current.toggleFavorite('Processos', 'solar'));
    expect(result.current.isFavorite('Processos', 'solar')).toBe(true);
    expect(result.current.isFavorite('Processos', 'fila')).toBe(false);
  });

  it('ID do favorito segue o formato module:label', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => result.current.toggleFavorite('Fila de Tarefas', 'fila'));
    expect(result.current.favorites[0].id).toBe('fila:Fila de Tarefas');
  });

  it('múltiplos favoritos acumulam corretamente', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite('Item A', 'fila');
      result.current.toggleFavorite('Item B', 'fila');
      result.current.toggleFavorite('Item C', 'solar');
    });
    expect(result.current.favorites).toHaveLength(3);
  });
});
