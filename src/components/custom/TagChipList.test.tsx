import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TagChipList } from './TagChipList';

const manyChips = [
  { label: 'Aguardando análise', color: 'support', iconKey: 'groups' },
  { label: 'Urgente', color: 'error', iconKey: 'person' },
  { label: 'Prioridade do órgão', color: 'primary', iconKey: 'account_balance' },
  { label: 'Assinatura(s) pendente(s)', color: 'warning' },
  { label: 'Assinatura(s) realizada(s)', color: 'success' },
  { label: 'Tag número 3', color: 'surface', iconKey: 'person' },
  { label: 'Tag número 4', color: 'support', iconKey: 'person' },
  { label: 'Tag número 5', color: 'error', iconKey: 'person' },
  { label: 'Tag adicional 1', color: 'warning', iconKey: 'person' },
  { label: 'Tag adicional 2', color: 'success', iconKey: 'person' },
];

let clientWidth = 800;
let scrollWidth = 200;

beforeEach(() => {
  clientWidth = 800;
  scrollWidth = 200;

  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
    }
  );

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return clientWidth;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() {
      return scrollWidth;
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TagChipList', () => {
  it('RN-CT-09: exibe tags completas quando cabem em uma linha', () => {
    render(<TagChipList chips={manyChips.slice(0, 3)} />);

    expect(screen.getAllByText('Aguardando análise').length).toBeGreaterThan(0);
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('RN-CT-09: alterna para modo compacto sem +N quando todos os ícones compactos cabem', async () => {
    clientWidth = 240;
    scrollWidth = 900;

    render(<TagChipList chips={manyChips} />);

    await waitFor(() => {
      expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
    });
  });

  it('RN-CT-09: exibe +N apenas quando os ícones compactos também ultrapassam a largura', async () => {
    clientWidth = 160;
    scrollWidth = 900;

    render(<TagChipList chips={manyChips} />);

    await waitFor(() => {
      expect(screen.getByText('+4')).toBeInTheDocument();
    });
    expect(screen.getByLabelText('4 tags adicionais')).toBeInTheDocument();
  });

  it('RN-CT-09: abre lista com tags excedentes quando +N usa popover', async () => {
    clientWidth = 160;
    scrollWidth = 900;

    render(<TagChipList chips={manyChips} overflowDisclosure="popover" />);

    const moreChip = await screen.findByText('+4');
    fireEvent.click(moreChip);

    const menu = screen.getByRole('menu');
    expect(within(menu).getByText('Tag adicional 1')).toBeInTheDocument();
    expect(within(menu).getByText('Tag adicional 2')).toBeInTheDocument();

    fireEvent.mouseEnter(within(menu).getAllByLabelText('Tag pessoal')[0]);
    expect(await screen.findByText('Tag pessoal')).toBeInTheDocument();
  });
});
