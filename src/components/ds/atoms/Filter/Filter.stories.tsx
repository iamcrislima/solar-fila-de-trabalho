import type { CSSProperties } from 'react';
import { useState } from 'react';
import { FilterResultBar }  from './FilterResultBar';
import { FilterNavBar }     from './FilterNavBar';
import { FilterItemRow }    from './FilterItemRow';
import { FilterSubItemRow } from './FilterSubItemRow';

export default {
  title: '01-DS/Atoms/Filter',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 4 };

// ─── FilterResultBar ──────────────────────────────────────────────────────────

export const ResultBarStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>FilterResultBar — com contagem</p>
      <FilterResultBar
        recordCount={5}
        onFilter={() => alert('filtrar')}
        onSortChange={() => alert('ordenar')}
        onPrint={() => alert('imprimir')}
      />
    </div>
    <div style={card}>
      <p style={label}>FilterResultBar — label customizado</p>
      <FilterResultBar
        title="Documentos"
        recordLabel="12 documentos encontrados"
        sortValue="Nome crescente"
        onFilter={() => alert('filtrar')}
        onSortChange={() => alert('ordenar')}
        onPrint={() => alert('imprimir')}
      />
    </div>
    <div style={card}>
      <p style={label}>FilterResultBar — sem contagem</p>
      <FilterResultBar
        onFilter={() => alert('filtrar')}
        onPrint={() => alert('imprimir')}
      />
    </div>
  </div>
);
ResultBarStory.storyName = 'FilterResultBar';

// ─── FilterNavBar ─────────────────────────────────────────────────────────────

export const NavBarStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>FilterNavBar — padrão</p>
      <FilterNavBar
        pageSize={10}
        sortValue="Mais relevantes"
        page={1}
        totalRows={10}
        onPageSizeChange={() => alert('page size')}
        onSortChange={() => alert('sort')}
      />
    </div>
    <div style={card}>
      <p style={label}>FilterNavBar — segunda página</p>
      <FilterNavBar
        pageSize={10}
        sortValue="Data decrescente"
        page={2}
        totalRows={47}
        onPageSizeChange={() => alert('page size')}
        onSortChange={() => alert('sort')}
      />
    </div>
  </div>
);
NavBarStory.storyName = 'FilterNavBar';

// ─── FilterItemRow ────────────────────────────────────────────────────────────

export const ItemRowStory = () => {
  const [exp1, setExp1] = useState(false);
  const [chk1, setChk1] = useState(false);
  const [chk2, setChk2] = useState(true);

  return (
    <div style={page}>
      <div style={{ ...card, maxWidth: 280 }}>
        <p style={label}>FilterItemRow — variantes</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FilterItemRow
            label="Contrato Social"
            count={1115}
            checked={chk1}
            onChange={e => setChk1(e.target.checked)}
            expanded={exp1}
            onToggle={() => setExp1(v => !v)}
          />
          <FilterItemRow
            label="Nota Fiscal"
            count={42}
            checked={chk2}
            onChange={e => setChk2(e.target.checked)}
            expanded={false}
            onToggle={() => {}}
          />
          <FilterItemRow
            label="Procuração — nome muito longo que deve ser truncado"
            count={7}
            checked={false}
            onChange={() => {}}
            onToggle={() => {}}
          />
          <FilterItemRow
            label="Sem contagem"
            showCount={false}
            checked={false}
            onChange={() => {}}
            onToggle={() => {}}
          />
          <FilterItemRow
            label="Sem expander"
            count={3}
            showExpander={false}
            checked={false}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
ItemRowStory.storyName = 'FilterItemRow';

// ─── FilterSubItemRow ─────────────────────────────────────────────────────────

export const SubItemRowStory = () => {
  const [chk1, setChk1] = useState(false);
  const [chk2, setChk2] = useState(true);

  return (
    <div style={page}>
      <div style={{ ...card, maxWidth: 280 }}>
        <p style={label}>FilterSubItemRow — variantes</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FilterSubItemRow
            label="Sub Item A"
            count={110}
            checked={chk1}
            onChange={e => setChk1(e.target.checked)}
          />
          <FilterSubItemRow
            label="Sub Item B"
            count={23}
            checked={chk2}
            onChange={e => setChk2(e.target.checked)}
          />
          <FilterSubItemRow
            label="Sub Item sem badge"
            showCount={false}
            checked={false}
            onChange={() => {}}
          />
        </div>
      </div>
      <div style={{ ...card, maxWidth: 280 }}>
        <p style={label}>Composição: ItemRow + SubItemRows</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FilterItemRow
            label="Categoria"
            count={133}
            checked={false}
            onChange={() => {}}
            expanded={true}
            onToggle={() => {}}
          />
          <div style={{ paddingLeft: 28 }}>
            <FilterSubItemRow label="Sub A" count={110} checked={false} onChange={() => {}} />
            <FilterSubItemRow label="Sub B" count={23}  checked={false} onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};
SubItemRowStory.storyName = 'FilterSubItemRow';
