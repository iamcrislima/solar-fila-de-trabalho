import type { CSSProperties } from 'react';
import { InputRead } from '.';

export default {
  title: '01-DS/Atoms/InputRead',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Default ──────────────────────────────────────────────────────────────────

export const Default = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Exatamente como no Figma</p>
      <div style={row}>
        <InputRead label="Label" value="Content" />
      </div>
    </div>
  </div>
);
Default.storyName = 'Default (Figma)';

// ─── Exemplos de uso ──────────────────────────────────────────────────────────

export const ExemplosDeUso = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Dados de formulário somente leitura</p>
      <div style={row}>
        <InputRead label="Nome"        value="João Silva" />
        <InputRead label="CPF"         value="123.456.789-00" />
        <InputRead label="E-mail"      value="joao.silva@empresa.com.br" />
        <InputRead label="Telefone"    value="(11) 99999-9999" />
        <InputRead label="Departamento" value="Tecnologia da Informação" />
        <InputRead label="Status"      value="Ativo" />
      </div>
    </div>
  </div>
);
ExemplosDeUso.storyName = 'Exemplos de uso';

// ─── Em grid de formulário ────────────────────────────────────────────────────

export const EmFormulario = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Combinado com outros campos em formulário</p>
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap:                 32,
        maxWidth:            720,
        backgroundColor:     '#fff',
        padding:             24,
        borderRadius:        4,
        boxShadow:           '0px 2px 4px rgba(0,0,0,0.12)',
      }}>
        <InputRead label="Contrato"    value="CT-2024-00123" />
        <InputRead label="Data início" value="01/03/2024" />
        <InputRead label="Vigência"    value="12 meses" />
        <InputRead label="Cliente"     value="Empresa XYZ Ltda." />
        <InputRead label="CNPJ"        value="12.345.678/0001-99" />
        <InputRead label="Valor"       value="R$ 48.000,00" />
      </div>
    </div>
  </div>
);
EmFormulario.storyName = 'Em grid de formulário';

// ─── Sem valor ────────────────────────────────────────────────────────────────

export const SemValor = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Valor vazio</p>
      <div style={row}>
        <InputRead label="Campo vazio" value="" />
        <InputRead label="Com valor"   value="Preenchido" />
      </div>
    </div>
  </div>
);
SemValor.storyName = 'Sem valor';
