import { useState, useEffect, useRef } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Modal }        from '../ds/atoms/Modal';
import { Button }       from '../ds/atoms/Button/Button';
import { colors }       from '../../styles/tokens/colors';
import { typography }   from '../../styles/tokens/typography';
import { spacing }      from '../../styles/tokens/spacing';
import { borders }      from '../../styles/tokens/borders';
import { shadows }      from '../../styles/tokens/shadows';
import {
  USER_DEFINED_NAME_MAX_LENGTH,
  getUserDefinedNameValidationCode,
  normalizeUserDefinedName,
} from '@/shared/utils/userDefinedName';
import { getTagColorBorderStyle } from './tagColorVisual';

// CriarTagModal / EditarTagModal — Figma: mQDpB8dWZNnULO7ShaY9Fs nodes 2323:7290 / 2323:7344

// Converte chave de token legada para hex — compatibilidade com tags criadas antes do color picker.
function tokenToHex(colorKey: string): string {
  if (colorKey.startsWith('#')) return colorKey;
  const map: Record<string, string> = {
    support: colors.support.main,
    error:   colors.error.main,
    warning: colors.warning.main,
    success: colors.success.main,
    surface: colors.surface.main,
    primary: colors.primary.main,
  };
  return map[colorKey] ?? colors.support.main;
}

// ─── TagColorPicker ───────────────────────────────────────────────────────────
// Figma: swatch 18×18 + seta chevron dentro de botão com fundo xl e sombra level1.
// Click abre o color picker nativo do HTML5.

interface TagColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function TagColorPicker({ label, value, onChange }: TagColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{
        ...typography.styles.body2,
        color:      colors.surface.dark,
        height:     23,
        display:    'flex',
        alignItems: 'center',
      }}>
        {label}
      </span>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display:         'flex',
            alignItems:      'center',
            gap:             spacing.xs,
            backgroundColor: colors.surface.xl,
            boxShadow:       shadows.level1,
            padding:         spacing.xs,
            borderRadius:    borders.radius.md,
            border:          'none',
            cursor:          'pointer',
            height:          42,
            boxSizing:       'border-box',
          }}
        >
          <div style={{
            width:           18,
            height:          18,
            borderRadius:    borders.radius.md,
            backgroundColor: value,
            boxSizing:       'border-box',
            ...getTagColorBorderStyle(value),
            boxShadow:       shadows.level1,
            flexShrink:      0,
          }} />
          <ArrowDropDownIcon style={{ fontSize: 24, color: colors.surface.main }} />
        </button>

        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            position: 'absolute',
            top:      0,
            left:     0,
            width:    0,
            height:   0,
            padding:  0,
            border:   0,
            opacity:  0,
          }}
        />
      </div>
    </div>
  );
}

// ─── CriarTagModal ────────────────────────────────────────────────────────────

export function CriarTagModal({
  open,
  onClose,
  onSave,
  existingLabels = [],
  initialTag = null,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (tag: Record<string, unknown>) => void;
  existingLabels?: string[];
  initialTag?: Record<string, unknown> | null;
}) {
  const isEdit = !!initialTag;

  const [name,        setName]        = useState('');
  const [borderColor, setBorderColor] = useState(colors.support.main);
  const [fontColor,   setFontColor]   = useState('#FFFFFF');
  const [touched,     setTouched]     = useState(false);

  useEffect(() => {
    if (open) {
      setName((initialTag?.label as string) ?? '');
      setBorderColor(tokenToHex((initialTag?.color as string) ?? colors.support.main));
      setFontColor((initialTag?.fontColor as string) ?? '#FFFFFF');
      setTouched(false);
    }
  }, [open, initialTag]);

  const normalizedName     = normalizeUserDefinedName(name);
  const nameValidationCode = getUserDefinedNameValidationCode(normalizedName);
  const initialLabel       = normalizeUserDefinedName((initialTag?.label as string) ?? '').toLowerCase();
  const otherLabels        = existingLabels.filter(
    l => !isEdit || normalizeUserDefinedName(l).toLowerCase() !== initialLabel
  );
  const nameDuplicate = otherLabels.some(
    (l: string) => normalizeUserDefinedName(l).toLowerCase() === normalizedName.toLowerCase()
  );
  const hasError = touched && (nameValidationCode !== null || nameDuplicate);
  const errorMsg =
    nameValidationCode === 'required'
      ? 'Campo obrigatório.'
      : nameValidationCode === 'maxLength'
        ? `O nome deve ter no máximo ${USER_DEFINED_NAME_MAX_LENGTH} caracteres.`
        : nameValidationCode === 'invalidCharacters'
          ? 'Use apenas letras, números e espaços.'
          : 'Já existe uma tag com esse nome.';

  const handleSave = () => {
    setTouched(true);
    if (nameValidationCode !== null || nameDuplicate) return;
    onSave({ label: normalizedName, color: borderColor, fontColor, iconKey: 'person' });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar tag pessoal' : 'Criar tag pessoal'}
      style={{ width: 400 }}
      footer={
        <>
          <Button type="primary" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="primary" variant="filled"  onClick={handleSave}>Salvar</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, paddingBottom: spacing.xs }}>

        {/* Nome da tag */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            ...typography.styles.body2,
            color:      colors.surface.dark,
            height:     23,
            display:    'flex',
            alignItems: 'center',
          }}>
            Nome da tag*:
          </span>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            maxLength={USER_DEFINED_NAME_MAX_LENGTH}
            style={{
              ...typography.styles.body2,
              color:        colors.surface.dark,
              border:       `1px solid ${hasError ? colors.error.main : colors.surface.medium}`,
              borderRadius: borders.radius.md,
              padding:      `${spacing.xs} ${spacing['bt-3']} ${spacing['bt-2']}`,
              outline:      'none',
              background:   colors.surface.xxxl,
              width:        '100%',
              boxSizing:    'border-box',
            }}
          />
          {hasError && (
            <span style={{ ...typography.styles.caption, color: colors.error.main, marginTop: spacing.xxs }}>
              {errorMsg}
            </span>
          )}
        </div>

        {/* Seletores de cor */}
        <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <TagColorPicker label="Cor da borda:" value={borderColor} onChange={setBorderColor} />
          <TagColorPicker label="Cor da fonte:" value={fontColor}   onChange={setFontColor}   />
        </div>

      </div>
    </Modal>
  );
}
