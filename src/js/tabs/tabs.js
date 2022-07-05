import { DOM, CURRENT_TAB, PREV_TAB } from '../constants';
import { findTabByName } from '../helpers';

function displayCurrentTab() {
  PREV_TAB.element.classList.remove('active');
  CURRENT_TAB.element.classList.add('active');
}

export function toggleTabs(elements = null) {
  if (!DOM.form) return;

  if (!CURRENT_TAB.element) {
    [CURRENT_TAB.element] = DOM.formTabs;
    CURRENT_TAB.element.classList.add('active');
  }

  if (!elements) {
    elements = DOM.formTabsToggles;
  }

  elements.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const tabName = toggle.dataset.tabTarget;

      PREV_TAB.element = CURRENT_TAB.element;
      PREV_TAB.id = CURRENT_TAB.id;
      CURRENT_TAB.element = findTabByName(tabName);
      CURRENT_TAB.id = CURRENT_TAB.element.dataset.tab;

      console.log('current: ', CURRENT_TAB.id);
      console.log('prev: ', PREV_TAB.id);

      if (!toggle.hasAttribute('data-tab-submit')) {
        displayCurrentTab();
      } else {
        DOM.form.classList.add('loading');
      }

      const changePrevButtonTarget = (label) => {
        const prevButton = CURRENT_TAB.element.querySelector(
          '.form__header-button--prev'
        );
        prevButton.dataset.tabTarget = PREV_TAB.id;
        prevButton.innerText = label || PREV_TAB.id;
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
    });
  });

  DOM.form.addEventListener('toggleTab', () => {
    displayCurrentTab();
    DOM.form.classList.remove('loading');
  });
}
