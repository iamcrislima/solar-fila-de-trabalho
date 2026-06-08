import { test, expect } from '@playwright/test';

// O app monta Fila de Tarefas e Fila de Processos simultaneamente no DOM
// (arquitetura display:none). Por isso todos os locators usam .first()
// para evitar strict mode violation do Playwright.

test.describe('Fila de Processos — E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByPlaceholder('Palavra-chave').first()).toBeVisible({ timeout: 10000 });
  });

  test('smoke: fila de processos carrega corretamente', async ({ page }) => {
    await expect(page.getByText('Processos/Documentos').first()).toBeVisible();
    await expect(page.getByPlaceholder('Palavra-chave').first()).toBeVisible();
  });

  test('exibe as três abas de situação', async ({ page }) => {
    await expect(page.getByText(/^Todos \(/).first()).toBeVisible();
    await expect(page.getByText(/^Recebidos \(/).first()).toBeVisible();
    await expect(page.getByText(/^Não recebidos \(/).first()).toBeVisible();
  });

  test('RN-FP: busca por palavra-chave filtra os resultados', async ({ page }) => {
    const input = page.getByPlaceholder('Palavra-chave').first();
    await input.fill('xyzxyz-inexistente-99999');
    await expect(page.getByText('Nenhum processo/documento encontrado.').first()).toBeVisible();
  });

  test('RN-FP: limpar busca restaura a lista', async ({ page }) => {
    const input = page.getByPlaceholder('Palavra-chave').first();
    await input.fill('xyzxyz-inexistente-99999');
    await expect(page.getByText('Nenhum processo/documento encontrado.').first()).toBeVisible();
    await input.clear();
    await expect(page.getByText('Nenhum processo/documento encontrado.')).not.toBeVisible();
  });

  test('troca de aba funciona sem erros', async ({ page }) => {
    await page.getByText(/^Recebidos \(/).first().click();
    await expect(page.getByText(/^Recebidos \(/).first()).toBeVisible();
    await page.getByText(/^Todos \(/).first().click();
    await expect(page.getByText(/^Todos \(/).first()).toBeVisible();
  });
});
