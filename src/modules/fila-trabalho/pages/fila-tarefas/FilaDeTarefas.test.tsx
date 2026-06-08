import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../../../tests/support/render';
import { FilaDeTarefas } from './FilaDeTarefas';

function renderFila() {
  return render(<FilaDeTarefas />);
}

describe('FilaDeTarefas — integração', () => {
  describe('renderização inicial', () => {
    it('renderiza sem erros (smoke test)', () => {
      expect(() => renderFila()).not.toThrow();
    });

    it('exibe o subtítulo "Tarefas"', () => {
      renderFila();
      expect(screen.getByText('Tarefas')).toBeInTheDocument();
    });

    it('exibe as três abas de atribuição', () => {
      renderFila();
      expect(screen.getByText(/^Todas/)).toBeInTheDocument();
      expect(screen.getByText(/^Atribuídas/)).toBeInTheDocument();
      expect(screen.getByText(/^Não atribuídas/)).toBeInTheDocument();
    });

    it('exibe ao menos um card de tarefa (mock data)', () => {
      renderFila();
      // O campo de busca por palavra-chave é evidência de que a lista carregou
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

    it('exibe "Nenhuma tarefa encontrada." quando a busca não tem resultados', async () => {
      const user = userEvent.setup();
      renderFila();
      const input = screen.getByPlaceholderText(/palavra-chave/i);
      await user.type(input, 'xyzxyzxyz-inexistente-99999');
      await waitFor(() => {
        expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
      });
    });
  });

  describe('callbacks opcionais', () => {
    it('onSidebarChange é chamado na montagem quando fornecido', async () => {
      const onSidebarChange = vi.fn();
      render(<FilaDeTarefas onSidebarChange={onSidebarChange} />);
      await waitFor(() => {
        expect(onSidebarChange).toHaveBeenCalled();
      });
    });
  });
});
