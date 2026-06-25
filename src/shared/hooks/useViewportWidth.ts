import { useEffect, useState } from 'react';

/**
 * Retorna a largura atual da janela em pixels e atualiza ao redimensionar.
 * SSR-safe: retorna 1440 quando `window` não existe.
 */
export function useViewportWidth(): number {
  const getWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth);
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
