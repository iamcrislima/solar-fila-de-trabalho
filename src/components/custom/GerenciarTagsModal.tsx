import { useState } from 'react';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, ModalDialog } from '../ds/atoms/Modal';
import { Button }      from '../ds/atoms/Button/Button';
import { colors }      from '../../styles/tokens/colors';
import { typography }  from '../../styles/tokens/typography';
import { CriarTagModal } from './CriarTagModal';
import { getTagColorBorderStyle, resolveTagVisualColor } from './tagColorVisual';

// GerenciarTagsModal — Figma: mQDpB8dWZNnULO7ShaY9Fs node 2323:7320

const headerCell = {
  ...typography.styles.overline,
  fontWeight:      700,
  color:           colors.surface.main,
  backgroundColor: colors.surface.light,
  borderBottom:    `1px solid ${colors.surface.medium}`,
  padding:         '8px 12px',
  boxSizing:       'border-box' as const,
};

const dataRow = {
  display:         'flex',
  alignItems:      'center',
  minHeight:       40,
  borderBottom:    `1px solid ${colors.surface.light}`,
  backgroundColor: colors.surface.xxxl,
  boxSizing:       'border-box' as const,
};

const iconBtn = {
  background: 'none',
  border:     'none',
  cursor:     'pointer',
  padding:    0,
  display:    'flex',
  alignItems: 'center',
  color:      colors.surface.main,
};

export function GerenciarTagsModal({
  open,
  onClose,
  tags = [] as Record<string, unknown>[],
  onSaveTag,
  onDeleteTag,
  countTagUsage,
}: { open: boolean; onClose: () => void; tags?: Record<string, unknown>[]; onSaveTag?: (t: Record<string, unknown>, orig?: string) => void; onDeleteTag?: (label: string) => void; countTagUsage?: (label: string) => Record<string, number> }) {
  const [editTag,     setEditTag]     = useState<Record<string, unknown> | null>(null);
  const [deleteLabel, setDeleteLabel] = useState<string | null>(null);

  const impactedCounts = deleteLabel && countTagUsage
    ? countTagUsage(deleteLabel)
    : { processos: 0, tarefas: 0 };
  const existingLabels = tags.map(t => t.label);

  return (
    <>
      {/* Main list modal */}
      <Modal
        open={open && editTag === null}
        onClose={onClose}
        title="Gerenciar tags pessoais"
        style={{ width: 800 }}
        footer={
          <>
            <Button type="primary" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="primary" variant="filled"  onClick={onClose}>Confirmar</Button>
          </>
        }
      >
        <div style={{ width: '100%', paddingBottom: 8 }}>
          {/* Header row */}
          <div style={{ display: 'flex' }}>
            <div style={{ ...headerCell, flex: 1 }}>Tag</div>
            <div style={{ ...headerCell, width: 96, textAlign: 'right' }}>Ações</div>
          </div>
          {/* Data rows */}
          {tags.map((tag: Record<string, unknown>) => (
            <div key={(tag.label as string)} style={dataRow}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
                <div style={{
                  width:           18,
                  height:          18,
                  borderRadius:    3,
                  backgroundColor: resolveTagVisualColor((tag.color as string)),
                  boxSizing:       'border-box',
                  ...getTagColorBorderStyle((tag.color as string)),
                  flexShrink:      0,
                }} />
                <span style={{ ...typography.styles.body2, color: colors.surface.main }}>
                  {(tag.label as string)}
                </span>
              </div>
              <div style={{ width: 96, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '0 8px' }}>
                <button type="button" style={iconBtn} onClick={() => setEditTag(tag)}>
                  <EditIcon style={{ fontSize: 20 }} />
                </button>
                <button type="button" style={iconBtn} onClick={() => setDeleteLabel((tag.label as string))}>
                  <DeleteIcon style={{ fontSize: 20 }} />
                </button>
              </div>
            </div>
          ))}
          {tags.length === 0 && (
            <div style={{ padding: '16px 8px', ...typography.styles.body2, color: colors.surface.main }}>
              Nenhuma tag pessoal criada.
            </div>
          )}
        </div>
      </Modal>

      {/* Edit modal */}
      <CriarTagModal
        open={open && editTag !== null}
        onClose={() => setEditTag(null)}
        onSave={(updated) => { onSaveTag?.(updated, editTag?.label as string); setEditTag(null); }}
        existingLabels={(existingLabels ?? []) as string[]}
        initialTag={editTag}
      />

      {/* Delete confirmation modal */}
      <ModalDialog
        open={open && deleteLabel !== null}
        title="Excluir tag pessoal"
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onCancel={() => setDeleteLabel(null)}
        onConfirm={() => { onDeleteTag?.(deleteLabel as string); setDeleteLabel(null); }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <span>
            Tem certeza que deseja excluir a tag <strong>"{deleteLabel}"</strong>?
          </span>
          <span style={{ ...typography.styles.body2, color: colors.surface.main }}>
            Processos/documentos impactados: {(impactedCounts as Record<string, number>).processos ?? 0}
          </span>
          <span style={{ ...typography.styles.body2, color: colors.surface.main }}>
            Tarefas impactadas: {(impactedCounts as Record<string, number>).tarefas ?? 0}
          </span>
        </div>
      </ModalDialog>
    </>
  );
}
