import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';

export function BuscaSidebar() {
  return (
    <div style={{
      padding: '16px 8px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <input
        type="text"
        placeholder="Buscar..."
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '8px 12px',
          border: `1px solid ${colors.surface.light}`,
          borderRadius: 4,
          ...typography.styles.body2,
          color: colors.surface.dark,
          outline: 'none',
        }}
      />
    </div>
  );
}
