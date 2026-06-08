import { useState } from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { colors }  from '@/styles/tokens/colors';
import { borders } from '@/styles/tokens/borders';

// IconButton — Figma: HMN6YiGdi3p6ZW0khUxzyW node 3703-6669
// Botão circular genérico com hover. Passe o ícone como children.
// Para tooltip, envolva com <Tooltip content="...">.
//
// Convenção de tamanho:
//   - Ícones MUI com fontSize={24} já respeitam a área de 24×24 — use direto.
//   - SVGs customizados (não 24×24 nativamente) devem ser envolvidos com <IconBox>
//     para garantir a área padronizada: <IconButton><IconBox><Svg /></IconBox></IconButton>
//   - Resultado: ícone 24×24 + padding 4px = botão 32×32.

interface IconButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  'aria-label'?: string;
  style?: CSSProperties;
}

export function IconButton({
  children,
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  style,
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         4,
        border:          'none',
        borderRadius:    borders.radius.circular,
        backgroundColor: hovered ? colors.surface.light : 'transparent',
        cursor:          disabled ? 'default' : 'pointer',
        opacity:         disabled ? 0.4 : 1,
        transition:      'background-color 0.12s ease',
        flexShrink:      0,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Container 24×24 para SVGs customizados dentro de IconButton.
// Centraliza o ícone e garante que o botão resulte em 32×32 (24 + 4px padding cada lado).
export function IconBox({ children }: { children: ReactNode }) {
  return (
    <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
}
