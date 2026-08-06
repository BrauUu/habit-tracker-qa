import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach('Acessando o "Habit Tracker"', async ({ page }) => {
    await page.goto('/');
    await page.getByRole("button", {name: "login"}).click()
  });

  test('Efetuando login com usuário válido', async ({ page }) => {
    const usernameInput = page.getByRole("textbox", {name: "type your username"})
    await usernameInput.fill(process.env.USERNAME)

    const passwordInput = page.getByRole("textbox", {name: "type your password"})
    await passwordInput.fill(process.env.PASSWORD)

    page.getByRole("button", {name: "login"}).click()
  });
});