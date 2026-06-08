import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CategoriasProvider } from './CategoriasProvider';
import { useCategorias } from './useCategorias';
import type { Categoria } from '@/domain/categorias/types/categoriaTypes';
import type { Chip } from '@/domain/shared.types';

function makeCategoria(overrides: Partial<Categoria> = {}): Categoria {
  return {
    id: `cat-${Math.random()}`,
    label: 'Urgente',
    color: 'error',
    tipo: 'pessoal',
    origem: 'usuario',
    iconKey: 'person',
    ...overrides,
  } as Categoria;
}

function makeChip(label: string, color = 'support'): Chip {
  return { label, color };
}

function makeWrapper(
  externalTags: Categoria[] = [],
  personalTags: Categoria[] = [],
  itemsByContext: Record<string, Array<{ id: string; chips?: Chip[] }>> = {},
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <CategoriasProvider
        initialExternalTags={externalTags}
        initialPersonalTags={personalTags}
        initialItemsByContext={itemsByContext}
      >
        {children}
      </CategoriasProvider>
    );
  };
}

describe('CategoriasProvider — useCategorias', () => {
  describe('estado inicial', () => {
    it('carrega externalTags sem as tags do tipo SISTEMA', () => {
      const tags: Categoria[] = [
        makeCategoria({ label: 'Urgente', tipo: 'pessoal' }),
        makeCategoria({ label: 'Aguardando prazo', tipo: 'sistema' }),
        makeCategoria({ label: 'Prioridade do órgão', tipo: 'orgao' }),
      ];
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(tags),
      });
      const labels = result.current.externalTags.map(t => t.label);
      expect(labels).toContain('Urgente');
      expect(labels).toContain('Prioridade do órgão');
      expect(labels).not.toContain('Aguardando prazo');
    });

    it('carrega personalTags fornecidas', () => {
      const tags = [makeCategoria({ label: 'Minha tag', tipo: 'pessoal' })];
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper([], tags),
      });
      expect(result.current.personalTags).toHaveLength(1);
      expect(result.current.personalTags[0].label).toBe('Minha tag');
    });

    it('getChipsMap retorna mapa vazio para contexto desconhecido', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      const mapa = result.current.getChipsMap('processos');
      expect(mapa.size).toBe(0);
    });
  });

  describe('savePersonalTag', () => {
    it('RN-CT-04: cria nova tag pessoal', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      act(() => {
        result.current.savePersonalTag({ label: 'Nova tag', color: 'primary', tipo: 'pessoal' as const });
      });
      expect(result.current.personalTags.some(t => t.label === 'Nova tag')).toBe(true);
    });

    it('RN-CT-04: atualiza label de tag existente via originalLabel', () => {
      const tags = [makeCategoria({ label: 'Tag antiga', tipo: 'pessoal' })];
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper([], tags),
      });
      act(() => {
        result.current.savePersonalTag({ label: 'Tag nova', color: 'primary' }, 'Tag antiga');
      });
      const labels = result.current.personalTags.map(t => t.label);
      expect(labels).toContain('Tag nova');
      expect(labels).not.toContain('Tag antiga');
    });

    it('não duplica tag com mesmo label', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      act(() => result.current.savePersonalTag({ label: 'Duplicada', color: 'primary', tipo: 'pessoal' as const }));
      act(() => result.current.savePersonalTag({ label: 'Duplicada', color: 'error', tipo: 'pessoal' as const }));
      const comLabel = result.current.personalTags.filter(t => t.label === 'Duplicada');
      expect(comLabel).toHaveLength(1);
    });
  });

  describe('deletePersonalTag', () => {
    it('RN-CT-04: remove a tag pessoal da lista', () => {
      const tags = [makeCategoria({ label: 'Para deletar', tipo: 'pessoal' })];
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper([], tags),
      });
      act(() => result.current.deletePersonalTag('Para deletar'));
      expect(result.current.personalTags.every(t => t.label !== 'Para deletar')).toBe(true);
    });

    it('RN-CT-04: remove chips da tag deletada de todos os itens do contexto', () => {
      const tags = [makeCategoria({ label: 'Tag removida', tipo: 'pessoal' })];
      const itens = {
        processos: [
          { id: 'p-001', chips: [makeChip('Tag removida'), makeChip('Outra tag')] },
        ],
      };
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper([], tags, itens),
      });
      act(() => result.current.deletePersonalTag('Tag removida'));
      const mapa = result.current.getChipsMap('processos');
      const chips = mapa.get('p-001') ?? [];
      expect(chips.every(c => c.label !== 'Tag removida')).toBe(true);
      expect(chips.some(c => c.label === 'Outra tag')).toBe(true);
    });
  });

  describe('updateChipsMap', () => {
    it('RN-CT-06: atualiza chips de um item no contexto correto', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      act(() => {
        result.current.updateChipsMap('processos', (prev) => {
          const next = new Map(prev);
          next.set('p-001', [makeChip('Urgente')]);
          return next;
        });
      });
      const mapa = result.current.getChipsMap('processos');
      expect(mapa.get('p-001')?.[0].label).toBe('Urgente');
    });

    it('RN-CT-06: contextos são independentes — atualizar processos não afeta tarefas', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      act(() => {
        result.current.updateChipsMap('processos', (prev) => {
          const next = new Map(prev);
          next.set('p-001', [makeChip('Urgente')]);
          return next;
        });
      });
      const mapaProcessos = result.current.getChipsMap('processos');
      const mapaTarefas = result.current.getChipsMap('tarefas');
      expect(mapaProcessos.get('p-001')).toBeDefined();
      expect(mapaTarefas.get('p-001')).toBeUndefined();
    });
  });

  describe('countTagUsage', () => {
    it('retorna contagem por contexto para uma tag usada', () => {
      const itens = {
        processos: [
          { id: 'p-001', chips: [makeChip('Urgente')] },
          { id: 'p-002', chips: [makeChip('Urgente'), makeChip('Outra')] },
        ],
        tarefas: [
          { id: 't-001', chips: [makeChip('Urgente')] },
        ],
      };
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper([], [], itens),
      });
      const contagem = result.current.countTagUsage('Urgente');
      expect(contagem.processos).toBe(2);
      expect(contagem.tarefas).toBe(1);
    });

    it('retorna objeto vazio para tag sem uso', () => {
      const { result } = renderHook(() => useCategorias(), {
        wrapper: makeWrapper(),
      });
      const contagem = result.current.countTagUsage('Tag inexistente');
      const total = Object.values(contagem).reduce((a, b) => a + b, 0);
      expect(total).toBe(0);
    });
  });
});
