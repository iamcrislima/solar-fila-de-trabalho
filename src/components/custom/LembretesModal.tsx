import type { CSSProperties } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import { Modal }      from '../ds/atoms/Modal';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';

interface LembretesModalProps {
  open: boolean;
  onClose: () => void;
  titulo?: string;
  lembretes?: string[];
  style?: CSSProperties;
}

export function LembretesModal({ open, onClose, titulo = 'Lembretes', lembretes = [] }: LembretesModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={titulo} style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 8 }}>
        {lembretes.length === 0
          ? <span style={{ ...typography.styles.body2, color: colors.surface.main }}>Nenhum lembrete cadastrado.</span>
          : lembretes.map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WarningIcon style={{ fontSize: 24, color: colors.warning.main, flexShrink: 0 }} />
              <span style={{ ...typography.styles.body2, color: colors.surface.main }}>{text}</span>
            </div>
          ))
        }
      </div>
    </Modal>
  );
}
