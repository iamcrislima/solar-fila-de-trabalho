import type { CSSProperties } from 'react';
import { useState } from 'react';
import { TextArea } from '.';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

export default {
  title: '01-DS/Atoms/TextArea',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estados visuais ─────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Todos os estados — hover e focus são interativos</p>
      <div style={col}>
        <TextArea label="Default"   placeholder="Placeholder" />
        <TextArea label="Read Only" variant="readOnly" value="Extensive Content" />
        <TextArea label="Disabled"  placeholder="Placeholder" disabled />
        <TextArea label="Error"     variant="error" placeholder="Placeholder"
          helperText="Este campo é obrigatório" helperVariant="error" />
      </div>
    </div>
  </div>
);
Estados.storyName = 'Estados visuais';

// ─── Label variants ───────────────────────────────────────────────────────────

export const LabelVariants = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Variações de label</p>
      <div style={col}>
        <TextArea label="Label"    placeholder="Default" />
        <TextArea label="Label"    placeholder="Bold label" boldLabel />
        <TextArea label="Label"    mandatory placeholder="Mandatory (Label*:)" />
        <TextArea label="Label"    labelIcon={<InfoOutlined />} placeholder="Com ícone info" />
        <TextArea                  placeholder="Sem label" />
      </div>
    </div>
  </div>
);
LabelVariants.storyName = 'Variações de Label';

// ─── Helper text ──────────────────────────────────────────────────────────────

export const HelperText = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Helper Text — variantes de cor</p>
      <div style={col}>
        <TextArea label="Default" placeholder="Placeholder"
          helperText="Mensagem de ajuda padrão" helperVariant="default" />
        <TextArea label="Error" variant="error" placeholder="Placeholder"
          helperText="Este campo é obrigatório" helperVariant="error" />
        <TextArea label="Success" placeholder="Placeholder"
          helperText="Conteúdo salvo com sucesso" helperVariant="success" />
        <TextArea label="Warning" placeholder="Placeholder"
          helperText="Atenção: limite de caracteres próximo" helperVariant="warning" />
      </div>
    </div>
  </div>
);
HelperText.storyName = 'Helper Text';

// ─── Tamanhos via rows ────────────────────────────────────────────────────────

export const Tamanhos = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Altura via prop rows</p>
      <div style={col}>
        <TextArea label="Mínimo (84px — padrão Figma)" placeholder="Placeholder" />
        <TextArea label="rows={6}" placeholder="Placeholder" rows={6} />
        <TextArea label="rows={10}" placeholder="Placeholder" rows={10} />
        <TextArea label="Sem resize" placeholder="resize desabilitado" resize="none" />
      </div>
    </div>
  </div>
);
Tamanhos.storyName = 'Tamanhos e resize';

// ─── Controlado ───────────────────────────────────────────────────────────────

export const Controlado = () => {
  const MAX = 300;
  const [val, setVal] = useState('');
  const remaining = MAX - val.length;
  const isError   = remaining < 0;

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado com contagem de caracteres</p>
        <div style={col}>
          <TextArea
            label="Descrição"
            mandatory
            placeholder="Descreva detalhes do processo..."
            value={val}
            onChange={(e) => setVal(e.target.value)}
            variant={isError ? 'error' : 'default'}
            helperText={
              isError
                ? `Limite excedido em ${Math.abs(remaining)} caractere(s)`
                : `${remaining} caractere(s) restante(s)`
            }
            helperVariant={isError ? 'error' : remaining < 50 ? 'warning' : 'default'}
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};
Controlado.storyName = 'Controlado (contador de caracteres)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={col}>
      <p style={sectionLabel}>Todas as variantes</p>
      <TextArea label="Default"   placeholder="Placeholder" />
      <TextArea label="Read Only" variant="readOnly" value="Extensive Content aqui" />
      <TextArea label="Disabled"  disabled placeholder="Placeholder" />
      <TextArea label="Error"     variant="error" placeholder="Placeholder"
        helperText="Mensagem de erro" helperVariant="error" />
      <TextArea label="Success helper" placeholder="Placeholder"
        helperText="Salvo com sucesso" helperVariant="success" />
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
