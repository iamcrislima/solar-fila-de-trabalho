import type { ProcessoComplementos } from '../models/processoDigital.model';

export const processoComplementosMock: Record<string, ProcessoComplementos> = {
  'SolarBPM-000005-2026': {
    chips: [{ label: 'Aguardando análise', color: 'support', iconKey: 'groups' }],
  },
  'SolarBPM-000006-2026': {
    chips: [
      { label: 'Urgente', color: 'error', iconKey: 'person' },
    ],
    lembretes: ['Prazo de encaminhamento vence em 10/02/2026.'],
  },
  'SolarBPM-000007-2026': {
    chips: [{ label: 'Assinatura(s) realizada(s)', color: 'success' }],
  },
  'SolarBPM-000008-2026': {
    chips: [{ label: 'Aguardando análise', color: 'support', iconKey: 'groups' }],
    lembretes: ['Confirmar lista de participantes até 31/01/2026.'],
  },
  'SolarBPM-000009-2026': {
    chips: [{ label: 'Aguardando prazo', color: 'warning' }],
  },
  'SolarBPM-000010-2026': {
    chips: [{ label: 'Assinatura(s) pendente(s)', color: 'warning' }],
  },
  'SolarBPM-000011-2026': {
    chips: [{ label: 'Assinatura(s) realizada(s)', color: 'success' }],
  },
  'SolarBPM-000012-2026': {
    chips: [
      { label: 'Aguardando prazo', color: 'warning' },
      { label: 'Aguardando análise', color: 'support', iconKey: 'groups' },
    ],
    lembretes: ['Avaliação deve ser concluída até 28/02/2026.', 'Chefia ainda não respondeu.'],
  },
  'SolarBPM-000013-2026': {
    chips: [
      { label: 'Urgente', color: 'error', iconKey: 'person' },
      { label: 'Aguardando análise', color: 'support', iconKey: 'groups' },
    ],
    lembretes: ['Contrato vence em 60 dias — prioridade máxima.'],
  },
  'SolarBPM-000014-2026': {
    chips: [],
  },
  'SolarBPM-000004-2026': {
    chips: [{ label: 'Aguardando prazo', color: 'warning' }],
  },
  'SolarBPM-000003-2026': {
    chips: [],
    lembretes: [
      'Retorno do processo solicitado até 30/04/2025.',
      'Documentação complementar pendente de análise.',
    ],
  },
  'SolarBPM-000002-2026': {
    chips: [
      { label: 'Aguardando análise', color: 'support', iconKey: 'groups' },
      { label: 'Urgente', color: 'error', iconKey: 'person' },
      { label: 'Assinatura(s) pendente(s)', color: 'warning' },
    ],
  },
  'SolarBPM-000001-2026': {
    chips: [{ label: 'Assinatura(s) realizada(s)', color: 'success' }],
  },
};

