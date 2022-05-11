import { DOM, CURRENT_TAB } from './constants';
import { findTab } from './helpers';

function toggleFormTabs() {
	if (!DOM.form) return;

	if (!CURRENT_TAB.element) {
		[CURRENT_TAB.element] = DOM.formTabs;
		CURRENT_TAB.element.classList.add('active');
	}

	DOM.formTabsToggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const tabId = toggle.dataset.tabTarget;
			const tab = findTab(tabId);
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

export function controlTabs() {
	toggleFormTabs();
}
