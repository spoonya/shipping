/* eslint-disable camelcase */
import { v4 as uuid } from 'uuid';

import { DOM, CURRENT_TAB, STATE, BASE_URL } from '../constants';
import {
  fetchData,
  findTabByName,
  findCheckedInput,
  preventTabChange,
  storeInLocalStorage
} from '../helpers';
import { loadBriefcases } from './briefcases';
import { TOGGLE_TAB } from '../utils';

async function getInfoBriefcase() {
  const url = `${BASE_URL}/api/infobiefcase`;
  const data = await fetchData(url);

  return data;
}

function addBriefcaseToStorage({
  nameCase,
  vessel,
  port,
  inspectorName,
  inspectionType,
  inspectionSource
}) {
  storeInLocalStorage(
    'briefcases',
    {
      briefcase: {
        id_case: uuid(),
        name_case: nameCase,
        InspectorName: inspectorName,
        InspectionTypes: inspectionType,
        InspectionSource: inspectionSource,
        port,
        vessel,
        date_in_vessel: new Date().toISOString().slice(0, 10)
      },
      answer: {}
    },
    (obj, data) => data.unshift(obj)
  );
}

function createDropdownOption(value, inputName) {
  const dropdownOptionHTML = `<div class="form__option" data-form-dropdown-option>
                        <label>
                          <input type="radio" name=${inputName} value="${value}">
                          ${value}
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

function resetBriefcaseAdd({ dropdownsContainer, dropdownsPlaceholder }) {
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
}

async function loadAddDropdowns(isLoaded) {
  if (isLoaded) {
    DOM.form.dispatchEvent(TOGGLE_TAB);

    return;
  }

  const infoBriefcase = await getInfoBriefcase();

  const vesselsDropdown = CURRENT_TAB.element.querySelector(
    '[data-dropdown-vessels]'
  );
  const portsDropdown = CURRENT_TAB.element.querySelector(
    '[data-dropdown-ports]'
  );
  const inspectionsTypeDropdown = CURRENT_TAB.element.querySelector(
    '[data-dropdown-inspections-type]'
  );
  const inspectionsSourceDropdown = CURRENT_TAB.element.querySelector(
    '[data-dropdown-inspections-source]'
  );

  renderDropdown({
    data: infoBriefcase.vessel,
    container: vesselsDropdown,
    inputName: 'vessels'
  });
  renderDropdown({
    data: infoBriefcase.port,
    container: portsDropdown,
    inputName: 'ports'
  });
  renderDropdown({
    data: infoBriefcase.inspection_type,
    container: inspectionsTypeDropdown,
    inputName: 'inspections-type'
  });
  renderDropdown({
    data: infoBriefcase.inspecstion_source,
    container: inspectionsSourceDropdown,
    inputName: 'inspections-source'
  });

  DOM.form.dispatchEvent(TOGGLE_TAB);
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
  const inspectionName = STATE.inspectorName;
  const dropdownsContainer = tab.querySelectorAll(
    '[data-form-dropdown-container]'
  );
  const dropdownVessels = tab.querySelector('[data-dropdown-vessels]');
  const dropdownPorts = tab.querySelector('[data-dropdown-ports]');
  const dropdownInspectionsType = tab.querySelector(
    '[data-dropdown-inspections-type]'
  );
  const dropdownInspectionsSource = tab.querySelector(
    '[data-dropdown-inspections-source]'
  );
  const errorEl = tab.querySelector('.form__error');

  if (!isDropdownsValid(dropdownsContainer)) {
    errorEl.classList.add('active');
    preventTabChange();

    return;
  }

  errorEl.classList.remove('active');

  const vessel = findCheckedInput(dropdownVessels);
  const port = findCheckedInput(dropdownPorts);
  const inspectionType = findCheckedInput(dropdownInspectionsType);
  const inspectionSource = findCheckedInput(dropdownInspectionsSource);

  addBriefcaseToStorage({
    nameCase: '',
    inspectorName: inspectionName,
    inspectionType: inspectionType.value,
    inspectionSource: inspectionSource.value,
    vessel: vessel.value,
    port: port.value
  });

  loadBriefcases();

  resetBriefcaseAdd({
    dropdownsContainer,
    dropdownsPlaceholder
  });

  DOM.form.dispatchEvent(TOGGLE_TAB);
}

export function controlAddBriefcase() {
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
