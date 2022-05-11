import { loadBriefcases } from './briefcases';
import { CURRENT_TAB, DOM, TOKEN } from './constants';
import { findTab } from './helpers';

async function getToken(login, password) {
	try {
		const url = 'https://dummyjson.com/auth/login';
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: login,
				password,
				returnSecureToken: true
			})
		});
		const data = await res.json();

		return data.token;
	} catch (error) {
		console.log(error);
	}

	return null;
}

export function signIn() {
	const signInTab = findTab('sign-in');
	const submitButton = signInTab.querySelector('[data-tab-submit]');
	const login = signInTab.querySelector('input[name="login"]');
	const password = signInTab.querySelector('input[name="password"]');
	const error = signInTab.querySelector('[data-tab-error]');

	submitButton.addEventListener('click', async () => {
		DOM.form.classList.add('loading');

		error.classList.remove('active');

		TOKEN.value = await getToken(login.value, password.value);

		if (TOKEN.value) {
			CURRENT_TAB.element = findTab('briefcases');

			await loadBriefcases();

			CURRENT_TAB.element.classList.add('active');
			signInTab.classList.remove('active');
		} else {
			error.classList.add('active');
		}

		DOM.form.classList.remove('loading');
	});
}
