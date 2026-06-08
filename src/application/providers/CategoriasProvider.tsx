import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Categoria } from '@/domain/categorias/types/categoriaTypes';
import type { Chip } from '@/domain/shared.types';
import { normalizeCategoriasExternas } from '@/domain/categorias/adapters/categoria.adapter';
import { categoriasExternasMock } from '@/domain/categorias/mocks/categorias.mock';
import { CATEGORIA_TIPO } from '@/domain/categorias/types/categoriaTypes';
import { CategoriasContext } from './useCategorias';
import type { ChipsMap } from './useCategorias';

type ContextChipsMaps = Map<string, ChipsMap>;

function dedupeTags(tags: Categoria[]): Categoria[] {
  return [
    ...new Map(
      tags.filter((t) => t && typeof t === 'object' && t.label).map((t) => [t.label, t])
    ).values(),
  ];
}

function createChipsMap(items: Array<{ id: string; chips?: Chip[] }> = []): ChipsMap {
  return new Map(items.map((item) => [item.id, item.chips ?? []]));
}

function createContextChipsMaps(
  initialItemsByContext: Record<string, Array<{ id: string; chips?: Chip[] }>> = {}
): ContextChipsMaps {
  return new Map(
    Object.entries(initialItemsByContext).map(([key, items]) => [key, createChipsMap(items)])
  );
}

function countItemsWithTag(chipsMap: ChipsMap, label: string): number {
  let count = 0;
  chipsMap.forEach((chips) => {
    if (chips.some((chip) => (typeof chip === 'string' ? chip : chip.label) === label)) count += 1;
  });
  return count;
}

export function CategoriasProvider({
  children,
  initialExternalTags = categoriasExternasMock as unknown as Categoria[],
  initialPersonalTags = [] as Categoria[],
  initialItemsByContext = {} as Record<string, Array<{ id: string; chips?: Chip[] }>>,
}: {
  children: ReactNode;
  initialExternalTags?: Categoria[];
  initialPersonalTags?: Categoria[];
  initialItemsByContext?: Record<string, Array<{ id: string; chips?: Chip[] }>>;
}) {
  const externalTags = useMemo(
    () =>
      dedupeTags(normalizeCategoriasExternas(initialExternalTags as Parameters<typeof normalizeCategoriasExternas>[0])).filter(
        (tag) => tag.tipo !== CATEGORIA_TIPO.SISTEMA
      ),
    [initialExternalTags]
  );
  const [personalTags, setPersonalTags] = useState<Categoria[]>(() => dedupeTags(initialPersonalTags));
  const [contextChipsMaps, setContextChipsMaps] = useState<ContextChipsMaps>(() =>
    createContextChipsMaps(initialItemsByContext)
  );

  const savePersonalTag = useCallback((updated: Partial<Categoria>, originalLabel?: string) => {
    setPersonalTags((prev) => {
      if (originalLabel) {
        return dedupeTags(
          prev.map((tag) => (tag.label === originalLabel ? { ...tag, ...updated } as Categoria : tag))
        );
      }
      return dedupeTags([...prev, updated as Categoria]);
    });

    if (originalLabel) {
      setContextChipsMaps((prev) => {
        const next = new Map(prev);
        next.forEach((chipsMap, contextKey) => {
          const updatedMap = new Map(chipsMap);
          updatedMap.forEach((chips, itemId) => {
            updatedMap.set(
              itemId,
              chips.map((chip) =>
                typeof chip !== 'string' && chip.label === originalLabel
                  ? { ...chip, ...updated }
                  : chip
              )
            );
          });
          next.set(contextKey, updatedMap);
        });
        return next;
      });
    }
  }, []);

  const deletePersonalTag = useCallback((label: string) => {
    setPersonalTags((prev) => prev.filter((tag) => tag.label !== label));
    setContextChipsMaps((prev) => {
      const next = new Map(prev);
      next.forEach((chipsMap, contextKey) => {
        const updatedMap = new Map(chipsMap);
        updatedMap.forEach((chips, itemId) => {
          updatedMap.set(
            itemId,
            chips.filter((chip) => (typeof chip === 'string' ? chip : chip.label) !== label)
          );
        });
        next.set(contextKey, updatedMap);
      });
      return next;
    });
  }, []);

  const getChipsMap = useCallback(
    (contextKey: string) => contextChipsMaps.get(contextKey) ?? new Map(),
    [contextChipsMaps]
  );

  const updateChipsMap = useCallback(
    (contextKey: string, updater: ChipsMap | ((m: ChipsMap) => ChipsMap)) => {
      setContextChipsMaps((prev) => {
        const currentMap = prev.get(contextKey) ?? new Map();
        const nextMap = typeof updater === 'function' ? updater(currentMap) : updater;
        const next = new Map(prev);
        next.set(contextKey, nextMap);
        return next;
      });
    },
    []
  );

  const countTagUsage = useCallback(
    (label: string): Record<string, number> => {
      const counts: Record<string, number> = {};
      contextChipsMaps.forEach((chipsMap, contextKey) => {
        counts[contextKey] = countItemsWithTag(chipsMap, label);
      });
      return counts;
    },
    [contextChipsMaps]
  );

  const value = useMemo(
    () => ({ externalTags, personalTags, savePersonalTag, deletePersonalTag, getChipsMap, updateChipsMap, countTagUsage }),
    [externalTags, personalTags, savePersonalTag, deletePersonalTag, getChipsMap, updateChipsMap, countTagUsage]
  );

  return <CategoriasContext.Provider value={value}>{children}</CategoriasContext.Provider>;
}
