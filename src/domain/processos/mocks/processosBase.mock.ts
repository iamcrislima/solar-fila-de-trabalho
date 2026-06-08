import type { ProcessoBase } from '../models/processoDigital.model';

export const processosBaseMock: ProcessoBase[] = [
  { id: 'SolarBPM-000014-2026', numero: 'SolarBPM 000014/2026', classificacao: 'Solicitação de férias', tipo: 'Documento', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000013-2026', numero: 'SolarBPM 000013/2026', classificacao: 'Renovação de contrato', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#EBF3FF' } },
  { id: 'SolarBPM-000012-2026', numero: 'SolarBPM 000012/2026', classificacao: 'Avaliação de desempenho', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { foraFila: true, bgColor: '#FFFFFF', fimPrazoInterno: '28/03/2026' } },
  { id: 'SolarBPM-000011-2026', numero: 'SolarBPM 000011/2026', classificacao: 'Solicitação de abono', tipo: 'Documento', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000010-2026', numero: 'SolarBPM 000010/2026', classificacao: 'Contratação de serviços', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000009-2026', numero: 'SolarBPM 000009/2026', classificacao: 'Prestação de contas', tipo: 'Documento', natureza: 'Digital', emAndamento: true, fila: { foraFila: true, bgColor: '#FFFFFF', fimPrazoInterno: '10/04/2026' } },
  { id: 'SolarBPM-000008-2026', numero: 'SolarBPM 000008/2026', classificacao: 'Capacitação de servidores', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#EBF3FF' } },
  { id: 'SolarBPM-000007-2026', numero: 'SolarBPM 000007/2026', classificacao: 'Licitação pública', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000006-2026', numero: 'SolarBPM 000006/2026', classificacao: 'Licença médica', tipo: 'Documento', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000005-2026', numero: 'SolarBPM 000005/2026', classificacao: 'Aquisição de material', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000004-2026', numero: 'SolarBPM 000004/2026', classificacao: 'Contratação de serviços', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { foraFila: true, bgColor: '#FFFFFF', fimPrazoInterno: '20/04/2026' } },
  { id: 'SolarBPM-000003-2026', numero: 'SolarBPM 000003/2026', classificacao: 'Solicitação de férias', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#EBF3FF' } },
  { id: 'SolarBPM-000002-2026', numero: 'SolarBPM 000002/2026', classificacao: 'Solicitação de férias', tipo: 'Documento', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
  { id: 'SolarBPM-000001-2026', numero: 'SolarBPM 000001/2026', classificacao: 'Solicitação de férias', tipo: 'Processo', natureza: 'Digital', emAndamento: true, fila: { bgColor: '#FFFFFF' } },
];
