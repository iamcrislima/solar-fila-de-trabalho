import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { FavoritesContext } from './useFavorites';
import type { Favorite } from './useFavorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const isFavorite = useCallback(
    (label: string, module: string) => favorites.some((f) => f.id === `${module}:${label}`),
    [favorites]
  );

  const toggleFavorite = useCallback((label: string, module: string) => {
    const id = `${module}:${label}`;
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === id);
      return exists ? prev.filter((f) => f.id !== id) : [...prev, { id, label, module }];
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
