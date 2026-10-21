import { type Locator, type Page } from '@playwright/test';

export class LoginModal {
  readonly modal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  //TODO: add show/hide password

  constructor(page: Page) {
    this.modal = page.getByRole('dialog');

    this.usernameInput = this.modal.getByRole('textbox', {
      name: 'type your username',
    });

    this.passwordInput = this.modal.getByRole('textbox', {
      name: 'type your password',
    });

    this.submitButton = this.modal.getByRole('button', {
      name: 'login',
    });

    this.cancelButton = this.modal.getByRole('button', {
      name: 'cancel',
    });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async submit(){
    await this.submitButton.click();
  }

  async close(){
    await this.cancelButton.click();
  }
}