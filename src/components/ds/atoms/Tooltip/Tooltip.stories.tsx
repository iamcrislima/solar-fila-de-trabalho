import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Tooltip } from './Tooltip';
import { colors }  from '@/styles/tokens/colors';
import InboxIcon          from '@mui/icons-material/Inbox';
import SettingsIcon       from '@mui/icons-material/Settings';
import NotificationsIcon  from '@mui/icons-material/NotificationsOutlined';
import { Button }         from '../Button/Button';
import { IconButton }     from '../Icon/IconButton';

export default {
  title: '01-DS/Atoms/Tooltip',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 48, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row:   CSSProperties = { display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 8 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const note:  CSSProperties = { fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#9E9E9E', margin: 0 };

// ─── Estático (Figma) ─────────────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Sobre IconButton (padrão do projeto)</p>
      <p style={note}>Passe o mouse sobre os botões para ver o tooltip (delay padrão: 750ms)</p>
      <div style={row}>
        <Tooltip content="Caixa de entrada">
          <IconButton aria-label="Caixa de entrada">
            <InboxIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Notificações">
          <IconButton aria-label="Notificações">
            <NotificationsIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Configurações">
          <IconButton aria-label="Configurações">
            <SettingsIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Sobre Button</p>
      <div style={row}>
        <Tooltip content="Clique para confirmar a ação">
          <Button type="primary" variant="filled">Confirmar</Button>
        </Tooltip>
        <Tooltip content="Esta ação não pode ser desfeita">
          <Button type="secondary" variant="filled">Excluir</Button>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Sem conteúdo — passthrough</p>
      <p style={note}>Quando content é undefined/null/vazio, o Tooltip não renderiza wrapper extra.</p>
      <div style={row}>
        <Tooltip content="">
          <IconButton aria-label="Sem tooltip">
            <InboxIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconButton>
        </Tooltip>
        <IconButton aria-label="Também sem tooltip">
          <SettingsIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </IconButton>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Texto longo</p>
      <div style={row}>
        <Tooltip content="Esta é uma descrição longa que explica com mais detalhes o que este botão faz quando ativado">
          <Button type="secondary" variant="outline">Botão com hint longo</Button>
        </Tooltip>
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [delay, setDelay] = useState(750);
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Delay configurável</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {[0, 300, 750, 1500].map(d => (
            <button
              key={d}
              onClick={() => setDelay(d)}
              style={{ padding: '4px 12px', cursor: 'pointer', fontWeight: delay === d ? 700 : 400, border: '1px solid #ccc', borderRadius: 4, background: delay === d ? '#EBF3FF' : 'white' }}
            >
              {d}ms
            </button>
          ))}
        </div>
        <div style={{ ...row, paddingTop: 8 }}>
          <Tooltip content="Tooltip com delay configurado" delay={delay}>
            <Button type="primary" variant="filled">Passe o mouse</Button>
          </Tooltip>
        </div>
        <p style={note}>Delay atual: {delay}ms. Delay padrão do projeto: 750ms.</p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (delay interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Sobre elementos inline</p>
      <div style={row}>
        <Tooltip content="Tooltip em span">
          <span style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.primary.main, cursor: 'default', borderBottom: '1px dashed' }}>
            texto com hint
          </span>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Sobre IconButton (padrão)</p>
      <div style={row}>
        <Tooltip content="Caixa de entrada">
          <IconButton aria-label="inbox"><InboxIcon style={{ fontSize: 24, color: colors.surface.main }} /></IconButton>
        </Tooltip>
        <Tooltip content="Configurações">
          <IconButton aria-label="settings"><SettingsIcon style={{ fontSize: 24, color: colors.surface.main }} /></IconButton>
        </Tooltip>
        <Tooltip content="Notificações">
          <IconButton aria-label="notifications"><NotificationsIcon style={{ fontSize: 24, color: colors.surface.main }} /></IconButton>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Sobre Button</p>
      <div style={row}>
        <Tooltip content="Ação primária do sistema">
          <Button type="primary" variant="filled">Primário</Button>
        </Tooltip>
        <Tooltip content="Ação secundária sem destaque">
          <Button type="secondary" variant="outline">Secundário</Button>
        </Tooltip>
        <Tooltip content="Ação perigosa — não pode ser desfeita">
          <Button type="secondary" variant="flat">Excluir</Button>
        </Tooltip>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Sem conteúdo (passthrough)</p>
      <div style={row}>
        <Tooltip content={undefined}>
          <Button type="secondary" variant="outline">Sem tooltip</Button>
        </Tooltip>
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
