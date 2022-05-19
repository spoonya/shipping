import { DOM } from '../constants';
import { TOGGLE_TAB } from '../utils';
import { fetchData, findTabByName, preventTabChange } from '../helpers';
import { loadCategories } from './categories';
import { loadAnswers } from './answers';

export async function getBriefcases() {
	const url = '../data/briefcases.json';
	const data = await fetchData(url);

	return data;
}

function createBriefcase({
	id,
	inspectionName,
	inspectionType,
	inspectionSource,
	vessel,
	port,
	test,
	date
}) {
	const briefcaseHTML = `<li data-id=${id}>
                    <div class="form__cases-img">
                    <img src="assets/img/svg/case.svg" with="130" height="130" alt=""></div>
                    <div class="form__cases-content">
                      <div class="form__cases-header">
                        <p class="form__cases-header-title">${vessel}</p>
                        <div class="form__text form__text--sm">
                          <p>${date}</p>
                        </div>
                      </div>
                      <div class="form__cases-descrip">
                        <p class="form__cases-port">${port}</p>
                        <p class="form__cases-inpection-type form__text">${inspectionType}</p>
                        <p class="form__cases-inpection-source form__text">${inspectionSource}</p>
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

export function renderBriefcases(briefcases, container) {
	container.innerHTML = '';

	for (let i = 0; i < briefcases.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createBriefcase({
				id: briefcases[i].id,
				inspectionName: briefcases[i].inspectionName,
				inspectionType: briefcases[i].inspectionType,
				inspectionSource: briefcases[i].inspectionSource,
				vessel: briefcases[i].vessel,
				port: briefcases[i].port,
				test: briefcases[i].test,
				date: briefcases[i].date
			})
		);
	}
}

function controlBriefcases(tab) {
	const answersButton = tab.querySelector('[data-tab-target="answers"]');

	answersButton.addEventListener('click', loadAnswers);
}

export async function loadBriefcases() {
	const briefcases = await getBriefcases();
	const briefcasesTab = findTabByName('briefcases');
	const briefcasesList = briefcasesTab.querySelector('.form__cases');

	renderBriefcases(briefcases, briefcasesList);
	controlBriefcases(briefcasesTab);

	DOM.form.dispatchEvent(TOGGLE_TAB);
}
