import type { CSSProperties } from 'react';
import { useState } from 'react';
import { VisualizacaoDropdown } from './VisualizacaoDropdown';

export default {
  title: '03-Custom/WorkQueue/VisualizacaoDropdown',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: '24px 16px 64px', borderRadius: 4 };

const STANDARD_OPTIONS = [
  { label: 'Visualização padrão' },
  { label: 'Compacta' },
  { label: 'Expandida' },
];

const MY_VIEWS = [
  { label: 'Minha visualização 1' },
  { label: 'Processos críticos' },
];

function Controlled({ initialValue, options, myViews }: { initialValue: string; options: { label: string }[]; myViews: { label: string }[] }) {
  const [value, setValue] = useState(initialValue);
  return (
    <VisualizacaoDropdown
      value={value}
      options={options}
      myViews={myViews}
      onChange={(item: string) => setValue(item)}
      onCreateCustom={() => alert('Criar visualização personalizada')}
    />
  );
}

export const VisualizacaoDropdownStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>VisualizacaoDropdown — com opções + minhas visualizações</p>
      <Controlled
        initialValue="Visualização padrão"
        options={STANDARD_OPTIONS}
        myViews={MY_VIEWS}
      />
    </div>

    <div style={card}>
      <p style={label}>VisualizacaoDropdown — sem minhas visualizações</p>
      <Controlled
        initialValue="Compacta"
        options={STANDARD_OPTIONS}
        myViews={[]}
      />
    </div>

    <div style={card}>
      <p style={label}>VisualizacaoDropdown — sem opções padrão</p>
      <Controlled
        initialValue="Minha visualização 1"
        options={[]}
        myViews={MY_VIEWS}
      />
    </div>
  </div>
);
VisualizacaoDropdownStory.storyName = 'VisualizacaoDropdown';
