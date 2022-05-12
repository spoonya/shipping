import { DOM, CURRENT_TAB, PREV_TAB } from '../constants';
import { findTabByName } from '../helpers';

function displayCurrentTab(prevTab) {
	prevTab.classList.remove('active');
	CURRENT_TAB.element.classList.add('active');
}

function toggleFormTabs() {
	if (!DOM.form) return;

	if (!CURRENT_TAB.element) {
		[CURRENT_TAB.element] = DOM.formTabs;
		CURRENT_TAB.element.classList.add('active');
	}

	DOM.formTabsToggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const tabId = toggle.dataset.tabTarget;

			PREV_TAB.element = CURRENT_TAB.element;
			PREV_TAB.id = CURRENT_TAB.id;
			CURRENT_TAB.element = findTabByName(tabId);
			CURRENT_TAB.id = CURRENT_TAB.element.dataset.tab;

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

			if (!toggle.hasAttribute('data-tab-submit')) {
				displayCurrentTab(PREV_TAB.element);
			} else {
				DOM.form.classList.add('loading');
			}
		});
	});

	DOM.form.addEventListener('toggleTab', () => {
		displayCurrentTab(PREV_TAB.element);
		DOM.form.classList.remove('loading');
	});
}

export function controlTabs() {
	toggleFormTabs();
}
