import { DOM, CURRENT_TAB, PREV_TAB, STATE } from '../constants';
import { fetchData, findTabByName } from '../helpers';
import { getBriefcases, renderBriefcases } from './briefcases';
import { TOGGLE_TAB } from '../utils';

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

async function addBriefcaseToDB({ inspectionName, vessel, port, inspection }) {
	const url = 'https://dummyjson.com/products/add';
	await fetchData(url, 'POST', {
		title: inspectionName.value,
		date: new Date().toLocaleDateString(),
		city: vessel.value,
		text: [port.value, inspection.value],
		test: 'do not used'
	});
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
		DOM.form.dispatchEvent(TOGGLE_TAB);

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

	DOM.form.dispatchEvent(TOGGLE_TAB);
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

function isDropdownsValid(container) {
	let isValid = true;

	container.forEach((dropdown) => {
		if (!dropdown.hasAttribute(['data-dropdown-selected'])) {
			isValid = false;
		}
	});

	return isValid;
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

	if (!inspectionName.value || !isDropdownsValid(dropdownsContainer)) {
		errorEl.classList.add('active');
		DOM.form.classList.remove('loading');
		CURRENT_TAB.element = PREV_TAB.element;
		CURRENT_TAB.id = PREV_TAB.id;

		return;
	}

	errorEl.classList.remove('active');

	const vessel = findCheckedInput(dropdownVessels);
	const port = findCheckedInput(dropdownPorts);
	const inspection = findCheckedInput(dropdownInspections);

	await addBriefcaseToDB({ inspectionName, vessel, port, inspection });

	const briefcases = await getBriefcases();
	renderBriefcases(briefcases);

	resetBriefcaseAdd({
		dropdownsContainer,
		textInput: inspectionName,
		dropdownsPlaceholder
	});

	DOM.form.dispatchEvent(TOGGLE_TAB);
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

	addBriefcaseButton.addEventListener('click', async () => {
		await loadAddDropdowns(STATE.dropdowns.isLoaded);
		STATE.dropdowns.isLoaded = true;
	});

	briefcaseAddSubmit.addEventListener('click', () =>
		addBriefcase(briefcaseAddTab, dropdownsPlaceholder)
	);
}
