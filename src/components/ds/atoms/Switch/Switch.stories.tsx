import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Switch } from '.';

export default {
  title: '01-DS/Atoms/Switch',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Variantes estáticas (exatamente como no Figma) ──────────────────────────

export const VariantesEstaticas = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Exatamente como no Figma</p>
      <div style={row}>
        <Switch type="primary"  checked   onChange={() => {}} />
        <Switch type="primary"  checked={false} onChange={() => {}} />
        <Switch type="surface"  checked   onChange={() => {}} />
        <Switch type="surface"  checked={false} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Disabled</p>
      <div style={row}>
        <Switch type="primary" checked disabled onChange={() => {}} />
        <Switch type="primary" checked={false} disabled onChange={() => {}} />
        <Switch type="surface" checked disabled onChange={() => {}} />
        <Switch type="surface" checked={false} disabled onChange={() => {}} />
      </div>
    </div>
  </div>
);
VariantesEstaticas.storyName = 'Variantes estáticas (Figma)';

// ─── Sem container ────────────────────────────────────────────────────────────

export const SemContainer = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>noContainer — toggle bare para composição</p>
      <div style={row}>
        <Switch type="primary"  checked   noContainer onChange={() => {}} />
        <Switch type="primary"  checked={false} noContainer onChange={() => {}} />
        <Switch type="surface"  checked   noContainer onChange={() => {}} />
        <Switch type="surface"  checked={false} noContainer onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Sem label de estado</p>
      <div style={row}>
        <Switch type="primary" checked showLabel={false} onChange={() => {}} />
        <Switch type="primary" checked={false} showLabel={false} onChange={() => {}} />
        <Switch type="surface" checked showLabel={false} onChange={() => {}} />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Labels customizados</p>
      <div style={row}>
        <Switch type="primary" checked onLabel="Ativo" offLabel="Inativo" onChange={() => {}} />
        <Switch type="primary" checked={false} onLabel="Ativo" offLabel="Inativo" onChange={() => {}} />
        <Switch type="surface" checked onLabel="Sim" offLabel="Não" onChange={() => {}} />
      </div>
    </div>
  </div>
);
SemContainer.storyName = 'Sem container / labels custom';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);
  const [emails,        setEmails]        = useState(true);
  const [sync,          setSync]          = useState(false);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado — interativo</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
          <Switch
            type="primary"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            onLabel="Notificações ativas"
            offLabel="Notificações desativadas"
          />
          <Switch
            type="primary"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            onLabel="Dark mode"
            offLabel="Light mode"
          />
          <Switch
            type="surface"
            checked={emails}
            onChange={(e) => setEmails(e.target.checked)}
            onLabel="E-mails habilitados"
            offLabel="E-mails desabilitados"
          />
          <Switch
            type="surface"
            checked={sync}
            onChange={(e) => setSync(e.target.checked)}
            onLabel="Sincronização ativa"
            offLabel="Sincronização pausada"
          />
        </div>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Primary</p>
      <div style={row}>
        <Switch type="primary" checked onChange={() => {}} />
        <Switch type="primary" checked={false} onChange={() => {}} />
        <Switch type="primary" checked disabled onChange={() => {}} />
        <Switch type="primary" checked={false} disabled onChange={() => {}} />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Surface</p>
      <div style={row}>
        <Switch type="surface" checked onChange={() => {}} />
        <Switch type="surface" checked={false} onChange={() => {}} />
        <Switch type="surface" checked disabled onChange={() => {}} />
        <Switch type="surface" checked={false} disabled onChange={() => {}} />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
