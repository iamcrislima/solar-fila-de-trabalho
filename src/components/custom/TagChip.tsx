import React from 'react';
import { Chip } from '../ds/atoms/Chip';
import { Tooltip } from '../ds/atoms/Tooltip/Tooltip';
import { ICON_MAP } from './attachmentCardIcons';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { spacing }    from '../../styles/tokens/spacing';
import { borders }    from '../../styles/tokens/borders';
import { CATEGORIA_TIPO, CATEGORIA_TIPO_LABEL } from '../../domain/categorias/types/categoriaTypes';
import {
  getTagColorBorderStyle,
  getTagIconOutlineStyle,
  resolveTagVisualColor,
} from './tagColorVisual';

const TAG_TYPE_LABEL = {
  groups:          'Tag de setor',
  person:          'Tag pessoal',
  account_balance: 'Tag de órgão',
};

const TAG_TYPE_BY_ICON = {
  groups:          CATEGORIA_TIPO.SETOR,
  person:          CATEGORIA_TIPO.PESSOAL,
  account_balance: CATEGORIA_TIPO.ORGAO,
};

function getChipTooltip(chip: Record<string, unknown>, label: string, iconKey: string) {
  if (!label) return '';
  if (typeof chip !== 'object' || chip === null) return label;

  const typeKey = (chip as Record<string, unknown>).tipo || (TAG_TYPE_BY_ICON as Record<string, string>)[iconKey as string];
  const meta = chip.description || chip.descricao || (CATEGORIA_TIPO_LABEL as Record<string, string>)[typeKey as string] || (TAG_TYPE_LABEL as Record<string, string>)[iconKey as string];
  return meta ? `${label} - ${meta}` : label;
}

export function TagChip({ chip, variant = 'default' }: { chip: string | Record<string, unknown>; variant?: string }) {
  const label = typeof chip === 'string' ? chip : chip.label;
  const chipColor = typeof chip === 'string' ? 'success' : ((chip as Record<string, unknown>).color || 'success');
  const iconKey = typeof chip === 'object' ? chip.iconKey : undefined;
  const IconComp = iconKey ? (ICON_MAP as Record<string, React.FC<{style?: React.CSSProperties}>>)[iconKey as string] : null;
  const tooltip = typeof chip === 'string' ? '' : getChipTooltip(chip as Record<string, unknown>, label as string, iconKey as string);
  const typeTitle = iconKey ? (TAG_TYPE_LABEL as Record<string, string>)[iconKey as string] : undefined;
  const renderedIconSize = iconKey === 'person' ? 11 : 12;
  const leadingIcon = IconComp ? (
    <span
      style={{
        width: 12,
        height: 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        flexShrink: 0,
      }}
    >
      <IconComp
        style={{
          width: renderedIconSize,
          height: renderedIconSize,
          fontSize: renderedIconSize,
          maxWidth: 12,
          maxHeight: 12,
          display: 'block',
        }}
      />
    </span>
  ) : null;

  if (variant === 'compact') {
    const compactSize = 18;
    const markerSize = 6;
    const backgroundColor = resolveTagVisualColor(String(chipColor));

    return (
      <Tooltip content={tooltip || undefined}>
        <span
          aria-label={tooltip}
          tabIndex={0}
          style={{
            width: compactSize,
            height: compactSize,
            minWidth: compactSize,
            minHeight: compactSize,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            backgroundColor,
            color: colors.surface.xxxl,
            lineHeight: 0,
            boxSizing: 'border-box',
            ...getTagColorBorderStyle(String(chipColor)),
            flexShrink: 0,
            cursor: 'default',
            outline: 'none',
          }}
        >
          {IconComp ? (
            <IconComp
              style={{
                width: renderedIconSize,
                height: renderedIconSize,
                fontSize: renderedIconSize,
                display: 'block',
                ...getTagIconOutlineStyle(String(chipColor)),
              }}
            />
          ) : (
            <span
              aria-hidden="true"
              style={{
                width: markerSize,
                height: markerSize,
                borderRadius: 999,
                backgroundColor,
                display: 'block',
              }}
            />
          )}
        </span>
      </Tooltip>
    );
  }

  // Tags pessoais com cor hex livre: renderiza com estilos inline em vez de usar o scheme do DS Chip.
  const isHexColor = typeof chipColor === 'string' && chipColor.startsWith('#');
  if (isHexColor) {
    const bgColor   = chipColor as string;
    const textColor = (typeof chip === 'object'
      ? ((chip as Record<string, unknown>).fontColor as string | undefined)
      : undefined) ?? colors.surface.xxxl;
    return (
      <Tooltip content={typeTitle}>
        <span style={{ display: 'inline-flex' }}>
          <div style={{
            display:         'inline-flex',
            alignItems:      'center',
            gap:             spacing.xxs,
            borderRadius:    borders.radius.pill,
            backgroundColor: bgColor,
            border: getTagColorBorderStyle(bgColor).border,
            paddingTop:      2,
            paddingBottom:   3,
            paddingLeft:     leadingIcon ? spacing.xxs : spacing.bt,
            paddingRight:    spacing.bt,
            minHeight:       18,
            whiteSpace:      'nowrap',
            cursor:          'default',
            boxSizing:       'border-box',
          }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {leadingIcon && React.cloneElement(leadingIcon as React.ReactElement, { style: { display: 'block', fontSize: 14, flexShrink: 0, color: textColor } } as any)}
            <span style={{ ...typography.styles.caption, color: textColor }}>
              {label as React.ReactNode}
            </span>
          </div>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={typeTitle}>
      <span style={{ display: 'inline-flex' }}>
        <Chip
          color={chipColor as "primary" | "warning" | "success" | "surface" | "error" | "support"}
          size="xs"
          leadingIcon={leadingIcon}
          style={{
            paddingTop: 2,
            paddingBottom: 3,
            minHeight: 18,
            boxSizing: 'border-box',
          }}
        >
          {label as React.ReactNode}
        </Chip>
      </span>
    </Tooltip>
  );
}
