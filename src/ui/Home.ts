import { expect, type Locator, type Page } from '@playwright/test';

export class Home {
    readonly page: Page;
    readonly loginButton: Locator;
    readonly registerButton: Locator;
    readonly toast: Locator;
    //TODO: add logout

    constructor(page: Page) {
        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'login' });
        this.registerButton = page.getByRole('button', { name: 'register' });
        this.toast = page.getByRole('status');

    }

    async open() {
        await this.page.goto('/');
    }

    async openLogin() {
        await this.loginButton.click();
    }

    async openRegister() {
        await this.registerButton.click();
    }

    async expectLoggedAs(username: string) {
        await expect(
            this.page.getByText(`hi, ${username}!`),
        ).toBeVisible();
    }

    async expectToastMessage(message: string | RegExp) {
        await expect(
            this.toast.filter({ hasText: message }),
        ).toBeVisible();
    }
}