import { SideMenuItem }   from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { SideMenuSection } from '../../components/ds/atoms/SideMenu/SideMenuSection';
import { useFavorites }   from '../../application/providers/useFavorites';

const MODULE = 'solar';

const item = (label: string, isFavorite: (l: string, m: string) => boolean, toggleFavorite: (l: string, m: string) => void) => (
  <SideMenuItem
    key={label}
    label={label}
    showFavIcon
    fav={isFavorite(label, MODULE)}
    onFavToggle={() => toggleFavorite(label, MODULE)}
  />
);

export function SolarSidebar() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const mk = (label: string) => item(label, isFavorite, toggleFavorite);
  return (
    <>
      {mk('Cadastro de processo/documento')}
      {mk('Autuação de documento')}
      {mk('Consulta de processos/documentos')}
      {mk('Histórico de atividades')}
      {mk('Materialização em segundo plano')}
      {mk('Metadados em segundo plano')}
      <SideMenuSection title="Processo" />
      <SideMenuSection title="Relatórios" />
      <SideMenuSection title="Cadastros básicos" />
      <SideMenuSection title="SEI" />
      <SideMenuSection title="Tramita GOV.BR" />
    </>
  );
}
