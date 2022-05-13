import { DOM, CURRENT_TAB, STATE } from '../constants';
import { fetchData } from '../helpers';
import { TOGGLE_TAB } from '../utils';

async function getInfo(id) {
	const url = '../data/info.json';
	const data = await fetchData(url);

	return data[id];
}

function createInfo(text) {
	const infoHTML = `<p>${text}</p>`;

	return infoHTML;
}

function renderInfo(info, container) {
	container.innerHTML = '';

	container.insertAdjacentHTML('beforeend', createInfo(info));
}

export async function loadInfo() {
	const textContainer = CURRENT_TAB.element.querySelector('.form__text');
	const [selectedQuestionId] = STATE.questions.idArray;
	const info = await getInfo(selectedQuestionId);

	renderInfo(info, textContainer);

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
