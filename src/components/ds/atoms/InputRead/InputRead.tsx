import { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { colors }     from '../../../../styles/tokens/colors';
import { typography } from '../../../../styles/tokens/typography';
import { HintMain }   from '../Hint';
import { TruncatedText } from '../TruncatedText';

// ─── InputRead ────────────────────────────────────────────────────────────────

/**
 * Campo de exibição somente leitura — label bold + valor abaixo, sem borda.
 * Tooltip (HintMain) aparece somente quando o valor está truncado; delay de 1s.
 * Renderizado via portal em document.body para não ser cortado por overflow:hidden.
 *
 * @param {string}              props.label            — texto do label
 * @param {string}              props.value            — conteúdo exibido
 * @param {string}              props.labelFontSize    — sobrescreve fontSize do label
 * @param {number}              props.labelFontWeight  — sobrescreve fontWeight do label
 * @param {string}              props.valueFontSize    — sobrescreve fontSize do valor
 * @param {number}              props.valueFontWeight  — sobrescreve fontWeight do valor
 * @param {React.CSSProperties} props.style            — container externo
 */
export function InputRead({
  label = 'Label',
  value = '',
  labelFontSize,
  labelFontWeight,
  valueFontSize,
  valueFontWeight,
  style,
}: { label?: string; value?: string; labelFontSize?: string | number; labelFontWeight?: string | number; valueFontSize?: string | number; valueFontWeight?: string | number; style?: React.CSSProperties }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hintPos, setHintPos] = useState<{ top: number; left: number } | null>(null);

  const handleMouseEnter = useCallback(() => {
    const el = valueRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    timerRef.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setHintPos({ top: rect.bottom, left: rect.left });
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHintPos(null);
  }, []);

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-start',
      overflow:      'hidden',
      ...style,
    }}>
      <TruncatedText text={`${label}:`} style={{
        ...typography.styles.body2,
        fontWeight:   labelFontWeight ?? typography.fontWeight.semibold,
        fontSize:     labelFontSize   ?? '14px',
        color:        colors.surface.dark,
        height:       19,
        maxWidth:     '100%',
      }}>
        {label}:
      </TruncatedText>

      <div style={{
        height:         24,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'flex-start',
        paddingBottom:  2,
        boxSizing:      'border-box',
        maxWidth:       '100%',
        overflow:       'hidden',
      }}>
        <span
          ref={valueRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            ...typography.styles.caption,
            fontSize:     valueFontSize   ?? '14px',
            fontWeight:   valueFontWeight ?? 400,
            color:        colors.surface.main,
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            maxWidth:     '100%',
            display:      'block',
          }}
        >
          {value || ' '}
        </span>
      </div>

      {hintPos && value && ReactDOM.createPortal(
        <div style={{
          position:      'fixed',
          top:           hintPos.top + 4,
          left:          hintPos.left,
          zIndex:        10000,
          pointerEvents: 'none',
          whiteSpace:    'nowrap',
        }}>
          <HintMain>{value}</HintMain>
        </div>,
        document.body
      )}
    </div>
  );
}
