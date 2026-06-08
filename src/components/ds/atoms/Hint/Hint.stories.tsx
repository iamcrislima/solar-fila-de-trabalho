import type { CSSProperties } from 'react';
import { HintMain, HintGiant } from '.';
import { Tooltip }   from '../Tooltip/Tooltip';
import { IconButton } from '../Icon/IconButton';
import { IconHint }   from '../Icon/IconHint';
import InboxIcon from '@mui/icons-material/Inbox';
import { colors } from '@/styles/tokens/colors';

export default {
  title: '01-DS/Atoms/Hint',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 40 };
const group: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1 };
const row: CSSProperties = { display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' };
// ─── HintMain ────────────────────────────────────────────────────────────────

export const HintMainVariants = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Hint Main — Default</p>
      <div style={row}>
        <HintMain variant="default">Caption here</HintMain>
        <HintMain variant="default">Texto mais longo que demonstra o comportamento de wrap</HintMain>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Hint Main — Stroke</p>
      <div style={row}>
        <HintMain variant="stroke">Caption here</HintMain>
        <HintMain variant="stroke">Texto mais longo que demonstra o comportamento de wrap</HintMain>
      </div>
    </div>

    <div style={group}>
      <p style={label}>Hint Main — Light</p>
      <div style={row}>
        <HintMain variant="light">Caption here</HintMain>
        <HintMain variant="light">Texto mais longo que demonstra o comportamento de wrap</HintMain>
      </div>
    </div>
  </div>
);
HintMainVariants.storyName = 'HintMain / Variantes';

// ─── HintGiant ───────────────────────────────────────────────────────────────

export const HintGiantDefault = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Hint Giant — Default</p>
      <div style={row}>
        <HintGiant label="Label:">
          Lorem ipsum dolor sit amet consectetur. Fermentum proin in dignissim id vitae cursus.
          Aliquam risus laoreet mauris id augue tortor nunc lorem. Sed et eleifend diam rhoncus
          fringilla est amet viverra et. Ac egestas sit tincidunt sagittis id.
        </HintGiant>

        <HintGiant label="Atenção:">
          Texto de atenção com conteúdo relevante para o usuário.
        </HintGiant>

        <HintGiant>
          Hint Giant sem label — apenas corpo de texto.
        </HintGiant>
      </div>
    </div>
  </div>
);
HintGiantDefault.storyName = 'HintGiant / Default';

// ─── Todas as variantes juntas ────────────────────────────────────────────────

export const TodasAsVariantes = () => (
  <div style={page}>
    <div style={group}>
      <p style={label}>Hint Main</p>
      <div style={row}>
        <HintMain variant="default">Default</HintMain>
        <HintMain variant="stroke">Stroke</HintMain>
        <HintMain variant="light">Light</HintMain>
      </div>
    </div>
    <div style={group}>
      <p style={label}>Hint Giant</p>
      <HintGiant label="Label:">
        Lorem ipsum dolor sit amet consectetur. Fermentum proin in dignissim id vitae cursus.
      </HintGiant>
    </div>
  </div>
);
TodasAsVariantes.storyName = 'Todas as variantes';

// ─── Ecossistema Hint / Tooltip / IconHint ────────────────────────────────────
// Os três componentes fazem parte do mesmo ecossistema de hints visuais.
// Cada um tem papel distinto:
//
//   HintMain    — o badge visual em si (fundo escuro + texto branco). Componente base.
//   Tooltip     — wrapper de hover que posiciona HintMain via portal. PADRÃO DO PROJETO.
//   IconHint    — ícone + badge-label abaixo, visível quando showHint=true.
//
// Regra: sempre use <Tooltip> para hints on-hover. Nunca instancie HintMain manualmente.

export const EcossistemaHint = () => (
  <div style={{ ...page, backgroundColor: '#F0F0F0' }}>
    <div style={group}>
      <p style={label}>1. HintMain — badge visual puro</p>
      <p style={{ fontFamily: "'Open Sans'", fontSize: 12, color: '#9E9E9E', margin: 0 }}>
        Componente base. Não use diretamente — use Tooltip.
      </p>
      <div style={row}>
        <HintMain>Caption here</HintMain>
        <HintMain variant="light">Light variant</HintMain>
      </div>
    </div>

    <div style={group}>
      <p style={label}>2. Tooltip — padrão do projeto (HintMain + portal + delay)</p>
      <p style={{ fontFamily: "'Open Sans'", fontSize: 12, color: '#9E9E9E', margin: 0 }}>
        Passe o mouse sobre os elementos abaixo (delay: 750ms).
      </p>
      <div style={row}>
        <Tooltip content="Caixa de entrada">
          <IconButton aria-label="Caixa de entrada">
            <InboxIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconButton>
        </Tooltip>
        <Tooltip content="Texto com hint via Tooltip">
          <span style={{ fontFamily: "'Open Sans'", fontSize: 14, color: colors.primary.main, borderBottom: '1px dashed', cursor: 'default' }}>
            Passe o mouse aqui
          </span>
        </Tooltip>
      </div>
    </div>

    <div style={{ ...group, paddingBottom: 32 }}>
      <p style={label}>3. IconHint — ícone com badge-label persistente</p>
      <p style={{ fontFamily: "'Open Sans'", fontSize: 12, color: '#9E9E9E', margin: 0 }}>
        showHint=true exibe o badge abaixo do ícone. Controlado por estado externo.
      </p>
      <div style={row}>
        <IconButton aria-label="Sem hint">
          <IconHint><InboxIcon style={{ fontSize: 24, color: colors.surface.main }} /></IconHint>
        </IconButton>
        <IconButton aria-label="Com hint">
          <IconHint hint="Caixa de entrada" showHint>
            <InboxIcon style={{ fontSize: 24, color: colors.surface.main }} />
          </IconHint>
        </IconButton>
      </div>
    </div>
  </div>
);
EcossistemaHint.storyName = 'Ecossistema Hint / Tooltip / IconHint';
