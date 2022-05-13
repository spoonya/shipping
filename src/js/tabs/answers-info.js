import { DOM, CURRENT_TAB, PREV_TAB } from '../constants';
import { findCheckedInput, fetchData } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadInfo } from './info';

async function addAnswerToDB({ date, comment, photo, answer, significant }) {
	const url = '';
	await fetchData(url, 'POST', {
		date,
		comment,
		photo,
		answer,
		significant
	});
}

async function editAnswerInDB({ date, comment, photo, answer, significant }) {
	const url = '';
	await fetchData(url, 'PUT', {
		date,
		comment,
		photo,
		answer,
		significant
	});
}

function isAnswerValid({ date, comment, photo, answer, significant }, errorEl) {
	let isValid = true;

	if (!date || !comment || !photo.length || !answer || !significant)
		isValid = false;

	if (isValid) {
		errorEl.classList.remove('active');
	} else {
		errorEl.classList.add('active');
	}

	return isValid;
}

function resetAnswer({ date, comment, photo, answer, significant }) {
	const imgPreview = photo
		.closest('.form__group')
		.querySelector('[data-tab-img-preview]');

	imgPreview.classList.remove('active');
	date.value = '';
	comment.value = '';
	photo.value = '';
	answer.checked = false;
	significant.checked = false;
}

function showImagePreview(e) {
	if (e.target.files.length < 1) return;

	const container = e.target.closest('.form__group');
	const previewContainer = container.querySelector('[data-tab-img-preview]');

	previewContainer.innerHTML = '';

	for (let i = 0; i < e.target.files.length; i++) {
		const src = URL.createObjectURL(e.target.files[i]);
		const img = document.createElement('img');

		img.src = src;
		previewContainer.append(img);
	}

	previewContainer.classList.add('active');
}

async function saveAnswer(action, tab) {
	const date = tab.querySelector('input[type="date"]');
	const comment = tab.querySelector('textarea');
	const photo = tab.querySelector('input[name="photo"]');
	const answerContainer = tab.querySelector('[data-tab-answer]');
	const significantContainer = tab.querySelector('[data-tab-significant]');
	const answer = findCheckedInput(answerContainer);
	const significant = findCheckedInput(significantContainer);
	const errorEl = tab.querySelector('.form__error');

	const data = {
		date: date.value,
		comment: comment.value,
		photo: photo.files,
		answer: answer && answer.value,
		significant: significant && significant.value
	};

	if (!isAnswerValid(data, errorEl)) {
		DOM.form.classList.remove('loading');
		CURRENT_TAB.element = PREV_TAB.element;
		CURRENT_TAB.id = PREV_TAB.id;

		return;
	}

	switch (action) {
		case 'add':
			await addAnswerToDB(data);
			break;
		case 'edit':
			await editAnswerInDB(data);
			break;
		default:
			console.log('Invalid action');
			return;
	}

	DOM.form.dispatchEvent(TOGGLE_TAB);

	resetAnswer({ date, comment, photo, answer, significant });
}

export function loadAnswer(action) {
	const tab = CURRENT_TAB.element;
	const saveButton = tab.querySelector('.form__bot [data-tab-submit]');
	const photoInput = tab.querySelector('input[name="photo"]');
	const infoButton = tab.querySelector('[data-tab-target="info"]');

	infoButton.addEventListener('click', loadInfo);

	photoInput.addEventListener('change', (e) => showImagePreview(e));

	saveButton.addEventListener('click', () => saveAnswer(action, tab));
}
