import { colors } from '../../styles/tokens/colors';
import { Tooltip } from '../ds/atoms/Tooltip/Tooltip';
import { IconButton, IconBox } from '../ds/atoms/Icon/IconButton';

interface ExpandRetractButtonProps { expanded?: boolean; active?: boolean; onClick?: () => void; label?: string; activeColor?: string; inactiveColor?: string; iconSize?: number; }
export function ExpandRetractButton({ expanded, active, onClick, label, activeColor = colors.primary.main, inactiveColor = colors.surface.main, iconSize = 17 }: ExpandRetractButtonProps) {
  const isActive = active ?? !expanded;
  const path = expanded
    ? 'M5 0V4H17V0M5 14H17V10H5M5 9H17V5H5M0 4H4V0H0M0 14H4V10H0M0 9H4V5H0V9Z'
    : 'M0 0V6H17V0M0 13H17V7H0V13Z';
  const viewBox = expanded ? '0 0 17 14' : '0 0 17 13';
  // Mantém proporção original (17×14 expandido / 17×13 retraído)
  const svgH = expanded ? Math.round(iconSize * 14 / 17) : Math.round(iconSize * 13 / 17);

  return (
    <Tooltip content={label}>
      <IconButton
        aria-label={label}
        onClick={onClick}
        style={{ color: isActive ? activeColor : inactiveColor }}
      >
        <IconBox>
          <svg
            width={iconSize}
            height={svgH}
            viewBox={viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path d={path} fill="currentColor" />
          </svg>
        </IconBox>
      </IconButton>
    </Tooltip>
  );
}
