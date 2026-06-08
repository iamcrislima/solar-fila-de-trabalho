import type { CSSProperties } from 'react';

// LogoHeader — Figma: H40KxY55j2KlnjKAVtSm7F node 3885:155901

import logoIcon              from '@/assets/logos/logo-icon.svg';
import logoSoftplan          from '@/assets/logos/logo-softplan.svg';
import logoSoftplanDm        from '@/assets/logos/logo-softplan-dm.svg';
import logoSoftplanIconLight from '@/assets/logos/logo-softplan-icon.svg';
import logoSoftplanIconDm    from '@/assets/logos/logo-softplan-icon-dm.svg';
import logoSolarBpmIcon      from '@/assets/logos/logo-solar-bpm-icon.svg';
import logoSolarBpmText      from '@/assets/logos/logo-solar-bpm-text.svg';
import logoSolarBpmDmIcon    from '@/assets/logos/logo-solar-bpm-dm-icon.svg';
import logoSolarBpmDmText    from '@/assets/logos/logo-solar-bpm-dm-text.svg';
import logoObrasGovText      from '@/assets/logos/logo-obras-gov-text.svg';
import logoObrasGovDmText    from '@/assets/logos/logo-obras-gov-dm-text.svg';
import logoObrasGovIcon      from '@/assets/logos/logo-obras-gov-icon.svg';
import logoGpd               from '@/assets/logos/logo-gpd.svg';
import logoGpdDm             from '@/assets/logos/logo-gpd-dm.svg';
import logoGpla              from '@/assets/logos/logo-gpla.svg';
import logoGplaDm            from '@/assets/logos/logo-gpla-dm.svg';
import logoSaff              from '@/assets/logos/logo-saff.svg';
import logoSaffDm            from '@/assets/logos/logo-saff-dm.svg';
import logoSajDef            from '@/assets/logos/logo-saj-def.svg';
import logoSajDefDm          from '@/assets/logos/logo-saj-def-dm.svg';
import logoSajMin            from '@/assets/logos/logo-saj-min.svg';
import logoSajMinDm          from '@/assets/logos/logo-saj-min-dm.svg';
import logoSajPro            from '@/assets/logos/logo-saj-pro.svg';
import logoSajProDm          from '@/assets/logos/logo-saj-pro-dm.svg';
import logoSajTri            from '@/assets/logos/logo-saj-tri.svg';
import logoSajTriDm          from '@/assets/logos/logo-saj-tri-dm.svg';
import logoSider             from '@/assets/logos/logo-sider.svg';
import logoSiderDm           from '@/assets/logos/logo-sider-dm.svg';
import logoPlaceholderCloud24     from '@/assets/logos/logo-placeholder-cloud-24.svg';
import logoPlaceholderCloud32     from '@/assets/logos/logo-placeholder-cloud-32.svg';
import logoPlaceholderArrow       from '@/assets/logos/logo-placeholder-arrow.svg';
import logoPlaceholderDmArrow     from '@/assets/logos/logo-placeholder-dm-arrow.svg';
import logoPlaceholderIconArrow   from '@/assets/logos/logo-placeholder-icon-arrow.svg';
import logoPlaceholderIconDmArrow from '@/assets/logos/logo-placeholder-icon-dm-arrow.svg';

interface SingleLogoConfig { src: string; width: number; height: number; }
interface StackedLayer extends SingleLogoConfig { ml: number; mt: number; }
interface PlaceholderConfig { bg: string; border: string; textColor: string | null; iconSize: number; cloud: string; arrow: string; showText: boolean; }

const SINGLE_LOGOS: Record<string, SingleLogoConfig> = {
  'Default': { src: logoSoftplan, width: 131.688, height: 26.337 }, 'DM': { src: logoSoftplanDm, width: 131.688, height: 26.337 },
  'Default Icon': { src: logoSoftplanIconLight, width: 48.122, height: 60 }, 'DM Icon': { src: logoSoftplanIconDm, width: 48.122, height: 60 },
  'Icon': { src: logoIcon, width: 60.005, height: 60 }, 'GPD': { src: logoGpd, width: 112.339, height: 40 }, 'GPD DM': { src: logoGpdDm, width: 112.339, height: 40 },
  'GPLA': { src: logoGpla, width: 130.834, height: 40 }, 'GPLA DM': { src: logoGplaDm, width: 130.834, height: 40 },
  'SAFF': { src: logoSaff, width: 125.528, height: 40 }, 'SAFF DM': { src: logoSaffDm, width: 125.528, height: 40 },
  'SAJ DEF': { src: logoSajDef, width: 96.102, height: 40 }, 'SAJ DEF DM': { src: logoSajDefDm, width: 96.102, height: 40 },
  'SAJ MIN': { src: logoSajMin, width: 92.914, height: 40 }, 'SAJ MIN DM': { src: logoSajMinDm, width: 92.914, height: 40 },
  'SAJ PRO': { src: logoSajPro, width: 108.068, height: 40 }, 'SAJ PRO DM': { src: logoSajProDm, width: 108.068, height: 40 },
  'SAJ TRI': { src: logoSajTri, width: 91.57, height: 40 }, 'SAJ TRI DM': { src: logoSajTriDm, width: 91.57, height: 40 },
  'SIDER': { src: logoSider, width: 138.071, height: 40 }, 'SIDER DM': { src: logoSiderDm, width: 138.071, height: 40 },
};

