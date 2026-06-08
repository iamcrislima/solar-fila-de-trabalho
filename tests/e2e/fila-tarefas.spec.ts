import { test, expect } from '@playwright/test';

// O app abre em Processos por padrão (useState('processos') no FilaModule).
// FilaDeProcessos é montada primeiro no DOM (index 0), FilaDeTarefas depois (index 1).
// Antes da navegação: processos = visible (index 0), tarefas = hidden (index 1).
// Após navegação para tarefas: processos = hidden (index 0), tarefas = visible (index 1).
// Por isso os seletores pós-navegação usam .nth(1) para o input de busca.

test.describe('Fila de Tarefas — E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Aguarda a fila de processos carregar (padrão inicial)
    await expect(page.getByPlaceholder('Palavra-chave').first()).toBeVisible({ timeout: 10000 });
    // Navega para tarefas via sidebar (force: true — item pode estar em seção colapsada)
    await page.getByText('Visualização padrão').nth(1).click({ force: true });
    // Confirma navegação: tab "Todas" de tarefas fica visível
    await expect(page.getByText(/^Todas \(/).first()).toBeVisible({ timeout: 5000 });
  });

  test('smoke: fila de tarefas carrega sem erros', async ({ page }) => {
    // Após navegação, tarefas é index 1 no DOM (processos ficou hidden)
    await expect(page.getByPlaceholder('Palavra-chave').nth(1)).toBeVisible();
    await expect(page).not.toHaveURL(/error/);
  });

  test('exibe as três abas de atribuição', async ({ page }) => {
    await expect(page.getByText(/^Todas \(/).first()).toBeVisible();
    await expect(page.getByText(/^Atribuídas \(/).first()).toBeVisible();
    await expect(page.getByText(/^Não atribuídas \(/).first()).toBeVisible();
  });

  test('RN-FT: busca por palavra-chave filtra os resultados', async ({ page }) => {
    // Tarefas é index 1 no DOM após navegação
    const input = page.getByPlaceholder('Palavra-chave').nth(1);
    await input.fill('xyzxyz-inexistente-99999');
    await expect(page.getByText('Nenhuma tarefa encontrada.').first()).toBeVisible();
  });

  test('RN-FT: limpar busca restaura a lista', async ({ page }) => {
    const input = page.getByPlaceholder('Palavra-chave').nth(1);
    await input.fill('xyzxyz-inexistente-99999');
    await expect(page.getByText('Nenhuma tarefa encontrada.').first()).toBeVisible();
    await input.clear();
    await expect(page.getByText('Nenhuma tarefa encontrada.')).not.toBeVisible();
  });

  test('troca de aba funciona sem erros', async ({ page }) => {
    await page.getByText(/^Atribuídas \(/).first().click();
    await expect(page.getByText(/^Atribuídas \(/).first()).toBeVisible();
    await page.getByText(/^Todas \(/).first().click();
    await expect(page.getByText(/^Todas \(/).first()).toBeVisible();
  });
});
