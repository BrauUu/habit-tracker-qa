import { randomUUID } from 'node:crypto';
import { test, expect } from '../fixtures/test';

import { LoginModal } from '../ui/LoginModal';
import { Home } from '../ui/Home';

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

  test.use({
    storageState: {
      cookies: [],
      origins: [],
    },
  });

  test.beforeEach('Acessando o "Habit Tracker"', async ({ home}) => {
    await home.open();
    await home.openLogin()
  });

  test('Efetuando login com usuário válido', async ({ loginModal, home }) => {
    await loginModal.login(username, password)
    await home.expectToastMessage('login with success')
    await home.expectLoggedAs(username)
  });
  
  test('Efetuando login com campo "password" incorreto', async ({ home, loginModal }) => {
    const incorrectPassword = 'incorrectpassword'
    await loginModal.login(username, incorrectPassword)
    await home.expectToastMessage("incorrect 'password' or 'username'")

  });

  test('Efetuando login com campo "password" vazio', async ({ home, loginModal }) => {
    await loginModal.fillPassword(password)
    await loginModal.submit()
    await home.expectToastMessage("'username' and 'password' required")

  });

  test('Efetuando login com campo "username" vazio', async ({ home, loginModal }) => {
    await loginModal.fillUsername(username)
    await loginModal.submit()
    await home.expectToastMessage("'username' and 'password' required")

  });

  test('Efetuando login com usuário inexistente', async ({ home, loginModal }) => {
    const inexistentUser = {
      username: 'iamaninexistentusername',
      password: 'iamaninexistentpassword'
    }
    await loginModal.login(inexistentUser.username, inexistentUser.password)
    await home.expectToastMessage("incorrect 'password' or 'username'")

  });

  test('Fechar o modal de login pelo botão cancel', async ({ loginModal }) => {
    await loginModal.close()
    await expect(loginModal.modal).toBeHidden()
  });

  test('Habilitar exibição de senha', async ({ loginModal }) => {
   //TODO
  });

  test.afterAll("Exclusão de usuário", async ({ request }) => {
    await request.delete(`${apiURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  })
});