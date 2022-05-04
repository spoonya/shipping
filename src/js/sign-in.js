import { DOM, TOKEN } from './constants';

async function getToken(login, password) {
  try {
    const url = 'https://mockend.com/spoonya/shipping/users';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login, password })
    });
    const data = await res.json();

    return data.token;
  } catch (error) {
    console.log(error);

    return null;
  }
}

export function signIn() {
  const signInTab = DOM.formTabs.find(
    (tab) => tab.getAttribute('data-tab') === 'sign-in'
  );
  const submitButton = signInTab.querySelector('[data-tab-submit]');
  const login = signInTab.querySelector('input[name="login"]');
  const password = signInTab.querySelector('input[name="password"]');
  const error = signInTab.querySelector('[data-tab-error]');

  submitButton.addEventListener('click', async () => {
    submitButton.setAttribute('disabled', true);
    error.classList.remove('active');

    TOKEN.value = await getToken(login.value, password.value);

    if (TOKEN.value) {
      signInTab.classList.remove('active');
      DOM.formTabs
        .find((tab) => tab.getAttribute('data-tab') === 'briefcases')
        .classList.add('active');
    } else {
      error.classList.add('active');
    }

    submitButton.removeAttribute('disabled');
  });
}
