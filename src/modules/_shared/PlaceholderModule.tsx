import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';

interface PlaceholderModuleProps { label?: string; }
export function PlaceholderModule({ label = '' }: PlaceholderModuleProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.surface.light,
    }}>
      <span style={{ ...typography.styles.title2, color: colors.surface.main }}>
        {label || 'Módulo em desenvolvimento'}
      </span>
      <span style={{ ...typography.styles.body2, color: colors.surface.medium }}>
        Este módulo estará disponível em breve.
      </span>
    </div>
  );
}
