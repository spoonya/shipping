import { fetchData, findTabByName } from '../helpers';
import { loadAnswers } from './answers';

export async function getBriefcases() {
  const url = '';
  const data = await fetchData(url);

  return data;
}

export function getBriefCasesFromStorage() {
  const briefcases = localStorage.getItem('briefcases')
    ? JSON.parse(localStorage.getItem('briefcases'))
    : [];

  return briefcases;
}

function createBriefcase({
  inspectorName,
  inspectionType,
  inspectionSource,
  vessel,
  port,
  date,
  caseName
}) {
  const briefcaseHTML = `<li>
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
                            <p>${caseName}</p>
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
        inspectorName: briefcases[i].briefcase.InspectorName,
        inspectionType: briefcases[i].briefcase.InspectionTypes,
        inspectionSource: briefcases[i].briefcase.InspectionSource,
        vessel: briefcases[i].briefcase.vessel,
        port: briefcases[i].briefcase.port,
        date: briefcases[i].briefcase.date_in_vessel,
        caseName: briefcases[i].briefcase.name_case
      })
    );
  }
}

function controlBriefcases(tab) {
  const answersButton = tab.querySelector('[data-tab-target="answers"]');

  answersButton.addEventListener('click', loadAnswers);
}

export async function loadBriefcases() {
  const briefcases = getBriefCasesFromStorage();
  const briefcasesTab = findTabByName('briefcases');
  const briefcasesList = briefcasesTab.querySelector('.form__cases');

  console.log(briefcases);

  renderBriefcases(briefcases, briefcasesList);
  controlBriefcases(briefcasesTab);
}
