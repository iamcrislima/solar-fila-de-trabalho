import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import HomeIcon                from '@mui/icons-material/Home';
import DashboardIcon           from '@mui/icons-material/Dashboard';
import SupportAgentIcon        from '@mui/icons-material/SupportAgent';
import HelpIcon                from '@mui/icons-material/Help';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Breadcrumb }          from './Breadcrumb';
import { HeaderIconButton }    from './HeaderIconButton';
import { HeaderUser }          from './HeaderUser';
import { TitleBar }            from './TitleBar';
import { HeaderBar }           from './HeaderBar';
import { colors }              from '../../../../styles/tokens/colors';

export default {
  title: '01-DS/Atoms/Header',
  parameters: { layout: 'fullscreen' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export const BreadcrumbStory = () => (
  <div style={page}>
    <div>
      <p style={label}>Breadcrumb — só título</p>
      <Breadcrumb items={[{ label: 'Página Principal' }]} />
    </div>
    <div>
      <p style={label}>Breadcrumb — com back + sub-páginas</p>
      <Breadcrumb
        showBack
        onBack={() => alert('back')}
        items={[
          { label: 'Início', onClick: () => {} },
          { label: 'Módulo', onClick: () => {} },
          { label: 'Página Atual' },
        ]}
        subtitle="Descrição opcional da página exibida abaixo do título."
      />
    </div>
  </div>
);
BreadcrumbStory.storyName = 'Breadcrumb';

// ─── HeaderIconButton ─────────────────────────────────────────────────────────
// Botão vertical exclusivo do cabeçalho do portal: ícone + label abaixo.
// NÃO confundir com IconButton (01-DS/Atoms/IconButton): são componentes distintos.
//   HeaderIconButton → usado no AppShell header, layout vertical, fundo cinza no hover
//   IconButton       → botão circular genérico, hover circular, sem label

export const IconButtonStory = () => (
  <div style={page}>
    <div>
      <p style={label}>HeaderIconButton — variantes</p>
      <div style={{ display: 'flex', backgroundColor: '#FFF', alignItems: 'flex-end' }}>
        <HeaderIconButton icon={<HomeIcon />}                 label="Home" />
        <HeaderIconButton icon={<DashboardIcon />}            label="Dashboard" />
        <HeaderIconButton icon={<SupportAgentIcon />}         label="Suporte" />
        <HeaderIconButton icon={<NotificationsOutlinedIcon />} label="Notificações" />
        <HeaderIconButton icon={<HelpIcon />}                 label="Ajuda" />
      </div>
    </div>
    <div>
      <p style={label}>HeaderIconButton — tema dark</p>
      <div style={{ display: 'flex', backgroundColor: '#212121', alignItems: 'flex-end' }}>
        <HeaderIconButton icon={<HomeIcon />}     label="Home"      iconColor="#E0E0E0" labelColor="#E0E0E0" />
        <HeaderIconButton icon={<DashboardIcon />} label="Dashboard" iconColor="#E0E0E0" labelColor="#E0E0E0" />
      </div>
    </div>
  </div>
);
IconButtonStory.storyName = 'HeaderIconButton';

// ─── HeaderUser ───────────────────────────────────────────────────────────────

export const UserStory = () => (
  <div style={page}>
    <div>
      <p style={label}>HeaderUser — sem orgLogo</p>
      <div style={{ backgroundColor: '#FFF', padding: 16, display: 'inline-flex' }}>
        <HeaderUser
          userName="João da Silva"
          userCode="COD1234"
          onLogout={() => alert('logout')}
        />
      </div>
    </div>
    <div>
      <p style={label}>HeaderUser — com orgLogo (placeholder)</p>
      <div style={{ backgroundColor: '#FFF', padding: 16, display: 'inline-flex' }}>
        <HeaderUser
          orgLogo={
            <div style={{ width: 48, height: 24, backgroundColor: colors.primary.main, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#FFF', fontSize: 10, fontWeight: 700 }}>LOGO</span>
            </div>
          }
          userName="Maria Souza"
          userCode="COD5678"
          onLogout={() => alert('logout')}
        />
      </div>
    </div>
  </div>
);
UserStory.storyName = 'HeaderUser';

// ─── TitleBar ─────────────────────────────────────────────────────────────────

const ActionBtn = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: colors.primary.main,
      color: '#FFF',
      border: 'none',
      padding: '6px 16px',
      borderRadius: 4,
      cursor: 'pointer',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: 14,
      fontWeight: 600,
    }}
  >
    {children}
  </button>
);

export const TitleBarStory = () => (
  <div style={{ ...page, padding: 0 }}>
    <div>
      <p style={{ ...label, padding: '32px 32px 12px' }}>TitleBar — simples</p>
      <TitleBar
        breadcrumb={<Breadcrumb items={[{ label: 'Dashboard' }]} />}
      />
    </div>
    <div>
      <p style={{ ...label, padding: '0 32px 12px' }}>TitleBar — com ações</p>
      <TitleBar
        breadcrumb={
          <Breadcrumb
            showBack
            items={[
              { label: 'Início', onClick: () => {} },
              { label: 'Módulo', onClick: () => {} },
              { label: 'Detalhe' },
            ]}
            subtitle="Subtítulo da página atual."
          />
        }
        actions={<ActionBtn>Nova Entrada</ActionBtn>}
      />
    </div>
  </div>
);
TitleBarStory.storyName = 'TitleBar';

// ─── HeaderBar — temas ────────────────────────────────────────────────────────

const iconItems = [
  <HeaderIconButton key="home"      icon={<HomeIcon />}                      label="Home" />,
  <HeaderIconButton key="dashboard" icon={<DashboardIcon />}                 label="Dashboard" />,
  <HeaderIconButton key="alertas"   icon={<NotificationsOutlinedIcon />}     label="Alertas" />,
];

const THEMES = ['default', 'dark', 'primary', 'primary-dark', 'secondary', 'secondary-dark'] as const;

export const HeaderBarThemes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
    {THEMES.map(t => (
      <div key={t}>
        <HeaderBar
          theme={t}
          systemName="Solar BPM"
          onMenuToggle={() => {}}
          iconItems={iconItems}
          userSlot={
            <HeaderUser
              userName="João Silva"
              userCode="COD1234"
              onLogout={() => {}}
            />
          }
        />
        <div style={{ ...label, padding: '4px 16px', backgroundColor: '#FAFAFA', borderBottom: '1px solid #E0E0E0' }}>
          theme="{t}"
        </div>
      </div>
    ))}
  </div>
);
HeaderBarThemes.storyName = 'HeaderBar — temas';

// ─── Header completo (HeaderBar + TitleBar) ───────────────────────────────────

export const HeaderCompleto = () => {
  const [, setCollapsed] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        theme="primary"
        systemName="Solar BPM"
        onMenuToggle={() => setCollapsed(c => !c)}
        iconItems={iconItems}
        userSlot={
          <HeaderUser
            userName="João Silva"
            userCode="COD1234"
            onLogout={() => alert('logout')}
          />
        }
      />
      <TitleBar
        breadcrumb={
          <Breadcrumb
            showBack
            onBack={() => {}}
            items={[
              { label: 'Início', onClick: () => {} },
              { label: 'Módulo', onClick: () => {} },
              { label: 'Página Atual' },
            ]}
            subtitle="Descrição da página atual."
          />
        }
        actions={<ActionBtn>Nova Entrada</ActionBtn>}
      />
      <div style={{ padding: 32, backgroundColor: '#F5F5F5', minHeight: 200 }}>
        <p style={{ color: '#9E9E9E', margin: 0 }}>Conteúdo da página</p>
      </div>
    </div>
  );
};
HeaderCompleto.storyName = 'Header Completo (HeaderBar + TitleBar)';