const STACKED_LOGOS: Record<string, StackedLayer[]> = {
  'Solar BPM': [{ src: logoSolarBpmIcon, width: 40.004, height: 40, ml: 0, mt: 0 }, { src: logoSolarBpmText, width: 131.446, height: 20.484, ml: 54.28, mt: 9.71 }],
  'Solar BPM DM': [{ src: logoSolarBpmDmIcon, width: 40.004, height: 40, ml: 0, mt: 0 }, { src: logoSolarBpmDmText, width: 133.068, height: 20.484, ml: 54.28, mt: 9.71 }],
  'Obras.gov': [{ src: logoObrasGovText, width: 142.543, height: 25.483, ml: 55.12, mt: 9.93 }, { src: logoObrasGovIcon, width: 40, height: 40, ml: 0, mt: 0 }],
  'Obras.gov DM': [{ src: logoObrasGovDmText, width: 142.543, height: 25.483, ml: 55.12, mt: 9.93 }, { src: logoObrasGovIcon, width: 40, height: 40, ml: 0, mt: 0 }],
};

const PLACEHOLDER_VARIANTS: Record<string, PlaceholderConfig> = {
  'Placeholder':         { bg: '#414141', border: '#000000', textColor: '#FFFFFF',  iconSize: 24, cloud: logoPlaceholderCloud24, arrow: logoPlaceholderArrow,       showText: true },
  'Placeholder DM':      { bg: '#FAFAFA', border: '#000000', textColor: '#000000',  iconSize: 24, cloud: logoPlaceholderCloud24, arrow: logoPlaceholderDmArrow,     showText: true },
  'Placeholder Icon':    { bg: '#414141', border: '#212121', textColor: null,       iconSize: 32, cloud: logoPlaceholderCloud32, arrow: logoPlaceholderIconArrow,   showText: false },
  'Placeholder DM Icon': { bg: '#FAFAFA', border: '#000000', textColor: null,       iconSize: 32, cloud: logoPlaceholderCloud32, arrow: logoPlaceholderIconDmArrow, showText: false },
};

function StackedLogo({ layers }: { layers: StackedLayer[] }) {
  const totalWidth  = Math.max(...layers.map((l) => l.ml + l.width));
  const totalHeight = Math.max(...layers.map((l) => l.mt + l.height));
  return (
    <div style={{ position: 'relative', width: totalWidth, height: totalHeight, flexShrink: 0 }}>
      {layers.map((l, i) => <img key={i} alt="" src={l.src} style={{ position: 'absolute', top: l.mt, left: l.ml, width: l.width, height: l.height, display: 'block' }} />)}
    </div>
  );
}

function PlaceholderLogo({ config }: { config: PlaceholderConfig }) {
  const { bg, border, textColor, iconSize, cloud, arrow, showText } = config;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: showText ? 8 : 0, backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 8, paddingLeft: 8, paddingRight: 8, paddingTop: showText ? 8 : 14, paddingBottom: showText ? 8 : 14, boxSizing: 'border-box' }}>
      <div style={{ position: 'relative', width: iconSize, height: iconSize, overflow: 'hidden', flexShrink: 0 }}>
        <img alt="" src={cloud} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', top: '16.67%', bottom: 0, left: 0, right: 0 }}>
          <img alt="" src={arrow} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        </div>
      </div>
      {showText && <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: 20, color: textColor ?? '#FFFFFF', whiteSpace: 'nowrap' }}>LOGO CLIENTE</span>}
    </div>
  );
}

interface LogoHeaderProps { variant?: string; style?: CSSProperties; }

export function LogoHeader({ variant = 'Default', style }: LogoHeaderProps) {
  if (PLACEHOLDER_VARIANTS[variant]) return <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative', ...style }}><PlaceholderLogo config={PLACEHOLDER_VARIANTS[variant]} /></div>;
  if (STACKED_LOGOS[variant]) return <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', ...style }}><StackedLogo layers={STACKED_LOGOS[variant]} /></div>;
  if (SINGLE_LOGOS[variant]) { const { src, width, height } = SINGLE_LOGOS[variant]; return <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative', ...style }}><img alt="" src={src} style={{ width, height, display: 'block', flexShrink: 0 }} /></div>; }
  return null;
}
