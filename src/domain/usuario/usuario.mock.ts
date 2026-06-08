// Contexto do usuário logado — fonte única para o mock.
// Na integração com API, este módulo será substituído pelo contexto de autenticação real.

export interface UsuarioLogado {
  nome: string;
  unidade: string;
}

export const USUARIO_LOGADO_MOCK: UsuarioLogado = {
  nome: 'Rafael Vitorino',
  unidade: 'SolarBPM/RH',
};
