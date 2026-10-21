import { test as base, expect } from '@playwright/test';
import { LoginModal } from '../ui/LoginModal';
import { Home } from '../ui/Home';

type Fixtures = {
    home: Home;
    loginModal: LoginModal;
};

export const test = base.extend<Fixtures>({
    home: async ({ page }, use) => {
        const home = new Home(page);
        await use(home);
    },
    loginModal: async ({ page }, use) => {
        const loginModal = new LoginModal(page);
        await use(loginModal);
    },

});

export { expect };