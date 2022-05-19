import { CURRENT_TAB, DOM, STATE } from '../constants';
import { fetchData, findTabByName } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadAnswer } from './answers-info';

async function getQuestions(id) {
	const url = 'http://dev.eraappmobile.com/api/question';
	const data = await fetchData(url, 'POST', { qid: id });

	console.log(data);

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

function controlQuestions() {
	const answersInfoTab = findTabByName('answers-info');
	const question = answersInfoTab.querySelector('.form__question');
	const addPhotoButton = answersInfoTab.querySelector(
		'[data-tab-photo-button]'
	);
	const infoButton = answersInfoTab.querySelector('[data-tab-target="info"]');
	const questionsInputs = [...CURRENT_TAB.element.querySelectorAll('input')];
	const nextButton = CURRENT_TAB.element.querySelector(
		'[data-tab-open-questions]'
	);

	let checkedCount = 0;

	const findCheckedInputParent = () => {
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
				addPhotoButton.style.display = 'none';
			} else {
				const checkedInput = findCheckedInputParent();
				question.textContent = checkedInput.textContent;
				infoButton.style.display = 'grid';
				addPhotoButton.style.display = 'block';
			}
		});
	});

	nextButton.addEventListener('click', () => {
		STATE.questions.idArray = questionsInputs
			.filter((input) => input.checked)
			.map((input) => input.closest('li').dataset.id);

		loadAnswer('add');
	});
}

export async function loadQuestions(id, title) {
	const questions = await getQuestions(id);
	const categoriesList = CURRENT_TAB.element.querySelector(
		'[data-tab-questions]'
	);

	renderQuestions({ questions, title, container: categoriesList });
	controlQuestions();

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
