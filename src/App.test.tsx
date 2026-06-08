import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';

import App from './App';

describe('App navigation', () => {
  it('mantem o conteudo atual ao trocar apenas o modulo ativo', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      (await screen.findAllByText('Processos/Documentos', {}, { timeout: 10000 })).length
    ).toBeGreaterThan(0);

    await user.click(screen.getByText('ORG'));

    expect(screen.getByText('Cadastro de níveis')).toBeInTheDocument();
    expect(screen.getAllByText('Processos/Documentos').length).toBeGreaterThan(0);
  }, 15000);

  it('troca o sidebar ao alternar entre modulos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findAllByText('Processos/Documentos', {}, { timeout: 5000 });

    await user.click(screen.getByText('ORG'));
    expect(screen.getByText('Cadastro de níveis')).toBeInTheDocument();

    await user.click(screen.getByText('FILA'));

    await waitFor(
      () => {
        expect(screen.getAllByText('Processos/Documentos').length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
    expect(screen.queryByText('Cadastro de níveis')).not.toBeInTheDocument();
  });

  it('abre a Fila de Trabalho diretamente ao selecionar o modulo FILA', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findAllByText('Processos/Documentos', {}, { timeout: 5000 });
    await user.click(screen.getByText('ORG'));
    await user.click(screen.getByText('Cadastro de níveis'));

    await user.click(screen.getByText('FILA'));

    await waitFor(
      () => {
        expect(screen.getAllByText('Processos/Documentos').length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
    expect(screen.queryByText('Cadastro de níveis')).not.toBeInTheDocument();
  });
});
