import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';

let username: string
let password: string
let token: string

const apiURL = process.env.API_BASEURL;

test.describe('Login', () => {
  test.beforeAll('Criando usuário', async ({ request }) => {

    if (!apiURL) {
      throw new Error('A variável API_BASEURL não foi configurada');
    }

    username = `user_${Date.now()}_${randomUUID().slice(0, 8)}`;
    password = 'E2eTest!123';

    const registerResponse = await request.post(`${apiURL}/register`, {
      data: {
        username,
        password,
      },
    });

    const registerBody = await registerResponse.json();
    token = registerBody.token;

    expect(registerResponse.status()).toBe(201);

  })

  test.beforeEach('Acessando o "Habit Tracker"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole("button", { name: "login" }).click()
  });

  test('Efetuando login com usuário válido', async ({ page }) => {
    const usernameInput = page.getByRole("textbox", { name: "type your username" })
    await usernameInput.fill(username)

    const passwordInput = page.getByRole("textbox", { name: "type your password" })
    await passwordInput.fill(password)

    const modal = page.getByRole("dialog")
    await modal.getByRole("button", { name: "login" }).click()

    const toast = page.getByRole("status").filter({ hasText: 'login with success' });
    await expect(toast).toBeVisible();

    await expect(page.getByText(`hi, ${username}!`)).toBeVisible();

  });

  test.afterAll("Exclusão de usuário", async ({ request }) => {
    await request.delete(`${apiURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  })
});