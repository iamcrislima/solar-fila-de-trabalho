import type { CSSProperties } from 'react';
import DownloadIcon   from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ButtonHint } from './ButtonHint';

export default {
  title: '03-Custom/WorkQueue/ButtonHint',
  parameters: { layout: 'padded' },
};

const page: CSSProperties = { padding: 32, backgroundColor: '#E0E0E0', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 32 };
const label: CSSProperties = { fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: '#616161', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' };
const card  = { backgroundColor: '#FFFFFF', padding: '24px 16px 48px', borderRadius: 4 };

export const ButtonHintStory = () => (
  <div style={page}>
    <div style={card}>
      <p style={label}>ButtonHint — passe o mouse para ver o hint + estado ativo</p>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <ButtonHint hint="Imprimir" onClick={() => alert('print')} />
        <ButtonHint icon={<DownloadIcon />} hint="Exportar" onClick={() => alert('download')} />
        <ButtonHint icon={<FilterListIcon />} hint="Filtrar resultados" onClick={() => alert('filter')} />
      </div>
    </div>
    <div style={card}>
      <p style={label}>ButtonHint — hint longo</p>
      <ButtonHint hint="Gerar relatório completo em PDF" onClick={() => alert('print')} />
    </div>
  </div>
);
ButtonHintStory.storyName = 'ButtonHint';
