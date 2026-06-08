import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Radio, RadioGroup } from '.';

export default {
  title: '01-DS/Atoms/Radio',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Primary ──────────────────────────────────────────────────────────────────

export const Primary = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Primary — estados individuais</p>
      <div style={row}>
        <Radio type="primary" value="a">Unselected</Radio>
        <Radio type="primary" value="b" checked>Selected</Radio>
        <Radio type="primary" value="c" disabled>Disabled</Radio>
        <Radio type="primary" value="d" checked disabled>Disabled selected</Radio>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Primary — RadioGroup horizontal (padrão Figma)</p>
      <RadioGroup label="Label" type="primary" value="opt2" direction="row">
        <Radio value="opt1">Option</Radio>
        <Radio value="opt2">Option</Radio>
      </RadioGroup>
    </div>
  </div>
);
Primary.storyName = 'Radio Primary';

// ─── Surface ──────────────────────────────────────────────────────────────────

export const Surface = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Surface — estados individuais</p>
      <div style={row}>
        <Radio type="surface" value="a">Unselected</Radio>
        <Radio type="surface" value="b" checked>Selected</Radio>
        <Radio type="surface" value="c" disabled>Disabled</Radio>
        <Radio type="surface" value="d" checked disabled>Disabled selected</Radio>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Surface — RadioGroup horizontal (padrão Figma)</p>
      <RadioGroup label="Label" type="surface" value="opt1" direction="row">
        <Radio value="opt1">Option</Radio>
        <Radio value="opt2">Option</Radio>
      </RadioGroup>
    </div>
  </div>
);
Surface.storyName = 'Radio Surface';

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export const Grupos = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Horizontal — primary (padrão)</p>
      <RadioGroup label="Forma de pagamento" type="primary" value="boleto" direction="row">
        <Radio value="boleto">Boleto</Radio>
        <Radio value="pix">PIX</Radio>
        <Radio value="cartao">Cartão</Radio>
      </RadioGroup>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Vertical — primary</p>
      <RadioGroup label="Prioridade" type="primary" value="media" direction="column">
        <Radio value="baixa">Baixa</Radio>
        <Radio value="media">Média</Radio>
        <Radio value="alta">Alta</Radio>
        <Radio value="critica">Crítica</Radio>
      </RadioGroup>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Horizontal — surface</p>
      <RadioGroup label="Status" type="surface" value="ativo" direction="row">
        <Radio value="ativo">Ativo</Radio>
        <Radio value="inativo">Inativo</Radio>
        <Radio value="suspenso">Suspenso</Radio>
      </RadioGroup>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Disabled</p>
      <RadioGroup label="Desabilitado" type="primary" value="a" disabled direction="row">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    </div>
  </div>
);
Grupos.storyName = 'RadioGroup';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [pagamento, setPagamento]   = useState('pix');
  const [prioridade, setPrioridade] = useState('');

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado — interativo</p>

        <RadioGroup
          label="Forma de pagamento"
          type="primary"
          value={pagamento}
          onChange={setPagamento}
          direction="row"
        >
          <Radio value="boleto">Boleto</Radio>
          <Radio value="pix">PIX</Radio>
          <Radio value="cartao">Cartão de crédito</Radio>
          <Radio value="debito">Débito automático</Radio>
        </RadioGroup>

        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#616161', margin: 0 }}>
          Selecionado: <strong>{pagamento}</strong>
        </p>
      </div>

      <div style={group}>
        <RadioGroup
          label="Prioridade"
          type="surface"
          value={prioridade}
          onChange={setPrioridade}
          direction="column"
        >
          <Radio value="baixa">Baixa</Radio>
          <Radio value="media">Média</Radio>
          <Radio value="alta">Alta</Radio>
        </RadioGroup>

        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#616161', margin: 0 }}>
          Selecionado: <strong>{prioridade || '(nenhum)'}</strong>
        </p>
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
        <Radio type="primary">Unselected</Radio>
        <Radio type="primary" checked>Selected</Radio>
        <Radio type="primary" disabled>Disabled</Radio>
        <Radio type="primary" checked disabled>Disabled selected</Radio>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Surface</p>
      <div style={row}>
        <Radio type="surface">Unselected</Radio>
        <Radio type="surface" checked>Selected</Radio>
        <Radio type="surface" disabled>Disabled</Radio>
        <Radio type="surface" checked disabled>Disabled selected</Radio>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>RadioGroup Primary horizontal</p>
      <RadioGroup label="Label" type="primary" value="b" direction="row">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    </div>
    <div style={group}>
      <p style={sectionLabel}>RadioGroup Surface vertical</p>
      <RadioGroup label="Label" type="surface" value="b" direction="column">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
        <Radio value="c">Option C</Radio>
      </RadioGroup>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
