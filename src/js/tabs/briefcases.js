import { DOM, CURRENT_TAB } from '../constants';
import { TOGGLE_TAB } from '../utils';
import { fetchData } from '../helpers';
import { loadCategories } from './categories';

export async function getBriefcases() {
	const url = 'https://dummyjson.com/auth/products';
	const data = await fetchData(url);

	return data.products;
}

function createBriefcase({ id, title, port, text, test, date }) {
	const briefcaseHTML = `<li data-id=${id}>
                    <div class="form__cases-img">
                    <img src="assets/img/svg/case.svg" with="130" height="130" alt=""></div>
                    <div class="form__cases-content">
                      <div class="form__cases-header">
                        <p class="form__cases-header-title">${title}</p>
                        <div class="form__text form__text--sm">
                          <p>${date}</p>
                        </div>
                      </div>
                      <div class="form__cases-descrip">
                        <p class="form__cases-city">${port}</p>
                        <div class="form__text">
                          ${text.map((item) => `<p>${item}</p>`).join('')}
                        </div>
                        <div class="form__cases-test"><span>Test:&nbsp;</span>
                          <div class="form__text">
                            <p>${test}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>`;

	return briefcaseHTML;
}

export function renderBriefcases(briefcases) {
	const briefcasesList = CURRENT_TAB.element.querySelector('.form__cases');

	briefcasesList.innerHTML = '';

	for (let i = 0; i < briefcases.length; i++) {
		briefcasesList.insertAdjacentHTML(
			'beforeend',
			createBriefcase({
				id: briefcases[i].id,
				title: briefcases[i].title,
				date: new Date().toLocaleDateString(),
				port: briefcases[i].brand,
				text: [
					'Site Visit',
					'Administration Nacional de Combustibles Alcohol y Portland (ACAP)'
				],
				test: 'do not used'
			})
		);
	}
}

export async function loadBriefcases() {
	const briefcases = await getBriefcases();

	const briefcasesList = CURRENT_TAB.element.querySelector(
		'[data-briefcases-list]'
	);

	renderBriefcases(briefcases);

	briefcasesList.addEventListener('click', async (e) => {
		const briefcaseId =
			e.target.tagName === 'LI'
				? e.target.dataset.id
				: e.target.closest('li').dataset.id;

		await loadCategories(briefcaseId);
	});

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
