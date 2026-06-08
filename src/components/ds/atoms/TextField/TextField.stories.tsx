import type { CSSProperties } from 'react';
import { useState } from 'react';
import { TextField } from '.';
import SearchOutlined      from '@mui/icons-material/SearchOutlined';
import VisibilityOutlined  from '@mui/icons-material/VisibilityOutlined';
import EmailOutlined       from '@mui/icons-material/EmailOutlined';
import InfoOutlined        from '@mui/icons-material/InfoOutlined';
import LockOutlined        from '@mui/icons-material/LockOutlined';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import ArrowDropDownOutlined from '@mui/icons-material/ArrowDropDownOutlined';

export default {
  title: '01-DS/Atoms/TextField',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 48 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 };
const row: CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' };
const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16, flex: '1 1 300px', maxWidth: 504 };
const sectionLabel: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: 0 };
// ─── Estados visuais ─────────────────────────────────────────────────────────

export const Estados = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Todos os estados (hover e focus são interativos)</p>
      <div style={col}>
        <TextField label="Default" placeholder="Placeholder" />
        <TextField label="Com ícone trailing" placeholder="Placeholder" trailingIcon={<SearchOutlined />} />
        <TextField label="Com ícone leading" placeholder="Placeholder" leadingIcon={<LockOutlined />} />
        <TextField label="Read Only" variant="readOnly" value="Conteúdo somente leitura" />
        <TextField label="Ghost / Disabled" placeholder="Placeholder" disabled />
        <TextField label="Error" variant="error" placeholder="Placeholder" helperText="Mensagem de erro aqui" helperVariant="error" />
        <TextField label="Error com valor" variant="error" value="Valor inválido" helperText="Este campo é obrigatório" helperVariant="error" />
      </div>
    </div>
  </div>
);
Estados.storyName = 'Estados visuais';

// ─── Label variants ───────────────────────────────────────────────────────────

export const LabelVariants = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Variações de Label</p>
      <div style={col}>
        <TextField label="Label" placeholder="Default" />
        <TextField label="Label" placeholder="Bold label" boldLabel />
        <TextField label="Label" mandatory placeholder="Mandatory (Label*:)" />
        <TextField label="Label" mandatory boldLabel placeholder="Mandatory Bold" />
        <TextField label="Label (R$)" placeholder="Money label" />
        <TextField label="Label" labelIcon={<InfoOutlined />} placeholder="Com ícone info" />
        <TextField label="Label" mandatory labelIcon={<InfoOutlined />} placeholder="Mandatory + info" />
        <TextField placeholder="Sem label" />
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
        <TextField label="Default" placeholder="Placeholder" helperText="Mensagem de ajuda padrão" helperVariant="default" />
        <TextField label="Error" placeholder="Placeholder" variant="error" helperText="Este campo é obrigatório" helperVariant="error" />
        <TextField label="Success" placeholder="Placeholder" helperText="Valor validado com sucesso" helperVariant="success" />
        <TextField label="Warning" placeholder="Placeholder" helperText="Atenção: verifique o valor informado" helperVariant="warning" />
      </div>
    </div>
  </div>
);
HelperText.storyName = 'Helper Text';

// ─── Com ícones ───────────────────────────────────────────────────────────────

export const ComIcones = () => (
  <div style={page}>
    <div style={group}>
      <p style={sectionLabel}>Ícones leading e trailing</p>
      <div style={col}>
        <TextField label="Busca" placeholder="Pesquisar..." trailingIcon={<SearchOutlined />} />
        <TextField label="E-mail" placeholder="email@empresa.com" leadingIcon={<EmailOutlined />} />
        <TextField label="Senha" placeholder="••••••••" type="password" leadingIcon={<LockOutlined />} trailingIcon={<VisibilityOutlined />} />
        <TextField label="Data" placeholder="DD/MM/AAAA" trailingIcon={<CalendarTodayOutlined />} />
        <TextField label="Seleção" placeholder="Selecione..." trailingIcon={<ArrowDropDownOutlined />} />
        <TextField label="Seleção (Read Only)" variant="readOnly" value="Opção selecionada" trailingIcon={<ArrowDropDownOutlined />} />
      </div>
    </div>
  </div>
);
ComIcones.storyName = 'Com ícones';

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled = () => {
  const [val, setVal] = useState('');
  const isError = val.length > 0 && val.length < 3;

  return (
    <div style={page}>
      <div style={group}>
        <p style={sectionLabel}>Controlado com validação</p>
        <div style={col}>
          <TextField
            label="Nome"
            mandatory
            placeholder="Digite seu nome"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            variant={isError ? 'error' : 'default'}
            helperText={isError ? 'Mínimo 3 caracteres' : val.length > 0 ? 'Parece ótimo!' : undefined}
            helperVariant={isError ? 'error' : 'success'}
          />
        </div>
      </div>
    </div>
  );
};
Controlled.storyName = 'Controlado (com validação)';

// ─── Todas as variantes ───────────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={row}>
      <div style={col}>
        <p style={sectionLabel}>Padrão</p>
        <TextField label="Label" placeholder="Placeholder" />
        <TextField label="Label" mandatory placeholder="Mandatory" />
        <TextField label="Label" placeholder="Com trailing" trailingIcon={<SearchOutlined />} />
        <TextField label="Label" placeholder="Com leading" leadingIcon={<EmailOutlined />} />
        <TextField label="Label" placeholder="Ambos" leadingIcon={<LockOutlined />} trailingIcon={<VisibilityOutlined />} />
      </div>
      <div style={col}>
        <p style={sectionLabel}>Estados especiais</p>
        <TextField label="Read Only" variant="readOnly" value="Valor fixo" />
        <TextField label="Disabled" disabled placeholder="Desabilitado" />
        <TextField label="Error" variant="error" placeholder="Campo inválido" helperText="Mensagem de erro" helperVariant="error" />
        <TextField label="Success" placeholder="Campo válido" helperText="Validado com sucesso" helperVariant="success" />
        <TextField label="Warning" placeholder="Atenção" helperText="Verifique o valor" helperVariant="warning" />
      </div>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';
