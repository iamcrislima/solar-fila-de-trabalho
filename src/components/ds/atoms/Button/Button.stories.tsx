import type { CSSProperties } from 'react';
import { Button, FloatingButton, ButtonGroup } from '.';
import PrintOutlined         from '@mui/icons-material/PrintOutlined';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';
import DeleteOutlined        from '@mui/icons-material/DeleteOutlined';
import ArrowUpwardOutlined   from '@mui/icons-material/ArrowUpwardOutlined';
import ChevronRightOutlined  from '@mui/icons-material/ChevronRightOutlined';
import AddCircleOutlineOutlined from '@mui/icons-material/AddCircleOutlineOutlined';

export default {
  title: '01-DS/Atoms/Button',
  parameters: { layout: 'padded' },
};

// ─── Layout helpers ───────────────────────────────────────────────────────────

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
const darkBg: CSSProperties = { backgroundColor: '#212121', padding: 16, borderRadius: 4, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };
// ─── Button Primary ───────────────────────────────────────────────────────────

export const ButtonPrimary = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Filled</p>
      <div style={row}>
        <Button type="primary" variant="filled">Button</Button>
        <Button type="primary" variant="filled" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="primary" variant="filled" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="primary" variant="filled" leadingIcon={<PrintOutlined />} trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="primary" variant="filled" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Outline</p>
      <div style={row}>
        <Button type="primary" variant="outline">Button</Button>
        <Button type="primary" variant="outline" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="primary" variant="outline" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="primary" variant="outline" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Flat</p>
      <div style={row}>
        <Button type="primary" variant="flat">Button</Button>
        <Button type="primary" variant="flat" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="primary" variant="flat" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="primary" variant="flat" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Dark (para fundos escuros)</p>
      <div style={darkBg}>
        <Button type="primary" variant="dark">Button</Button>
        <Button type="primary" variant="dark" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="primary" variant="dark" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="primary" variant="dark" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Ícone only</p>
      <div style={row}>
        <Button type="primary" variant="filled" leadingIcon={<PrintOutlined />} />
        <Button type="primary" variant="outline" leadingIcon={<PrintOutlined />} />
        <Button type="primary" variant="flat" leadingIcon={<PrintOutlined />} />
      </div>
    </div>
  </div>
);
ButtonPrimary.storyName = 'Button Primary';

// ─── Button Secondary ─────────────────────────────────────────────────────────

export const ButtonSecondary = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Filled</p>
      <div style={row}>
        <Button type="secondary" variant="filled">Button</Button>
        <Button type="secondary" variant="filled" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="secondary" variant="filled" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="secondary" variant="filled" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Outline</p>
      <div style={row}>
        <Button type="secondary" variant="outline">Button</Button>
        <Button type="secondary" variant="outline" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="secondary" variant="outline" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="secondary" variant="outline" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Flat</p>
      <div style={row}>
        <Button type="secondary" variant="flat">Button</Button>
        <Button type="secondary" variant="flat" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="secondary" variant="flat" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="secondary" variant="flat" disabled>Button</Button>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Dark (para fundos escuros)</p>
      <div style={darkBg}>
        <Button type="secondary" variant="dark">Button</Button>
        <Button type="secondary" variant="dark" leadingIcon={<PrintOutlined />}>Button</Button>
        <Button type="secondary" variant="dark" trailingIcon={<ArrowDropDownOutlined />}>Button</Button>
        <Button type="secondary" variant="dark" disabled>Button</Button>
      </div>
    </div>
  </div>
);
ButtonSecondary.storyName = 'Button Secondary';

// ─── Floating Button ──────────────────────────────────────────────────────────

export const FloatingButtonStory = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Floating Primary</p>
      <div style={row}>
        <FloatingButton type="primary"><ArrowUpwardOutlined /></FloatingButton>
        <FloatingButton type="primary"><ArrowUpwardOutlined /><ChevronRightOutlined /></FloatingButton>
        <FloatingButton type="primary"><ArrowUpwardOutlined /><ChevronRightOutlined /><AddCircleOutlineOutlined /></FloatingButton>
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Floating Secondary</p>
      <div style={row}>
        <FloatingButton type="secondary"><ArrowUpwardOutlined /></FloatingButton>
        <FloatingButton type="secondary"><ArrowUpwardOutlined /><ChevronRightOutlined /></FloatingButton>
        <FloatingButton type="secondary"><ArrowUpwardOutlined /><ChevronRightOutlined /><AddCircleOutlineOutlined /></FloatingButton>
      </div>
    </div>
  </div>
);
FloatingButtonStory.storyName = 'Floating Button';

// ─── Button Group ─────────────────────────────────────────────────────────────

export const ButtonGroupStory = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Button Group — padrão completo</p>
      <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 4 }}>
        <ButtonGroup
          leftActions={[
            <Button key="del" type="secondary" variant="outline" leadingIcon={<DeleteOutlined />}>Delete</Button>,
            <Button key="dd"  type="secondary" variant="outline" trailingIcon={<ArrowDropDownOutlined />}>Dropdown</Button>,
            <Button key="pr"  type="secondary" variant="outline" leadingIcon={<PrintOutlined />} />,
          ]}
          rightActions={[
            <Button key="back"   type="primary" variant="flat">Back</Button>,
            <Button key="cancel" type="primary" variant="outline">Cancel</Button>,
            <Button key="save"   type="primary" variant="filled">Save</Button>,
          ]}
        />
      </div>
    </div>

    <div style={group}>
      <p style={sectionLabel}>Button Group — apenas ações principais</p>
      <div style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 4 }}>
        <ButtonGroup
          rightActions={[
            <Button key="cancel" type="primary" variant="flat">Cancel</Button>,
            <Button key="save"   type="primary" variant="filled">Save</Button>,
          ]}
        />
      </div>
    </div>
  </div>
);
ButtonGroupStory.storyName = 'Button Group';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Primary — todas variantes</p>
      <div style={row}>
        <Button type="primary" variant="filled">Filled</Button>
        <Button type="primary" variant="outline">Outline</Button>
        <Button type="primary" variant="flat">Flat</Button>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Secondary — todas variantes</p>
      <div style={row}>
        <Button type="secondary" variant="filled">Filled</Button>
        <Button type="secondary" variant="outline">Outline</Button>
        <Button type="secondary" variant="flat">Flat</Button>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Disabled</p>
      <div style={row}>
        <Button type="primary" variant="filled" disabled>Filled</Button>
        <Button type="primary" variant="outline" disabled>Outline</Button>
        <Button type="primary" variant="flat" disabled>Flat</Button>
        <Button type="secondary" variant="filled" disabled>Filled</Button>
        <Button type="secondary" variant="outline" disabled>Outline</Button>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Dark</p>
      <div style={darkBg}>
        <Button type="primary" variant="dark">Primary Dark</Button>
        <Button type="secondary" variant="dark">Secondary Dark</Button>
        <Button type="primary" variant="dark" disabled>Disabled</Button>
      </div>
    </div>
    <div style={group}>
      <p style={sectionLabel}>Floating</p>
      <div style={row}>
        <FloatingButton type="primary"><ArrowUpwardOutlined /></FloatingButton>
        <FloatingButton type="secondary"><ArrowUpwardOutlined /></FloatingButton>
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
