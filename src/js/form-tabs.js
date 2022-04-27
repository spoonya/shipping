const form = document.querySelector('#form-inspection');
const formTabs = [...form.querySelectorAll('[data-tab]')];
const formTabsToggles = [...form.querySelectorAll('[data-tab-target]')];
const multiAnswersInputsContainer = formTabs
  .find((tab) => tab.dataset.tab === 'answers-info-multi')
  .querySelector('.form__inner');
let currentTab = formTabs.find((tab) => tab.classList.contains('active'));

function toggleFormTabs() {
  if (!form) return;

  if (!currentTab) {
    [currentTab] = formTabs;
    currentTab.classList.add('active');
  }

  formTabsToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const tabId = toggle.dataset.tabTarget;
      const tab = formTabs.find((el) => el.dataset.tab === tabId);
      const currentTabId = currentTab.dataset.tab;

      if (!tab) return;

      if (
        toggle.dataset.tabTarget === 'answers-info' ||
        toggle.dataset.tabTarget === 'answers-info-multi'
      ) {
        const prevButton = tab.querySelector('.form__header-button--prev');
        prevButton.dataset.tabTarget = currentTabId;
        prevButton.innerText = currentTabId;
      }

      currentTab.classList.remove('active');
      tab.classList.add('active');
      currentTab = tab;
    });
  });
}

function renderMultiAnswersInfo(count) {
  const answersTab = formTabs.find(
    (tab) => tab.dataset.tab === 'answers-info-multi'
  );
  const answersInfoWrapper = answersTab.querySelector('.form__wrapper');
  answersInfoWrapper.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const answersInfoClone = multiAnswersInputsContainer.cloneNode(true);
    answersInfoWrapper.appendChild(answersInfoClone);
  }
}

function controlQuestionsTab() {
  const questionsTab = formTabs.find((tab) => tab.dataset.tab === 'questions');

  if (!questionsTab) return;

  const questionsInputs = [...questionsTab.querySelectorAll('input')];
  const nextButton = questionsTab.querySelector(
    '[data-tab-target="answers-info"]'
  );
  let checkedCount = 0;

  questionsInputs.forEach((input) => {
    input.addEventListener('change', () => {
      checkedCount += input.checked ? 1 : -1;

      if (checkedCount > 1) {
        nextButton.dataset.tabTarget = 'answers-info-multi';
        renderMultiAnswersInfo(checkedCount);
      } else {
        nextButton.dataset.tabTarget = 'answers-info';
      }
    });
  });
}

export function controlForm() {
  toggleFormTabs();
  controlQuestionsTab();
}
