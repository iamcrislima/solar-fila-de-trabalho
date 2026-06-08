import type { CSSProperties } from 'react';
import { useState } from 'react';
import { InputMulti } from '.';

export default {
  title: '01-DS/Atoms/InputMulti',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Tamanhos — modo simples ──────────────────────────────────────────────────

export const Tamanhos = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Tamanhos com search icon — como no Figma</p>
      <InputMulti label="Label" mandatory size="xl"      icon="search" placeholder="Placeholder" />
      <InputMulti label="Label" mandatory size="lg"      icon="search" placeholder="Placeholder" />
      <InputMulti label="Label" mandatory size="default" icon="search" placeholder="Placeholder" />
      <InputMulti label="Label" mandatory size="sm"      icon="arrow"  placeholder="Placeholder" />
      <InputMulti label="Label" mandatory size="xs"      icon="arrow"  placeholder="Placeholder" />
      <InputMulti label="Label" mandatory size="xxs"     icon="arrow"  placeholder="Select" />
      <InputMulti label="Label" mandatory size="xxxs"    icon={undefined}   placeholder="aaaa" />
    </div>
  </div>
);
Tamanhos.storyName = 'Tamanhos (Figma)';

// ─── Ícones ───────────────────────────────────────────────────────────────────

export const Icones = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Variações de ícone trailing</p>
      <InputMulti label="Buscar"    icon="search"   size="default" placeholder="Pesquisar..." />
      <InputMulti label="Selecionar" icon="arrow"   size="default" placeholder="Selecione uma opção..." />
      <InputMulti label="Data"      icon="calendar" size="default" placeholder="dd/mm/aaaa" />
      <InputMulti label="Sem ícone" icon={undefined}     size="default" placeholder="Texto livre" />
    </div>
  </div>
);
Icones.storyName = 'Ícones';

// ─── Modo Double — date range ─────────────────────────────────────────────────

export const DoubleAte = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Double — intervalo de datas (bridge "até")</p>
      <InputMulti
        label="Período"
        mandatory
        double
        bridgeText="até"
        startIcon="calendar"
        endIcon="calendar"
        startPlaceholder="dd/mm/aaaa"
        endPlaceholder="dd/mm/aaaa"
      />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Double — intervalo numérico</p>
      <InputMulti
        label="Faixa etária"
        double
        bridgeText="até"
        startIcon={undefined}
        endIcon={undefined}
        startPlaceholder="De"
        endPlaceholder="Até"
      />
    </div>
  </div>
);
DoubleAte.storyName = 'Double — bridge "até"';

// ─── Modo Double — separador / ────────────────────────────────────────────────

export const DoubleBarra = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Double XS — CEP: 00000-000 / aaaa</p>
      <InputMulti
        label="CEP"
        mandatory
        double
        bridgeText="/"
        startIcon={undefined}
        endIcon={undefined}
        startPlaceholder="00000-000"
        endPlaceholder="aaaa"
      />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Double XXXS — aaaa / 00000-000</p>
      <InputMulti
        label="Código"
        double
        bridgeText="/"
        startIcon={undefined}
        endIcon={undefined}
        startPlaceholder="aaaa"
        endPlaceholder="00000-000"
      />
    </div>
  </div>
);
DoubleBarra.storyName = 'Double — bridge "/"';

// ─── Estados ──────────────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Default — hover e focus são interativos</p>
      <InputMulti label="Ativo"     icon="search" size="default" placeholder="Hover e focus interativos" />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Disabled</p>
      <InputMulti label="Disabled"  icon="search" size="default" placeholder="Campo desabilitado" disabled />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Sem label</p>
      <InputMulti icon="search" size="sm" placeholder="Sem label" />
    </div>
  </div>
);
Estados.storyName = 'Estados';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const [search, setSearch]         = useState('');
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado — interativo</p>
        <InputMulti
          label="Busca"
          icon="search"
          size="default"
          placeholder="Digite para buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <InputMulti
          label="Período"
          double
          bridgeText="até"
          startIcon="calendar"
          endIcon="calendar"
          startPlaceholder="dd/mm/aaaa"
          endPlaceholder="dd/mm/aaaa"
          startValue={startDate}
          endValue={endDate}
          onStartChange={(e) => setStartDate(e.target.value)}
          onEndChange={(e) => setEndDate(e.target.value)}
        />
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#424242', margin: 0 }}>
          Busca: "{search}" | Início: "{startDate}" | Fim: "{endDate}"
        </p>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Simples — todos os tamanhos</p>
      <InputMulti label="XL"      size="xl"      icon="search"   placeholder="Placeholder" />
      <InputMulti label="LG"      size="lg"      icon="search"   placeholder="Placeholder" />
      <InputMulti label="Default" size="default" icon="search"   placeholder="Placeholder" />
      <InputMulti label="SM"      size="sm"      icon="arrow"    placeholder="Placeholder" />
      <InputMulti label="XS"      size="xs"      icon="arrow"    placeholder="Placeholder" />
      <InputMulti label="XXS"     size="xxs"     icon="arrow"    placeholder="Select" />
      <InputMulti label="XXXS"    size="xxxs"    icon={undefined}     placeholder="aaaa" />
    </div>
    <div style={group}>
      <p style={sectionLabel}>Double</p>
      <InputMulti label="Data" mandatory double bridgeText="até" startIcon="calendar" endIcon="calendar" startPlaceholder="dd/mm/aaaa" endPlaceholder="dd/mm/aaaa" />
      <InputMulti label="CEP"  mandatory double bridgeText="/"   startIcon={undefined} endIcon={undefined} startPlaceholder="00000-000" endPlaceholder="aaaa" />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
