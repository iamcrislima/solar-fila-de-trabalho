import { useState } from 'react';
import { AttachmentCardProcesso } from './AttachmentCardProcesso';

export default {
  title:     '03-Custom/Cards/AttachmentCardProcesso',
  component: AttachmentCardProcesso,
  parameters: { layout: 'padded' },
};

const FIELDS = [
  { label: 'Uni. encam.', value: 'SolarBPM/ADM' },
  { label: 'Data encam.', value: '25/04/2025 - 08:13' },
  { label: 'Prazo encam.', value: '-' },
  { label: 'Uni. atual',  value: 'SolarBPM/RH' },
];

const EXTRA_FIELDS = [
  { label: 'Origem',    value: 'São Paulo' },
  { label: 'Destino',   value: 'Rio de Janeiro' },
  { label: 'Protocolo', value: '2025-0089' },
  { label: 'SLA',       value: '3 dias' },
];

const STATUS_ACTIONS_DEFAULT = [
  { iconKey: 'groups',        active: true },
  { iconKey: 'library_books', active: true },
  { iconKey: 'etapas',        active: false },
  { iconKey: 'lock',          active: false },
];

const CHIPS_PLAIN = ['Tributário', 'Urgente', 'Recurso', 'Judicial', 'Fase 2'];

const CHIPS_RICH = [
  { label: 'Aguardando análise',             color: 'support', iconKey: 'groups' },
  { label: 'Urgente',                         color: 'error',   iconKey: 'person' },
  { label: 'Assinatura(s) pendente(s) (2/5)', color: 'warning' },
];

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000003/2026"
      processClass="Solicitação de férias"
      fields={FIELDS}
      statusActions={STATUS_ACTIONS_DEFAULT}
      documentCount={1}
    />
  </div>
);

// ─── Expandido ───────────────────────────────────────────────────────────────

export const Expandido = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000003/2026"
      processClass="Solicitação de férias"
      expanded
      fields={FIELDS}
      extraFields={EXTRA_FIELDS}
      chips={CHIPS_PLAIN}
      statusActions={STATUS_ACTIONS_DEFAULT}
      documentCount={3}
    />
  </div>
);

// ─── Selecionado ─────────────────────────────────────────────────────────────

export const Selecionado = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000003/2026"
      processClass="Solicitação de férias"
      selected
      expanded
      fields={FIELDS}
      extraFields={EXTRA_FIELDS}
      chips={CHIPS_PLAIN}
      statusActions={STATUS_ACTIONS_DEFAULT}
      documentCount={5}
    />
  </div>
);

// ─── Sem chips ────────────────────────────────────────────────────────────────

export const SemChips = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000001/2026"
      processClass="Solicitação de férias"
      fields={FIELDS}
      statusActions={STATUS_ACTIONS_DEFAULT}
      documentCount={0}
    />
  </div>
);

// ─── Com alerta ──────────────────────────────────────────────────────────────

export const ComAlerta = () => (
  <div style={{ maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000002/2026"
      processClass="Solicitação de férias"
      bgColor="#FFFFFF"
      fields={FIELDS}
      chips={CHIPS_RICH}
      statusActions={[
        { iconKey: 'groups',            active: true },
        { iconKey: 'insert_drive_file', active: true },
        { iconKey: 'etapas',            active: false },
        { iconKey: 'insert_drive_file', active: true },
      ]}
      documentCount={1}
      alertActive
    />
  </div>
);

// ─── Interativo ──────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [checked,  setChecked]  = useState(false);
  const [pinned,   setPinned]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AttachmentCardProcesso
        processNumber="SolarBPM 000003/2026"
        processClass="Solicitação de férias"
        checked={checked}
        onCheckedChange={e => setChecked(e.target.checked)}
        pinned={pinned}
        onPinClick={() => setPinned(p => !p)}
        expanded={expanded}
        selected={selected}
        onClick={() => { setSelected(s => !s); setExpanded(e => !e); }}
        fields={FIELDS}
        extraFields={EXTRA_FIELDS}
        chips={CHIPS_PLAIN}
        statusActions={STATUS_ACTIONS_DEFAULT}
        documentCount={3}
      />
      <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#616161' }}>
        checked={String(checked)} | pinned={String(pinned)} | expanded={String(expanded)} | selected={String(selected)}
      </p>
    </div>
  );
};

// ─── Todas as variações ──────────────────────────────────────────────────────

export const TodasVariacoes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
    <AttachmentCardProcesso
      processNumber="SolarBPM 000003/2026 (Default — azul)"
      processClass="Solicitação de férias"
      fields={FIELDS}
      statusActions={STATUS_ACTIONS_DEFAULT}
      documentCount={1}
    />
    <AttachmentCardProcesso
      processNumber="SolarBPM 000002/2026 (Alerta — branco)"
      processClass="Solicitação de férias"
      bgColor="#FFFFFF"
      fields={FIELDS}
      chips={CHIPS_RICH}
      statusActions={[
        { iconKey: 'groups',            active: true },
        { iconKey: 'insert_drive_file', active: true },
        { iconKey: 'etapas',            active: false },
        { iconKey: 'insert_drive_file', active: true },
      ]}
      documentCount={1}
      alertActive
    />
    <AttachmentCardProcesso
      processNumber="SolarBPM 000001/2026 (Realizado — branco)"
      processClass="Solicitação de férias"
      bgColor="#FFFFFF"
      fields={FIELDS}
      chips={[{ label: 'Assinatura(s) realizada(s)', color: 'success' }]}
      statusActions={[
        { iconKey: 'person', active: true },
        { iconKey: 'person', active: true },
        { iconKey: 'etapas', active: false },
        { iconKey: 'person', active: true },
      ]}
      documentCount={0}
    />
  </div>
);
