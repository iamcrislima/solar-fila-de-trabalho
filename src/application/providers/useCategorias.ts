import { createContext, useContext } from 'react';
import type { Chip } from '@/domain/shared.types';
import type { Categoria } from '@/domain/categorias/types/categoriaTypes';

export type ChipsMap = Map<string, Chip[]>;

export interface CategoriasContextValue {
  externalTags: Categoria[];
  personalTags: Categoria[];
  savePersonalTag: (updated: Partial<Categoria>, originalLabel?: string) => void;
  deletePersonalTag: (label: string) => void;
  getChipsMap: (contextKey: string) => ChipsMap;
  updateChipsMap: (contextKey: string, updater: ChipsMap | ((m: ChipsMap) => ChipsMap)) => void;
  countTagUsage: (label: string) => Record<string, number>;
}

export const CategoriasContext = createContext<CategoriasContextValue | null>(null);

export function useCategorias(): CategoriasContextValue {
  const context = useContext(CategoriasContext);
  if (!context) throw new Error('useCategorias deve ser usado dentro de CategoriasProvider.');
  return context;
}

export function extractPersonalTagsFromItems(items: Array<{ id: string; chips?: Chip[] }> = []): Chip[] {
  return [
    ...new Map(
      items
        .flatMap((item) => item.chips ?? [])
        .filter((chip) => chip && typeof chip === 'object' && chip.iconKey === 'person')
        .map((chip) => [chip.label, chip])
    ).values(),
  ];
}
