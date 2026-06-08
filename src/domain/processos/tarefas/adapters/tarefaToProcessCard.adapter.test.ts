import { describe, it, expect } from 'vitest';
import {
  tarefaToProcessTaskCard,
  tarefasToProcessTaskCards,
} from './tarefaToProcessCard.adapter';
import { PROCESSO_TAREFA_CARD_FIELDS } from '../fields/processoTarefaCardFields';
import type { Tarefa } from '../models/tarefa.model';

function makeTarefa(overrides: Partial<Record<string, unknown>> = {}): Tarefa {
  return {
    id: 'tarefa-001',
    titulo: 'Analisar documentação',
    processoId: 'proc-001',
    statusAtribuicao: 'nao_atribuida',
    status: 'nao_atribuida',
    situacao: 'em_aberto',
    tipo: 'Autuação',
    dados: {
      categoria: 'Urgente',
      detalhamento: 'Revisar contrato',
      responsaveis: 'SolarBPM/RH',
      interessado: 'Rafael Vitorino',
    },
    criacao: {
      data: '01/06/2024',
      unidadeUsuario: 'SolarBPM/RH',
    },
    atribuicao: {
      atribuidoA: 'Machado de Assis',
      data: '02/06/2024',
    },
    agendamento: {
      agendada: false,
      dataPrazo: '30/06/2024',
    },
    chips: [],
    ...overrides,
  } as unknown as Tarefa;
}

describe('tarefaToProcessTaskCard', () => {
  const tarefa = makeTarefa();
  const card = tarefaToProcessTaskCard(tarefa);

  it('retorna card com id igual ao da tarefa', () => {
    expect(card.id).toBe('tarefa-001');
  });

  it('retorna taskName igual ao título da tarefa', () => {
    expect(card.taskName).toBe('Analisar documentação');
  });

  it('retorna situação da tarefa', () => {
    expect(card.situacao).toBe('em_aberto');
  });

  it('retorna statusAtribuicao da tarefa', () => {
    expect(card.statusAtribuicao).toBe('nao_atribuida');
  });

  it('mantém referência à tarefa original', () => {
    expect(card.tarefa).toBe(tarefa);
  });

  it('retorna chips como array (default [])', () => {
    expect(Array.isArray(card.chips)).toBe(true);
  });

  it('retorna fields com o mesmo número de entradas que PROCESSO_TAREFA_CARD_FIELDS', () => {
    expect(card.fields).toHaveLength(PROCESSO_TAREFA_CARD_FIELDS.length);
  });

  it('cada field tem id, fieldId, label e value como string', () => {
    card.fields.forEach(field => {
      expect(typeof field.id).toBe('string');
      expect(typeof field.fieldId).toBe('string');
      expect(typeof field.label).toBe('string');
      expect(typeof field.value).toBe('string');
    });
  });

  it('lê campo de nível raiz (tipo) corretamente', () => {
    const tipoField = card.fields.find(f => f.fieldId === 'tipoDeTarefa');
    expect(tipoField?.value).toBe('Autuação');
  });

  it('lê campo aninhado (dados.categoria) corretamente', () => {
    const categoriaField = card.fields.find(f => f.fieldId === 'categoria');
    expect(categoriaField?.value).toBe('Urgente');
  });

  it('lê campo profundamente aninhado (atribuicao.atribuidoA) corretamente', () => {
    const atribuidoField = card.fields.find(f => f.fieldId === 'atribuidoA');
    expect(atribuidoField?.value).toBe('Machado de Assis');
  });

  it('retorna "-" para campo null ou undefined', () => {
    const tarefaSemDados = makeTarefa({ dados: {} });
    const cardSemDados = tarefaToProcessTaskCard(tarefaSemDados);
    const categoriaField = cardSemDados.fields.find(f => f.fieldId === 'categoria');
    expect(categoriaField?.value).toBe('-');
  });

  it('retorna "-" para campo de string vazia', () => {
    const tarefaComVazio = makeTarefa({ dados: { categoria: '' } });
    const cardComVazio = tarefaToProcessTaskCard(tarefaComVazio);
    const categoriaField = cardComVazio.fields.find(f => f.fieldId === 'categoria');
    expect(categoriaField?.value).toBe('-');
  });

  it('usa "em_aberto" como situação padrão quando ausente', () => {
    const tarefaSemSituacao = makeTarefa({ situacao: undefined });
    const cardSemSituacao = tarefaToProcessTaskCard(tarefaSemSituacao);
    expect(cardSemSituacao.situacao).toBe('em_aberto');
  });

  it('chips do mock são retornados quando presentes', () => {
    const chip = { label: 'Urgente', color: 'error' };
    const tarefaComChips = makeTarefa({ chips: [chip] });
    const cardComChips = tarefaToProcessTaskCard(tarefaComChips);
    expect(cardComChips.chips).toHaveLength(1);
    expect(cardComChips.chips[0].label).toBe('Urgente');
  });
});

describe('tarefasToProcessTaskCards', () => {
  it('converte array de tarefas para array de cards', () => {
    const tarefas = [makeTarefa({ id: 't-1' }), makeTarefa({ id: 't-2' })];
    const cards = tarefasToProcessTaskCards(tarefas);
    expect(cards).toHaveLength(2);
    expect(cards[0].id).toBe('t-1');
    expect(cards[1].id).toBe('t-2');
  });

  it('retorna array vazio para entrada vazia', () => {
    expect(tarefasToProcessTaskCards([])).toEqual([]);
  });

  it('retorna array vazio para undefined', () => {
    expect(tarefasToProcessTaskCards(undefined)).toEqual([]);
  });
});
