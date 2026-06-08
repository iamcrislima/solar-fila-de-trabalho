import { describe, it, expect } from 'vitest';
import {
  copyFilters,
  uniqueVals,
  normalizeChipLabel,
  getBulkActionEligibility,
  getSortValue,
  resolveDisplayFields,
} from './workQueueUtils';

describe('getBulkActionEligibility', () => {
  const items = [
    { id: '1', eligible: true },
    { id: '2', eligible: false },
    { id: '3', eligible: true },
  ];

  it('RN-FP-06: ação crítica exige que todos os itens selecionados sejam elegíveis', () => {
    const result = getBulkActionEligibility(items, item => item.eligible, 'all');

    expect(result.canRun).toBe(false);
    expect(result.isMixedSelection).toBe(true);
    expect(result.eligible.map(item => item.id)).toEqual(['1', '3']);
    expect(result.ineligible.map(item => item.id)).toEqual(['2']);
  });

  it('RN-FP-06: ação crítica é permitida quando toda a seleção é elegível', () => {
    const result = getBulkActionEligibility(
      items.filter(item => item.eligible),
      item => item.eligible,
      'all',
    );

    expect(result.canRun).toBe(true);
    expect(result.hasIneligible).toBe(false);
  });

  it('RN-FT-06: ação parcial permanece executável em seleção mista', () => {
    const result = getBulkActionEligibility(items, item => item.eligible, 'partial');

    expect(result.canRun).toBe(true);
    expect(result.isMixedSelection).toBe(true);
    expect(result.hasEligible).toBe(true);
    expect(result.hasIneligible).toBe(true);
  });

  it('RN-FT-06: nenhuma ação em lote é executável sem seleção', () => {
    const result = getBulkActionEligibility([], item => Boolean(item), 'partial');

    expect(result.canRun).toBe(false);
    expect(result.hasSelection).toBe(false);
  });
});

describe('copyFilters', () => {
  it('copia Set como nova instância com os mesmos valores', () => {
    const original = { categorias: new Set(['A', 'B']) };
    const copia = copyFilters(original as unknown as Record<string, unknown>);
    expect(copia.categorias).toEqual(new Set(['A', 'B']));
    expect(copia.categorias).not.toBe(original.categorias);
  });

  it('copia objeto aninhado como nova instância', () => {
    const original = { datas: { from: '01/01/2024', to: '31/12/2024' } };
    const copia = copyFilters(original as unknown as Record<string, unknown>);
    expect(copia.datas).toEqual(original.datas);
    expect(copia.datas).not.toBe(original.datas);
  });

  it('copia valores primitivos diretamente', () => {
    const original = { texto: 'Rafael', numero: 42, flag: true };
    const copia = copyFilters(original as unknown as Record<string, unknown>);
    expect(copia.texto).toBe('Rafael');
    expect(copia.numero).toBe(42);
    expect(copia.flag).toBe(true);
  });

  it('mutação no original não afeta a cópia (Set)', () => {
    const original = { categorias: new Set(['A']) };
    const copia = copyFilters(original as unknown as Record<string, unknown>);
    (original.categorias as Set<string>).add('B');
    expect((copia.categorias as Set<string>).has('B')).toBe(false);
  });
});

describe('uniqueVals', () => {
  it('remove duplicatas e ordena alfabeticamente', () => {
    expect(uniqueVals(['banana', 'apple', 'banana', 'cherry'])).toEqual([
      'apple', 'banana', 'cherry',
    ]);
  });
  it('filtra null, undefined, "-" e string vazia', () => {
    expect(uniqueVals([null, undefined, '-', '', 'valor'])).toEqual(['valor']);
  });
  it('retorna array vazio para entrada vazia', () => {
    expect(uniqueVals([])).toEqual([]);
  });
  it('retorna array vazio quando todos os valores são inválidos', () => {
    expect(uniqueVals([null, '-', ''])).toEqual([]);
  });
});

describe('normalizeChipLabel', () => {
  it('remove sufixo (x/y) do final do label', () => {
    expect(normalizeChipLabel('Urgente (2/5)')).toBe('Urgente');
  });
  it('não altera labels sem sufixo', () => {
    expect(normalizeChipLabel('Aguardando análise')).toBe('Aguardando análise');
  });
  it('remove espaços extras ao redor', () => {
    expect(normalizeChipLabel('  Urgente  ')).toBe('Urgente');
  });
  it('remove sufixo com espaços antes', () => {
    expect(normalizeChipLabel('Prioridade do órgão (1/1)')).toBe('Prioridade do órgão');
  });
});

