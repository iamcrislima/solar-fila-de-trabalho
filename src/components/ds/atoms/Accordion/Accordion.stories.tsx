import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Accordion } from '.';

export default {
  title: '01-DS/Atoms/Accordion',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 16 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '16px 0 8px' };
// ── Conteúdo de exemplo ──────────────────────────────────────────────────────

const ExampleContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
      <FakeInput label="Label*" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <FakeInput label="Label*" />
      <FakeInput label="Label*" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      <FakeInput label="Label*" />
      <FakeInput label="Label*" />
      <FakeInput label="Label*" />
    </div>
  </div>
);

function FakeInput({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161' }}>{label}</span>
      <div style={{ border: '1px solid #9E9E9E', borderRadius: 4, height: 36, backgroundColor: '#fff', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#9E9E9E' }}>Select</span>
      </div>
    </div>
  );
}

function StatusChips() {
  return (
    <>
      <span style={{ backgroundColor: '#F57F17', color: '#fff', borderRadius: 980, padding: '4px 12px', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
        Doing
      </span>
      <span style={{ backgroundColor: '#00838F', color: '#fff', borderRadius: 980, padding: '4px 12px', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
        New
      </span>
    </>
  );
}

// ─── Todas as variantes — fechadas ────────────────────────────────────────────

export const Collapsed = () => (
  <div style={page}>
    <p style={sectionLabel}>Default</p>
    <Accordion title="Section" variant="default" />

    <p style={sectionLabel}>Emphasis</p>
    <Accordion title="Section" variant="emphasis" />

    <p style={sectionLabel}>High Emphasis</p>
    <Accordion title="Section" variant="high-emphasis" />

    <p style={sectionLabel}>Section</p>
    <Accordion title="Section" variant="section" />
  </div>
);
Collapsed.storyName = 'Collapsed — todas as variantes';

// ─── Abertas ──────────────────────────────────────────────────────────────────

export const Expanded = () => (
  <div style={page}>
    <p style={sectionLabel}>Default</p>
    <Accordion title="Section" variant="default" defaultOpen>
      <ExampleContent />
    </Accordion>

    <p style={sectionLabel}>Emphasis</p>
    <Accordion title="Section" variant="emphasis" defaultOpen>
      <ExampleContent />
    </Accordion>

    <p style={sectionLabel}>High Emphasis</p>
    <Accordion title="Section" variant="high-emphasis" defaultOpen>
      <ExampleContent />
    </Accordion>

    <p style={sectionLabel}>Section</p>
    <Accordion title="Section" variant="section" defaultOpen>
      <ExampleContent />
    </Accordion>
  </div>
);
Expanded.storyName = 'Expanded — todas as variantes';

// ─── Com ícone e slot de chips ────────────────────────────────────────────────

export const ComHeaderSlot = () => (
  <div style={page}>
    <p style={sectionLabel}>Com info + chips (Default)</p>
    <Accordion title="Section" variant="default" info headerSlot={<StatusChips />} defaultOpen>
      <ExampleContent />
    </Accordion>

    <p style={sectionLabel}>Com info + chips (Emphasis)</p>
    <Accordion title="Section" variant="emphasis" info headerSlot={<StatusChips />} defaultOpen>
      <ExampleContent />
    </Accordion>

    <p style={sectionLabel}>Com info + chips (High Emphasis)</p>
    <Accordion title="Section" variant="high-emphasis" info headerSlot={<StatusChips />} defaultOpen>
      <ExampleContent />
    </Accordion>
  </div>
);
ComHeaderSlot.storyName = 'Com info + chips';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  return (
    <div style={page}>
      <p style={sectionLabel}>Accordion em grupo (só um aberto por vez)</p>
      <Accordion
        title="Dados Pessoais"
        variant="default"
        info
        open={open1}
        onToggle={() => { setOpen1(!open1); setOpen2(false); setOpen3(false); }}
      >
        <ExampleContent />
      </Accordion>
      <Accordion
        title="Endereço"
        variant="emphasis"
        info
        open={open2}
        onToggle={() => { setOpen1(false); setOpen2(!open2); setOpen3(false); }}
      >
        <ExampleContent />
      </Accordion>
      <Accordion
        title="Documentos"
        variant="high-emphasis"
        info
        headerSlot={<StatusChips />}
        open={open3}
        onToggle={() => { setOpen1(false); setOpen2(false); setOpen3(!open3); }}
      >
        <ExampleContent />
      </Accordion>
    </div>
  );
};
Interativo.storyName = 'Interativo (accordion group)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    {(['default', 'emphasis', 'high-emphasis', 'section'] as const).map(v => (
      <Accordion key={v} title={`Section — ${v}`} variant={v} defaultOpen info>
        <ExampleContent />
      </Accordion>
    ))}
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
