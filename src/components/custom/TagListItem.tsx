import type { CSSProperties, FC, ReactNode } from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { colors } from '../../styles/tokens/colors';
import { spacing } from '../../styles/tokens/spacing';
import { typography } from '../../styles/tokens/typography';
import { getTagIconOutlineStyle, resolveTagVisualColor } from './tagColorVisual';
import { Tooltip } from '../ds/atoms/Tooltip/Tooltip';

const TAG_ICON_SIZE = 20;

const TYPE_ICON_MAP: Record<string, FC<{ style?: CSSProperties }>> = {
  groups: GroupsIcon,
  person: PersonIcon,
  account_balance: AccountBalanceIcon,
};

const DEFAULT_TYPE_TOOLTIPS: Record<string, string> = {
  groups: 'Tag de setor',
  person: 'Tag pessoal',
  account_balance: 'Tag de órgão',
};

interface TagListItemProps {
  label: string;
  color?: string;
  iconKey?: string;
  iconTooltip?: string;
  leading?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function TagListItem({
  label,
  color,
  iconKey,
  iconTooltip,
  leading,
  onClick,
  disabled = false,
}: TagListItemProps) {
  const tagColor = resolveTagVisualColor(color);
  const TypeIcon = iconKey ? TYPE_ICON_MAP[iconKey] : null;
  const resolvedTooltip = iconTooltip ?? (iconKey ? DEFAULT_TYPE_TOOLTIPS[iconKey] : undefined);

  return (
    <div
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xxs,
        padding: `${spacing.xxs} ${spacing.xs}`,
        minHeight: 32,
        backgroundColor: colors.surface.xxxl,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.45 : 1,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {leading}
      <LocalOfferIcon
        style={{
          fontSize: TAG_ICON_SIZE,
          color: tagColor,
          flexShrink: 0,
          ...getTagIconOutlineStyle(color),
        }}
      />
      {TypeIcon && (
        <Tooltip content={resolvedTooltip}>
          <span
            aria-label={resolvedTooltip}
            style={{
              width: TAG_ICON_SIZE,
              height: TAG_ICON_SIZE,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TypeIcon style={{ fontSize: TAG_ICON_SIZE, color: colors.surface.main }} />
          </span>
        </Tooltip>
      )}
      <span
        title={label}
        style={{
          ...typography.styles.caption,
          color: colors.surface.dark,
          flex: '0 1 auto',
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </div>
  );
}
