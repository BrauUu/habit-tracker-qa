import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { test as setup, expect } from '@playwright/test';

const authFile = path.resolve('playwright/.auth/user.json');
const apiURL = process.env.API_BASEURL;

setup('criar usuário e salvar autenticação', async ({ request, page }) => {
  if (!apiURL) {
    throw new Error('A variável API_BASEURL não foi configurada');
  }

  const username = `user_${Date.now()}_${randomUUID().slice(0, 8)}`;
  const password = 'E2eTest!123';

  const response = await request.post(`${apiURL}/register`, {
    data: { username, password },
  });

  expect(response.status()).toBe(201);

  //TODO: Login via API
  await page.goto('/');
  await page.getByRole('button', { name: 'login' }).click();

  await page
    .getByRole('textbox', { name: 'type your username' })
    .fill(username);

  await page
    .getByRole('textbox', { name: 'type your password' })
    .fill(password);

  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'login' })
    .click();

  await expect(page.getByText(`hi, ${username}!`)).toBeVisible();

  await page.context().storageState({ path: authFile });
});