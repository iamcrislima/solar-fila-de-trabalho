import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Overlay } from './Overlay';
import { Button }  from '../Button/Button';
import { colors }  from '@/styles/tokens/colors';
import { shadows } from '@/styles/tokens/shadows';
import { borders } from '@/styles/tokens/borders';

export default {
  title: '01-DS/Atoms/Overlay',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page:  CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const note:  CSSProperties = { fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: '#9E9E9E', margin: 0 };

const card: CSSProperties = {
  padding: 24,
  backgroundColor: colors.surface.xxxl,
  borderRadius: borders.radius.lg,
  boxShadow: shadows.level2,
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

// ─── Estático ─────────────────────────────────────────────────────────────────

export const EstaticoFigma = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Backdrop padrão — fechar ao clicar fora</p>
        <p style={note}>Também fecha com Esc.</p>
        <Button type="primary" variant="filled" onClick={() => setOpen(true)} style={{ alignSelf: 'flex-start' }}>
          Abrir Overlay
        </Button>
        <Overlay open={open} onClose={() => setOpen(false)}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={card}>
              <p style={{ ...label, textTransform: 'none', fontSize: 16, color: colors.surface.dark }}>
                Conteúdo sobre o overlay
              </p>
              <p style={note}>Clique fora ou pressione Esc para fechar.</p>
              <Button type="secondary" variant="outline" onClick={() => setOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </Overlay>
      </div>
    </div>
  );
};
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [open, setOpen]           = useState(false);
  const [closeOnBd, setCloseOnBd] = useState(true);
  const [color, setColor]         = useState('rgba(0,0,0,0.5)');

  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Configurações</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ fontFamily: "'Open Sans'", fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={closeOnBd} onChange={e => setCloseOnBd(e.target.checked)} />
            closeOnBackdrop
          </label>
          {(['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)', 'rgba(59,130,246,0.3)'] as const).map(c => (
            <button key={c} onClick={() => setColor(c)} style={{ padding: '4px 10px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: color === c ? '#EBF3FF' : 'white', fontSize: 12, fontFamily: 'monospace' }}>
              {c}
            </button>
          ))}
        </div>
        <Button type="primary" variant="filled" onClick={() => setOpen(true)} style={{ alignSelf: 'flex-start' }}>
          Abrir Overlay
        </Button>
      </div>
      <Overlay open={open} onClose={() => setOpen(false)} backdropColor={color} closeOnBackdrop={closeOnBd}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={card}>
            <p style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.surface.dark, margin: 0 }}>
              closeOnBackdrop: <strong>{String(closeOnBd)}</strong>
            </p>
            <Button type="secondary" variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
          </div>
        </div>
      </Overlay>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => {
  const [which, setWhich] = useState<null | 'default' | 'dark' | 'noclose'>(null);
  return (
    <div style={page}>
      <div style={group}>
        <p style={label}>Variantes de backdrop</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button type="secondary" variant="outline" onClick={() => setWhich('default')}>
            Padrão (50% preto)
          </Button>
          <Button type="secondary" variant="outline" onClick={() => setWhich('dark')}>
            Escuro (80% preto)
          </Button>
          <Button type="secondary" variant="outline" onClick={() => setWhich('noclose')}>
            Sem fechar ao clicar fora
          </Button>
        </div>
      </div>
      <Overlay open={which === 'default'} onClose={() => setWhich(null)} backdropColor="rgba(0,0,0,0.5)">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={card}>
            <p style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.surface.dark, margin: 0 }}>Backdrop padrão</p>
            <Button type="secondary" variant="outline" onClick={() => setWhich(null)}>Fechar</Button>
          </div>
        </div>
      </Overlay>
      <Overlay open={which === 'dark'} onClose={() => setWhich(null)} backdropColor="rgba(0,0,0,0.8)">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={card}>
            <p style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.surface.dark, margin: 0 }}>Backdrop escuro</p>
            <Button type="secondary" variant="outline" onClick={() => setWhich(null)}>Fechar</Button>
          </div>
        </div>
      </Overlay>
      <Overlay open={which === 'noclose'} onClose={() => setWhich(null)} backdropColor="rgba(0,0,0,0.5)" closeOnBackdrop={false}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={card}>
            <p style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.surface.dark, margin: 0 }}>Clique fora não fecha — apenas o botão fecha</p>
            <Button type="secondary" variant="outline" onClick={() => setWhich(null)}>Fechar</Button>
          </div>
        </div>
      </Overlay>
    </div>
  );
};
TodasAsVariantes.storyName = 'Todas as variantes';
