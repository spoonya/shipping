import { DOM, CURRENT_TAB, STATE } from './constants';
import { fetchData, findTabByName } from './helpers';
import { getBriefcases, renderBriefcases } from './briefcases';
import { TOGGLE } from './utils';

async function getVessels() {
	const url = '../data/vessels.json';
	const data = await fetchData(url);

	return data;
}

async function getPorts() {
	const url = '../data/ports.json';
	const data = await fetchData(url);

	return data;
}

async function getInspections() {
	const url = '../data/inspection-type.json';
	const data = await fetchData(url);

	return data;
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

async function loadAddDropdowns(isLoaded) {
	if (isLoaded) {
		DOM.form.dispatchEvent(TOGGLE);

		return;
	}

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
		data: vessels,
		container: vesselsDropdown,
		inputName: 'vessels'
	});
	renderDropdown({
		data: ports,
		container: portsDropdown,
		inputName: 'ports'
	});
	renderDropdown({
		data: inspections,
		container: inspectionsDropdown,
		inputName: 'inspections'
	});

	DOM.form.dispatchEvent(TOGGLE);
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

		const briefcases = await getBriefcases();

		renderBriefcases({
			briefcases,
			startFrom: STATE.briefcases.currentIndex,
			maxPerView: STATE.briefcases.itemsPerView
		});

		resetBriefcaseAdd({
			dropdownsContainer,
			textInput: inspectionName,
			dropdownsPlaceholder
		});
	} catch (error) {
		console.log(error);
	}

	DOM.form.dispatchEvent(TOGGLE);
}

export function loadAddBriefcase() {
	const briefcaseAddTab = findTabByName('briefcases-add');
	const briefcaseAddSubmit = briefcaseAddTab.querySelector('[data-tab-submit]');
	const dropdownsPlaceholder = [
		...briefcaseAddTab.querySelectorAll('[data-form-dropdown-selected] span')
	].map((el) => el.textContent);
	const addBriefcaseButton = CURRENT_TAB.element.querySelector(
		'[data-tab-target="briefcases-add"]'
	);
	let isDropdownsLoaded = false;

	addBriefcaseButton.addEventListener('click', async () => {
		await loadAddDropdowns(isDropdownsLoaded);
		isDropdownsLoaded = true;
	});

	briefcaseAddSubmit.addEventListener('click', () =>
		addBriefcase(briefcaseAddTab, dropdownsPlaceholder)
	);
}
