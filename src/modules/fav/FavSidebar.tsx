import { SideMenuItem }   from '../../components/ds/atoms/SideMenu/SideMenuItem';
import { SideMenuSection } from '../../components/ds/atoms/SideMenu/SideMenuSection';
import { useFavorites }   from '../../application/providers/useFavorites';
import { colors }         from '../../styles/tokens/colors';
import { typography }     from '../../styles/tokens/typography';

const MODULE_LABELS: Record<string, string> = {
  solar: 'SOLAR',
  bpm:   'BPM',
  wflow: 'WFLOW',
  ecm:   'ECM',
  ces:   'CES',
  org:   'ORG',
  seg:   'SEG',
};

export function FavSidebar() {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '24px 16px' }}>
        <span style={{ ...typography.styles.overlineBold, color: colors.surface.dark }}>
          Você não possui favoritos.
        </span>
      </div>
    );
  }

  const byModule = favorites.reduce((acc: Record<string, typeof favorites>, fav) => {
    if (!acc[fav.module]) acc[fav.module] = [];
    acc[fav.module].push(fav);
    return acc;
  }, {});

  return (
    <>
      {(Object.entries(byModule) as [string, typeof favorites][]).map(([module, items]) => (
        <SideMenuSection key={module} title={MODULE_LABELS[module] ?? module.toUpperCase()}>
          {items.map(({ label }) => (
            <SideMenuItem
              key={label}
              label={label}
              showFavIcon
              fav
              onFavToggle={() => toggleFavorite(label, module)}
            />
          ))}
        </SideMenuSection>
      ))}
    </>
  );
}
