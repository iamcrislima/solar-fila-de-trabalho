import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { CustomViewsProvider } from './CustomViewsProvider';
import { useCustomViews } from './useCustomViews';

function wrapper({ children }: { children: ReactNode }) {
  return <CustomViewsProvider>{children}</CustomViewsProvider>;
}

describe('CustomViewsProvider — useCustomViews', () => {
  describe('estado inicial', () => {
    it('inicia com lista de visualizações vazia para processos', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      expect(result.current.customViews).toEqual([]);
    });

    it('inicia com lista de visualizações vazia para tarefas', () => {
      const { result } = renderHook(() => useCustomViews('tarefas'), { wrapper });
      expect(result.current.customViews).toEqual([]);
    });

    it('inicia sem visualização ativa', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      expect(result.current.activeViewLabel).toBeNull();
    });

    it('inicia sem filtros aplicados', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      expect(result.current.appliedFilters).toBeNull();
    });
  });

  describe('setCustomViews', () => {
    it('RN-VP-05: adiciona visualização à lista', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => {
        result.current.setCustomViews([{ label: 'Minha visualização', pinInSidebar: false }]);
      });
      expect(result.current.customViews).toHaveLength(1);
      expect(result.current.customViews[0].label).toBe('Minha visualização');
    });

    it('aceita função updater para adicionar à lista existente', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => result.current.setCustomViews([{ label: 'Vista A' }]));
      act(() => result.current.setCustomViews(prev => [...prev, { label: 'Vista B' }]));
      expect(result.current.customViews).toHaveLength(2);
    });
  });

  describe('setActiveViewLabel', () => {
    it('RN-VP-01: define a visualização ativa', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => result.current.setActiveViewLabel('Urgentes'));
      expect(result.current.activeViewLabel).toBe('Urgentes');
    });

    it('RN-VP-07: limpa a visualização ativa ao passar null', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => result.current.setActiveViewLabel('Urgentes'));
      act(() => result.current.setActiveViewLabel(null));
      expect(result.current.activeViewLabel).toBeNull();
    });
  });

  describe('setAppliedFilters', () => {
    it('RN-VP-01: aplica filtros ao ativar visualização', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      const filtros = { tipo: new Set(['Setorial']) };
      act(() => result.current.setAppliedFilters(filtros as unknown as null));
      expect(result.current.appliedFilters).toEqual(filtros);
    });

    it('RN-VP-07: limpa filtros ao desativar', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => result.current.setAppliedFilters({ tipo: new Set(['Setorial']) } as unknown as null));
      act(() => result.current.setAppliedFilters(null));
      expect(result.current.appliedFilters).toBeNull();
    });
  });

  describe('setPinnedSidebarViews', () => {
    it('RN-VP-04: adiciona visualização fixada no sidebar', () => {
      const { result } = renderHook(() => useCustomViews('processos'), { wrapper });
      act(() => {
        result.current.setPinnedSidebarViews([{ label: 'Fixada', pinInSidebar: true }]);
      });
      expect(result.current.pinnedSidebarViews).toHaveLength(1);
      expect(result.current.pinnedSidebarViews[0].label).toBe('Fixada');
    });
  });

  describe('RN-VP-08: independência entre contextos', () => {
    it('visualizações de processos não aparecem em tarefas', () => {
      const { result: processos } = renderHook(() => useCustomViews('processos'), { wrapper });
      const { result: tarefas } = renderHook(() => useCustomViews('tarefas'), { wrapper });

      act(() => processos.current.setCustomViews([{ label: 'Vista de Processos' }]));

      expect(processos.current.customViews).toHaveLength(1);
      expect(tarefas.current.customViews).toHaveLength(0);
    });

    it('activeViewLabel de processos não afeta tarefas', () => {
      const { result: processos } = renderHook(() => useCustomViews('processos'), { wrapper });
      const { result: tarefas } = renderHook(() => useCustomViews('tarefas'), { wrapper });

      act(() => processos.current.setActiveViewLabel('Vista Processos'));

      expect(processos.current.activeViewLabel).toBe('Vista Processos');
      expect(tarefas.current.activeViewLabel).toBeNull();
    });

    it('appliedFilters de tarefas não afeta processos', () => {
      const { result: processos } = renderHook(() => useCustomViews('processos'), { wrapper });
      const { result: tarefas } = renderHook(() => useCustomViews('tarefas'), { wrapper });

      act(() => tarefas.current.setAppliedFilters({ tipo: new Set(['Urgente']) } as unknown as null));

      expect(tarefas.current.appliedFilters).not.toBeNull();
      expect(processos.current.appliedFilters).toBeNull();
    });
  });
});
