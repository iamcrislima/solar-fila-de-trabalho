import { CATEGORIA_ORIGEM, CATEGORIA_TIPO } from '../types/categoriaTypes';
import type { Categoria, CategoriaTipo } from '../types/categoriaTypes';

interface CategoriaInput {
  id: string;
  label?: string;
  tipo?: CategoriaTipo;
  color?: string;
  iconKey?: string;
}

const ICON_BY_TYPE: Partial<Record<CategoriaTipo, string>> = {
  [CATEGORIA_TIPO.SETOR]: 'groups',
  [CATEGORIA_TIPO.PESSOAL]: 'person',
  [CATEGORIA_TIPO.ORGAO]: 'account_balance',
};

export function normalizeCategoriaExterna(categoria: CategoriaInput): Categoria {
  const tipo = categoria.tipo ?? CATEGORIA_TIPO.SISTEMA;
  return {
    id: categoria.id,
    label: categoria.label ?? '',
    color: categoria.color ?? 'surface',
    tipo,
    origem: CATEGORIA_ORIGEM.EXTERNA,
    iconKey: categoria.iconKey ?? ICON_BY_TYPE[tipo],
  };
}

export function normalizeCategoriasExternas(categorias: CategoriaInput[] = []): Categoria[] {
  return categorias.filter((c) => c?.label).map(normalizeCategoriaExterna);
}
