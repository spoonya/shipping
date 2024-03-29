import { loadBriefcases } from './briefcases';
import { controlAddBriefcase } from './briefcases-add';
import { BASE_URL, STATE } from '../constants';
import { findTabByName, preventTabChange } from '../helpers';
import { loadCategories } from './categories';

async function getSignInInfo(login, password) {
  try {
    const url = `${BASE_URL}/login`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: login,
        password,
        returnSecureToken: true
      })
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export function signIn() {
  const signInTab = findTabByName('sign-in');
  const submitButton = signInTab.querySelector('[data-tab-submit]');
  const login = signInTab.querySelector('input[name="login"]');
  const password = signInTab.querySelector('input[name="password"]');
  const error = signInTab.querySelector('[data-tab-error]');

  submitButton.addEventListener('click', async () => {
    error.classList.remove('active');

    const signInInfo = await getSignInInfo(login.value, password.value);

    STATE.token = signInInfo.token;
    STATE.inspectorName = signInInfo.full_name;

    if (STATE.token) {
      await loadBriefcases();
      await loadCategories();
      controlAddBriefcase();
    } else {
      error.classList.add('active');
      preventTabChange();
    }
  });
}
