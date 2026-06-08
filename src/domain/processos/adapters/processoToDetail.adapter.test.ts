import { describe, it, expect } from 'vitest';
import { processoToDetail, processoCardToDetail } from './processoToDetail.adapter';
import type { ProcessoDigital } from '../models/processoDigital.model';

function makeProcesso(overrides: Partial<Record<string, unknown>> = {}): ProcessoDigital {
  return {
    id: '001',
    numero: '000001',
    recebimento: {
      recebidoEm: '01/01/2024 10:00',
      recebidoPor: 'Sistema',
      unidadeRecebimento: 'SolarBPM/RH',
    },
    ...overrides,
  } as unknown as ProcessoDigital;
}

describe('processoToDetail', () => {
  it('preserva dados originais do recebimento quando sem readField', () => {
    const processo = makeProcesso();
    const resultado = processoToDetail(processo);
    expect(resultado.recebimento?.recebidoPor).toBe('Sistema');
    expect(resultado.recebimento?.recebidoEm).toBe('01/01/2024 10:00');
    expect(resultado.recebimento?.unidadeRecebimento).toBe('SolarBPM/RH');
  });

  it('sobrescreve recebidoPor quando readField retorna valor', () => {
    const processo = makeProcesso();
    const resultado = processoToDetail(processo, {
      readField: (key) => key === 'recebidoPor' ? 'Rafael Vitorino' : undefined,
    });
    expect(resultado.recebimento?.recebidoPor).toBe('Rafael Vitorino');
    expect(resultado.recebimento?.recebidoEm).toBe('01/01/2024 10:00');
  });

  it('usa fallback quando readField retorna null', () => {
    const processo = makeProcesso();
    const resultado = processoToDetail(processo, { readField: () => null });
    expect(resultado.recebimento?.recebidoPor).toBe('Sistema');
  });

  it('usa fallback quando readField retorna string vazia', () => {
    const processo = makeProcesso();
    const resultado = processoToDetail(processo, { readField: () => '' });
    expect(resultado.recebimento?.recebidoEm).toBe('01/01/2024 10:00');
  });

  it('preserva todos os outros campos do processo', () => {
    const processo = makeProcesso({ numero: '999999', classificacao: 'Ação Civil' });
    const resultado = processoToDetail(processo);
    expect(resultado.numero).toBe('999999');
    expect((resultado as unknown as Record<string, unknown>).classificacao).toBe('Ação Civil');
  });

  it('inicia recebimento vazio quando processo não tem recebimento', () => {
    const processo = makeProcesso({ recebimento: undefined });
    const resultado = processoToDetail(processo);
    expect(resultado.recebimento).toBeDefined();
  });
});

describe('processoCardToDetail', () => {
  it('retorna null para processCard null', () => {
    expect(processoCardToDetail(null)).toBeNull();
  });

  it('retorna null para processCard undefined', () => {
    expect(processoCardToDetail(undefined)).toBeNull();
  });

  it('retorna null para processCard sem processo', () => {
    expect(processoCardToDetail({ processo: undefined })).toBeNull();
  });

  it('retorna ProcessoDigital quando processCard tem processo', () => {
    const processo = makeProcesso({ id: '123' });
    const resultado = processoCardToDetail({ processo });
    expect(resultado?.id).toBe('123');
  });

  it('passa options.readField corretamente', () => {
    const processo = makeProcesso();
    const resultado = processoCardToDetail(
      { processo },
      { readField: (key) => key === 'recebidoPor' ? 'Novo Usuário' : undefined },
    );
    expect(resultado?.recebimento?.recebidoPor).toBe('Novo Usuário');
  });
});
