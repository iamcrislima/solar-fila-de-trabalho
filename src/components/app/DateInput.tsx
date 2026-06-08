import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker }  from '../ds/atoms/DatePicker';
import { HintMain }    from '../ds/atoms/Hint/Hint';
import { colors }      from '../../styles/tokens/colors';
import { typography }  from '../../styles/tokens/typography';
import {
  applyMask,
  normalizeDateOnBlur,
  parseDateBR,
  formatDateBR,
  isValidDateBR,
  getDateErrorBR,
} from '../../domain/filtros/dateRange';


/**
 * Campo de data único (não range) com máscara dd/mm/aaaa,
 * ícone de calendário clicável e validação real de datas.
 *
 * Validação ocorre no blur: qualquer valor não-vazio que não seja
 * uma data completa e válida exibe mensagem de erro abaixo do campo,
 * em fluxo normal — empurra toda a linha uniformemente.
 *
 * Props:
 *   label?        — rótulo acima do campo
 *   value         — string no formato dd/mm/aaaa (ou '' / null)
 *   onChange      — (value: string | null) => void
 *   invalid?      — força estado de erro externamente
 *   errorMessage? — sobrescreve a mensagem automática de erro
 *   disabled?
 *   disablePast?  — no DatePicker, dias passados ficam desabilitados
 *   disableFuture?
 *   style?        — estilos do container externo
 */
interface DateInputProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  invalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  disablePast?: boolean;
  disableFuture?: boolean;
  style?: CSSProperties;
}

export function DateInput({
  label,
  value,
  onChange,
  onBlur: onBlurProp,
  invalid       = false,
  errorMessage,
  disabled      = false,
  disablePast   = false,
  disableFuture = false,
  style,
}: DateInputProps) {
  const [open,        setOpen]       = useState(false);
  const [pickerPos,   setPickerPos]  = useState({ top: 0, left: 0 });
  const [pickerYear,  setPickerYear] = useState(() => new Date().getFullYear());
  const [pickerMonth, setPickerMonth]= useState(() => new Date().getMonth());
  const [touched,     setTouched]    = useState(false);
  const [hovered,     setHovered]    = useState(false);
  const [tooltipPos,  setTooltipPos] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect();
      setTooltipPos({ top: rect.bottom + 4, left: rect.left });
    }
    setHovered(true);
  };

  const fieldRef  = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const val = value ?? '';

  // Após blur e normalização, o valor será sempre 10 chars (dd/mm/aaaa).
  // Considera completa e válida se tem 10 chars e passa na validação de calendário.
  const isDateComplete = val.length === 10 && isValidDateBR(val);

  // Erro após blur: qualquer valor não-vazio que não seja uma data completa e válida.
  const showError = invalid || (touched && val.length > 0 && !isDateComplete);

  // Mensagem: usa prop externa (ex: "Deve ser >= hoje") ou gera mensagem contextual automática.
  const displayError = errorMessage
    ?? getDateErrorBR(val)
    ?? 'Data inválida.';

  const openPicker = () => {
    if (disabled) return;
    if (open) { setOpen(false); return; }
    const rect = fieldRef.current?.getBoundingClientRect();
    if (rect) {
      const parsed = parseDateBR(val);
      setPickerYear(parsed?.year   ?? new Date().getFullYear());
      setPickerMonth(parsed?.month ?? new Date().getMonth());
      setPickerPos({ top: rect.bottom + 4, left: rect.left });
    }
    setOpen(true);
  };

  useLayoutEffect(() => {
    if (!open || !pickerRef.current) return;
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ph = pickerRef.current.offsetHeight;
    const pw = pickerRef.current.offsetWidth;
    const top  = window.innerHeight - rect.bottom - 4 >= ph
      ? rect.bottom + 4
      : Math.max(4, rect.top - ph - 4);
    const left = Math.min(rect.left, window.innerWidth - pw - 8);
    setPickerPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (pickerRef.current?.contains(e.target as Node)) return;
      if (fieldRef.current?.contains(e.target as Node))  return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const prevMonth = () => {
    if (pickerMonth === 0) { setPickerMonth(11); setPickerYear(y => y - 1); }
    else setPickerMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (pickerMonth === 11) { setPickerMonth(0); setPickerYear(y => y + 1); }
    else setPickerMonth(m => m + 1);
  };

  const handleDayClick = (day: number) => {
    onChange?.(formatDateBR(pickerYear, pickerMonth, day));
    setOpen(false);
    setTouched(true);
  };

  const selectedDay = (() => {
    const parsed = parseDateBR(val);
    return parsed?.year === pickerYear && parsed?.month === pickerMonth ? parsed.day : null;
  })();

  const borderColor = showError
    ? colors.error.main
    : open ? colors.primary.main : colors.surface.medium;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}
    >
      {label && (
        <span style={{ ...typography.styles.body2, color: showError ? colors.error.main : colors.surface.dark }}>
          {label}
        </span>
      )}

      {/* Campo de input */}
      <div
        ref={fieldRef}
        style={{
          display:         'flex',
          alignItems:      'center',
          border:          `1px solid ${borderColor}`,
          borderRadius:    4,
          padding:         '0 8px',
          height:          40,
          gap:             4,
          backgroundColor: disabled ? colors.surface.xl : colors.surface.xxxl,
          boxSizing:       'border-box',
        }}
      >
        <input
          value={val}
          onChange={e => {
            const masked = applyMask(e.target.value);
            onChange?.(masked || null);
          }}
          onBlur={() => {
            // Normaliza qualquer entrada ao sair do campo (1-8 dígitos → dd/mm/aaaa)
            if (val.length > 0) {
              const normalized = normalizeDateOnBlur(val);
              if (normalized !== val) onChange?.(normalized);
            }
            setTouched(true);
            onBlurProp?.();
          }}
          placeholder="dd/mm/aaaa"
          disabled={disabled}
          maxLength={10}
          style={{
            border:     'none',
            outline:    'none',
            ...typography.styles.body2,
            color:      disabled ? colors.surface.medium : colors.surface.dark,
            flex:       1,
            background: 'transparent',
            minWidth:   0,
          }}
        />
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          style={{
            background: 'none',
            border:     'none',
            cursor:     disabled ? 'default' : 'pointer',
            padding:    0,
            display:    'flex',
            color:      showError ? colors.error.main : colors.surface.main,
            flexShrink: 0,
          }}
        >
          <CalendarTodayIcon style={{ fontSize: 18 }} />
        </button>
      </div>

      {showError && hovered && createPortal(
        <div style={{ position: 'fixed', top: tooltipPos.top, left: tooltipPos.left, zIndex: 10000, pointerEvents: 'none' }}>
          <HintMain style={{ backgroundColor: colors.error.main, whiteSpace: 'nowrap', maxWidth: 'none' }}>
            {displayError}
          </HintMain>
        </div>,
        document.body
      )}

      {open && createPortal(
        <div
          ref={pickerRef}
          style={{ position: 'fixed', top: pickerPos.top, left: pickerPos.left, zIndex: 9999 }}
        >
          <DatePicker
            compact
            variant="default"
            year={pickerYear}
            month={pickerMonth}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            disablePast={disablePast}
            disableFuture={disableFuture}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
