import type { CSSProperties } from 'react';
import { useState } from 'react';
import { SelectAll } from './SelectAll';

export default {
  title: '03-Custom/WorkQueue/SelectAll',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 4 };

export const SelectAllStory = () => {
  const [selected, setSelected] = useState(false);

  return (
    <div style={page}>
      <div style={card}>
        <p style={label}>SelectAll — interativo</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <SelectAll selected={selected} onChange={() => setSelected(v => !v)} />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: '#616161' }}>
            {selected ? 'Todos selecionados' : 'Nenhum selecionado'}
          </span>
        </div>
      </div>
      <div style={card}>
        <p style={label}>SelectAll — estados fixos</p>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <SelectAll selected={false} />
            <p style={{ ...label, margin: '8px 0 0', textTransform: 'none' }}>unselected</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <SelectAll selected={true} />
            <p style={{ ...label, margin: '8px 0 0', textTransform: 'none' }}>selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};
SelectAllStory.storyName = 'SelectAll';
