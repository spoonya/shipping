import { ANSWERS_INFO_ACTIONS, CURRENT_TAB, DOM, STATE } from '../constants';
import { fetchData } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadAnswerDetails } from './answers-info';

async function getQuestions(id) {
	const url = 'http://dev.eraappmobile.com/api/question';
	const data = await fetchData(url, 'POST', { qid: id });

	return data;
}

function createQuestion({ questionid, question }) {
	const categoryHTML = `<li data-id="${questionid}">
                    <label class="form__checkbox-wrapper">
                      <input class="form__checkbox" name="question" type="checkbox" hidden>
                      <span class="form__checkbox-styled"></span>
                      <span class="form__checkbox-txt">${question}</span>
                    </label>
                  </li>`;

	return categoryHTML;
}

function renderQuestions({ questions, title, container }) {
	container.innerHTML = '';

	const titleEl = CURRENT_TAB.element.querySelector('.form__title p');
	titleEl.textContent = title;

	for (let i = 0; i < questions.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createQuestion({
				questionid: questions[i].questionid,
				question: questions[i].question
			})
		);
	}
}

function controlQuestions(questions) {
	const questionsInputs = [...CURRENT_TAB.element.querySelectorAll('input')];
	const nextButton = CURRENT_TAB.element.querySelector(
		'[data-tab-open-questions]'
	);

	let activeQuestion = null;
	let checkedCount = 0;

	questionsInputs.forEach((input) => {
		input.addEventListener('change', () => {
			checkedCount += input.checked ? 1 : -1;

			if (checkedCount > 0) {
				nextButton.removeAttribute('disabled');
			} else {
				nextButton.setAttribute('disabled', true);
			}
		});
	});

	nextButton.addEventListener('click', () => {
		STATE.activeQuestions.idArray = questionsInputs
			.filter((input) => input.checked)
			.map((input) => input.closest('li').dataset.id);

		if (STATE.activeQuestions.idArray.length === 1) {
			activeQuestion = questions.find(
				(question) => question.questionid === STATE.activeQuestions.idArray[0]
			);
		} else {
			activeQuestion = null;
		}

		console.log(activeQuestion);

		loadAnswerDetails(ANSWERS_INFO_ACTIONS.add, activeQuestion);
	});
}

export async function loadQuestions(id, title) {
	const questions = await getQuestions(id);
	const categoriesList = CURRENT_TAB.element.querySelector(
		'[data-tab-questions]'
	);

	console.log(questions);

	renderQuestions({ questions, title, container: categoriesList });
	controlQuestions(questions);

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
