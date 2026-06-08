import { describe, it, expect } from 'vitest';
import {
  tarefaToWorkQueueCard,
  tarefasToWorkQueueCards,
} from './tarefaToWorkQueue.adapter';
import { tarefasMock } from '@/domain/processos/tarefas/mocks/tarefas.mock';

describe('tarefaToWorkQueueCard', () => {
  const tarefa = tarefasMock[0] as unknown as Record<string, unknown>;
  const card = tarefaToWorkQueueCard(tarefa);

  it('retorna card com id igual à tarefa', () => {
    expect(card.id).toBe(tarefa.id);
  });

  it('retorna processoId correto', () => {
    expect(card.processoId).toBe(tarefa.processoId);
  });

  it('retorna fields como array não-vazio', () => {
    expect(Array.isArray(card.fields)).toBe(true);
    expect(card.fields.length).toBeGreaterThan(0);
  });

  it('retorna extraFields como array', () => {
    expect(Array.isArray(card.extraFields)).toBe(true);
  });

  it('cada field tem label e value como string', () => {
    card.fields.forEach(field => {
      expect(typeof field.label).toBe('string');
      expect(typeof field.value).toBe('string');
    });
  });

  it('retorna chips como array', () => {
    expect(Array.isArray(card.chips)).toBe(true);
  });

  it('agendada é boolean', () => {
    expect(typeof card.agendada).toBe('boolean');
  });

  it('mantém referência à tarefa original', () => {
    expect(card.tarefa).toBe(tarefa);
  });
});

describe('tarefaToWorkQueueCard — agendamento', () => {
  it('agendada é false quando tarefa não tem agendamento', () => {
    const tarefa = { id: 't-001', processoId: 'p-001' } as unknown as Record<string, unknown>;
    const card = tarefaToWorkQueueCard(tarefa);
    expect(card.agendada).toBe(false);
  });

  it('agendada é true quando agendamento.agendada é true', () => {
    const tarefa = {
      id: 't-001',
      processoId: 'p-001',
      agendamento: { agendada: true },
    } as unknown as Record<string, unknown>;
    const card = tarefaToWorkQueueCard(tarefa);
    expect(card.agendada).toBe(true);
  });
});

describe('tarefaToWorkQueueCard — chips', () => {
  it('retorna chips do mock quando presentes', () => {
    const tarefaComChips = tarefasMock.find(
      t => Array.isArray((t as unknown as Record<string, unknown>).chips) &&
           ((t as unknown as Record<string, unknown>).chips as unknown[]).length > 0
    ) as unknown as Record<string, unknown> | undefined;
    if (!tarefaComChips) return;
    const card = tarefaToWorkQueueCard(tarefaComChips);
    expect(card.chips.length).toBeGreaterThan(0);
  });

  it('retorna chips vazio quando tarefa não tem chips', () => {
    const tarefa = { id: 't-001', processoId: 'p-001' } as unknown as Record<string, unknown>;
    const card = tarefaToWorkQueueCard(tarefa);
    expect(card.chips).toEqual([]);
  });
});

describe('tarefasToWorkQueueCards', () => {
  it('converte array de tarefas em array de cards', () => {
    const tarefas = tarefasMock.slice(0, 2) as unknown as Record<string, unknown>[];
    const cards = tarefasToWorkQueueCards(tarefas);
    expect(cards).toHaveLength(2);
  });

  it('retorna array vazio para entrada vazia', () => {
    expect(tarefasToWorkQueueCards([])).toEqual([]);
  });
});
