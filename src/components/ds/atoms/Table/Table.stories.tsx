import type { CSSProperties } from 'react';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TableHeaderCell }  from './TableHeaderCell';
import { TableNavBar }      from './TableNavBar';
import { TableAddBar }      from './TableAddBar';
import { TableCaption }     from './TableCaption';
import { TableCaptionLine } from './TableCaptionLine';
import { TableColumn }      from './TableColumn';
import { TableAccordionLine } from './TableAccordionLine';
import { InputRead }        from '../InputRead';

export default {
  title: '01-DS/Atoms/Table',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 4 };

// ─── TableColumn ─────────────────────────────────────────────────────────────

const ROWS = ['Contrato Social', 'Nota Fiscal', 'Procuração'];

export const TableColumnStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>TableColumn — default / money / status / statusChip</p>
      <div style={{ display: 'flex' }}>
        <TableColumn type="default"    label="Nome"  rows={ROWS}                                   width={200} />
        <TableColumn type="money"      label="Valor" rows={['1.250,00', '320,00', '0,00']}         width={120} />
        <TableColumn type="status"                   rows={[null, null, null]}                     width={100} />
        <TableColumn type="statusChip"               rows={['Checked', 'Checked', 'Checked']}      width={130} />
      </div>
    </div>
    <div style={card}>
      <p style={label}>TableColumn — accordion / checkbox</p>
      <div style={{ display: 'flex' }}>
        <TableColumn type="accordion" label="Expandir" rows={ROWS}                                          width={220} onToggle={(i) => alert(`toggle ${i}`)} />
        <TableColumn type="checkbox"  label="Sel."     rows={ROWS.map(l => ({ label: l, checked: false }))} width={220} onSelect={(i, v) => alert(`select ${i}: ${v}`)} />
      </div>
    </div>
    <div style={card}>
      <p style={label}>TableColumn — input</p>
      <div style={{ display: 'flex' }}>
        <TableColumn type="input" label="Categoria" rows={[null, null, null]} width={200} />
      </div>
    </div>
    <div style={card}>
      <p style={label}>TableColumn — icon1 / icon2 / icon3</p>
      <div style={{ display: 'flex' }}>
        <TableColumn type="icon1" rows={[null, null, null]} width={80}  onView={(i) => alert(`view ${i}`)} />
        <TableColumn type="icon2" rows={[null, null, null]} width={100} onView={(i) => alert(`view ${i}`)} onEdit={(i) => alert(`edit ${i}`)} />
        <TableColumn type="icon3" rows={[null, null, null]} width={120} onView={(i) => alert(`view ${i}`)} onEdit={(i) => alert(`edit ${i}`)} onDelete={(i) => alert(`delete ${i}`)} />
      </div>
    </div>
    <div style={card}>
      <p style={label}>TableColumn — grade completa (composição livre)</p>
      <div style={{ display: 'flex' }}>
        <TableColumn type="default" label="Nome"  rows={ROWS}                              width={200} sortable />
        <TableColumn type="money"   label="Valor" rows={['1.250,00', '320,00', '0,00']}   width={120} sortable />
        <TableColumn type="status"                rows={[null, null, null]}                width={100} />
        <TableColumn type="icon2"                 rows={[null, null, null]}                width={100} onView={(i) => alert(`view ${i}`)} onEdit={(i) => alert(`edit ${i}`)} />
      </div>
    </div>
  </div>
);
TableColumnStory.storyName = 'TableColumn';

// ─── TableNavBar ─────────────────────────────────────────────────────────────

export const NavBarStory = () => {
  const [pg, setPg] = useState(1);
  const [ps, setPs] = useState(5);
  return (
    <div style={page}>
      <div>
        <p style={label}>TableNavBar — ativo</p>
        <TableNavBar totalRows={47} page={pg} pageSize={ps} onPageChange={setPg} onPageSizeChange={setPs} />
      </div>
      <div>
        <p style={label}>TableNavBar — desabilitado (Nav Off)</p>
        <TableNavBar totalRows={5} page={1} pageSize={5} disabled />
      </div>
    </div>
  );
};
NavBarStory.storyName = 'TableNavBar';

// ─── TableAddBar ─────────────────────────────────────────────────────────────

export const AddBarStory = () => (
  <div style={page}>
    <div>
      <p style={label}>TableAddBar — default (primary)</p>
      <TableAddBar onAdd={() => alert('add')} />
    </div>
    <div>
      <p style={label}>TableAddBar — surface (desabilitado visual)</p>
      <TableAddBar variant="surface" onAdd={() => alert('add')} />
    </div>
  </div>
);
AddBarStory.storyName = 'TableAddBar';

