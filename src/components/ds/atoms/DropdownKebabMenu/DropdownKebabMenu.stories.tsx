import type { CSSProperties } from 'react';
import { DropdownKebabMenu } from '.';

export default {
  title: '01-DS/Atoms/DropdownKebabMenu',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Types ────────────────────────────────────────────────────────────────────

export const TiposPrimario = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Primary — texto #00838F, hover #E0F7FA</p>
      <div style={row}>
        <DropdownKebabMenu type="primary" />
      </div>
    </div>
  </div>
);
TiposPrimario.storyName = 'Primary';

export const TiposSurface = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Surface — texto #212121, hover #F5F5F5</p>
      <div style={row}>
        <DropdownKebabMenu type={"surface" as "secondary"} />
      </div>
    </div>
  </div>
);
TiposSurface.storyName = 'Surface';

// ─── Ações customizadas ───────────────────────────────────────────────────────

export const AcoesCustomizadas = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Subconjunto de ações</p>
      <div style={row}>
        <div style={group}>
          <p style={{ ...sectionLabel, fontSize: 11, textTransform: 'none' }}>View + Edit + Delete</p>
          <DropdownKebabMenu
            type="primary"
            actions={[
              { action: 'view' },
              { action: 'edit' },
              { action: 'delete' },
            ]}
          />
        </div>

        <div style={group}>
          <p style={{ ...sectionLabel, fontSize: 11, textTransform: 'none' }}>View + Lock + Send</p>
          <DropdownKebabMenu
            type={"surface" as "secondary"}
            actions={[
              { action: 'view' },
              { action: 'lock' },
              { action: 'send' },
            ]}
          />
        </div>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Labels customizados</p>
      <div style={row}>
        <DropdownKebabMenu
          type="primary"
          actions={[
            { action: 'view',   label: 'Visualizar' },
            { action: 'edit',   label: 'Editar'     },
            { action: 'delete', label: 'Excluir'    },
            { action: 'lock',   label: 'Bloquear'   },
            { action: 'send',   label: 'Enviar'     },
          ]}
        />
        <DropdownKebabMenu
          type={"surface" as "secondary"}
          actions={[
            { action: 'view',   label: 'Visualizar' },
            { action: 'edit',   label: 'Editar'     },
            { action: 'delete', label: 'Excluir'    },
            { action: 'lock',   label: 'Bloquear'   },
            { action: 'send',   label: 'Enviar'     },
          ]}
        />
      </div>
    </div>
  </div>
);
AcoesCustomizadas.storyName = 'Ações customizadas';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={group}>
        <p style={sectionLabel}>Primary — todas ações</p>
        <DropdownKebabMenu type="primary" />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Surface — todas ações</p>
        <DropdownKebabMenu type={"surface" as "secondary"} />
      </div>
      <div style={group}>
        <p style={sectionLabel}>Primary — labels PT</p>
        <DropdownKebabMenu
          type="primary"
          actions={[
            { action: 'view',   label: 'Visualizar' },
            { action: 'edit',   label: 'Editar'     },
            { action: 'delete', label: 'Excluir'    },
            { action: 'lock',   label: 'Bloquear'   },
            { action: 'send',   label: 'Enviar'     },
          ]}
        />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
