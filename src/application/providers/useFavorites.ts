import { createContext, useContext } from 'react';

export interface Favorite {
  id: string;
  label: string;
  module: string;
}

export interface FavoritesContextValue {
  favorites: Favorite[];
  isFavorite: (label: string, module: string) => boolean;
  toggleFavorite: (label: string, module: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
