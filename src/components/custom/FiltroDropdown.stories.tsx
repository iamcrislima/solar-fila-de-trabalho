import type { CSSProperties } from 'react';
import { useState } from 'react';
import { FiltroDropdown } from '@/components/app/filters/FiltroDropdown';

export default {
  title: '02-App/FiltroDropdown',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: '24px 16px 48px', borderRadius: 4 };

const SAMPLE_ITEMS = [
  { id: 1, label: 'Análise de crédito',      checked: false },
  { id: 2, label: 'Aprovação financeira',     checked: true  },
  { id: 3, label: 'Validação documental',     checked: false },
  { id: 4, label: 'Liberação de contrato',    checked: false },
  { id: 5, label: 'Revisão jurídica',         checked: true  },
];

function Controlled({ label: fieldLabel, placeholder, items: initial }: { label: string | undefined; placeholder: string; items: { id: number; label: string; checked: boolean }[] }) {
  const [items, setItems] = useState(initial);
  const toggle = (id: string | number, checked: boolean) =>
    setItems((prev: { id: number; label: string; checked: boolean }[]) => prev.map((it: { id: number; label: string; checked: boolean }) => it.id === id ? { ...it, checked } : it));
  return (
    <FiltroDropdown
      label={fieldLabel}
      placeholder={placeholder}
      items={items}
      onChange={toggle}
    />
  );
}

export const FiltroDropdownStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>FiltroDropdown — com label e placeholder</p>
      <Controlled
        label="Tipo de processo*:"
        placeholder="Buscar tipo..."
        items={SAMPLE_ITEMS}
      />
    </div>

    <div style={card}>
      <p style={label}>FiltroDropdown — sem label</p>
      <Controlled
        label={undefined}
        placeholder="Selecionar status..."
        items={[
          { id: 10, label: 'Ativo',     checked: false },
          { id: 11, label: 'Inativo',   checked: false },
          { id: 12, label: 'Pendente',  checked: true  },
          { id: 13, label: 'Cancelado', checked: false },
        ]}
      />
    </div>

    <div style={card}>
      <p style={label}>FiltroDropdown — lista longa</p>
      <Controlled
        label="Responsável*:"
        placeholder="Buscar responsável..."
        items={Array.from({ length: 12 }, (_, i) => ({
          id: 100 + i,
          label: `Colaborador ${i + 1}`,
          checked: i % 3 === 0,
        }))}
      />
    </div>
  </div>
);
FiltroDropdownStory.storyName = 'FiltroDropdown';
