import { loadBriefcases } from './briefcases';
import { controlAddBriefcase } from './briefcases-add';
import { STATE } from '../constants';
import { findTabByName, preventTabChange } from '../helpers';

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
	const signInTab = findTabByName('sign-in');
	const submitButton = signInTab.querySelector('[data-tab-submit]');
	const login = signInTab.querySelector('input[name="login"]');
	const password = signInTab.querySelector('input[name="password"]');
	const error = signInTab.querySelector('[data-tab-error]');

	submitButton.addEventListener('click', async () => {
		error.classList.remove('active');

		STATE.token = await getToken(login.value, password.value);

		if (STATE.token) {
			await loadBriefcases();
			controlAddBriefcase();
		} else {
			error.classList.add('active');
			preventTabChange();
		}
	});
}
