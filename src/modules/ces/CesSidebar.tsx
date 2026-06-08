import { SideMenuItem } from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { useFavorites } from '../../application/providers/useFavorites';

const MODULE = 'ces';

const ITEMS = [
  'Área de interesse',
  'Serviços',
];

export function CesSidebar() {
  const { isFavorite, toggleFavorite } = useFavorites();
  return (
    <>
      {ITEMS.map((label) => (
        <SideMenuItem
          key={label}
          label={label}
          showFavIcon
          fav={isFavorite(label, MODULE)}
          onFavToggle={() => toggleFavorite(label, MODULE)}
        />
      ))}
    </>
  );
}
