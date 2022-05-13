import { CURRENT_TAB, DOM } from '../constants';
import { fetchData } from '../helpers';
import { TOGGLE_TAB } from '../utils';
import { loadQuestions } from './questions';

async function getCategories(id) {
	const url = '../data/categories.json';
	const data = await fetchData(url);

	return data;
}

function createCategory({ title, qid }) {
	const categoryHTML = `<li data-id=${qid}>${title}</li>`;

	return categoryHTML;
}

function renderCategories(categories, container) {
	container.innerHTML = '';

	for (let i = 0; i < categories.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createCategory({ qid: categories[i].qid, title: categories[i].title })
		);
	}
}

export async function loadCategories(id) {
	const categories = await getCategories(id);
	const categoriesList = CURRENT_TAB.element.querySelector(
		'[data-tab-categories]'
	);

	renderCategories(categories, categoriesList);

	categoriesList.addEventListener('click', async (e) => {
		const categoryId = e.target.dataset.id;
		await loadQuestions(categoryId);
	});

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
