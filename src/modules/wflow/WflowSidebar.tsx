import { SideMenuItem } from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { useFavorites } from '../../application/providers/useFavorites';

const MODULE = 'wflow';

const ITEMS = [
  'Permitir acesso à minha fila de trabalho',
  'Acesso à fila de trabalhos',
];

export function WflowSidebar() {
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
