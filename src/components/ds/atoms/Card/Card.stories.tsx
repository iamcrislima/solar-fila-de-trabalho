import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { useState, cloneElement } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import PrintIcon         from '@mui/icons-material/Print';
import { Card, CardHeader, CardFooter } from '.';
import { colors }     from '../../../../styles/tokens/colors';
import { typography } from '../../../../styles/tokens/typography';

export default {
  title: '01-DS/Atoms/Card',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
// ─── Botões reutilizáveis na story ────────────────────────────────────────────

const BtnPrimary = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    background: colors.primary.main, color: '#FFF', border: 'none',
    borderRadius: 4, padding: '6px 16px', cursor: 'pointer',
    ...typography.styles.subtitle2,
  }}>
    {children}
  </button>
);

const BtnOutline = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    background: 'transparent', color: colors.primary.main,
    border: `1px solid ${colors.primary.main}`,
    borderRadius: 4, padding: '6px 16px', cursor: 'pointer',
    ...typography.styles.subtitle2,
  }}>
    {children}
  </button>
);

const BtnFlat = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    background: 'transparent', color: colors.primary.main, border: 'none',
    borderRadius: 4, padding: '6px 16px', cursor: 'pointer',
    ...typography.styles.subtitle2,
  }}>
    {children}
  </button>
);

const BtnSecondary = ({ children, icon, onClick }: { children?: ReactNode; icon?: ReactElement; onClick?: () => void }) => (
  <button onClick={onClick} style={{
    background: 'transparent', color: colors.surface.main,
    border: `1px solid ${colors.surface.main}`,
    borderRadius: 4, padding: '6px 8px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 4,
    ...typography.styles.subtitle2,
  }}>
    {icon && cloneElement(icon as ReactElement<{ style?: CSSProperties }>, { style: { fontSize: 24 } })}
    {children}
  </button>
);

const ContentPlaceholder = () => (
  <div style={{
    height: 80,
    backgroundColor: colors.surface.xl,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '12px 0',
  }}>
    <span style={{ ...typography.styles.body2, color: colors.surface.medium }}>
      Conteúdo do card (inputs, tabelas, texto...)
    </span>
  </div>
);

// ─── CardHeader ───────────────────────────────────────────────────────────────

export const HeaderStory = () => (
  <div style={page}>
    <div>
      <p style={label}>CardHeader — variações</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Card>
          <CardHeader title="Apenas título" />
        </Card>
        <Card>
          <CardHeader title="Com tooltip" showTooltip />
        </Card>
        <Card>
          <CardHeader title="Com chip de status" showTooltip chip={{ label: 'Doing' }} />
        </Card>
        <Card>
          <CardHeader
            title="Com ações completas"
            showTooltip
            chip={{ label: 'Doing' }}
            primaryAction={{ label: 'New', onClick: () => {} }}
            showDownload
            showUpload
            showMore
          />
        </Card>
        <Card>
          <CardHeader
            title="Com checkbox"
            showCheckbox
            showTooltip
            chip={{ label: 'Em análise', scheme: colors.support.main }}
            showAccordion
            collapsed={false}
          />
        </Card>
      </div>
    </div>
  </div>
);
HeaderStory.storyName = 'Card Header';

// ─── CardFooter ───────────────────────────────────────────────────────────────

export const FooterStory = () => (
  <div style={page}>
    <div>
      <p style={label}>CardFooter — variações</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Card>
          <CardFooter
            leftActions={<>
              <BtnSecondary icon={<DeleteOutlineIcon />}>Delete</BtnSecondary>
              <BtnSecondary icon={<PrintIcon />} />
            </>}
            rightActions={<>
              <BtnFlat>Back</BtnFlat>
              <BtnOutline>Cancel</BtnOutline>
              <BtnPrimary>Save</BtnPrimary>
            </>}
          />
        </Card>
        <Card>
          <CardFooter showDivider={false} rightActions={<BtnPrimary>Confirmar</BtnPrimary>} />
        </Card>
      </div>
    </div>
  </div>
);
FooterStory.storyName = 'Card Footer';

// ─── Card — expandido / colapsado ────────────────────────────────────────────

export const CardDefault = () => {
  const [open, setOpen] = useState(true);

  return (
    <div style={page}>
      <div>
        <p style={label}>Card — expandido / colapsado</p>
        <Card>
          <CardHeader
            title="Resultados da busca"
            showTooltip
            chip={{ label: 'Doing' }}
            primaryAction={{ label: 'New', onClick: () => {} }}
            showAccordion
            collapsed={!open}
            onToggle={() => setOpen(p => !p)}
          />
          {open && (
            <>
              <ContentPlaceholder />
              <ContentPlaceholder />
              <CardFooter
                leftActions={<BtnSecondary icon={<DeleteOutlineIcon />}>Delete</BtnSecondary>}
                rightActions={<>
                  <BtnFlat>Back</BtnFlat>
                  <BtnOutline>Cancel</BtnOutline>
                  <BtnPrimary>Save</BtnPrimary>
                </>}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
CardDefault.storyName = 'Card (interativo)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div>
      <p style={label}>Expandido — completo</p>
      <Card>
        <CardHeader
          title="Processos em andamento"
          showTooltip
          chip={{ label: 'Em andamento', scheme: colors.success.main }}
          showDownload
          showMore
          showAccordion
          collapsed={false}
        />
        <ContentPlaceholder />
        <CardFooter
          leftActions={<BtnSecondary icon={<DeleteOutlineIcon />}>Delete</BtnSecondary>}
          rightActions={<>
            <BtnFlat>Back</BtnFlat>
            <BtnOutline>Cancel</BtnOutline>
            <BtnPrimary>Save</BtnPrimary>
          </>}
        />
      </Card>
    </div>
    <div>
      <p style={label}>Colapsado — apenas header</p>
      <Card>
        <CardHeader
          title="Processos em andamento"
          showTooltip
          chip={{ label: 'Em andamento', scheme: colors.success.main }}
          showAccordion
          collapsed={true}
        />
      </Card>
    </div>
    <div>
      <p style={label}>Simples — sem ações</p>
      <Card>
        <CardHeader title="Configurações gerais" />
        <ContentPlaceholder />
      </Card>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
