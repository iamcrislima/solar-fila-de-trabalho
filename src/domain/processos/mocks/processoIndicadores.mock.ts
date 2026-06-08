import type { ProcessoIndicadores } from '../models/processoDigital.model';

export const processoIndicadoresMock: Record<string, ProcessoIndicadores> = {
  'SolarBPM-000005-2026': { possuiFluxo: true,  possuiRestricao: false, tarefasPendentes: true,  lembretes: false, documentCount: 2 },
  'SolarBPM-000006-2026': { possuiFluxo: false, possuiRestricao: true,  tarefasPendentes: true,  lembretes: true,  documentCount: 1 },
  'SolarBPM-000007-2026': { possuiFluxo: true,  possuiRestricao: false, tarefasPendentes: true,  lembretes: false, documentCount: 1 },
  'SolarBPM-000008-2026': { possuiFluxo: true,  possuiRestricao: false, tarefasPendentes: true,  lembretes: true,  documentCount: 2 },
  'SolarBPM-000009-2026': { possuiFluxo: false, possuiRestricao: true,  tarefasPendentes: false, lembretes: false, documentCount: 0 },
  'SolarBPM-000010-2026': { possuiFluxo: true,  possuiRestricao: false, tarefasPendentes: true,  lembretes: false, documentCount: 1 },
  'SolarBPM-000011-2026': { possuiFluxo: false, possuiRestricao: false, tarefasPendentes: true,  lembretes: false, documentCount: 1 },
  'SolarBPM-000012-2026': { possuiFluxo: true,  possuiRestricao: true,  tarefasPendentes: false, lembretes: true,  documentCount: 0 },
  'SolarBPM-000013-2026': { possuiFluxo: true,  possuiRestricao: false, tarefasPendentes: true,  lembretes: true,  documentCount: 1 },
  'SolarBPM-000014-2026': { possuiFluxo: false, possuiRestricao: false, tarefasPendentes: true,  lembretes: false, documentCount: 1 },
  'SolarBPM-000004-2026': {
    possuiFluxo: false,
    possuiRestricao: false,
    tarefasPendentes: true,
    lembretes: false,
    documentCount: 1,
  },
  'SolarBPM-000003-2026': {
    possuiFluxo: false,
    possuiRestricao: false,
    tarefasPendentes: true,
    lembretes: true,
    documentCount: 1,
  },
  'SolarBPM-000002-2026': {
    possuiFluxo: false,
    possuiRestricao: false,
    tarefasPendentes: true,
    lembretes: false,
    documentCount: 1,
  },
  'SolarBPM-000001-2026': {
    possuiFluxo: false,
    possuiRestricao: false,
    tarefasPendentes: true,
    lembretes: false,
    documentCount: 1,
  },
};
