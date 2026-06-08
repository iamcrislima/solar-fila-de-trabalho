import type { ProcessoRecebimento } from '../models/processoDigital.model';

export const processoRecebimentosMock: Record<string, ProcessoRecebimento> = {
  'SolarBPM-000005-2026': { recebidoEm: '02/01/2026 - 11:30', recebidoPor: 'Rafael Vitorino', unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000006-2026': { recebidoEm: '10/01/2026 - 16:20', recebidoPor: 'Rafael Vitorino', unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000007-2026': { recebidoEm: '15/01/2026 - 11:30', recebidoPor: 'Rafael Vitorino', unidadeRecebimento: 'SolarBPM/JUR' },
  'SolarBPM-000008-2026': { recebidoEm: '-',                   recebidoPor: '-',               unidadeRecebimento: '-'           },
  'SolarBPM-000009-2026': { recebidoEm: '20/01/2026 - 13:00', recebidoPor: 'João Carvalho',   unidadeRecebimento: 'SolarBPM/FIN' },
  'SolarBPM-000010-2026': { recebidoEm: '22/01/2026 - 10:45', recebidoPor: 'Fernando Naim',   unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000011-2026': { recebidoEm: '25/01/2026 - 14:00', recebidoPor: 'Rafael Vitorino', unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000012-2026': { recebidoEm: '28/01/2026 - 09:15', recebidoPor: 'Fernando Naim',   unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000013-2026': { recebidoEm: '-',                   recebidoPor: '-',               unidadeRecebimento: '-'           },
  'SolarBPM-000014-2026': { recebidoEm: '03/02/2026 - 08:45', recebidoPor: 'João Carvalho',   unidadeRecebimento: 'SolarBPM/RH'  },
  'SolarBPM-000004-2026': {
    recebidoEm: '15/03/2025 - 10:05',
    recebidoPor: 'Rafael Vitorino',
    unidadeRecebimento: 'SolarBPM/ADM',
  },
  'SolarBPM-000003-2026': {
    recebidoEm: '-',
    recebidoPor: '-',
    unidadeRecebimento: '-',
  },
  'SolarBPM-000002-2026': {
    recebidoEm: '22/04/2025 - 14:02',
    recebidoPor: 'Fernando Naim',
    unidadeRecebimento: 'SolarBPM/RH',
  },
  'SolarBPM-000001-2026': {
    recebidoEm: '20/04/2025 - 13:55',
    recebidoPor: 'Rafael Vitorino',
    unidadeRecebimento: 'SolarBPM/RH',
  },
};


