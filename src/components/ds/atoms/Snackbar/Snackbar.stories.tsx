import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Snackbar } from '.';

export default {
  title: '01-DS/Atoms/Snackbar',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' };
const MSG = 'Lorem ipsum dolor sit amet consectetur. Orci tempus enim leo ornare augue faucibus risus vitae. Adipiscing odio lobortis volutpat fames senectus sit.';

// ─── Estático — como no Figma (default 626px) ─────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Dark — 4 tipos (626px)</p>
      <Snackbar type="success" tone="dark"  message={MSG} onClose={() => {}} />
      <Snackbar type="warning" tone="dark"  message={MSG} onClose={() => {}} />
      <Snackbar type="error"   tone="dark"  message={MSG} onClose={() => {}} />
      <Snackbar type="support" tone="dark"  message={MSG} onClose={() => {}} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Light — 4 tipos (626px)</p>
      <Snackbar type="success" tone="light" message={MSG} onClose={() => {}} />
      <Snackbar type="warning" tone="light" message={MSG} onClose={() => {}} />
      <Snackbar type="error"   tone="light" message={MSG} onClose={() => {}} />
      <Snackbar type="support" tone="light" message={MSG} onClose={() => {}} />
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Large (1072px) ───────────────────────────────────────────────────────────

export const Large = () => (
  <div style={{ ...page, backgroundColor: '#E0E0E0' }}>
    <div style={group}>
      <p style={sectionLabel}>Dark LG — 4 tipos (1072px)</p>
      <Snackbar type="success" tone="dark"  size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="warning" tone="dark"  size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="error"   tone="dark"  size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="support" tone="dark"  size="lg" message={MSG} onClose={() => {}} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Light LG — 4 tipos (1072px)</p>
      <Snackbar type="success" tone="light" size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="warning" tone="light" size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="error"   tone="light" size="lg" message={MSG} onClose={() => {}} />
      <Snackbar type="support" tone="light" size="lg" message={MSG} onClose={() => {}} />
    </div>
  </div>
);
Large.storyName = 'Large (1072px)';

// ─── Com botão de ação ────────────────────────────────────────────────────────

export const ComAcao = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Com botão de ação</p>
      <Snackbar type="success" tone="dark"  message={MSG} actionLabel="Desfazer" onAction={() => {}} onClose={() => {}} />
      <Snackbar type="error"   tone="dark"  message={MSG} actionLabel="Tentar novamente" onAction={() => {}} onClose={() => {}} />
      <Snackbar type="warning" tone="light" message={MSG} actionLabel="Ver detalhes" onAction={() => {}} onClose={() => {}} />
      <Snackbar type="support" tone="light" message={MSG} actionLabel="Saiba mais" onAction={() => {}} onClose={() => {}} />
    </div>
  </div>
);
ComAcao.storyName = 'Com botão de ação';

// ─── Controlado — aparecer/sumir ──────────────────────────────────────────────

type SnackbarType = 'success' | 'warning' | 'error' | 'support';

export const Controlado = () => {
  const [visible, setVisible] = useState(false);
  const [tipo,    setTipo]    = useState<SnackbarType>('success');

  const tipos: SnackbarType[] = ['success', 'warning', 'error', 'support'];

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Simule um toast aparecendo</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tipos.map(t => (
            <button
              key={t}
              onClick={() => { setTipo(t); setVisible(true); }}
              style={{ padding: '8px 16px', borderRadius: 4, border: '1px solid #9E9E9E', cursor: 'pointer', background: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: 12 }}
            >
              Mostrar {t}
            </button>
          ))}
        </div>
        {visible && (
          <Snackbar
            type={tipo}
            tone="dark"
            message="Operação realizada com sucesso! Esta mensagem desaparece ao clicar no ×."
            onClose={() => setVisible(false)}
          />
        )}
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    {(['success', 'warning', 'error', 'support'] as const).map(type => (
      <div key={type} style={group}>
        <p style={sectionLabel}>{type}</p>
        <Snackbar type={type} tone="dark"  message={MSG} onClose={() => {}} />
        <Snackbar type={type} tone="light" message={MSG} onClose={() => {}} />
      </div>
    ))}
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
