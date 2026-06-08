import type { CSSProperties } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { typography } from '@/styles/tokens/typography';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';

interface UserSelectorProps { label?: string; nome?: string; style?: CSSProperties; }

export function UserSelector({ label = 'Usuário:', nome = 'Rafael Vitorino', style }: UserSelectorProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: colors.surface.xl, padding: '6px 8px', width: '100%', boxSizing: 'border-box', flexShrink: 0, ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '1 0 0', minWidth: 0 }}>
        <span style={{ ...typography.styles.body2, fontWeight: 600, color: colors.surface.dark, display: 'block', marginBottom: 2, whiteSpace: 'nowrap' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface.xxxl, border: `${borders.width.sm} solid ${colors.surface.medium}`, borderRadius: borders.radius.md, paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12, width: '100%', boxSizing: 'border-box' }}>
          <span style={{ ...typography.styles.caption, color: colors.surface.main, flex: '1 0 0', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nome}</span>
          <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
