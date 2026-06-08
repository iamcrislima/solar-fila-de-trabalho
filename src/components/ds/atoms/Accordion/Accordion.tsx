import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import ExpandMore    from '@mui/icons-material/ExpandMore';
import ExpandLess    from '@mui/icons-material/ExpandLess';
import InfoOutlined  from '@mui/icons-material/InfoOutlined';
import { colors }    from '@/styles/tokens/colors';
import { borders }   from '@/styles/tokens/borders';
import { typography } from '@/styles/tokens/typography';

type AccordionVariant = 'default' | 'emphasis' | 'high-emphasis' | 'section';

interface AccordionStyle { headerBg: string; contentBg: string; outerBorder: string; divider: string; titleColor: string; infoColor: string; chevronColor: string; headerHeight: number; }

const VARIANT_MAP: Record<AccordionVariant, AccordionStyle> = {
  'default':       { headerBg: colors.surface.xxxl, contentBg: colors.surface.xxxl, outerBorder: `1px solid ${colors.surface.light}`, divider: `1px solid ${colors.surface.light}`, titleColor: colors.surface.dark,    infoColor: colors.surface.main,    chevronColor: colors.surface.main,    headerHeight: 68 },
  'emphasis':      { headerBg: colors.primary.xxl,  contentBg: colors.surface.xxxl, outerBorder: `1px solid ${colors.primary.xl}`,   divider: `1px solid ${colors.primary.xl}`,   titleColor: colors.primary.dark,    infoColor: colors.primary.dark,    chevronColor: colors.primary.dark,    headerHeight: 68 },
  'high-emphasis': { headerBg: colors.primary.light, contentBg: colors.surface.xxxl, outerBorder: 'none',                             divider: `1px solid ${colors.primary.medium}`, titleColor: colors.surface.xxxl,  infoColor: colors.surface.xxxl,    chevronColor: colors.surface.xxxl,    headerHeight: 68 },
  'section':       { headerBg: colors.surface.xl,   contentBg: colors.surface.xxxl, outerBorder: `1px solid ${colors.surface.light}`, divider: `1px solid ${colors.surface.light}`, titleColor: colors.surface.main,   infoColor: colors.surface.main,    chevronColor: colors.surface.main,    headerHeight: 60 },
};

interface AccordionProps {
  title?: string;
  variant?: AccordionVariant;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  info?: boolean;
  headerSlot?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Accordion({ title = 'Section', variant = 'default', defaultOpen = false, open: openProp, onToggle, info = false, headerSlot, children, style }: AccordionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp! : internalOpen;
  const v = VARIANT_MAP[variant] ?? VARIANT_MAP.default;

  function handleToggle() {
    if (!isControlled) setInternalOpen((prev) => !prev);
    onToggle?.(!isOpen);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: v.outerBorder, borderRadius: borders.radius.lg, overflow: 'hidden', ...style }}>
      <button onClick={handleToggle} style={{ display: 'flex', alignItems: 'center', gap: 8, height: v.headerHeight, paddingLeft: 16, paddingRight: 16, backgroundColor: v.headerBg, borderBottom: isOpen ? v.divider : 'none', cursor: 'pointer', border: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'left' }}>
        <span style={{ ...typography.styles.subtitle1, color: v.titleColor, flexShrink: 0 }}>{title}</span>
        {info && <InfoOutlined style={{ fontSize: 18, color: v.infoColor, flexShrink: 0 }} />}
        {headerSlot
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 0 0', justifyContent: 'flex-end', marginRight: 8 }}>{headerSlot}</div>
          : <div style={{ flex: '1 0 0' }} />
        }
        {isOpen ? <ExpandLess style={{ fontSize: 24, color: v.chevronColor, flexShrink: 0 }} /> : <ExpandMore style={{ fontSize: 24, color: v.chevronColor, flexShrink: 0 }} />}
      </button>
      {isOpen && children && <div style={{ backgroundColor: v.contentBg, padding: 16, boxSizing: 'border-box' }}>{children}</div>}
    </div>
  );
}
