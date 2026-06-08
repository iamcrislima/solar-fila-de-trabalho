import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TarefasProvider } from './TarefasProvider';
import { useTarefasState } from './useTarefasState';
import type { Tarefa } from '@/domain/processos/tarefas/models/tarefa.model';

function makeTarefa(overrides: Partial<Record<string, unknown>> = {}): Tarefa {
  return {
    id: 'tarefa-001',
    processoId: 'proc-001',
    statusAtribuicao: 'nao_atribuida',
    atribuicao: { atribuidoA: '', data: '' },
    dados: { responsaveis: 'SolarBPM/RH' },
    ...overrides,
  } as unknown as Tarefa;
}

function makeWrapper(tarefas: Tarefa[], usuario = 'Rafael Vitorino') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <TarefasProvider initialTarefas={tarefas} usuarioAtribuicao={usuario}>
        {children}
      </TarefasProvider>
    );
  };
}

describe('TarefasProvider — useTarefasState', () => {
  describe('estado inicial', () => {
    it('carrega o assignmentMap com as tarefas fornecidas', () => {
      const tarefas = [makeTarefa({ id: 't-1' }), makeTarefa({ id: 't-2' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      expect(result.current.assignmentMap.size).toBe(2);
    });

    it('isTarefaAtribuida retorna false para tarefa nao_atribuida', () => {
      const tarefas = [makeTarefa({ id: 't-1', statusAtribuicao: 'nao_atribuida' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      expect(result.current.isTarefaAtribuida('t-1')).toBe(false);
    });

    it('isTarefaAtribuida retorna true para tarefa já atribuída no mock inicial', () => {
      const tarefas = [
        makeTarefa({
          id: 't-1',
          statusAtribuicao: 'atribuida',
          atribuicao: { atribuidoA: 'Rafael Vitorino', data: '01/01/2024 - 10:00' },
        }),
      ];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      expect(result.current.isTarefaAtribuida('t-1')).toBe(true);
    });
  });

  describe('atribuirTarefa', () => {
    it('RN-FT-06: muda statusAtribuicao para atribuida', () => {
      const tarefas = [makeTarefa({ id: 't-1' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.atribuirTarefa('t-1'));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(true);
    });

    it('RN-FT-06: registra o usuário como atribuidoA', () => {
      const tarefas = [makeTarefa({ id: 't-1' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas, 'Rafael Vitorino'),
      });
      act(() => result.current.atribuirTarefa('t-1'));
      const assignment = result.current.getTarefaAssignment('t-1');
      expect(assignment.atribuidoA).toBe('Rafael Vitorino');
    });

    it('registra data/hora da atribuição', () => {
      const tarefas = [makeTarefa({ id: 't-1' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.atribuirTarefa('t-1'));
      expect(result.current.getTarefaAssignment('t-1').data).toBeTruthy();
    });

    it('aceita objeto Tarefa além de string ID', () => {
      const tarefa = makeTarefa({ id: 't-1' });
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper([tarefa]),
      });
      act(() => result.current.atribuirTarefa(tarefa));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(true);
    });
  });

  describe('desatribuirTarefa', () => {
    it('RN-FT-06: muda statusAtribuicao para nao_atribuida', () => {
      const tarefas = [
        makeTarefa({
          id: 't-1',
          statusAtribuicao: 'atribuida',
          atribuicao: { atribuidoA: 'Rafael Vitorino', data: '01/01/2024 - 10:00' },
        }),
      ];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.desatribuirTarefa('t-1'));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(false);
    });

    it('RN-FT-06: limpa o atribuidoA ao desatribuir', () => {
      const tarefas = [
        makeTarefa({
          id: 't-1',
          statusAtribuicao: 'atribuida',
          atribuicao: { atribuidoA: 'Rafael Vitorino', data: '01/01/2024 - 10:00' },
        }),
      ];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.desatribuirTarefa('t-1'));
      // Provider representa "sem atribuição" com '-' (sentinel de valor vazio do domínio)
      const atribuidoA = result.current.getTarefaAssignment('t-1').atribuidoA;
      expect(atribuidoA === '' || atribuidoA === '-').toBe(true);
    });
  });

  describe('toggleTarefaAtribuicao', () => {
    it('alterna de nao_atribuida para atribuida', () => {
      const tarefas = [makeTarefa({ id: 't-1', statusAtribuicao: 'nao_atribuida' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.toggleTarefaAtribuicao('t-1'));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(true);
    });

    it('alterna de atribuida para nao_atribuida', () => {
      const tarefas = [
        makeTarefa({
          id: 't-1',
          statusAtribuicao: 'atribuida',
          atribuicao: { atribuidoA: 'Rafael Vitorino', data: '01/01/2024 - 10:00' },
        }),
      ];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.toggleTarefaAtribuicao('t-1'));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(false);
    });

    it('dois toggles consecutivos voltam ao estado original', () => {
      const tarefas = [makeTarefa({ id: 't-1', statusAtribuicao: 'nao_atribuida' })];
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper(tarefas),
      });
      act(() => result.current.toggleTarefaAtribuicao('t-1'));
      act(() => result.current.toggleTarefaAtribuicao('t-1'));
      expect(result.current.isTarefaAtribuida('t-1')).toBe(false);
    });
  });

  describe('mergeTarefaAssignment', () => {
    it('retorna null para tarefa null', () => {
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper([]),
      });
      expect(result.current.mergeTarefaAssignment(null)).toBeNull();
    });

    it('retorna tarefa com statusAtribuicao atualizado do provider', () => {
      const tarefa = makeTarefa({ id: 't-1', statusAtribuicao: 'nao_atribuida' });
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper([tarefa]),
      });
      act(() => result.current.atribuirTarefa('t-1'));
      const merged = result.current.mergeTarefaAssignment(tarefa);
      expect(merged?.statusAtribuicao).toBe('atribuida');
    });

    it('preserva outros campos da tarefa ao fazer merge', () => {
      const tarefa = makeTarefa({
        id: 't-1',
        titulo: 'Analisar documentação',
        processoId: 'proc-999',
      });
      const { result } = renderHook(() => useTarefasState(), {
        wrapper: makeWrapper([tarefa]),
      });
      const merged = result.current.mergeTarefaAssignment(tarefa);
      expect((merged as unknown as Record<string, unknown>)?.titulo).toBe('Analisar documentação');
      expect(merged?.processoId).toBe('proc-999');
    });
  });
});
