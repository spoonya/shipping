import { DOM, CURRENT_TAB, TOKEN } from './constants';

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

function createDropdownOption({ firstName }) {
  const dropdownOptionHTML = `<div class="form__option" data-form-dropdown-option>
                        <label>
                          <input type="radio">${firstName}
                        </label>
                      </div>`;

  return dropdownOptionHTML;
}

function renderDropdown(data, container) {
  for (let i = 0; i < data.length; i++) {
    container.insertAdjacentHTML('beforeend', createDropdownOption(data[i]));
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

function renderBriefcases({
  briefcases,
  currentIndex,
  itemsPerView,
  briefcasesList
}) {
  briefcasesList.innerHTML = '';

  for (let i = currentIndex; i < itemsPerView + currentIndex; i++) {
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

  renderDropdown(vessels, vesselsDropdown);
  renderDropdown(ports, portsDropdown);
  renderDropdown(inspections, inspectionsDropdown);

  DOM.form.classList.remove('loading');
}

async function addBriefcase(tab) {
  const inspectionName = tab.querySelector('input[name="inspection-name"]');
  const dropdowns = tab.querySelectorAll('[data-form-dropdown-container]');
  const error = tab.querySelector('.form__error');

  const validateDropdowns = () => {
    let isValid = true;

    dropdowns.forEach((dropdown) => {
      if (!dropdown.hasAttribute(['data-dropdown-selected'])) {
        isValid = false;
      }
    });

    return isValid;
  };

  if (!inspectionName.value || !validateDropdowns()) {
    error.classList.add('active');

    return;
  }

  error.classList.remove('active');
}

export async function loadBriefcases() {
  const briefcases = await getBriefcases();
  const briefcasesList = CURRENT_TAB.element.querySelector('.form__cases');
  const loadMore = CURRENT_TAB.element.querySelector('[data-load-more]');
  const addBriefcaseButton = CURRENT_TAB.element.querySelector(
    '[data-tab-target="briefcases-add"]'
  );
  const briefcaseAddTab = DOM.formTabs.find(
    (el) => el.dataset.tab === 'briefcases-add'
  );
  const briefcaseAddSubmit = briefcaseAddTab.querySelector('[data-tab-submit]');
  const itemsPerView = 2;
  let currentIndex = 0;
  let isDropdownsLoaded = false;

  renderBriefcases({
    briefcases,
    currentIndex,
    itemsPerView,
    briefcasesList
  });

  currentIndex += itemsPerView;

  loadMore.addEventListener('click', () => {
    renderBriefcases({
      briefcases,
      currentIndex,
      itemsPerView,
      briefcasesList
    });

    currentIndex += itemsPerView;

    if (!briefcases[currentIndex]) {
      loadMore.remove();
    }
  });

  addBriefcaseButton.addEventListener('click', async () => {
    await loadAddDropdowns(isDropdownsLoaded);
    isDropdownsLoaded = true;
  });

  briefcaseAddSubmit.addEventListener('click', () =>
    addBriefcase(briefcaseAddTab)
  );
}
