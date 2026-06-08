import { describe, it, expect } from 'vitest';
import {
  getTarefaProcessoId,
  getTarefaTitulo,
  getTarefaStatus,
  isTarefaAtribuida,
  isTarefaAgendada,
  getTarefaSituacao,
  isTarefaAberta,
} from './tarefaSelectors';
import type { Tarefa } from '../models/tarefa.model';

function makeTarefa(overrides: Partial<Record<string, unknown>> = {}): Tarefa {
  return {
    id: 't-001',
    processoId: 'p-001',
    titulo: 'Analisar documentação',
    statusAtribuicao: 'nao_atribuida',
    status: 'nao_atribuida',
    situacao: 'em_aberto',
    agendamento: { agendada: false, dataPrazo: null },
    ...overrides,
  } as unknown as Tarefa;
}

describe('getTarefaProcessoId', () => {
  it('retorna o processoId quando presente', () => {
    expect(getTarefaProcessoId(makeTarefa({ processoId: 'proc-123' }))).toBe('proc-123');
  });
  it('retorna null para tarefa null', () => {
    expect(getTarefaProcessoId(null)).toBeNull();
  });
  it('retorna null para tarefa undefined', () => {
    expect(getTarefaProcessoId(undefined)).toBeNull();
  });
});

describe('getTarefaTitulo', () => {
  it('retorna o título quando presente', () => {
    expect(getTarefaTitulo(makeTarefa({ titulo: 'Assinar documento' }))).toBe('Assinar documento');
  });
  it('retorna string vazia para tarefa null', () => {
    expect(getTarefaTitulo(null)).toBe('');
  });
  it('retorna string vazia quando título está ausente', () => {
    expect(getTarefaTitulo(makeTarefa({ titulo: undefined }))).toBe('');
  });
});

describe('getTarefaStatus', () => {
  it('retorna statusAtribuicao quando presente', () => {
    expect(getTarefaStatus(makeTarefa({ statusAtribuicao: 'atribuida' }))).toBe('atribuida');
  });
  it('cai para campo status quando statusAtribuicao está ausente', () => {
    expect(getTarefaStatus(makeTarefa({ statusAtribuicao: undefined, status: 'nao_atribuida' }))).toBe('nao_atribuida');
  });
  it('retorna string vazia para tarefa null', () => {
    expect(getTarefaStatus(null)).toBe('');
  });
});

describe('isTarefaAtribuida', () => {
  it('retorna true quando statusAtribuicao é "atribuida"', () => {
    expect(isTarefaAtribuida(makeTarefa({ statusAtribuicao: 'atribuida' }))).toBe(true);
  });
  it('retorna false quando statusAtribuicao é "nao_atribuida"', () => {
    expect(isTarefaAtribuida(makeTarefa({ statusAtribuicao: 'nao_atribuida' }))).toBe(false);
  });
  it('retorna false para tarefa null', () => {
    expect(isTarefaAtribuida(null)).toBe(false);
  });
});

describe('isTarefaAgendada', () => {
  it('retorna true quando agendamento.agendada é true', () => {
    expect(isTarefaAgendada(makeTarefa({ agendamento: { agendada: true, dataPrazo: '31/12/2024' } }))).toBe(true);
  });
  it('retorna false quando agendamento.agendada é false', () => {
    expect(isTarefaAgendada(makeTarefa({ agendamento: { agendada: false } }))).toBe(false);
  });
  it('retorna false quando agendamento está ausente', () => {
    expect(isTarefaAgendada(makeTarefa({ agendamento: undefined }))).toBe(false);
  });
  it('retorna false para tarefa null', () => {
    expect(isTarefaAgendada(null)).toBe(false);
  });
});

describe('getTarefaSituacao', () => {
  it('retorna a situação da tarefa', () => {
    expect(getTarefaSituacao(makeTarefa({ situacao: 'finalizada' }))).toBe('finalizada');
    expect(getTarefaSituacao(makeTarefa({ situacao: 'cancelada' }))).toBe('cancelada');
    expect(getTarefaSituacao(makeTarefa({ situacao: 'rejeitada' }))).toBe('rejeitada');
    expect(getTarefaSituacao(makeTarefa({ situacao: 'em_aberto' }))).toBe('em_aberto');
  });
  it('retorna "em_aberto" como padrão quando situação está ausente', () => {
    expect(getTarefaSituacao(makeTarefa({ situacao: undefined }))).toBe('em_aberto');
  });
  it('retorna "em_aberto" para tarefa null', () => {
    expect(getTarefaSituacao(null)).toBe('em_aberto');
  });
});

describe('isTarefaAberta', () => {
  it('retorna true quando situação é "em_aberto"', () => {
    expect(isTarefaAberta(makeTarefa({ situacao: 'em_aberto' }))).toBe(true);
  });
  it('retorna false quando situação é "finalizada"', () => {
    expect(isTarefaAberta(makeTarefa({ situacao: 'finalizada' }))).toBe(false);
  });
  it('retorna false quando situação é "cancelada"', () => {
    expect(isTarefaAberta(makeTarefa({ situacao: 'cancelada' }))).toBe(false);
  });
  it('retorna false quando situação é "rejeitada"', () => {
    expect(isTarefaAberta(makeTarefa({ situacao: 'rejeitada' }))).toBe(false);
  });
  it('retorna true por padrão quando situação está ausente (default: em_aberto)', () => {
    expect(isTarefaAberta(makeTarefa({ situacao: undefined }))).toBe(true);
  });
  it('retorna true para tarefa null (default: em_aberto)', () => {
    expect(isTarefaAberta(null)).toBe(true);
  });
});
