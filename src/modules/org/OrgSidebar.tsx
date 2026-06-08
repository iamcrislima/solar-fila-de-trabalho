import { SideMenuItem } from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { useFavorites } from '../../application/providers/useFavorites';

const MODULE = 'org';

// Itens do menu ORG conforme Figma node 42:1842.
// Nenhuma funcionalidade está implementada ainda — todos os itens são não-clicáveis
// até que a rota correspondente seja criada em App.tsx e a página desenvolvida.
const ITEMS = [
  { label: 'Cadastro de níveis' },
  { label: 'Associação entre nível e tipo' },
  { label: 'Cadastro de órgãos' },
  { label: 'Cadastro de tipo de unidade' },
  { label: 'Cadastro de revisão' },
];

export function OrgSidebar() {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      {ITEMS.map((item) => (
        <SideMenuItem
          key={item.label}
          label={item.label}
          showFavIcon
          fav={isFavorite(item.label, MODULE)}
          state="default"
          onFavToggle={() => toggleFavorite(item.label, MODULE)}
        />
      ))}
    </>
  );
}
