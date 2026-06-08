import { SideMenuItem } from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { useFavorites } from '../../application/providers/useFavorites';

const MODULE = 'bpm';

const ITEMS = [
  'Workspace',
  'Editor',
  'Formulário dinâmico',
  'Configuração de serviços',
  'Administrador',
];

export function BpmSidebar() {
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
