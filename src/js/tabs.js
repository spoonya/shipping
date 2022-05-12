import { DOM, CURRENT_TAB } from './constants';
import { findTabByName } from './helpers';

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

	let prevTab;
	let prevTabId;

	DOM.formTabsToggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const tabId = toggle.dataset.tabTarget;

			prevTab = CURRENT_TAB.element;
			prevTabId = CURRENT_TAB.id;
			CURRENT_TAB.element = findTabByName(tabId);
			CURRENT_TAB.id = CURRENT_TAB.element.dataset.tab;

			const changePrevButtonTarget = (label) => {
				const prevButton = CURRENT_TAB.element.querySelector(
					'.form__header-button--prev'
				);
				prevButton.dataset.tabTarget = prevTabId;
				prevButton.innerText = label || prevTabId;
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
				displayCurrentTab(prevTab);
			} else {
				DOM.form.classList.add('loading');
			}
		});
	});

	DOM.form.addEventListener('toggleTab', () => {
		displayCurrentTab(prevTab);
		DOM.form.classList.remove('loading');
	});
}

export function controlTabs() {
	toggleFormTabs();
}
