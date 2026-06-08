import type {
  ProcessoDigital,
  ProcessoDados,
  ProcessoIndicadores,
  ProcessoLembrete,
} from '../models/processoDigital.model';

export function getProcessoNumero(processo: ProcessoDigital | null | undefined): string {
  return processo?.numero ?? '';
}

export function getProcessoClassificacao(processo: ProcessoDigital | null | undefined): string {
  return processo?.classificacao ?? '';
}

export function getProcessoDados(processo: ProcessoDigital | null | undefined): ProcessoDados {
  return processo?.dados ?? {};
}

export function getProcessoIndicadores(
  processo: ProcessoDigital | null | undefined
): ProcessoIndicadores {
  return processo?.indicadores ?? {};
}

export function processoPossuiFluxo(processo: ProcessoDigital | null | undefined): boolean {
  return !!processo?.indicadores?.possuiFluxo || !!processo?.fluxo?.possuiFluxo;
}

export function getProcessoLembretes(
  processo: ProcessoDigital | null | undefined
): ProcessoLembrete[] {
  return processo?.lembretes ?? [];
}

export function getProcessoLembretesEmDestaque(
  processo: ProcessoDigital | null | undefined
): ProcessoLembrete[] {
  return getProcessoLembretes(processo).filter((lembrete) => lembrete.destaque);
}

export function processoPossuiLembretes(processo: ProcessoDigital | null | undefined): boolean {
  return getProcessoLembretes(processo).length > 0;
}
