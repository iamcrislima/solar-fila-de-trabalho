import type { CSSProperties } from 'react';
import { useState } from 'react';
import { InputCheckboxCombo } from '.';

export default {
  title: '01-DS/Atoms/InputCheckboxCombo',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estático — como no Figma ─────────────────────────────────────────────────

export const EstaticoFigma = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Exatamente como no Figma — Default (primary) + Surface</p>
      <div style={row}>
        <InputCheckboxCombo
          label="Label"
          type="primary"
          options={[
            { label: 'Label', checked: true,  onChange: () => {} },
            { label: 'Label', checked: false, onChange: () => {} },
          ]}
        />
        <InputCheckboxCombo
          label="Label"
          type="surface"
          options={[
            { label: 'Label', checked: true,  onChange: () => {} },
            { label: 'Label', checked: false, onChange: () => {} },
          ]}
        />
      </div>
    </div>
  </div>
);
EstaticoFigma.storyName = 'Estático (Figma)';

// ─── Exemplos de uso ──────────────────────────────────────────────────────────

export const ExemplosDeUso = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Situação do processo</p>
      <div style={row}>
        <InputCheckboxCombo
          label="Situação"
          type="primary"
          options={[
            { label: 'Ativo',     checked: true,  onChange: () => {} },
            { label: 'Pendente',  checked: true,  onChange: () => {} },
            { label: 'Inativo',   checked: false, onChange: () => {} },
            { label: 'Cancelado', checked: false, onChange: () => {} },
          ]}
        />
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Com disabled</p>
      <div style={row}>
        <InputCheckboxCombo
          label="Permissões"
          type="primary"
          options={[
            { label: 'Visualizar', checked: true,  onChange: () => {}, disabled: false },
            { label: 'Editar',     checked: false, onChange: () => {}, disabled: false },
            { label: 'Excluir',    checked: false, onChange: () => {}, disabled: true  },
          ]}
        />
      </div>
    </div>
  </div>
);
ExemplosDeUso.storyName = 'Exemplos de uso';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const OPCOES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'] as const;
  type OpcaoKey = typeof OPCOES[number];
  const [checked, setChecked] = useState<Record<OpcaoKey, boolean>>({ Segunda: true, Terça: false, Quarta: true, Quinta: false, Sexta: false });

  const toggle = (key: OpcaoKey) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Dias da semana — interativo</p>
        <div style={row}>
          <InputCheckboxCombo
            label="Dias de envio"
            mandatory
            type="primary"
            options={OPCOES.map(op => ({
              label:    op,
              checked:  checked[op],
              onChange: () => toggle(op),
            }))}
          />
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Selecionados: {OPCOES.filter(op => checked[op]).join(', ') || 'nenhum'}
        </p>
      </div>

      <div style={group}>
        <p style={sectionLabel}>Surface — interativo</p>
        <InputCheckboxCombo
          label="Tipo"
          type="surface"
          options={[
            { label: 'Físico',  checked: checked['Segunda'], onChange: () => toggle('Segunda') },
            { label: 'Digital', checked: checked['Terça'],   onChange: () => toggle('Terça')   },
          ]}
        />
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Primary — 2 opções</p>
        <InputCheckboxCombo
          label="Label"
          type="primary"
          options={[
            { label: 'Label', checked: true,  onChange: () => {} },
            { label: 'Label', checked: false, onChange: () => {} },
          ]}
        />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Surface — 2 opções</p>
        <InputCheckboxCombo
          label="Label"
          type="surface"
          options={[
            { label: 'Label', checked: true,  onChange: () => {} },
            { label: 'Label', checked: false, onChange: () => {} },
          ]}
        />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Primary — 4 opções</p>
        <InputCheckboxCombo
          label="Filtros"
          mandatory
          type="primary"
          options={[
            { label: 'Opção A', checked: true,  onChange: () => {} },
            { label: 'Opção B', checked: false, onChange: () => {} },
            { label: 'Opção C', checked: true,  onChange: () => {} },
            { label: 'Opção D', checked: false, onChange: () => {} },
          ]}
        />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
