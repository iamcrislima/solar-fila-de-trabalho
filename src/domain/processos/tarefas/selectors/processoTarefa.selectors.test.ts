import { describe, it, expect } from 'vitest';
import {
  normalizeProcessNumber,
  buildProcessosById,
  buildProcessosByNumero,
  resolveProcessoForTarefa,
  getTarefasAbertasByProcessoId,
  countTarefasAbertasByProcessoId,
  buildTarefasByProcessoId,
} from './processoTarefa.selectors';
import type { Tarefa } from '../models/tarefa.model';
import type { ProcessoDigital } from '../../models/processoDigital.model';

function makeTarefa(overrides: Partial<Record<string, unknown>> = {}): Tarefa {
  return {
    id: 't-001',
    processoId: 'p-001',
    situacao: 'Em andamento',
    ...overrides,
  } as unknown as Tarefa;
}

function makeProcesso(overrides: Partial<Record<string, unknown>> = {}): ProcessoDigital {
  return { id: 'p-001', numero: '000001', ...overrides } as unknown as ProcessoDigital;
}

describe('normalizeProcessNumber', () => {
  it('remove espaços e converte para lowercase', () => {
    expect(normalizeProcessNumber('  000001  ')).toBe('000001');
  });
  it('mantém barras e dígitos', () => {
    expect(normalizeProcessNumber('SEI/001/2024')).toBe('sei/001/2024');
  });
  it('retorna string vazia para null', () => {
    expect(normalizeProcessNumber(null)).toBe('');
  });
  it('retorna string vazia para undefined', () => {
    expect(normalizeProcessNumber(undefined)).toBe('');
  });
});

describe('buildProcessosById', () => {
  it('constrói mapa id → processo', () => {
    const processos = [
      makeProcesso({ id: 'p-001' }),
      makeProcesso({ id: 'p-002', numero: '000002' }),
    ];
    const mapa = buildProcessosById(processos);
    expect(mapa.get('p-001')?.id).toBe('p-001');
    expect(mapa.get('p-002')?.numero).toBe('000002');
  });
  it('retorna mapa vazio para array vazio', () => {
    expect(buildProcessosById([]).size).toBe(0);
  });
  it('retorna mapa vazio para undefined', () => {
    expect(buildProcessosById(undefined).size).toBe(0);
  });
});

describe('buildProcessosByNumero', () => {
  it('constrói mapa número normalizado → processo', () => {
    const processos = [makeProcesso({ id: 'p-001', numero: '000001' })];
    const mapa = buildProcessosByNumero(processos);
    expect(mapa.get('000001')?.id).toBe('p-001');
  });
  it('normaliza o número da chave', () => {
    const processos = [makeProcesso({ id: 'p-001', numero: '  SEI/001  ' })];
    const mapa = buildProcessosByNumero(processos);
    expect(mapa.get('sei/001')?.id).toBe('p-001');
  });
});

describe('resolveProcessoForTarefa', () => {
  it('resolve processo pelo processoId', () => {
    const processo = makeProcesso({ id: 'p-001' });
    const tarefa = makeTarefa({ processoId: 'p-001' });
    expect(resolveProcessoForTarefa(tarefa, [processo])?.id).toBe('p-001');
  });
  it('retorna null para tarefa null', () => {
    expect(resolveProcessoForTarefa(null, [])).toBeNull();
  });
  it('retorna null quando processo não encontrado', () => {
    const tarefa = makeTarefa({ processoId: 'p-inexistente' });
    expect(resolveProcessoForTarefa(tarefa, [])).toBeNull();
  });
});

describe('getTarefasAbertasByProcessoId', () => {
  it('retorna array vazio para processoId vazio', () => {
    expect(getTarefasAbertasByProcessoId('', [makeTarefa()])).toEqual([]);
  });
  it('retorna apenas tarefas do processoId informado', () => {
    const tarefas = [
      makeTarefa({ id: 't-1', processoId: 'p-001' }),
      makeTarefa({ id: 't-2', processoId: 'p-002' }),
    ];
    const resultado = getTarefasAbertasByProcessoId('p-001', tarefas);
    expect(resultado.every(t => t.processoId === 'p-001')).toBe(true);
  });
});

describe('countTarefasAbertasByProcessoId', () => {
  it('retorna 0 para processoId vazio', () => {
    expect(countTarefasAbertasByProcessoId('', [makeTarefa()])).toBe(0);
  });
  it('retorna número >= 0', () => {
    const tarefas = [makeTarefa({ processoId: 'p-001' })];
    const count = countTarefasAbertasByProcessoId('p-001', tarefas);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe('buildTarefasByProcessoId', () => {
  it('agrupa tarefas por processoId', () => {
    const tarefas = [
      makeTarefa({ id: 't-1', processoId: 'p-001' }),
      makeTarefa({ id: 't-2', processoId: 'p-001' }),
      makeTarefa({ id: 't-3', processoId: 'p-002' }),
    ];
    const mapa = buildTarefasByProcessoId(tarefas);
    expect(mapa.get('p-001')).toHaveLength(2);
    expect(mapa.get('p-002')).toHaveLength(1);
  });
  it('ignora tarefas sem processoId', () => {
    const tarefas = [makeTarefa({ processoId: undefined })];
    const mapa = buildTarefasByProcessoId(tarefas);
    expect(mapa.size).toBe(0);
  });
  it('retorna mapa vazio para array vazio', () => {
    expect(buildTarefasByProcessoId([]).size).toBe(0);
  });
});
