import { useState, useEffect } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { colors }     from '../../styles/tokens/colors';
import { typography } from '../../styles/tokens/typography';
import { borders }    from '../../styles/tokens/borders';

interface SimplePaginationProps {
  page:         number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  style?:       CSSProperties;
}

export function SimplePagination({ page, totalPages, onPageChange, style }: SimplePaginationProps) {
  const [inputValue, setInputValue] = useState(String(page));

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const goTo = (p: number) => {
    const clamped = Math.max(1, Math.min(p, Math.max(1, totalPages)));
    onPageChange(clamped);
  };

  const commit = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) goTo(num);
    else setInputValue(String(page));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter')  { commit(); (e.target as HTMLInputElement).blur(); }
    if (e.key === 'Escape') { setInputValue(String(page)); (e.target as HTMLInputElement).blur(); }
  };

  const txt: CSSProperties = { ...typography.styles.caption, color: colors.secondary.main };

  const NavBtn = ({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background:  'none',
        border:      'none',
        padding:     '0 4px',
        cursor:      disabled ? 'default' : 'pointer',
        opacity:     disabled ? 0.4 : 1,
        fontFamily:  'inherit',
        ...txt,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             8,
      padding:         '10px 20px',
      backgroundColor: colors.surface.xxxl,
      borderRadius:    borders.radius.lg,
      border:          `1px solid ${colors.surface.light}`,
      ...style,
    }}>
      <NavBtn label="Anterior" onClick={() => goTo(page - 1)} disabled={page <= 1} />

      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={e => setInputValue(e.target.value.replace(/\D/g, ''))}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        style={{
          width:       36,
          height:      28,
          textAlign:   'center',
          border:      `1px solid ${colors.surface.medium}`,
          borderRadius: borders.radius.md,
          boxSizing:   'border-box',
          outline:     'none',
          fontFamily:  'inherit',
          ...txt,
        }}
      />

      <span style={txt}>de</span>
      <span style={txt}>{Math.max(1, totalPages)}</span>

      <NavBtn label="Próxima" onClick={() => goTo(page + 1)} disabled={page >= totalPages} />
    </div>
  );
}
