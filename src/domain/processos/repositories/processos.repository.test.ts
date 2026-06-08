import { describe, it, expect } from 'vitest';
import {
  isProcessoEmAndamento,
  isProcessoVisivelParaUsuario,
  getProcessoById,
  getProcessosEmAndamento,
} from './processos.repository';
import type { ProcessoDigital } from '../models/processoDigital.model';

function makeProcesso(overrides: Partial<Record<string, unknown>> = {}): ProcessoDigital {
  return {
    id: 'test-001',
    numero: '000001',
    emAndamento: true,
    tramite: {
      encaminhamento: 'Setorial',
      unidadeEncaminhamento: 'SolarBPM/RH',
      usuarioDestinatario: '',
    },
    ...overrides,
  } as unknown as ProcessoDigital;
}

describe('isProcessoEmAndamento', () => {
  it('retorna true quando emAndamento é true', () => {
    expect(isProcessoEmAndamento(makeProcesso({ emAndamento: true }))).toBe(true);
  });
  it('retorna false quando emAndamento é false', () => {
    expect(isProcessoEmAndamento(makeProcesso({ emAndamento: false }))).toBe(false);
  });
  it('retorna true quando emAndamento está ausente (undefined)', () => {
    expect(isProcessoEmAndamento(makeProcesso({ emAndamento: undefined }))).toBe(true);
  });
});

describe('isProcessoVisivelParaUsuario', () => {
  it('RN-FP-09: processo Interpessoal é visível para o usuário destinatário', () => {
    const processo = makeProcesso({
      tramite: {
        encaminhamento: 'Interpessoal',
        usuarioDestinatario: 'Rafael Vitorino',
        unidadeEncaminhamento: 'SolarBPM/RH',
      },
    });
    expect(isProcessoVisivelParaUsuario(processo, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(true);
  });

  it('RN-FP-09: processo Interpessoal não é visível para outro usuário do mesmo setor', () => {
    const processo = makeProcesso({
      tramite: {
        encaminhamento: 'Interpessoal',
        usuarioDestinatario: 'João Carvalho',
        unidadeEncaminhamento: 'SolarBPM/RH',
      },
    });
    expect(isProcessoVisivelParaUsuario(processo, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(false);
  });

  it('RN-FP-10: processo Setorial é visível para usuário da unidade correta', () => {
    const processo = makeProcesso({
      tramite: {
        encaminhamento: 'Setorial',
        unidadeEncaminhamento: 'SolarBPM/RH',
        usuarioDestinatario: '',
      },
    });
    expect(isProcessoVisivelParaUsuario(processo, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(true);
  });

  it('RN-FP-10: processo Setorial não é visível para usuário de outra unidade', () => {
    const processo = makeProcesso({
      tramite: {
        encaminhamento: 'Setorial',
        unidadeEncaminhamento: 'SolarBPM/JUR',
        usuarioDestinatario: '',
      },
    });
    expect(isProcessoVisivelParaUsuario(processo, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(false);
  });

  it('processo sem encaminhamento classificado (outro valor) é visível para todos', () => {
    const processo = makeProcesso({
      tramite: {
        encaminhamento: '',
        unidadeEncaminhamento: '',
        usuarioDestinatario: '',
      },
    });
    expect(isProcessoVisivelParaUsuario(processo, 'Rafael Vitorino', 'SolarBPM/RH')).toBe(true);
  });
});

describe('getProcessoById', () => {
  it('retorna o processo quando o id existe nos mocks', () => {
    const processos = getProcessosEmAndamento();
    if (processos.length === 0) return;
    const alvo = processos[0];
    expect(getProcessoById(alvo.id)?.id).toBe(alvo.id);
  });

  it('retorna null para id inexistente', () => {
    expect(getProcessoById('id-que-nao-existe')).toBeNull();
  });
});

describe('getProcessosEmAndamento', () => {
  it('retorna apenas processos com emAndamento !== false', () => {
    const processos = getProcessosEmAndamento();
    expect(processos.every(p => p.emAndamento !== false)).toBe(true);
  });

  it('RN-FP-09 + RN-FP-10: com filtro de usuário retorna igual ou menos processos', () => {
    const semFiltro = getProcessosEmAndamento();
    const comFiltro = getProcessosEmAndamento('Rafael Vitorino', 'SolarBPM/RH');
    expect(comFiltro.length).toBeLessThanOrEqual(semFiltro.length);
  });

  it('retorna array (pode ser vazio) quando usuário sem processos visíveis', () => {
    const resultado = getProcessosEmAndamento('Usuario Inexistente', 'Unidade/Inexistente');
    expect(Array.isArray(resultado)).toBe(true);
  });
});
