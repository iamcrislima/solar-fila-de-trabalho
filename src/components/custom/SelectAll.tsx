import type { CSSProperties } from 'react';
import { colorsSolarBPM } from '@/styles/tokens/solarbpm/colors';
import { colors }         from '@/styles/tokens/colors';
import { IconButton, IconBox } from '../ds/atoms/Icon/IconButton';
import { Tooltip }             from '../ds/atoms/Tooltip/Tooltip';

const SELECTED_PATH   = 'M20 14C20 14.5304 19.7893 15.0391 19.4142 15.4142C19.0391 15.7893 18.5304 16 18 16H6C4.89 16 4 15.1 4 14V2C4 0.89 4.89 0 6 0H18C18.5304 0 19.0391 0.210714 19.4142 0.585786C19.7893 0.960859 20 1.46957 20 2V14ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V5H2V18H14ZM11 12L18 5L16.59 3.59L11 9.17L7.91 6.09L6.5 7.5L11 12Z';
const UNSELECTED_PATH = 'M18 14V2H6V14H18ZM20 14C20 14.5304 19.7893 15.0391 19.4142 15.4142C19.0391 15.7893 18.5304 16 18 16H6C4.89 16 4 15.1 4 14V2C4 0.89 4.89 0 6 0H18C18.5304 0 19.0391 0.210714 19.4142 0.585786C19.7893 0.960859 20 1.46957 20 2V14ZM14 18V20H2C1.46957 20 0.960859 19.7893 0.585786 19.4142C0.210714 19.0391 0 18.5304 0 18V5H2V18H14Z';

interface SelectAllProps { selected?: boolean; onChange?: () => void; style?: CSSProperties; iconSize?: number; }

export function SelectAll({ selected = false, onChange, style, iconSize = 20 }: SelectAllProps) {
  const fill = selected ? colorsSolarBPM.primary.main : colors.surface.main;
  const d    = selected ? SELECTED_PATH : UNSELECTED_PATH;
  return (
    <Tooltip content="Selecionar todos">
      <IconButton onClick={onChange} aria-label="Selecionar todos" style={style}>
        <IconBox>
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: iconSize, height: iconSize, display: 'block' }}>
            <path d={d} fill={fill} />
          </svg>
        </IconBox>
      </IconButton>
    </Tooltip>
  );
}
