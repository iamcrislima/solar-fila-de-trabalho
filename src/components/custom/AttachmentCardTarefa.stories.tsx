import { useState } from 'react';
import { AttachmentCardTarefa } from './AttachmentCardTarefa';

export default {
  title:     '03-Custom/Cards/AttachmentCardTarefa',
  component: AttachmentCardTarefa,
  parameters: { layout: 'padded' },
};

const FIELDS = [
  { label: 'Responsável',  value: 'João Silva' },
  { label: 'Prazo',        value: '30/05/2025' },
  { label: 'Prioridade',   value: 'Alta' },
  { label: 'Processo',     value: '2025/0047' },
];

const EXTRA_FIELDS = [
  { label: 'Criado em',    value: '01/04/2025' },
  { label: 'Atualizado',   value: '20/05/2025' },
  { label: 'Categoria',    value: 'Tributário' },
  { label: 'Origem',       value: 'São Paulo' },
];

const CHIPS = ['Tributário', 'Urgente', 'Recurso'];

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardTarefa
      taskName="Análise de documentos fiscais"
      processNumber="SolarBPM 000003/2026"
      fields={FIELDS}
      chips={CHIPS}
    />
  </div>
);

// ─── Expandido ────────────────────────────────────────────────────────────────

export const Expandido = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardTarefa
      taskName="Análise de documentos fiscais"
      processNumber="SolarBPM 000003/2026"
      expanded
      fields={FIELDS}
      extraFields={EXTRA_FIELDS}
      chips={CHIPS}
    />
  </div>
);

// ─── Selecionado ──────────────────────────────────────────────────────────────

export const Selecionado = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardTarefa
      taskName="Análise de documentos fiscais"
      processNumber="SolarBPM 000003/2026"
      selected
      fields={FIELDS}
      chips={CHIPS}
    />
  </div>
);

// ─── Sem chips ────────────────────────────────────────────────────────────────

export const SemChips = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardTarefa
      taskName="Revisão de contrato"
      processNumber="SolarBPM 000007/2026"
      fields={FIELDS}
    />
  </div>
);

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [checked,  setChecked]  = useState(false);
  const [pinned,   setPinned]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AttachmentCardTarefa
        taskName="Análise de documentos fiscais"
        processNumber="SolarBPM 000003/2026"
        checked={checked}
        onCheckedChange={e => setChecked(e.target.checked)}
        pinned={pinned}
        onPinClick={() => setPinned(p => !p)}
        expanded={expanded}
        onExpandClick={() => setExpanded(e => !e)}
        selected={selected}
        onClick={() => setSelected(s => !s)}
        fields={FIELDS}
        extraFields={EXTRA_FIELDS}
        chips={CHIPS}
      />
      <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#616161' }}>
        checked={String(checked)} | pinned={String(pinned)} | expanded={String(expanded)} | selected={String(selected)}
      </p>
    </div>
  );
};

// ─── Todas as variações ───────────────────────────────────────────────────────

export const TodasVariacoes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
    <AttachmentCardTarefa
      taskName="Padrão — com chips"
      processNumber="SolarBPM 000001/2026"
      fields={FIELDS}
      chips={CHIPS}
    />
    <AttachmentCardTarefa
      taskName="Expandido — 2 linhas de campos"
      processNumber="SolarBPM 000002/2026"
      expanded
      fields={FIELDS}
      extraFields={EXTRA_FIELDS}
      chips={CHIPS}
    />
    <AttachmentCardTarefa
      taskName="Selecionado — borda azul"
      processNumber="SolarBPM 000003/2026"
      selected
      fields={FIELDS}
      chips={CHIPS}
    />
    <AttachmentCardTarefa
      taskName="Pinado e sem chips"
      processNumber="SolarBPM 000004/2026"
      pinned
      fields={FIELDS}
    />
  </div>
);
