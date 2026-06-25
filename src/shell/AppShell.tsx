import React, { useEffect, useState } from 'react';

import { HeaderBar }        from '../components/ds/atoms/Header/HeaderBar';
import { HeaderIconButton } from '../components/ds/atoms/Header/HeaderIconButton';
import { SideMenuIconItem } from '../components/ds/atoms/SideMenu/SideMenuIconItem';

import { headerConfig }       from './config/header.config';
import { sidebarIconsConfig } from './config/sidebar-icons.config';

import { colors }  from '../styles/tokens/colors';
import { shadows } from '../styles/tokens/shadows';
import { borders } from '../styles/tokens/borders';
import { spacing } from '../styles/tokens/spacing';

import { SolarBPMLogo, HEADER_ICONS, MODULE_ICON_MAP } from './assets';
import { SOFTPLAN_LOGO } from './assets.logos';

// ─── Dimensões fixas do shell ─────────────────────────────────────────────────
const SIDEBAR_PANEL_WIDTH   = 216;
const SIDEBAR_PANEL_COMPACT = 176;
const BRANDING_WIDTH        = 270;
const BRANDING_COMPACT      = 230;
const ICON_BAR_WIDTH        = 54;
const LOGO_WIDTH            = '96px';
const LOGO_HEIGHT           = '20px';

// ─── AppShell ─────────────────────────────────────────────────────────────────
// Shell global da aplicação: Header, barra de ícones de módulos, painel lateral
// e rodapé de branding. É o único componente que "conhece" o layout de portal.
//
// Props:
//   sidebarContent  — conteúdo do painel lateral (SideMenuHeader/Item do módulo ativo)
//   activeModuleId  — id do módulo ativo (ex: 'fila', 'solar')
//   onModuleChange  — callback (moduleId: string) => void ao clicar em ícone
//   children        — área de conteúdo principal (renderizada pelo módulo ativo)

interface AppShellProps {
  sidebarContent?: React.ReactNode;
  activeModuleId: string;
  onModuleChange: (moduleId: string) => void;
  children: React.ReactNode;
  /** Conteúdo da barra de breadcrumb global (full-width, acima da sidebar). */
  breadcrumbBar?: React.ReactNode;
}

export function AppShell({ sidebarContent, activeModuleId, onModuleChange, children, breadcrumbBar }: AppShellProps) {
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [viewportWidth, setViewportWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(getWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // padding: '8px 12px 7px' → 8 + gap4 + icon24 + label13 + 7 = 56 px (ajustado ao header de 56 px)
  const headerIcons = headerConfig.textos.iconButtons.map((btn: { label: string }, i: number) => (
    <HeaderIconButton key={btn.label} icon={HEADER_ICONS[i]} label={btn.label} onClick={() => {}} style={{ padding: '8px 12px 7px' }} />
  ));

  const compactSidebar    = viewportWidth <= 980;
  const sidebarPanelWidth = compactSidebar ? SIDEBAR_PANEL_COMPACT : SIDEBAR_PANEL_WIDTH;
  const brandingWidth     = compactSidebar ? BRANDING_COMPACT      : BRANDING_WIDTH;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <HeaderBar
        logo={<SolarBPMLogo />}
        systemName={headerConfig.textos.sistemaNome}
        iconItems={headerIcons}
        style={{
          backgroundColor: colors.surface.xxxl,
          boxShadow:       'none',
          borderBottom:    `1px solid ${colors.surface.light}`,
          paddingLeft:     spacing.sm,
          paddingRight:    spacing.xl,
          height:          56,
          flexShrink:      0,
          position:        'relative',
          zIndex:          100,
        }}
      />

      {/* ── Área principal ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* ── Coluna esquerda ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Barra de ícones de módulos */}
            <div style={{
              backgroundColor: colors.primary.main,
              width:           ICON_BAR_WIDTH,
              display:         'flex',
              flexDirection:   'column',
              flexShrink:      0,
              overflow:        'hidden',
              boxShadow:       shadows.level1,
              borderRight:     `${borders.width.sm} solid ${colors.surface.xl}`,
            }}>
              {sidebarIconsConfig.dados.modulos.map((mod) => {
                const isActive = mod.id === activeModuleId;
                const icon = mod.fav ? undefined : MODULE_ICON_MAP[mod.id];
                return (
                  <React.Fragment key={mod.id}>
                    <SideMenuIconItem
                      icon={icon}
                      label={mod.label}
                      fav={mod.fav}
                      theme="default"
                      state={isActive ? 'hover' : 'default'}
                      onClick={() => onModuleChange?.(mod.id)}
                      style={{}}
                    />
                    {mod.hasDivider && (
                      <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.3)', margin: `0 ${spacing.xs}` }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Painel lateral do módulo ativo */}
            <div style={{
              backgroundColor: colors.surface.xl,
              width:           sidebarPanelWidth,
              display:         'flex',
              flexDirection:   'column',
              flexShrink:      0,
              overflowY:       'auto',
              overflowX:       'hidden',
              transition:      'width 180ms ease',
              borderRight:     `1px solid ${colors.surface.light}`,
            }}>
              {sidebarContent}
            </div>
          </div>

          {/* Rodapé — branding Softplan */}
          <div style={{
            backgroundColor: colors.surface.xxxl,
            borderTop:       `${borders.width.sm} solid ${colors.surface.light}`,
            display:         'flex',
            justifyContent:  'center',
            alignItems:      'center',
            padding:         `${spacing.xs} ${spacing.lg}`,
            width:           brandingWidth,
            boxSizing:       'border-box',
            flexShrink:      0,
          }}>
            <img
              alt="Softplan Setor Público"
              src={SOFTPLAN_LOGO}
              style={{ width: LOGO_WIDTH, height: LOGO_HEIGHT, objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* ── Área de conteúdo do módulo ──────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          {breadcrumbBar && (
            <div style={{
              display:         'flex',
              alignItems:      'center',
              height:          32,
              paddingLeft:     20,
              paddingRight:    spacing.sm,
              backgroundColor: colors.surface.xxxl,
              borderBottom:    `1px solid ${colors.surface.light}`,
              flexShrink:      0,
            }}>
              {breadcrumbBar}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
