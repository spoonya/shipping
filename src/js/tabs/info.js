import { DOM } from '../constants';
import { findTabByName } from '../helpers';
import { TOGGLE_TAB } from '../utils';

function createInfo(text) {
	const infoHTML = `<p>${text || 'No info'}</p>`;

	return infoHTML;
}

function renderInfo(comment, container) {
	container.innerHTML = '';

	container.insertAdjacentHTML('beforeend', createInfo(comment));
}

export async function loadInfo(comment) {
	const infoTab = findTabByName('info');
	const textContainer = infoTab.querySelector('.form__text');

	renderInfo(comment, textContainer);

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
