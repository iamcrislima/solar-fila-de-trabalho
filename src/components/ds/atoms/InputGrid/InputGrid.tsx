import type { CSSProperties } from 'react';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import { TruncatedText } from '../TruncatedText';
import { colors }     from '@/styles/tokens/colors';
import { borders }    from '@/styles/tokens/borders';
import { typography } from '@/styles/tokens/typography';

interface InputGridProps { value?: string | null; placeholder?: string; readOnly?: boolean; onClick?: () => void; style?: CSSProperties; }

export function InputGrid({ value = '', placeholder = 'Select', readOnly = false, onClick, style }: InputGridProps) {
  const hasValue = value !== '' && value != null;
  return (
    <div onClick={!readOnly ? onClick : undefined} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 2, paddingTop: 6, paddingBottom: 8, paddingLeft: 12, paddingRight: 6, border: `1px solid ${colors.surface.medium}`, borderRadius: borders.radius.md, backgroundColor: readOnly ? colors.surface.light : colors.surface.xxxl, cursor: readOnly ? 'default' : 'pointer', boxSizing: 'border-box', ...style }}>
      <div style={{ paddingTop: 2, minWidth: 0, flex: '1 1 auto' }}>
        <TruncatedText text={hasValue ? (value ?? '') : placeholder} style={{ ...typography.styles.body1, color: colors.surface.main, opacity: hasValue ? 1 : 0.4 }}>
          {hasValue ? value : placeholder}
        </TruncatedText>
      </div>
      <ArrowDropDownOutlined style={{ fontSize: 24, color: colors.surface.medium, opacity: readOnly ? 0.4 : 1, flexShrink: 0 }} />
    </div>
  );
}
