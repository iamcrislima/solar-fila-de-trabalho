import type { CSSProperties } from 'react';
import { useState } from 'react';
import { AttachmentCard } from '.';
import { InputRead }      from '../InputRead';
import { colors }         from '../../../../styles/tokens/colors';
// Chip é usado internamente pelo AttachmentCard — não importado diretamente nas stories

export default {
  title: '01-DS/Atoms/Attachment',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
// ─── Conteúdo expandido LG (5 colunas) ───────────────────────────────────────

const ExpandedContentLg = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10 }}>
    {[
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
    ].map((row, ri) => (
      <div key={ri} style={{ display: 'flex', gap: 144, paddingLeft: 8, paddingBottom: 6 }}>
        {row.map(([l, v], ci) => (
          <InputRead key={ci} label={l} value={v} />
        ))}
      </div>
    ))}
  </div>
);

// ─── Conteúdo expandido SM (3 colunas) ───────────────────────────────────────

const ExpandedContentSm = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10 }}>
    {[
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
      [['Label', 'Content'], ['Label', 'Content'], ['Label', 'Content']],
    ].map((row, ri) => (
      <div key={ri} style={{ display: 'flex', gap: 120, paddingLeft: 8, paddingBottom: 6 }}>
        {row.map(([l, v], ci) => (
          <InputRead key={ci} label={l} value={v} />
        ))}
      </div>
    ))}
  </div>
);

// ─── LG Default (collapsed) ──────────────────────────────────────────────────

export const LgDefault = () => {
  const [exp, setExp] = useState(false);
  const [pg, setPg]   = useState(1);
  return (
    <div style={page}>
      <div>
        <p style={label}>AttachmentCard — LG Default (collapsed)</p>
        <AttachmentCard
          fileName="Contrato_2024.pdf"
          fileDate="Label: 01/01/2024"
          status="Doing"
          size="lg"
          expanded={exp}
          onToggle={() => setExp(e => !e)}
          onView={() => alert('visualizar')}
          onDelete={() => alert('excluir')}
          page={pg}
          totalPages={3}
          onPrevPage={() => setPg(p => Math.max(1, p - 1))}
          onNextPage={() => setPg(p => Math.min(3, p + 1))}
        >
          <ExpandedContentLg />
        </AttachmentCard>
      </div>
    </div>
  );
};
LgDefault.storyName = 'LG Default / Expanded';

// ─── LG com imagem ────────────────────────────────────────────────────────────

export const LgComImagem = () => {
  const [exp, setExp] = useState(false);
  const [pg, setPg]   = useState(1);
  return (
    <div style={page}>
      <div>
        <p style={label}>AttachmentCard — LG com imagem (placeholder colorido)</p>
        <AttachmentCard
          image={
            (<div style={{ width: '100%', height: '100%', backgroundColor: colors.primary.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#FFF', fontSize: 10, fontWeight: 700 }}>PDF</span>
            </div>) as unknown as string
          }
          fileName="Relatorio_Anual.pdf"
          fileDate="Label: 15/03/2024"
          status="Done"
          statusScheme="success"
          size="lg"
          expanded={exp}
          onToggle={() => setExp(e => !e)}
          onView={() => alert('visualizar')}
          onDelete={() => alert('excluir')}
          page={pg}
          totalPages={5}
          onPrevPage={() => setPg(p => Math.max(1, p - 1))}
          onNextPage={() => setPg(p => Math.min(5, p + 1))}
        >
          <ExpandedContentLg />
        </AttachmentCard>
      </div>
    </div>
  );
};
LgComImagem.storyName = 'LG com imagem';

// ─── SM Default ──────────────────────────────────────────────────────────────

export const SmDefault = () => {
  const [exp, setExp] = useState(false);
  const [pg, setPg]   = useState(1);
  return (
    <div style={page}>
      <div>
        <p style={label}>AttachmentCard — SM Default / Expanded</p>
        <AttachmentCard
          fileName="Nota_Fiscal.pdf"
          fileDate="Label: 20/05/2024"
          status="Doing"
          size="sm"
          expanded={exp}
          onToggle={() => setExp(e => !e)}
          onDelete={() => alert('excluir')}
          page={pg}
          totalPages={2}
          onPrevPage={() => setPg(p => Math.max(1, p - 1))}
          onNextPage={() => setPg(p => Math.min(2, p + 1))}
        >
          <ExpandedContentSm />
        </AttachmentCard>
      </div>
    </div>
  );
};
SmDefault.storyName = 'SM Default / Expanded';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => {
  const [states, setStates] = useState({ lg: false, sm: false });
  const toggle = (key: 'lg' | 'sm') => setStates(s => ({ ...s, [key]: !s[key] }));

  return (
    <div style={page}>
      <div>
        <p style={label}>LG — 1024px</p>
        <AttachmentCard
          fileName="Arquivo_Grande.pdf"
          fileDate="Label: 10/10/2023"
          status="Doing"
          size="lg"
          expanded={states.lg}
          onToggle={() => toggle('lg')}
          onView={() => {}}
          onDelete={() => {}}
          page={1}
          totalPages={4}
          onPrevPage={() => {}}
          onNextPage={() => {}}
        >
          <ExpandedContentLg />
        </AttachmentCard>
      </div>
      <div>
        <p style={label}>SM — 504px</p>
        <AttachmentCard
          fileName="Arquivo_Pequeno.pdf"
          fileDate="Label: 20/11/2023"
          status="Pending"
          statusScheme="surface"
          size="sm"
          expanded={states.sm}
          onToggle={() => toggle('sm')}
          onDelete={() => {}}
          page={1}
          totalPages={2}
          onPrevPage={() => {}}
          onNextPage={() => {}}
        >
          <ExpandedContentSm />
        </AttachmentCard>
      </div>
    </div>
  );
};
TodasAsVariantes.storyName = 'Todas as variantes';
