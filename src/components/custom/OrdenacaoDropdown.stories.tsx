import type { CSSProperties } from 'react';
import { useState } from 'react';
import { OrdenacaoDropdown } from './OrdenacaoDropdown';

export default {
  title: '03-Custom/WorkQueue/OrdenacaoDropdown',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: '24px 16px 48px', borderRadius: 4 };

function Controlled() {
  const [selected, setSelected] = useState({ section: 0, item: 0 });

  const sections = [
    {
      title: 'Campo',
      items: [
        { label: 'Data de abertura',   selected: selected.section === 0 && selected.item === 0, onClick: () => setSelected({ section: 0, item: 0 }) },
        { label: 'Data de vencimento', selected: selected.section === 0 && selected.item === 1, onClick: () => setSelected({ section: 0, item: 1 }) },
        { label: 'Responsável',        selected: selected.section === 0 && selected.item === 2, onClick: () => setSelected({ section: 0, item: 2 }) },
      ],
    },
    {
      title: 'Direção',
      items: [
        { label: 'Crescente',  selected: selected.section === 1 && selected.item === 0, onClick: () => setSelected({ section: 1, item: 0 }) },
        { label: 'Decrescente', selected: selected.section === 1 && selected.item === 1, onClick: () => setSelected({ section: 1, item: 1 }) },
      ],
    },
  ];

  return <OrdenacaoDropdown sections={sections} />;
}

export const OrdenacaoDropdownStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>OrdenacaoDropdown — clique no ícone para abrir o painel</p>
      <Controlled />
    </div>

    <div style={card}>
      <p style={label}>OrdenacaoDropdown — seção única</p>
      <OrdenacaoDropdown
        sections={[
          {
            title: 'Ordenar por',
            items: [
              { label: 'Mais recente', selected: true,  onClick: () => {} },
              { label: 'Mais antigo', selected: false, onClick: () => {} },
              { label: 'Alfabético',  selected: false, onClick: () => {} },
            ],
          },
        ]}
      />
    </div>
  </div>
);
OrdenacaoDropdownStory.storyName = 'OrdenacaoDropdown';
