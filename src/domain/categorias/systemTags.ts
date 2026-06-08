import type { Chip } from '@/domain/shared.types';

type ChipColor = 'primary' | 'warning' | 'success' | 'surface' | 'error' | 'support';
type SystemTagEntity = 'processo' | 'tarefa';

interface SystemTagDef {
  readonly id:     string;
  readonly label:  string;
  readonly color:  ChipColor;
  readonly entity: readonly SystemTagEntity[];
}

/**
 * Catálogo de tags de sistema — fonte única de verdade para id, label e cor.
 * Novas tags de sistema devem ser adicionadas aqui antes de qualquer uso.
 */
export const SYSTEM_TAGS = {

  ASSINATURAS_PENDENTES: {
    id:     'cat-sistema-assinaturas-pendentes',
    label:  'Assinatura(s) pendente(s)',
    color:  'warning',
    entity: ['processo'],
  },

  ASSINATURAS_REALIZADAS: {
    id:     'cat-sistema-assinaturas-realizadas',
    label:  'Assinatura(s) realizada(s)',
    color:  'success',
    entity: ['processo'],
  },

  AGUARDANDO_PRAZO: {
    id:     'cat-sistema-aguardando-prazo',
    label:  'Aguardando prazo',
    color:  'warning',
    entity: ['processo', 'tarefa'],
  },

  INICIO_AGENDADO: {
    id:     'cat-sistema-inicio-agendado',
    label:  'Início agendado',
    color:  'error',
    entity: ['tarefa'],
  },

  RETORNADA_AGENDAMENTO: {
    id:     'cat-sistema-retornada-agendamento',
    label:  'Retornada do agendamento',
    color:  'success',
    entity: ['tarefa'],
  },

  // Planejadas — adicionar quando o ciclo de Prazo de tarefa for implementado:
  // PROXIMO_PRAZO_FINAL: { id: 'cat-sistema-proximo-prazo-final', label: 'Próxima do prazo final', color: 'warning', entity: ['tarefa'] },
  // PRAZO_VENCIDO:       { id: 'cat-sistema-prazo-vencido',       label: 'Prazo vencido',          color: 'error',   entity: ['tarefa'] },

} as const satisfies Record<string, SystemTagDef>;

export type SystemTagKey   = keyof typeof SYSTEM_TAGS;
export type SystemTagValue = (typeof SYSTEM_TAGS)[SystemTagKey];

export function systemChip(tag: SystemTagValue): Chip {
  return { label: tag.label, color: tag.color };
}

export function hasSystemChip(chips: Chip[], tag: SystemTagValue): boolean {
  return chips.some(c => c.label === tag.label);
}

export function removeSystemChip(chips: Chip[], tag: SystemTagValue): Chip[] {
  return chips.filter(c => c.label !== tag.label);
}
