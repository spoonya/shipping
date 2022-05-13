import { CURRENT_TAB, DOM } from '../constants';
import { fetchData, findTabByName } from '../helpers';
import { TOGGLE_TAB } from '../utils';

async function getQuestions(id) {
	const url = '../data/questions.json';
	const data = await fetchData(url);

	return data;
}

function createQuestion({ questionID, question }) {
	const categoryHTML = `<li data-id="${questionID}">
                    <label class="form__checkbox-wrapper">
                      <input class="form__checkbox" name="question" type="checkbox" hidden>
                      <span class="form__checkbox-styled"></span>
                      <span class="form__checkbox-txt">${question}</span>
                    </label>
                  </li>`;

	return categoryHTML;
}

function renderQuestions(questions, container) {
	container.innerHTML = '';

	for (let i = 0; i < questions.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createQuestion({
				questionID: questions[i].questionID,
				question: questions[i].question
			})
		);
	}
}

function controlQuestions() {
	const answersInfoTab = findTabByName('answers-info');
	const question = answersInfoTab.querySelector('.form__question');
	const questionsInputs = [...CURRENT_TAB.element.querySelectorAll('input')];
	const nextButton = CURRENT_TAB.element.querySelector(
		'[data-tab-open-questions]'
	);
	const infoButton = answersInfoTab.querySelector('[data-tab-target="info"]');

	let checkedCount = 0;

	const findCheckedInput = () => {
		const checked = questionsInputs.find((input) => input.checked);

		return checked.parentElement;
	};

	questionsInputs.forEach((input) => {
		input.addEventListener('change', () => {
			checkedCount += input.checked ? 1 : -1;

			if (checkedCount > 0) {
				nextButton.removeAttribute('disabled');
			} else {
				nextButton.setAttribute('disabled', true);

				return;
			}

			if (checkedCount > 1) {
				question.textContent = 'Questions added to the list';
				infoButton.style.display = 'none';
			} else {
				const checkedInput = findCheckedInput();
				question.textContent = checkedInput.textContent;
				infoButton.style.display = 'grid';
			}
		});
	});

	nextButton.addEventListener('click', () => {});
}

export async function loadQuestions(id) {
	const categories = await getQuestions(id);
	const categoriesList = CURRENT_TAB.element.querySelector(
		'[data-tab-questions]'
	);

	renderQuestions(categories, categoriesList);
	controlQuestions();

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
