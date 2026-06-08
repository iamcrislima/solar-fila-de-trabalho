import React from 'react';
import type { CSSProperties } from 'react';
import ArrowBackIcon    from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

// Breadcrumb — Figma node: 623:83705

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
  style?: CSSProperties;
}

export function Breadcrumb({ items = [{ label: 'Page Title' }], showBack = false, onBack, subtitle, style }: BreadcrumbProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button onClick={onBack} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 8px 0 0', display: 'flex', alignItems: 'center' }}>
            <ArrowBackIcon style={{ fontSize: 24, color: colors.surface.dark }} />
          </button>
        )}
        {items.map((item, i) => {
          const isFirst  = i === 0;
          const isActive = i === items.length - 1 && items.length > 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRightIcon style={{ fontSize: 24, color: colors.surface.main, flexShrink: 0 }} />}
              <span onClick={item.onClick} style={{ ...(isFirst ? typography.styles.title2 : typography.styles.subtitle2), color: isActive ? colors.primary.medium : colors.surface.dark, cursor: item.onClick ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>
      {subtitle && <p style={{ ...typography.styles.body2, color: colors.surface.dark, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}