const ordenacaoConfig = [
  {
    titulo: 'CLASSIFICAR POR',
    itens: [
      { label: 'Número', dataKey: 'numero' },
      { label: 'Classificação', dataKey: 'fields:Classificação' },
      { label: 'Prazo', dataKey: 'extraFields:Prazo' },
    ],
  },
];

describe('getSortValue', () => {
  it('retorna valor de chave direta no item', () => {
    const item = { id: '1', numero: '000001', fields: [], extraFields: [] };
    expect(getSortValue(item as unknown as Record<string, unknown>, 'Número', ordenacaoConfig)).toBe('000001');
  });

  it('retorna valor de fields via prefixo "fields:"', () => {
    const item = {
      id: '1',
      fields: [{ label: 'Classificação', value: 'PROC-A' }],
      extraFields: [],
    };
    expect(getSortValue(item as unknown as Record<string, unknown>, 'Classificação', ordenacaoConfig)).toBe('PROC-A');
  });

  it('retorna valor de extraFields via prefixo "extraFields:"', () => {
    const item = {
      id: '1',
      fields: [],
      extraFields: [{ label: 'Prazo', value: '31/12/2024' }],
    };
    expect(getSortValue(item as unknown as Record<string, unknown>, 'Prazo', ordenacaoConfig)).toBe('31/12/2024');
  });

  it('retorna string vazia para label não mapeado', () => {
    const item = { id: '1', fields: [], extraFields: [] };
    expect(getSortValue(item as unknown as Record<string, unknown>, 'Campo Inexistente', ordenacaoConfig)).toBe('');
  });

  it('retorna string vazia quando campo fields não encontrado', () => {
    const item = { id: '1', fields: [], extraFields: [] };
    expect(getSortValue(item as unknown as Record<string, unknown>, 'Classificação', ordenacaoConfig)).toBe('');
  });
});

const personalizacaoItems = [
  { id: 'numero', label: 'Número', dataKey: 'Número' },
  { id: 'classificacao', label: 'Classificação', dataKey: 'Classificação' },
  { id: 'prazo', label: 'Prazo', dataKey: 'Prazo' },
];

describe('resolveDisplayFields', () => {
  it('retorna campos na ordem do savedPersonalizacao', () => {
    const item = {
      id: '1',
      fields: [
        { label: 'Classificação', value: 'PROC-A' },
        { label: 'Número', value: '000001' },
      ],
      extraFields: [],
    };
    const result = resolveDisplayFields(
      item as unknown as Record<string, unknown>,
      ['numero', 'classificacao'],
      personalizacaoItems,
    );
    expect(result).toHaveLength(2);
    expect((result[0] as Record<string, unknown>).label).toBe('Número');
    expect((result[1] as Record<string, unknown>).label).toBe('Classificação');
  });

  it('sobrescreve valor via fieldOverrideMap', () => {
    const item = {
      id: '42',
      fields: [{ label: 'Número', value: '000001' }],
      extraFields: [],
    };
    const overrideMap = new Map([['42', { 'Número': '999999' }]]);
    const result = resolveDisplayFields(
      item as unknown as Record<string, unknown>,
      ['numero'],
      personalizacaoItems,
      overrideMap,
    );
    expect((result[0] as Record<string, unknown>).value).toBe('999999');
  });

  it('usa "-" quando campo não encontrado', () => {
    const item = { id: '1', fields: [], extraFields: [] };
    const result = resolveDisplayFields(
      item as unknown as Record<string, unknown>,
      ['numero'],
      personalizacaoItems,
    );
    expect((result[0] as Record<string, unknown>).value).toBe('-');
  });

  it('ignora ids de personalização sem definição', () => {
    const item = { id: '1', fields: [], extraFields: [] };
    const result = resolveDisplayFields(
      item as unknown as Record<string, unknown>,
      ['id-inexistente'],
      personalizacaoItems,
    );
    expect(result).toHaveLength(0);
  });

  it('retorna array vazio para personalização vazia', () => {
    const item = { id: '1', fields: [], extraFields: [] };
    const result = resolveDisplayFields(
      item as unknown as Record<string, unknown>,
      [],
      personalizacaoItems,
    );
    expect(result).toHaveLength(0);
  });
});
