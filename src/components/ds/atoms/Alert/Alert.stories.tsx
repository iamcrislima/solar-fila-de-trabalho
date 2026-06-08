import type { CSSProperties } from 'react';
import { Alert } from '.';

export default {
  title: '01-DS/Atoms/Alert',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };
const row: CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' };
const MSG = 'Lorem ipsum dolor sit amet consectetur. Orci tempus enim leo ornare augue faucibus risus vitae. Adipiscing odio lobortis volutpat fames senectus sit.';

// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    {/* H */}
    <div style={group}>
      <p style={sectionLabel}>Horizontal (H) — 4 tipos</p>
      <Alert type="support" layout="h" message={MSG} />
      <Alert type="success" layout="h" message={MSG} />
      <Alert type="warning" layout="h" message={MSG} />
      <Alert type="error"   layout="h" message={MSG} />
    </div>

    {/* SM */}
    <div style={group}>
      <p style={sectionLabel}>Small (SM) — 4 tipos</p>
      <div style={row}>
        <Alert type="support" layout="sm" message="50 registros encontrados" />
        <Alert type="success" layout="sm" message="50 registros encontrados" />
        <Alert type="warning" layout="sm" message="50 registros encontrados" />
        <Alert type="error"   layout="sm" message="50 registros encontrados" />
      </div>
    </div>

    {/* V */}
    <div style={group}>
      <p style={sectionLabel}>Vertical (V) — 4 tipos</p>
      <div style={row}>
        <Alert type="support" layout="v" message="No info..."  />
        <Alert type="success" layout="v" message="Welcome"     />
        <Alert type="warning" layout="v" message="No info..."  />
        <Alert type="error"   layout="v" message="No info..."  />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── H — com botões e close ───────────────────────────────────────────────────

export const HorizontalComAcoes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Com botão outline (primary)</p>
      <Alert type="support" layout="h" message={MSG} primaryLabel="Confirmar" onPrimary={() => alert('primary')} />
      <Alert type="error"   layout="h" message={MSG} primaryLabel="Confirmar" onPrimary={() => alert('primary')} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Com botão flat (secondary) + outline (primary)</p>
      <Alert type="warning" layout="h" message={MSG} secondaryLabel="Ignorar" onSecondary={() => {}} primaryLabel="Corrigir" onPrimary={() => {}} />
      <Alert type="success" layout="h" message={MSG} secondaryLabel="Ignorar" onSecondary={() => {}} primaryLabel="Confirmar" onPrimary={() => {}} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Com ícone de fechar</p>
      <Alert type="support" layout="h" message={MSG} onClose={() => alert('fechar')} />
      <Alert type="error"   layout="h" message={MSG} onClose={() => alert('fechar')} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Sem ícone</p>
      <Alert type="warning" layout="h" message={MSG} showIcon={false} />
    </div>
  </div>
);
HorizontalComAcoes.storyName = 'H — com ações';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Layout H</p>
      <Alert type="support" layout="h" message={MSG} />
      <Alert type="success" layout="h" message={MSG} />
      <Alert type="warning" layout="h" message={MSG} />
      <Alert type="error"   layout="h" message={MSG} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Layout SM</p>
      <div style={row}>
        <Alert type="support" layout="sm" message="50 registros encontrados" />
        <Alert type="success" layout="sm" message="50 registros encontrados" />
        <Alert type="warning" layout="sm" message="50 registros encontrados" />
        <Alert type="error"   layout="sm" message="50 registros encontrados" />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Layout V</p>
      <div style={row}>
        <Alert type="support" layout="v" message="No info..." />
        <Alert type="success" layout="v" message="Welcome"   />
        <Alert type="warning" layout="v" message="No info..." />
        <Alert type="error"   layout="v" message="No info..." />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
