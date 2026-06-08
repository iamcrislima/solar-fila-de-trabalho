import { describe, it, expect } from 'vitest';
import {
  isTarefaEmAndamento,
  isTarefaVisivelParaUsuario,
  getTarefaById,
  getTarefasVisiveis,
  getTarefasByProcessoId,
} from './tarefas.repository';
import type { Tarefa } from '../models/tarefa.model';

function makeTarefa(overrides: Partial<Record<string, unknown>> = {}): Tarefa {
  return {
    id: 'tarefa-001',
    processoId: 'proc-001',
    dados: { responsaveis: 'SolarBPM/RH' },
    ...overrides,
  } as unknown as Tarefa;
}

describe('isTarefaEmAndamento', () => {
  it('retorna true por padrão quando emAndamento não está definido', () => {
    expect(isTarefaEmAndamento(makeTarefa())).toBe(true);
  });
  it('retorna false quando emAndamento é false', () => {
    expect(isTarefaEmAndamento(makeTarefa({ emAndamento: false }))).toBe(false);
  });
  it('retorna true quando emAndamento é true', () => {
    expect(isTarefaEmAndamento(makeTarefa({ emAndamento: true }))).toBe(true);
  });
});

describe('isTarefaVisivelParaUsuario', () => {
  it('RN-FT-10: visível quando responsaveis contém o nome do usuário', () => {
    const tarefa = makeTarefa({ dados: { responsaveis: 'Rafael Vitorino' } });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/JUR')).toBe(true);
  });

  it('RN-FT-10: visível quando responsaveis contém a unidade do usuário', () => {
    const tarefa = makeTarefa({ dados: { responsaveis: 'SolarBPM/RH' } });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(true);
  });

  it('RN-FT-10: visível com múltiplos responsáveis separados por vírgula', () => {
    const tarefa = makeTarefa({ dados: { responsaveis: 'Rafael Vitorino, SolarBPM/JUR' } });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(true);
  });

  it('RN-FT-10: não visível quando responsaveis é de outro usuário/setor', () => {
    const tarefa = makeTarefa({ dados: { responsaveis: 'SolarBPM/JUR' } });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(false);
  });

  it('RN-FT-10: não visível quando responsaveis está vazio', () => {
    const tarefa = makeTarefa({ dados: { responsaveis: '' } });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(false);
  });

  it('RN-FT-10: não visível quando dados está ausente', () => {
    const tarefa = makeTarefa({ dados: undefined });
    expect(isTarefaVisivelParaUsuario(tarefa, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(false);
  });
});

describe('getTarefaById', () => {
  it('retorna a tarefa quando id existe nos mocks', () => {
    const visiveis = getTarefasVisiveis('Rafael Vitorino', 'SolarBPM/RH');
    if (visiveis.length === 0) return;
    const alvo = visiveis[0];
    expect(getTarefaById(alvo.id)?.id).toBe(alvo.id);
  });

  it('retorna null para id inexistente', () => {
    expect(getTarefaById('id-inexistente')).toBeNull();
  });
});

describe('getTarefasByProcessoId', () => {
  it('retorna tarefas do processo quando processoId existe nos mocks', () => {
    const visiveis = getTarefasVisiveis('Rafael Vitorino', 'SolarBPM/RH');
    if (visiveis.length === 0) return;
    const processoId = visiveis[0].processoId;
    const resultado = getTarefasByProcessoId(processoId);
    expect(resultado.every(t => t.processoId === processoId)).toBe(true);
  });

  it('retorna array vazio para processoId vazio', () => {
    expect(getTarefasByProcessoId('')).toEqual([]);
  });

  it('retorna array vazio para processoId inexistente', () => {
    expect(getTarefasByProcessoId('processo-inexistente')).toEqual([]);
  });
});

describe('getTarefasVisiveis', () => {
  it('retorna array de tarefas visíveis para Rafael na unidade SolarBPM/RH', () => {
    const resultado = getTarefasVisiveis('Rafael Vitorino', 'SolarBPM/RH');
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBeGreaterThan(0);
  });

  it('retorna array vazio para usuário sem tarefas visíveis', () => {
    const resultado = getTarefasVisiveis('Usuario Inexistente', 'Unidade/Inexistente');
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado.length).toBe(0);
  });
});
