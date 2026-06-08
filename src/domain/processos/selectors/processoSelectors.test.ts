import { describe, it, expect } from 'vitest';
import {
  getProcessoNumero,
  getProcessoClassificacao,
  processoPossuiFluxo,
  getProcessoLembretes,
  getProcessoLembretesEmDestaque,
  processoPossuiLembretes,
} from './processoSelectors';
import type { ProcessoDigital } from '../models/processoDigital.model';

function makeProcesso(overrides: Partial<Record<string, unknown>> = {}): ProcessoDigital {
  return { id: '001', numero: '000001', ...overrides } as unknown as ProcessoDigital;
}

describe('getProcessoNumero', () => {
  it('retorna o número do processo', () => {
    expect(getProcessoNumero(makeProcesso({ numero: '12345' }))).toBe('12345');
  });
  it('retorna string vazia para processo null', () => {
    expect(getProcessoNumero(null)).toBe('');
  });
  it('retorna string vazia para processo undefined', () => {
    expect(getProcessoNumero(undefined)).toBe('');
  });
});

describe('getProcessoClassificacao', () => {
  it('retorna a classificação quando presente', () => {
    expect(getProcessoClassificacao(makeProcesso({ classificacao: 'Ação Civil' }))).toBe('Ação Civil');
  });
  it('retorna string vazia quando classificacao está ausente', () => {
    expect(getProcessoClassificacao(makeProcesso())).toBe('');
  });
  it('retorna string vazia para processo null', () => {
    expect(getProcessoClassificacao(null)).toBe('');
  });
});

describe('processoPossuiFluxo', () => {
  it('retorna true quando indicadores.possuiFluxo é true', () => {
    const processo = makeProcesso({ indicadores: { possuiFluxo: true } });
    expect(processoPossuiFluxo(processo)).toBe(true);
  });
  it('retorna true quando fluxo.possuiFluxo é true', () => {
    const processo = makeProcesso({ fluxo: { possuiFluxo: true } });
    expect(processoPossuiFluxo(processo)).toBe(true);
  });
  it('retorna false quando indicadores.possuiFluxo é false', () => {
    const processo = makeProcesso({ indicadores: { possuiFluxo: false } });
    expect(processoPossuiFluxo(processo)).toBe(false);
  });
  it('retorna false para processo null', () => {
    expect(processoPossuiFluxo(null)).toBe(false);
  });
  it('retorna false quando nem indicadores nem fluxo estão definidos', () => {
    expect(processoPossuiFluxo(makeProcesso())).toBe(false);
  });
});

describe('getProcessoLembretes', () => {
  it('retorna lista de lembretes quando presente', () => {
    const lembrete = { id: 'l1', texto: 'Revisar doc', destaque: false };
    const processo = makeProcesso({ lembretes: [lembrete] });
    const resultado = getProcessoLembretes(processo);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].texto).toBe('Revisar doc');
  });
  it('retorna array vazio quando não há lembretes', () => {
    expect(getProcessoLembretes(makeProcesso())).toEqual([]);
  });
  it('retorna array vazio para processo null', () => {
    expect(getProcessoLembretes(null)).toEqual([]);
  });
});

describe('getProcessoLembretesEmDestaque', () => {
  it('retorna apenas lembretes com destaque true', () => {
    const lembretes = [
      { id: 'l1', texto: 'Normal', destaque: false },
      { id: 'l2', texto: 'Destaque', destaque: true },
    ];
    const processo = makeProcesso({ lembretes });
    const resultado = getProcessoLembretesEmDestaque(processo);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].texto).toBe('Destaque');
  });
  it('retorna array vazio quando nenhum lembrete tem destaque', () => {
    const processo = makeProcesso({ lembretes: [{ id: 'l1', texto: 'Normal', destaque: false }] });
    expect(getProcessoLembretesEmDestaque(processo)).toEqual([]);
  });
});

describe('processoPossuiLembretes', () => {
  it('retorna true quando há ao menos um lembrete', () => {
    const processo = makeProcesso({ lembretes: [{ id: 'l1', texto: 'teste', destaque: false }] });
    expect(processoPossuiLembretes(processo)).toBe(true);
  });
  it('retorna false quando não há lembretes', () => {
    expect(processoPossuiLembretes(makeProcesso())).toBe(false);
  });
  it('retorna false para processo null', () => {
    expect(processoPossuiLembretes(null)).toBe(false);
  });
});
