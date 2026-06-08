import { CATEGORIA_TIPO } from '../types/categoriaTypes';
import type { CategoriaTipo } from '../types/categoriaTypes';
import { SYSTEM_TAGS } from '@/domain/categorias/systemTags';

interface CategoriaInput {
  id: string;
  label: string;
  tipo: CategoriaTipo;
  color: string;
  iconKey?: string;
}

export const categoriasExternasMock: CategoriaInput[] = [
  { id: 'cat-setor-aguardando-analise', label: 'Aguardando análise', tipo: CATEGORIA_TIPO.SETOR, color: 'support' },
  { id: 'cat-pessoal-urgente', label: 'Urgente', tipo: CATEGORIA_TIPO.PESSOAL, color: 'error' },
  { id: SYSTEM_TAGS.ASSINATURAS_PENDENTES.id,  label: SYSTEM_TAGS.ASSINATURAS_PENDENTES.label,  tipo: CATEGORIA_TIPO.SISTEMA, color: SYSTEM_TAGS.ASSINATURAS_PENDENTES.color  },
  { id: SYSTEM_TAGS.ASSINATURAS_REALIZADAS.id, label: SYSTEM_TAGS.ASSINATURAS_REALIZADAS.label, tipo: CATEGORIA_TIPO.SISTEMA, color: SYSTEM_TAGS.ASSINATURAS_REALIZADAS.color },
  { id: SYSTEM_TAGS.AGUARDANDO_PRAZO.id,       label: SYSTEM_TAGS.AGUARDANDO_PRAZO.label,       tipo: CATEGORIA_TIPO.SISTEMA, color: SYSTEM_TAGS.AGUARDANDO_PRAZO.color       },
  { id: SYSTEM_TAGS.INICIO_AGENDADO.id,        label: SYSTEM_TAGS.INICIO_AGENDADO.label,        tipo: CATEGORIA_TIPO.SISTEMA, color: SYSTEM_TAGS.INICIO_AGENDADO.color        },
  { id: SYSTEM_TAGS.RETORNADA_AGENDAMENTO.id,  label: SYSTEM_TAGS.RETORNADA_AGENDAMENTO.label,  tipo: CATEGORIA_TIPO.SISTEMA, color: SYSTEM_TAGS.RETORNADA_AGENDAMENTO.color  },
  { id: 'cat-orgao-prioridade-orgao', label: 'Prioridade do órgão', tipo: CATEGORIA_TIPO.ORGAO, color: 'primary' },
];
