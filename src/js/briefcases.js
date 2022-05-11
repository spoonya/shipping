import { DOM, CURRENT_TAB, TOKEN } from './constants';
import * as DATA from './data';

const itemsPerView = 2;
let currentIndex = 0;

async function fetchData(url) {
	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${TOKEN.value}`,
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();

		return data;
	} catch (error) {
		console.log(error);
	}

	return null;
}

async function getBriefcases() {
	const url = 'https://dummyjson.com/auth/products';
	const data = await fetchData(url);

	return data.products;
}

async function getVessels() {
	const url = 'https://dummyjson.com/auth/users';
	const data = await fetchData(url);

	return data.users;
}

async function getPorts() {
	const url = 'https://dummyjson.com/auth/users';
	const data = await fetchData(url);

	return data.users;
}

async function getInspections() {
	const url = 'https://dummyjson.com/auth/users';
	const data = await fetchData(url);

	return data.users;
}

function createDropdownOption(value, inputName) {
	const dropdownOptionHTML = `<div class="form__option" data-form-dropdown-option>
                        <label>
                          <input type="radio" name=${inputName} value=${value}>${value}
                        </label>
                      </div>`;

	return dropdownOptionHTML;
}

function renderDropdown({ data, container, inputName }) {
	for (let i = 0; i < data.length; i++) {
		container.insertAdjacentHTML(
			'beforeend',
			createDropdownOption(data[i], inputName)
		);
	}
}

function createBriefcase({ id, title, city, text, test, date }) {
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
                        <p class="form__cases-city">${city}</p>
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

function renderBriefcases({ briefcases, startFrom, maxPerView }) {
	currentIndex += itemsPerView;

	const briefcasesList = CURRENT_TAB.element.querySelector('.form__cases');

	briefcasesList.innerHTML = '';

	for (let i = startFrom; i < maxPerView + startFrom; i++) {
		briefcasesList.insertAdjacentHTML(
			'beforeend',
			createBriefcase({
				id: briefcases[i].id,
				title: briefcases[i].title,
				date: new Date().toLocaleDateString(),
				city: briefcases[i].brand,
				text: [
					'Site Visit',
					'Administration Nacional de Combustibles Alcohol y Portland (ACAP)'
				],
				test: 'do not used'
			})
		);
	}
}

async function loadAddDropdowns(isLoaded) {
	if (isLoaded) return;

	DOM.form.classList.add('loading');

	const vessels = await getVessels();
	const ports = await getPorts();
	const inspections = await getInspections();

	const vesselsDropdown = CURRENT_TAB.element.querySelector(
		'[data-dropdown-vessels]'
	);
	const portsDropdown = CURRENT_TAB.element.querySelector(
		'[data-dropdown-ports]'
	);
	const inspectionsDropdown = CURRENT_TAB.element.querySelector(
		'[data-dropdown-inspections]'
	);

	renderDropdown({
		data: DATA.VESSELS,
		container: vesselsDropdown,
		inputName: 'vessels'
	});
	renderDropdown({
		data: DATA.PORTS,
		container: portsDropdown,
		inputName: 'ports'
	});
	renderDropdown({
		data: DATA.INSPECTION_TYPE,
		container: inspectionsDropdown,
		inputName: 'inspections'
	});

	DOM.form.classList.remove('loading');
}

function findCheckedInput(container) {
	let checkedInput = '';

	container.querySelectorAll('input').forEach((input) => {
		if (input.checked) {
			checkedInput = input;
		}
	});

	return checkedInput;
}

function resetBriefcaseAdd({
	dropdownsContainer,
	textInput,
	dropdownsPlaceholder
}) {
	dropdownsContainer.forEach((dropdown, index) => {
		const inputs = dropdown.querySelectorAll('input');
		const selectedLabel = dropdown
			.closest('[data-form-dropdown]')
			.querySelector('[data-form-dropdown-selected] span');

		selectedLabel.textContent = dropdownsPlaceholder[index];

		inputs.forEach((input) => {
			input.checked = false;
		});
	});

	textInput.value = '';
}

async function addBriefcase(tab, dropdownsPlaceholder) {
	const inspectionName = tab.querySelector('input[name="inspection-name"]');
	const dropdownsContainer = tab.querySelectorAll(
		'[data-form-dropdown-container]'
	);
	const dropdownVessels = tab.querySelector('[data-dropdown-vessels]');
	const dropdownPorts = tab.querySelector('[data-dropdown-ports]');
	const dropdownInspections = tab.querySelector('[data-dropdown-inspections]');
	const errorEl = tab.querySelector('.form__error');

	const validateDropdowns = () => {
		let isValid = true;

		dropdownsContainer.forEach((dropdown) => {
			if (!dropdown.hasAttribute(['data-dropdown-selected'])) {
				isValid = false;
			}
		});

		return isValid;
	};

	if (!inspectionName.value || !validateDropdowns()) {
		errorEl.classList.add('active');

		return;
	}

	errorEl.classList.remove('active');

	const vessel = findCheckedInput(dropdownVessels);
	const port = findCheckedInput(dropdownPorts);
	const inspection = findCheckedInput(dropdownInspections);

	DOM.form.classList.add('loading');

	try {
		const url = 'https://dummyjson.com/products/add';
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: inspectionName.value,
				date: new Date().toLocaleDateString(),
				city: vessel.value,
				text: [port.value, inspection.value],
				test: 'do not used'
			})
		});

		const prevTab = CURRENT_TAB.element;

		CURRENT_TAB.element = DOM.formTabs.find(
			(el) => el.getAttribute('data-tab') === 'briefcases'
		);

		const briefcases = await getBriefcases();

		renderBriefcases({
			briefcases,
			startFrom: currentIndex,
			maxPerView: itemsPerView
		});

		resetBriefcaseAdd({
			dropdownsContainer,
			textInput: inspectionName,
			dropdownsPlaceholder
		});

		prevTab.classList.remove('active');
		CURRENT_TAB.element.classList.add('active');
	} catch (error) {
		console.log(error);
	}

	DOM.form.classList.remove('loading');
}

export async function loadBriefcases() {
	const briefcases = await getBriefcases();
	const loadMore = CURRENT_TAB.element.querySelector('[data-load-more]');
	const addBriefcaseButton = CURRENT_TAB.element.querySelector(
		'[data-tab-target="briefcases-add"]'
	);
	const briefcaseAddTab = DOM.formTabs.find(
		(el) => el.dataset.tab === 'briefcases-add'
	);
	const briefcaseAddSubmit = briefcaseAddTab.querySelector('[data-tab-submit]');
	const dropdownsPlaceholder = [
		...briefcaseAddTab.querySelectorAll('[data-form-dropdown-selected] span')
	].map((el) => el.textContent);

	let isDropdownsLoaded = false;

	renderBriefcases({
		briefcases,
		startFrom: currentIndex,
		maxPerView: itemsPerView
	});

	loadMore.addEventListener('click', () => {
		renderBriefcases({
			briefcases,
			startFrom: currentIndex,
			maxPerView: itemsPerView
		});

		if (!briefcases[currentIndex]) {
			loadMore.remove();
		}
	});

	addBriefcaseButton.addEventListener('click', () => {
		loadAddDropdowns(isDropdownsLoaded);
		isDropdownsLoaded = true;
	});

	briefcaseAddSubmit.addEventListener('click', () =>
		addBriefcase(briefcaseAddTab, dropdownsPlaceholder)
	);
}
