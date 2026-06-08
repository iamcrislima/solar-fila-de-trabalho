export const CATEGORIA_TIPO = {
  SETOR: 'setor',
  SISTEMA: 'sistema',
  PESSOAL: 'pessoal',
  ORGAO: 'orgao',
} as const;

export type CategoriaTipo = (typeof CATEGORIA_TIPO)[keyof typeof CATEGORIA_TIPO];

export const CATEGORIA_ORIGEM = {
  EXTERNA: 'externa',
  USUARIO: 'usuario',
} as const;

export type CategoriaOrigem = (typeof CATEGORIA_ORIGEM)[keyof typeof CATEGORIA_ORIGEM];

export const CATEGORIA_TIPO_LABEL: Record<CategoriaTipo, string> = {
  [CATEGORIA_TIPO.SETOR]: 'Tag de setor',
  [CATEGORIA_TIPO.SISTEMA]: 'Tag de sistema',
  [CATEGORIA_TIPO.PESSOAL]: 'Tag pessoal',
  [CATEGORIA_TIPO.ORGAO]: 'Tag do órgão',
};

export interface Categoria {
  id: string;
  label: string;
  color: string;
  tipo: CategoriaTipo;
  origem: CategoriaOrigem;
  iconKey?: string;
}
