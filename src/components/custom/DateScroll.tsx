import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import ChevronLeftIcon  from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { colors }     from '@/styles/tokens/colors';
import { typography } from '@/styles/tokens/typography';
import { borders }    from '@/styles/tokens/borders';

// DateScroll — barra de navegação horizontal por datas
// Referência visual: LATAM date selector
//
// Props:
//   items    — lista de datas { value, dayLabel, dateLabel }
//   selected — value da data selecionada
//   onChange — callback ao clicar em uma data
//   onPrev   — callback da seta esquerda
//   onNext   — callback da seta direita
//   style    — override do container externo

export interface DateScrollItem {
  value:      string; // identificador único (ex: '2025-06-19')
  dayLabel:   string; // ex: 'sex.'
  dateLabel:  string; // ex: '19/06'
}

interface DateScrollProps {
  items:      DateScrollItem[];
  selected?:  string;
  onChange?:  (value: string) => void;
  onPrev?:    () => void;
  onNext?:    () => void;
  style?:     CSSProperties;
}

export function DateScroll({ items, selected, onChange, onPrev, onNext, style }: DateScrollProps) {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  return (
    <div style={{
      display:         'flex',
      alignItems:      'stretch',
      backgroundColor: colors.surface.xxxl,
      border:          `1px solid ${colors.surface.light}`,
      borderRadius:    borders.radius.lg,
      overflow:        'hidden',
      height:          56,
      ...style,
    }}>

      {/* ── Seta esquerda ── */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Período anterior"
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           44,
          border:          'none',
          borderRight:     `1px solid ${colors.surface.light}`,
          background:      'transparent',
          cursor:          onPrev ? 'pointer' : 'default',
          flexShrink:      0,
          color:           colors.secondary.main,
          transition:      'background-color 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.secondary.xl; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
      >
        <ChevronLeftIcon style={{ fontSize: 20 }} />
      </button>

      {/* ── Células de data ── */}
      {items.map((item, index) => {
        const isSelected = item.value === selected;
        const isHovered  = hoveredValue === item.value && !isSelected;
        const showDividerBefore =
          index > 0 &&
          items[index - 1].value !== selected &&
          !isSelected;

        return (
          <React.Fragment key={item.value}>
            {showDividerBefore && (
              <div style={{
                width:           1,
                alignSelf:       'center',
                height:          24,
                backgroundColor: colors.surface.light,
                flexShrink:      0,
              }} />
            )}

            <button
              type="button"
              onClick={() => onChange?.(item.value)}
              onMouseEnter={() => setHoveredValue(item.value)}
              onMouseLeave={() => setHoveredValue(null)}
              aria-pressed={isSelected}
              style={{
                display:         'flex',
                flexDirection:   'column',
                alignItems:      'center',
                justifyContent:  'center',
                flex:            1,
                border:          isSelected ? `2px solid ${colors.primary.dark}` : 'none',
                borderRadius:    isSelected ? borders.radius.md : 0,
                backgroundColor: isSelected
                  ? colors.primary.main
                  : isHovered
                    ? colors.secondary.xl
                    : 'transparent',
                cursor:          'pointer',
                padding:         isSelected ? '0 12px' : '0 8px',
                gap:             2,
                margin:          isSelected ? '4px 2px' : 0,
                boxSizing:       'border-box',
                transition:      'background-color 0.12s',
                minWidth:        0,
              }}
            >
              <span style={{
                ...typography.styles.caption,
                color:      isSelected ? 'rgba(255,255,255,0.85)' : colors.secondary.main,
                lineHeight: '16px',
                whiteSpace: 'nowrap',
              }}>
                {item.dayLabel}
              </span>
              <span style={{
                ...typography.styles.subtitle2,
                color:      isSelected ? colors.surface.xxxl : colors.secondary.dark,
                whiteSpace: 'nowrap',
              }}>
                {item.dateLabel}
              </span>
            </button>
          </React.Fragment>
        );
      })}

      {/* ── Seta direita ── */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Próximo período"
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           44,
          border:          'none',
          borderLeft:      `1px solid ${colors.surface.light}`,
          background:      'transparent',
          cursor:          onNext ? 'pointer' : 'default',
          flexShrink:      0,
          color:           colors.secondary.main,
          transition:      'background-color 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.secondary.xl; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
      >
        <ChevronRightIcon style={{ fontSize: 20 }} />
      </button>

    </div>
  );
}
