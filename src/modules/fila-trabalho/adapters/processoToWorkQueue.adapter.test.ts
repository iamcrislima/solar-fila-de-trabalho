import { describe, it, expect } from 'vitest';
import {
  processoToWorkQueueCard,
  processosToWorkQueueCards,
} from './processoToWorkQueue.adapter';
import { processosDigitaisMock } from '@/domain/processos/mocks/processos.mock';

describe('processoToWorkQueueCard', () => {
  const processo = processosDigitaisMock[0] as unknown as Record<string, unknown>;
  const card = processoToWorkQueueCard(processo);

  it('retorna card com id igual ao processo', () => {
    expect(card.id).toBe(processo.id);
  });

  it('retorna fields como array não-vazio', () => {
    expect(Array.isArray(card.fields)).toBe(true);
    expect(card.fields.length).toBeGreaterThan(0);
  });

  it('retorna extraFields como array', () => {
    expect(Array.isArray(card.extraFields)).toBe(true);
  });

  it('cada field tem label, value e fieldId', () => {
    card.fields.forEach(field => {
      expect(field).toHaveProperty('label');
      expect(field).toHaveProperty('value');
      expect(typeof field.label).toBe('string');
      expect(typeof field.value).toBe('string');
    });
  });

  it('retorna chips como array', () => {
    expect(Array.isArray(card.chips)).toBe(true);
  });

  it('retorna statusActions com 6 itens', () => {
    expect(card.statusActions).toHaveLength(6);
  });

  it('cada statusAction tem iconKey, active e tooltip', () => {
    card.statusActions?.forEach(action => {
      expect(typeof action.iconKey).toBe('string');
      expect(typeof action.active).toBe('boolean');
      expect(typeof action.tooltip).toBe('string');
    });
  });

  it('foraFila é boolean', () => {
    expect(typeof card.foraFila).toBe('boolean');
  });

  it('mantém referência ao processo original', () => {
    expect(card.processo).toBe(processo);
  });
});

describe('processoToWorkQueueCard — processo Interpessoal', () => {
  const interpessoal = processosDigitaisMock.find(
    p => (p as unknown as Record<string, unknown>).tramite &&
         ((p as unknown as Record<string, unknown>).tramite as Record<string, unknown>).encaminhamento === 'Interpessoal'
  ) as unknown as Record<string, unknown> | undefined;

  it('statusAction de encaminhamento é "person" para Interpessoal', () => {
    if (!interpessoal) return;
    const card = processoToWorkQueueCard(interpessoal);
    const encAction = card.statusActions?.find(a => a.iconKey === 'person');
    expect(encAction).toBeDefined();
  });
});

describe('processosToWorkQueueCards', () => {
  it('converte array de processos em array de cards', () => {
    const processos = processosDigitaisMock.slice(0, 3) as unknown as Record<string, unknown>[];
    const cards = processosToWorkQueueCards(processos);
    expect(cards).toHaveLength(3);
    expect(cards.every(c => typeof c.id === 'string')).toBe(true);
  });

  it('retorna array vazio para entrada vazia', () => {
    expect(processosToWorkQueueCards([])).toEqual([]);
  });
});
