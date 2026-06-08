import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Checkbox } from '.';

export default {
  title: '01-DS/Atoms/Checkbox',
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
      <p style={sectionLabel}>Primary — estados</p>
      <div style={row}>
        <Checkbox type="primary">Unchecked</Checkbox>
        <Checkbox type="primary" checked>Checked</Checkbox>
        <Checkbox type="primary" indeterminate>Indeterminate</Checkbox>
        <Checkbox type="primary" disabled>Disabled unchecked</Checkbox>
        <Checkbox type="primary" checked disabled>Disabled checked</Checkbox>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Primary — sem label</p>
      <div style={row}>
        <Checkbox type="primary" />
        <Checkbox type="primary" checked />
        <Checkbox type="primary" indeterminate />
        <Checkbox type="primary" disabled />
        <Checkbox type="primary" checked disabled />
      </div>
    </div>
  </div>
);
Primary.storyName = 'Checkbox Primary';

// ─── Surface ──────────────────────────────────────────────────────────────────

export const Surface = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Surface — estados</p>
      <div style={row}>
        <Checkbox type="surface">Unchecked</Checkbox>
        <Checkbox type="surface" checked>Checked</Checkbox>
        <Checkbox type="surface" indeterminate>Indeterminate</Checkbox>
        <Checkbox type="surface" disabled>Disabled unchecked</Checkbox>
        <Checkbox type="surface" checked disabled>Disabled checked</Checkbox>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Surface — sem label</p>
      <div style={row}>
        <Checkbox type="surface" />
        <Checkbox type="surface" checked />
        <Checkbox type="surface" indeterminate />
        <Checkbox type="surface" disabled />
        <Checkbox type="surface" checked disabled />
      </div>
    </div>
  </div>
);
Surface.storyName = 'Checkbox Surface';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [items, setItems] = useState([
    { id: 1, label: 'Opção A', checked: true },
    { id: 2, label: 'Opção B', checked: false },
    { id: 3, label: 'Opção C', checked: true },
    { id: 4, label: 'Opção D', checked: false },
  ]);

  const allChecked  = items.every((i) => i.checked);
  const someChecked = items.some((i) => i.checked) && !allChecked;

  const toggleAll = () => {
    const next = !allChecked;
    setItems((prev) => prev.map((i) => ({ ...i, checked: next })));
  };

  const toggle = (id: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Lista controlada com "select all"</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Checkbox
            type="primary"
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleAll}
          >
            Selecionar todos
          </Checkbox>
          <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => (
              <Checkbox
                key={item.id}
                type="primary"
                checked={item.checked}
                onChange={() => toggle(item.id)}
              >
                {item.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (select all)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Primary</p>
      <div style={row}>
        <Checkbox type="primary">Unchecked</Checkbox>
        <Checkbox type="primary" checked>Checked</Checkbox>
        <Checkbox type="primary" indeterminate>Indeterminate</Checkbox>
        <Checkbox type="primary" disabled>Disabled</Checkbox>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Surface</p>
      <div style={row}>
        <Checkbox type="surface">Unchecked</Checkbox>
        <Checkbox type="surface" checked>Checked</Checkbox>
        <Checkbox type="surface" indeterminate>Indeterminate</Checkbox>
        <Checkbox type="surface" disabled>Disabled</Checkbox>
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
