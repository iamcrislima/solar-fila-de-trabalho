import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Steps } from '.';

export default {
  title: '01-DS/Atoms/Steps',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' };
const STEPS_H = [
  { label: 'Identificação' },
  { label: 'Endereço' },
  { label: 'Documentos' },
  { label: 'Revisão' },
  { label: 'Conclusão' },
];

const STEPS_V = [
  { label: 'Passo 1', description: 'Preencha seus dados pessoais' },
  { label: 'Passo 2', description: 'Informe o endereço completo' },
  { label: 'Passo 3', description: 'Envie os documentos necessários' },
  { label: 'Passo 4', description: 'Revise as informações inseridas' },
  { label: 'Passo 5', description: 'Confirme e finalize o processo' },
];

const CardContent = ({ label, value }: { label: string; value: string }) => (
  <>
    <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 600, fontSize: 14, lineHeight: 1, color: '#616161' }}>
      {label}
    </span>
    <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: '22px', color: '#616161' }}>
      {value}
    </span>
  </>
);

const STEPS_DASH = [
  { label: 'Etapa 1', content: <CardContent label="Valor total"     value="R$ 8.220,40" /> },
  { label: 'Etapa 2', content: <CardContent label="Parcelas"        value="12x R$ 685,03" /> },
  { label: 'Etapa 3', content: <CardContent label="Vencimento"      value="15/06/2026" /> },
  { label: 'Etapa 4', content: <CardContent label="Forma de pagto." value="Boleto bancário" /> },
  { label: 'Etapa 5', content: <CardContent label="Status"          value="Aguardando aprovação" /> },
];

// ─── Horizontal ───────────────────────────────────────────────────────────────

export const Horizontal = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Etapa 1 (Doing)</p>
      <Steps orientation="h" steps={STEPS_H} current={0} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Etapa 3 (Doing)</p>
      <Steps orientation="h" steps={STEPS_H} current={2} />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Todas concluídas</p>
      <Steps orientation="h" steps={STEPS_H} current={5} />
    </div>
  </div>
);
Horizontal.storyName = 'Horizontal (H)';

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical = () => (
  <div style={page}>
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <div style={group}>
        <p style={sectionLabel}>Etapa 2 (Doing)</p>
        <Steps orientation="v" steps={STEPS_V} current={1} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Todas concluídas</p>
        <Steps orientation="v" steps={STEPS_V} current={5} />
      </div>
    </div>
  </div>
);
Vertical.storyName = 'Vertical (V)';

// ─── Vertical com cards ───────────────────────────────────────────────────────

export const VerticalDash = () => (
  <div style={page}>
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <div style={group}>
        <p style={sectionLabel}>Etapa 3 (Doing)</p>
        <Steps orientation="v-dash" steps={STEPS_DASH} current={2} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Todas concluídas</p>
        <Steps orientation="v-dash" steps={STEPS_DASH} current={5} />
      </div>
    </div>
  </div>
);
VerticalDash.storyName = 'Vertical com cards (V-Dash)';

// ─── Estados especiais ────────────────────────────────────────────────────────

export const EstadosEspeciais = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Checked / Warning / Error — horizontal</p>
      <Steps
        orientation="h"
        steps={STEPS_H}
        current={2}
        stepStates={{ 1: 'checked', 2: 'warning', 3: 'error' }}
      />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Checked / Warning / Error — vertical</p>
      <Steps
        orientation="v"
        steps={STEPS_V}
        current={2}
        stepStates={{ 1: 'checked', 2: 'warning', 3: 'error' }}
      />
    </div>
  </div>
);
EstadosEspeciais.storyName = 'Estados especiais';

// ─── Interativo ───────────────────────────────────────────────────────────────

export const Interativo = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Navegar entre etapas</p>
        <Steps orientation="h" steps={STEPS_H} current={current} style={{ maxWidth: 764 }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            style={{ padding: '8px 20px', borderRadius: 4, border: '1px solid #9E9E9E', cursor: current === 0 ? 'not-allowed' : 'pointer', background: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: 12, opacity: current === 0 ? 0.4 : 1 }}
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrent(c => Math.min(STEPS_H.length, c + 1))}
            disabled={current === STEPS_H.length}
            style={{ padding: '8px 20px', borderRadius: 4, border: '1px solid #9E9E9E', cursor: current === STEPS_H.length ? 'not-allowed' : 'pointer', background: '#fff', fontFamily: 'Montserrat, sans-serif', fontSize: 12, opacity: current === STEPS_H.length ? 0.4 : 1 }}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};
Interativo.storyName = 'Interativo';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Horizontal — 5 etapas, etapa 3 ativa</p>
      <Steps orientation="h" steps={STEPS_H} current={2} />
    </div>
    <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
      <div style={group}>
        <p style={sectionLabel}>Vertical — etapa 3 ativa</p>
        <Steps orientation="v" steps={STEPS_V} current={2} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Vertical dash — etapa 3 ativa</p>
        <Steps orientation="v-dash" steps={STEPS_DASH} current={2} />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
