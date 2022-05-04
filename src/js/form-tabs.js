import { DOM, CURRENT_TAB } from './constants';

const answersInfoTab = DOM.formTabs.find(
  (tab) => tab.dataset.tab === 'answers-info'
);
const question = answersInfoTab.querySelector('.form__question');

function toggleFormTabs() {
  if (!DOM.form) return;

  if (!CURRENT_TAB.element) {
    [CURRENT_TAB.element] = DOM.formTabs;
    CURRENT_TAB.element.classList.add('active');
  }

  DOM.formTabsToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const tabId = toggle.dataset.tabTarget;
      const tab = DOM.formTabs.find((el) => el.dataset.tab === tabId);
      CURRENT_TAB.id = CURRENT_TAB.element.dataset.tab;

      if (!tab) return;

      const changePrevButtonTarget = (label) => {
        const prevButton = tab.querySelector('.form__header-button--prev');
        prevButton.dataset.tabTarget = CURRENT_TAB.id;
        prevButton.innerText = label || CURRENT_TAB.id;
      };

      if (
        !toggle.classList.contains('form__header-button') &&
        toggle.dataset.tabTarget === 'answers-info'
      ) {
        changePrevButtonTarget();
      }

      if (toggle.dataset.tabTarget === 'info') {
        changePrevButtonTarget('question');
      }

      CURRENT_TAB.element.classList.remove('active');
      tab.classList.add('active');
      CURRENT_TAB.element = tab;
    });
  });
}

function controlAnswersTab() {
  const answersTab = DOM.formTabs.find((tab) => tab.dataset.tab === 'answers');
  const answersOptionsLists = answersTab.querySelectorAll(
    '[data-form-dropdown-container]'
  );

  answersOptionsLists.forEach((list) => {
    list.addEventListener('click', (e) => {
      const option = e.target;

      question.textContent = option.textContent;
    });
  });
}

function controlQuestionsTab() {
  const questionsTab = DOM.formTabs.find(
    (tab) => tab.dataset.tab === 'questions'
  );
  const questionsInputs = [...questionsTab.querySelectorAll('input')];
  const nextButton = questionsTab.querySelector(
    '[data-tab-target="answers-info"]'
  );
  let checkedCount = 0;

  const findCheckedInput = () => {
    const checked = questionsInputs.find((input) => input.checked);

    return checked.parentElement;
  };

  nextButton.setAttribute('disabled', true);

  questionsInputs.forEach((input) => {
    input.addEventListener('change', () => {
      checkedCount += input.checked ? 1 : -1;

      if (checkedCount > 0) {
        nextButton.removeAttribute('disabled');
      } else {
        nextButton.setAttribute('disabled', true);

        return;
      }

      if (checkedCount > 1) {
        question.textContent = 'Questions added to the list';
      } else {
        const checkedInput = findCheckedInput();
        question.textContent = checkedInput.textContent;
      }
    });
  });
}

export function controlForm() {
  toggleFormTabs();
  controlAnswersTab();
  controlQuestionsTab();
}
