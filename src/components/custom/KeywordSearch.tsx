import type { CSSProperties, ChangeEventHandler } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

interface KeywordSearchProps {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  style?: CSSProperties;
}

export function KeywordSearch({ value, onChange, placeholder = 'Palavra-chave', style }: KeywordSearchProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 220px', minWidth: 180, maxWidth: '100%', height: 32, backgroundColor: colors.surface.xxxl, border: `1px solid ${colors.surface.medium}`, borderRadius: '4px', paddingLeft: '12px', paddingRight: '10px', boxSizing: 'border-box', ...style }}>
      <input value={value} onChange={onChange} placeholder={placeholder} style={{ ...typography.styles.body2, flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', color: colors.surface.main }} />
      <SearchIcon style={{ fontSize: 20, color: colors.surface.main, flexShrink: 0 }} />
    </div>
  );
}