// ─── TableCaption / TableCaptionLine ─────────────────────────────────────────

export const CaptionStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>TableCaption — tipos predefinidos</p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <TableCaption type="finalizado"  label="Finalizado"    />
        <TableCaption type="pendente"    label="Pendente"      />
        <TableCaption type="construcao"  label="Em construção" />
        <TableCaption type="andamento"   label="Em andamento"  />
        <TableCaption type="cancelado"   label="Cancelado"     />
        <TableCaption type="reprovado"   label="Reprovado"     />
      </div>
    </div>
    <div style={card}>
      <p style={label}>TableCaption — ícone customizado</p>
      <TableCaption icon={<CheckCircleIcon />} color="#0097A7" label="Customizado" />
    </div>
    <div style={card}>
      <p style={label}>TableCaptionLine — linha completa (alinhada à direita)</p>
      <TableCaptionLine items={[
        { type: 'finalizado',  label: 'Finalizado'    },
        { type: 'pendente',    label: 'Pendente'      },
        { type: 'construcao',  label: 'Em construção' },
        { type: 'andamento',   label: 'Em andamento'  },
        { type: 'cancelado',   label: 'Cancelado'     },
        { type: 'reprovado',   label: 'Reprovado'     },
      ]} />
    </div>
  </div>
);
CaptionStory.storyName = 'TableCaption / CaptionLine';

// ─── TableAccordionLine ───────────────────────────────────────────────────────

export const AccordionLineStory = () => {
  const [col1, setCol1] = useState(false);
  const [col2, setCol2] = useState(true);
  const [chk,  setChk]  = useState(false);

  return (
    <div style={page}>
      <div>
        <p style={label}>TableAccordionLine — expandida</p>
        <TableAccordionLine
          collapsed={col1}
          onToggle={() => setCol1(v => !v)}
          checked={chk}
          onCheckChange={e => setChk(e.target.checked)}
          statusLabel="Finalizada"
          statusScheme="success"
          onView={() => alert('ver')}
          onEdit={() => alert('editar')}
          headerFields={[
            { label: 'Nome',    value: 'Contrato Social' },
            { label: 'Código',  value: 'CS-2024-001'     },
          ]}
        >
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '8px 0' }}>
            <InputRead label="Responsável" value="João Silva"    />
            <InputRead label="Emissão"     value="01/01/2024"    />
            <InputRead label="Vencimento"  value="31/12/2024"    />
            <InputRead label="Valor (R$)"  value="1.250,00"      />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '8px 0' }}>
            <InputRead label="Categoria"   value="Jurídico"      />
            <InputRead label="Observação"  value="Sem pendências" />
            <InputRead label="Total (R$)"  value="1.250,00"      />
          </div>
        </TableAccordionLine>
      </div>
      <div>
        <p style={label}>TableAccordionLine — colapsada</p>
        <TableAccordionLine
          collapsed={col2}
          onToggle={() => setCol2(v => !v)}
          statusLabel="Pendente"
          statusScheme="warning"
          onEdit={() => alert('editar')}
          headerFields={[
            { label: 'Nome',   value: 'Nota Fiscal' },
            { label: 'Código', value: 'NF-2024-042' },
          ]}
        >
          <div style={{ display: 'flex', gap: 16, padding: '8px 0' }}>
            <InputRead label="Valor" value="320,00" />
          </div>
        </TableAccordionLine>
      </div>
    </div>
  );
};
AccordionLineStory.storyName = 'TableAccordionLine';

// ─── TableHeaderCell (referência) ────────────────────────────────────────────

export const HeaderCells = () => (
  <div style={page}>
    <div>
      <p style={label}>TableHeaderCell — temas (sub-componente interno do TableColumn)</p>
      <div style={{ display: 'flex' }}>
        <TableHeaderCell label="Label" theme="default"   sortable sortDir="none" style={{ minWidth: 130 }} />
        <TableHeaderCell label="Label" theme="sub"       sortable sortDir="asc"  style={{ minWidth: 130 }} />
        <TableHeaderCell label="Label" theme="primary"   sortable sortDir="desc" style={{ minWidth: 130 }} />
        <TableHeaderCell label="Label" theme="secondary" sortable sortDir="none" style={{ minWidth: 130 }} />
      </div>
    </div>
  </div>
);
HeaderCells.storyName = 'TableHeaderCell';
