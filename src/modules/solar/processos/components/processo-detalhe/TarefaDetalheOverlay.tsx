import type { ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../../../../styles/tokens/colors';
import { layout } from '../../../../../styles/tokens/layout';
import { Overlay } from '../../../../../components/ds/atoms/Overlay';
import { TarefaDetalhePanel } from '@/modules/fila-trabalho/components/TarefaDetalhePanel';

interface TarefaDetalheOverlayProps { tarefa?: Record<string, unknown>; chips?: unknown[]; onClose?: () => void; actionLabels?: Record<string, string>; actionStates?: Record<string, unknown>; categoriasAction?: ReactNode; }
export function TarefaDetalheOverlay({
  tarefa,
  chips,
  onClose,
  actionLabels,
  actionStates,
  categoriasAction,
}: TarefaDetalheOverlayProps) {
  if (!tarefa) return null;

  return (
    <Overlay
      open={!!tarefa}
      onClose={onClose}
      zIndex={1500}
      backdropColor="rgba(0,0,0,0.5)"
      style={{ padding: layout.pagePadding }}
      contentStyle={{ flex: 1 }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        maxHeight: '100%',
        borderRadius: layout.radius,
        background: 'transparent',
        overflow: 'visible',
      }}>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 3,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CloseIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </button>
        <TarefaDetalhePanel
          tarefa={tarefa}
          chips={chips}
          actionLabels={actionLabels}
          actionStates={actionStates}
          categoriasAction={categoriasAction}
          onClose={onClose}
          showBackButton={false}
        />
      </div>
    </Overlay>
  );
}

