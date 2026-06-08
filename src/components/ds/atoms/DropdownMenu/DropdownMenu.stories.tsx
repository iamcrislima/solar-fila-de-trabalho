import type { CSSProperties } from 'react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuItem } from '.';

export default {
  title: '01-DS/Atoms/DropdownMenu',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estados do item ──────────────────────────────────────────────────────────

export const EstadosDoItem = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Estados visuais do item — hover é interativo</p>
      <div style={row}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DropdownMenuItem label="Default" />
          <DropdownMenuItem label="Hover (passe o mouse)" />
          <DropdownMenuItem label="Active" active />
          <DropdownMenuItem label="Disabled" disabled />
        </div>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Com ícone trailing (open_in_new)</p>
      <div style={row}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DropdownMenuItem label="Abrir em nova aba" trailingIcon />
          <DropdownMenuItem label="Active com ícone" active trailingIcon />
        </div>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Com checkbox</p>
      <div style={row}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <DropdownMenuItem label="Unchecked" showCheckbox />
          <DropdownMenuItem label="Checked"   showCheckbox checked />
          <DropdownMenuItem label="Active + checked" showCheckbox checked active />
          <DropdownMenuItem label="Hover com checkbox" showCheckbox />
        </div>
      </div>
    </div>
  </div>
);
EstadosDoItem.storyName = 'Estados do item';

// ─── Tamanhos do painel ───────────────────────────────────────────────────────

export const TamanhosDoPainel = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default — 504px</p>
      <div style={row}>
        <DropdownMenu size="default">
          <DropdownMenuItem label="Item 1" />
          <DropdownMenuItem label="Item 2" />
          <DropdownMenuItem label="Item 3" />
          <DropdownMenuItem label="Item 4" />
          <DropdownMenuItem label="Item 5" />
        </DropdownMenu>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>SM — 244px</p>
      <div style={row}>
        <DropdownMenu size="sm">
          <DropdownMenuItem label="Item 1" />
          <DropdownMenuItem label="Item 2" />
          <DropdownMenuItem label="Item 3" />
          <DropdownMenuItem label="Item 4" />
          <DropdownMenuItem label="Item 5" />
        </DropdownMenu>
      </div>
    </div>
  </div>
);
TamanhosDoPainel.storyName = 'Tamanhos do painel';

// ─── Controlado — checkbox ────────────────────────────────────────────────────

export const Controlado = () => {
  const ITEMS = ['Opção Alpha', 'Opção Beta', 'Opção Gamma', 'Opção Delta', 'Opção Epsilon'];
  const [selected, setSelected] = useState(new Set());

  const toggle = (item: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  });

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Multi-select com checkbox — interativo</p>
        <div style={row}>
          <DropdownMenu size="sm">
            {ITEMS.map(item => (
              <DropdownMenuItem
                key={item}
                label={item}
                showCheckbox
                checked={selected.has(item)}
                active={selected.has(item)}
                onClick={() => toggle(item)}
              />
            ))}
          </DropdownMenu>
          <div>
            <p style={{ ...sectionLabel, textTransform: 'none', fontSize: 13 }}>
              Selecionados: {selected.size === 0 ? 'nenhum' : [...selected].join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (multi-select)';

// ─── Com ícone trailing ───────────────────────────────────────────────────────

export const ComIconeTrailing = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Itens com link externo</p>
      <div style={row}>
        <DropdownMenu size="sm">
          <DropdownMenuItem label="Abrir documentação" trailingIcon />
          <DropdownMenuItem label="Ver no portal" trailingIcon />
          <DropdownMenuItem label="Exportar relatório" trailingIcon />
          <DropdownMenuItem label="Sem link externo" />
        </DropdownMenu>
      </div>
    </div>
  </div>
);
ComIconeTrailing.storyName = 'Com ícone trailing';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Default (504px)</p>
        <DropdownMenu>
          <DropdownMenuItem label="Item padrão" />
          <DropdownMenuItem label="Item hover (mouse over)" />
          <DropdownMenuItem label="Item active" active />
          <DropdownMenuItem label="Com ícone" trailingIcon />
          <DropdownMenuItem label="Disabled" disabled />
        </DropdownMenu>
      </div>

      <div style={group}>
        <p style={sectionLabel}>SM (244px) com checkbox</p>
        <DropdownMenu size="sm">
          <DropdownMenuItem label="Unchecked" showCheckbox />
          <DropdownMenuItem label="Checked" showCheckbox checked active />
          <DropdownMenuItem label="Hover" showCheckbox />
          <DropdownMenuItem label="Disabled" showCheckbox disabled />
        </DropdownMenu>
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
