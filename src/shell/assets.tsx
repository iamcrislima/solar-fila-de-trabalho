/* eslint-disable react-refresh/only-export-components */
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountTreeIcon      from '@mui/icons-material/AccountTree';
import FileCopyIcon         from '@mui/icons-material/FileCopy';
import RoofingIcon          from '@mui/icons-material/Roofing';
import SchemaIcon           from '@mui/icons-material/Schema';
import CorporateFareIcon    from '@mui/icons-material/CorporateFare';
import LockIcon             from '@mui/icons-material/Lock';
import ListAltIcon          from '@mui/icons-material/ListAlt';
import SearchIcon           from '@mui/icons-material/Search';
import HomeIcon          from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon          from '@mui/icons-material/Help';
import DashboardIcon     from '@mui/icons-material/DesktopMac';
import SupportAgentIcon  from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { ReactElement } from 'react';
import { colors } from '../styles/tokens/colors';

import { LOGO_ICON, LOGO_TEXT } from './assets.logos';

export function SolarBPMLogo() {
  return (
    <div style={{ position: 'relative', display: 'inline-grid', gridTemplateColumns: 'max-content', gridTemplateRows: 'max-content', width: '186px', height: '40px' }}>
      <img alt="SolarBPM icon" src={LOGO_ICON} style={{ width: 40, height: 40 }} />
      <img alt="SolarBPM text" src={LOGO_TEXT} style={{ position: 'absolute', top: 9.71, left: 54.28, width: 131, height: 20 }} />
    </div>
  );
}

const _iconStyle = { fontSize: 24, color: colors.surface.xl };

export const MODULE_ICON_MAP: Record<string, ReactElement> = {
  busca: <SearchIcon           style={_iconStyle} />,
  fila:  <ListAltIcon          style={_iconStyle} />,
  solar: <PlaylistAddCheckIcon style={_iconStyle} />,
  wflow: <AccountTreeIcon      style={_iconStyle} />,
  ecm:   <FileCopyIcon         style={_iconStyle} />,
  ces:   <RoofingIcon          style={_iconStyle} />,
  bpm:   <SchemaIcon           style={_iconStyle} />,
  org:   <CorporateFareIcon    style={_iconStyle} />,
  seg:   <LockIcon             style={_iconStyle} />,
};

// Mantido para compatibilidade
export const MODULO_ICONS = [
  <PlaylistAddCheckIcon key="fila"  style={_iconStyle} />,
  <AccountTreeIcon      key="solar" style={_iconStyle} />,
  <FileCopyIcon         key="ecm"   style={_iconStyle} />,
  <RoofingIcon          key="wflow" style={_iconStyle} />,
  <SchemaIcon           key="bpm"   style={_iconStyle} />,
  <CorporateFareIcon    key="org"   style={_iconStyle} />,
  <LockIcon             key="seg"   style={_iconStyle} />,
];

export const HEADER_ICONS = [
  <HomeIcon            key="home"         />,
  <NotificationsIcon   key="notification" />,
  <DashboardIcon       key="dashboard"    />,
  <SupportAgentIcon    key="support"      />,
  <HelpIcon            key="help"         />,
  <AccountCircleIcon   key="account"      />,
];
