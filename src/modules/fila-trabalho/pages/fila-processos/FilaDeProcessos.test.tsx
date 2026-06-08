import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../../tests/support/render';
import { FilaDeProcessos } from './FilaDeProcessos';

function renderFila() {
  return render(<FilaDeProcessos />);
}

describe('FilaDeProcessos — integração', () => {
  describe('renderização inicial', () => {
    it('renderiza sem erros (smoke test)', () => {
      expect(() => renderFila()).not.toThrow();
    });

    it('exibe o subtítulo "Processos/Documentos"', () => {
      renderFila();
      expect(screen.getByText('Processos/Documentos')).toBeInTheDocument();
    });

    it('exibe as três abas de situação', () => {
      renderFila();
      expect(screen.getByText(/^Todos/)).toBeInTheDocument();
      expect(screen.getByText(/^Recebidos/)).toBeInTheDocument();
      expect(screen.getByText(/^Não recebidos/)).toBeInTheDocument();
    });

    it('exibe o campo de busca por palavra-chave', () => {
      renderFila();
      expect(screen.getByPlaceholderText(/palavra-chave/i)).toBeInTheDocument();
    });
  });

  describe('busca por palavra-chave', () => {
    it('campo de busca aceita texto', async () => {
      const user = userEvent.setup();
      renderFila();
      const input = screen.getByPlaceholderText(/palavra-chave/i);
      await user.type(input, 'teste');
      expect((input as HTMLInputElement).value).toBe('teste');
    });

    it('exibe "Nenhum processo/documento encontrado." quando a busca não tem resultados', async () => {
      const user = userEvent.setup();
      renderFila();
      const input = screen.getByPlaceholderText(/palavra-chave/i);
      await user.type(input, 'xyzxyzxyz-inexistente-99999');
      await waitFor(() => {
        expect(screen.getByText('Nenhum processo/documento encontrado.')).toBeInTheDocument();
      });
    });
  });

  describe('callbacks opcionais', () => {
    it('onSidebarChange é chamado na montagem quando fornecido', async () => {
      const onSidebarChange = vi.fn();
      render(<FilaDeProcessos onSidebarChange={onSidebarChange} />);
      await waitFor(() => {
        expect(onSidebarChange).toHaveBeenCalled();
      });
    });
  });
});
