import { CURRENT_TAB, DOM, STATE } from '../constants';
import { toggleDropdown } from '../dropdown';
import { fetchData, preventTabChange } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { toggleTabs } from './tabs';
import { loadAnswerDetails } from './answers-info';

async function getAnswers() {
	const url = '../data/answers.json';
	const data = await fetchData(url);

	return data;
}

function createAnswer({ category, answers }) {
	const categoryHTML = `<div class="form__select form__select--secondary" data-form-dropdown="spoiler">
                  <ul class="form__options-container" data-form-dropdown-container data-tab-target="answers-info" data-tab-submit>
                    ${answers
											.map(
												(answer) =>
													`<li data-id="${answer.questionID}">${answer.question}</li>`
											)
											.join('')}
                  </ul>
                  <div class="form__option-selected form__input" data-form-dropdown-selected><span>${category}</span></div>
                </div>`;

	return categoryHTML;
}

function renderAnswers(answers, container) {
	container.innerHTML = '';

	for (let i = 0; i < answers.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createAnswer({
				category: answers[i].category,
				answers: answers[i].answers
			})
		);
	}

	// Add addEventListeners
	const dropdowns = container.querySelectorAll('[data-form-dropdown-selected]');
	const tabToggles = [...container.querySelectorAll('[data-tab-target]')];

	toggleDropdown(dropdowns);
	toggleTabs(tabToggles);
}

function controlAnswers(list) {
	list.addEventListener('click', async (e) => {
		if (e.target.tagName === 'LI') {
			const answerId = e.target.dataset.id;

			STATE.questions.idArray = [answerId];

			loadAnswerDetails('edit');

			DOM.form.dispatchEvent(TOGGLE_TAB);
		} else if (e.target.closest('ul')) {
			preventTabChange();
		}
	});
}

export async function loadAnswerDetailss() {
	const answers = await getAnswers();
	const answersContainer =
		CURRENT_TAB.element.querySelector('[data-tab-answers]');

	renderAnswers(answers, answersContainer);
	controlAnswers(answersContainer);

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
