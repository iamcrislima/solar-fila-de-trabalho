import type {
  ProcessoBase,
  ProcessoDigital,
  ProcessoLembrete,
} from '../models/processoDigital.model';
import { processosBaseMock } from './processosBase.mock';
import { processoDadosMock } from './processoDados.mock';
import { processoFluxosMock } from './processoFluxos.mock';
import { processoTramitesMock } from './processoTramites.mock';
import { processoRecebimentosMock } from './processoRecebimentos.mock';
import { processoIndicadoresMock } from './processoIndicadores.mock';
import { processoComplementosMock } from './processoComplementos.mock';

function normalizeLembretes(
  processoId: string,
  lembretes: Array<ProcessoLembrete | string> = []
): ProcessoLembrete[] {
  return lembretes.map((lembrete, index) => {
    if (typeof lembrete !== 'string') return lembrete;

    return {
      id: `${processoId}-lembrete-${index + 1}`,
      texto: lembrete,
      destaque: true,
      origem: 'manual',
    };
  });
}

function composeProcesso(processo: ProcessoBase): ProcessoDigital {
  const complementos = processoComplementosMock[processo.id] ?? {};
  const lembretes = normalizeLembretes(processo.id, complementos.lembretes);
  const indicadores = {
    ...(processoIndicadoresMock[processo.id] ?? {}),
    lembretes: lembretes.length > 0,
  };

  return {
    ...processo,
    foraFila: !!processo.fila?.foraFila,
    bgColor: processo.fila?.bgColor,
    dados: processoDadosMock[processo.id] ?? {},
    fluxo: processoFluxosMock[processo.id] ?? {},
    tramite: processoTramitesMock[processo.id] ?? {},
    recebimento: processoRecebimentosMock[processo.id] ?? {},
    indicadores,
    chips: complementos.chips ?? [],
    lembretes,
  };
}

export const processosDigitaisMock: ProcessoDigital[] = processosBaseMock.map(composeProcesso);
