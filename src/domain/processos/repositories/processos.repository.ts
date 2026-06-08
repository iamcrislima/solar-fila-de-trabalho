import type { ProcessoDigital } from '../models/processoDigital.model';
import { processosDigitaisMock } from '../mocks/processos.mock';

export function isProcessoEmAndamento(processo: ProcessoDigital): boolean {
  return processo?.emAndamento !== false;
}

// RN-FP-09: Interpessoal — só visível se destinado ao usuário logado.
// RN-FP-10: Setorial — só visível se destinado à unidade do usuário logado.
export function isProcessoVisivelParaUsuario(
  processo: ProcessoDigital,
  nomeUsuario: string,
  unidade: string
): boolean {
  const enc = processo?.tramite?.encaminhamento;
  if (enc === 'Interpessoal') return processo.tramite.usuarioDestinatario === nomeUsuario;
  if (enc === 'Setorial') return processo.tramite.unidadeEncaminhamento === unidade;
  return true;
}

export function getProcessos(): ProcessoDigital[] {
  return processosDigitaisMock;
}

export function getProcessosEmAndamento(
  nomeUsuario: string | null = null,
  unidade: string | null = null
): ProcessoDigital[] {
  return getProcessos().filter(
    (p) =>
      isProcessoEmAndamento(p) &&
      (nomeUsuario === null || isProcessoVisivelParaUsuario(p, nomeUsuario, unidade ?? ''))
  );
}

export function getProcessoById(processoId: string): ProcessoDigital | null {
  return getProcessos().find((p) => p.id === processoId) ?? null;
}
