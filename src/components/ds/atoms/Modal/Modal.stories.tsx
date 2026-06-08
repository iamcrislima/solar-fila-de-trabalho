import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { Modal, ModalDialog } from '.';
import { colors }     from '../../../../styles/tokens/colors';
import { typography } from '../../../../styles/tokens/typography';

export default {
  title: '01-DS/Atoms/Modal',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const Btn = ({ onClick, children, variant = 'filled' }: { onClick?: () => void; children: ReactNode; variant?: string }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: variant === 'filled' ? colors.primary.main : 'transparent',
      color:           variant === 'filled' ? '#FFF' : colors.primary.main,
      border:          variant === 'outline' ? `1px solid ${colors.primary.main}` : 'none',
      padding:         '6px 16px',
      borderRadius:    4,
      cursor:          'pointer',
      ...typography.styles.subtitle2,
    }}
  >
    {children}
  </button>
);

const TriggerBtn = ({ onClick, children }: { onClick?: () => void; children: ReactNode }) => (
  <button
    onClick={onClick}
    style={{
      backgroundColor: colors.primary.main,
      color:           '#FFF',
      border:          'none',
      padding:         '8px 20px',
      borderRadius:    4,
      cursor:          'pointer',
      ...typography.styles.subtitle2,
    }}
  >
    {children}
  </button>
);

const ContentPlaceholder = ({ rows = 3 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        style={{ height: 40, backgroundColor: colors.surface.xl, borderRadius: 4 }}
      />
    ))}
  </div>
);

// ─── Modal Dialog ─────────────────────────────────────────────────────────────

export const Dialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={page}>
      <div>
        <p style={label}>Modal Dialog — confirmação</p>
        <TriggerBtn onClick={() => setOpen(true)}>Abrir Dialog</TriggerBtn>
        <ModalDialog
          open={open}
          title="Delete Confirmation Dialog"
          message="Are you sure? This action will permanently delete all the selected files and folders without sending them to the Recycle Bin."
          cancelLabel="Cancel"
          confirmLabel="Confirm"
          onCancel={() => setOpen(false)}
          onConfirm={() => { alert('Confirmado!'); setOpen(false); }}
        />
      </div>
    </div>
  );
};
Dialog.storyName = 'Modal Dialog (confirmação)';

// ─── Modal SM ─────────────────────────────────────────────────────────────────

export const ModalSm = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={page}>
      <div>
        <p style={label}>Modal — SM (504px)</p>
        <TriggerBtn onClick={() => setOpen(true)}>Abrir Modal SM</TriggerBtn>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal Pequeno"
          size="sm"
          footer={<>
            <Btn variant="outline" onClick={() => setOpen(false)}>Cancelar</Btn>
            <Btn onClick={() => setOpen(false)}>Salvar</Btn>
          </>}
        >
          <ContentPlaceholder rows={3} />
        </Modal>
      </div>
    </div>
  );
};
ModalSm.storyName = 'Modal SM';

// ─── Modal MD ─────────────────────────────────────────────────────────────────

export const ModalMd = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={page}>
      <div>
        <p style={label}>Modal — MD / Default (764px)</p>
        <TriggerBtn onClick={() => setOpen(true)}>Abrir Modal MD</TriggerBtn>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal Padrão"
          size="md"
          footer={<>
            <Btn variant="outline" onClick={() => setOpen(false)}>Cancelar</Btn>
            <Btn onClick={() => setOpen(false)}>Salvar</Btn>
          </>}
        >
          <ContentPlaceholder rows={4} />
        </Modal>
      </div>
    </div>
  );
};
ModalMd.storyName = 'Modal MD (default)';

// ─── Modal LG ─────────────────────────────────────────────────────────────────

export const ModalLg = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={page}>
      <div>
        <p style={label}>Modal — LG (959px)</p>
        <TriggerBtn onClick={() => setOpen(true)}>Abrir Modal LG</TriggerBtn>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal Grande"
          size="lg"
          footer={<>
            <Btn variant="outline" onClick={() => setOpen(false)}>Fechar</Btn>
            <Btn onClick={() => setOpen(false)}>Selecionar</Btn>
          </>}
        >
          <ContentPlaceholder rows={6} />
        </Modal>
      </div>
    </div>
  );
};
ModalLg.storyName = 'Modal LG';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => {
  const [which, setWhich] = useState<string | null>(null);
  return (
    <div style={page}>
      <div>
        <p style={label}>Todas as variantes</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <TriggerBtn onClick={() => setWhich('dialog')}>Dialog</TriggerBtn>
          <TriggerBtn onClick={() => setWhich('sm')}>Modal SM</TriggerBtn>
          <TriggerBtn onClick={() => setWhich('md')}>Modal MD</TriggerBtn>
          <TriggerBtn onClick={() => setWhich('lg')}>Modal LG</TriggerBtn>
        </div>
      </div>

      <ModalDialog
        open={which === 'dialog'}
        title="Delete Confirmation Dialog"
        message="Are you sure? This action will permanently delete all the selected files and folders without sending them to the Recycle Bin."
        onCancel={() => setWhich(null)}
        onConfirm={() => setWhich(null)}
      />

      <Modal
        open={which === 'sm'}
        onClose={() => setWhich(null)}
        title="Modal SM"
        size="sm"
        footer={<Btn onClick={() => setWhich(null)}>OK</Btn>}
      >
        <ContentPlaceholder rows={2} />
      </Modal>

      <Modal
        open={which === 'md'}
        onClose={() => setWhich(null)}
        title="Modal Padrão"
        size="md"
        footer={<>
          <Btn variant="outline" onClick={() => setWhich(null)}>Cancelar</Btn>
          <Btn onClick={() => setWhich(null)}>Salvar</Btn>
        </>}
      >
        <ContentPlaceholder rows={4} />
      </Modal>

      <Modal
        open={which === 'lg'}
        onClose={() => setWhich(null)}
        title="Modal Grande"
        size="lg"
        footer={<>
          <Btn variant="outline" onClick={() => setWhich(null)}>Fechar</Btn>
          <Btn onClick={() => setWhich(null)}>Selecionar</Btn>
        </>}
      >
        <ContentPlaceholder rows={6} />
      </Modal>
    </div>
  );
};
TodasAsVariantes.storyName = 'Todas as variantes';
