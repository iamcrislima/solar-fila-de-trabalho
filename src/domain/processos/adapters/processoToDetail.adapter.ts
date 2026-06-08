import type { ProcessoDigital, ProcessoRecebimento } from '../models/processoDigital.model';

interface ReadFieldFn {
  (fieldKey: string): string | null | undefined;
}

interface AdapterOptions {
  readField?: ReadFieldFn;
}

export function processoToDetail(
  processo: ProcessoDigital,
  options: AdapterOptions = {}
): ProcessoDigital {
  const { readField } = options;
  const read = (fieldKey: string, fallback: string | undefined) => {
    const value = readField?.(fieldKey);
    return value === undefined || value === null || value === '' ? fallback : value;
  };

  return {
    ...processo,
    recebimento: {
      ...(processo.recebimento ?? {}),
      recebidoEm: read('recebidoEm', processo.recebimento?.recebidoEm),
      recebidoPor: read('recebidoPor', processo.recebimento?.recebidoPor),
      unidadeRecebimento: read('unidadeRecebimento', processo.recebimento?.unidadeRecebimento),
    } as ProcessoRecebimento,
  };
}

interface ProcessCard {
  processo?: ProcessoDigital;
}

export function processoCardToDetail(
  processCard: ProcessCard | null | undefined,
  options: AdapterOptions = {}
): ProcessoDigital | null {
  if (!processCard?.processo) return null;
  return processoToDetail(processCard.processo, options);
}
