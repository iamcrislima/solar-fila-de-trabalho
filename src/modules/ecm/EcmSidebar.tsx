import { SideMenuItem } from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { useFavorites } from '../../application/providers/useFavorites';

const MODULE = 'ecm';

const ITEMS = [
  'Modelos de documentos',
  'Documentos sem processo',
];

export function EcmSidebar() {
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
