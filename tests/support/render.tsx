import { render, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TarefasProvider } from '@/application/providers/TarefasProvider';
import { CategoriasProvider } from '@/application/providers/CategoriasProvider';
import { FavoritesProvider } from '@/application/providers/FavoritesProvider';
import { CustomViewsProvider } from '@/modules/fila-trabalho/providers/CustomViewsProvider';

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      <CategoriasProvider>
        <TarefasProvider>
          <CustomViewsProvider>
            {children}
          </CustomViewsProvider>
        </TarefasProvider>
      </CategoriasProvider>
    </FavoritesProvider>
  );
}

function renderWithProviders(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { renderWithProviders as render };
