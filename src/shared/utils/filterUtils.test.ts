import { describe, it, expect } from 'vitest';
import {
  normalizeSearchText,
  textIncludesSearch,
  isPresentFilterValue,
  getDateOnly,
  normalizeFilterValue,
  parseSortableValue,
} from './filterUtils';

describe('normalizeSearchText', () => {
  it('converte para lowercase', () => {
    expect(normalizeSearchText('HELLO')).toBe('hello');
  });
  it('remove diacrítico de á, é, í, ó, ú', () => {
    expect(normalizeSearchText('ação')).toBe('acao');
    expect(normalizeSearchText('Índia')).toBe('india');
    expect(normalizeSearchText('Ênfase')).toBe('enfase');
  });
  it('remove cedilha', () => {
    expect(normalizeSearchText('coração')).toBe('coracao');
  });
  it('retorna string vazia para null', () => {
    expect(normalizeSearchText(null)).toBe('');
  });
  it('retorna string vazia para undefined', () => {
    expect(normalizeSearchText(undefined)).toBe('');
  });
  it('converte números para string', () => {
    expect(normalizeSearchText(42)).toBe('42');
  });
});

describe('textIncludesSearch', () => {
  it('encontra substring case-insensitive', () => {
    expect(textIncludesSearch('Rafael Vitorino', 'rafael')).toBe(true);
  });
  it('encontra sem diacríticos', () => {
    expect(textIncludesSearch('Ação Civil', 'acao')).toBe(true);
    expect(textIncludesSearch('João Silva', 'joao')).toBe(true);
  });
  it('retorna false quando não encontra', () => {
    expect(textIncludesSearch('Rafael', 'Silva')).toBe(false);
  });
  it('retorna true para termo vazio (toda string contém "")', () => {
    expect(textIncludesSearch('qualquer', '')).toBe(true);
  });
  it('retorna true para valor null com termo vazio', () => {
    expect(textIncludesSearch(null, '')).toBe(true);
  });
});

describe('isPresentFilterValue', () => {
  it('retorna false para null', () => {
    expect(isPresentFilterValue(null)).toBe(false);
  });
  it('retorna false para undefined', () => {
    expect(isPresentFilterValue(undefined)).toBe(false);
  });
  it('retorna false para string vazia', () => {
    expect(isPresentFilterValue('')).toBe(false);
  });
  it('retorna false para string só com espaços', () => {
    expect(isPresentFilterValue('   ')).toBe(false);
  });
  it('retorna false para "-"', () => {
    expect(isPresentFilterValue('-')).toBe(false);
  });
  it('retorna true para string com conteúdo', () => {
    expect(isPresentFilterValue('Rafael')).toBe(true);
  });
  it('retorna true para zero numérico', () => {
    expect(isPresentFilterValue(0)).toBe(true);
  });
  it('retorna true para false booleano', () => {
    expect(isPresentFilterValue(false)).toBe(true);
  });
});

describe('getDateOnly', () => {
  it('extrai DD/MM/YYYY de datetime completo', () => {
    expect(getDateOnly('15/06/2024 10:30')).toBe('15/06/2024');
  });
  it('retorna a própria data quando não há hora', () => {
    expect(getDateOnly('15/06/2024')).toBe('15/06/2024');
  });
  it('retorna string original quando formato não é DD/MM/YYYY', () => {
    expect(getDateOnly('sem data')).toBe('sem data');
  });
  it('retorna string vazia para null', () => {
    expect(getDateOnly(null)).toBe('');
  });
  it('retorna string vazia para undefined', () => {
    expect(getDateOnly(undefined)).toBe('');
  });
});

describe('normalizeFilterValue', () => {
  it('extrai apenas a data quando field.type é "date"', () => {
    expect(normalizeFilterValue('15/06/2024 10:30', { type: 'date' })).toBe('15/06/2024');
  });
  it('retorna o valor original para field.type diferente de "date"', () => {
    expect(normalizeFilterValue('Rafael', { type: 'text' })).toBe('Rafael');
  });
  it('retorna o valor original quando field não tem type', () => {
    expect(normalizeFilterValue('Rafael')).toBe('Rafael');
  });
  it('retorna o valor original quando field é objeto vazio', () => {
    expect(normalizeFilterValue('valor', {})).toBe('valor');
  });
});

describe('parseSortableValue', () => {
  it('converte data BR DD/MM/YYYY para YYYYMMDD', () => {
    expect(parseSortableValue('15/06/2024')).toBe('20240615');
  });
  it('converte data com hora para YYYYMMDD (ignora hora)', () => {
    expect(parseSortableValue('31/12/2023 23:59')).toBe('20231231');
  });
  it('retorna string vazia para null', () => {
    expect(parseSortableValue(null)).toBe('');
  });
  it('retorna string vazia para "-"', () => {
    expect(parseSortableValue('-')).toBe('');
  });
  it('retorna string vazia para string vazia', () => {
    expect(parseSortableValue('')).toBe('');
  });
  it('normaliza texto não-data para lowercase sem diacríticos', () => {
    expect(parseSortableValue('Ação')).toBe('acao');
    expect(parseSortableValue('RAFAEL')).toBe('rafael');
  });
});
