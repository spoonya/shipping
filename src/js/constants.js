export const DOM = {
	form: document.querySelector('#form-inspection'),
	formTabs: [...document.querySelectorAll('[data-tab]')],
	formTabsToggles: [...document.querySelectorAll('[data-tab-target]')]
};

export const CURRENT_TAB = {
	element: DOM.formTabs.find((tab) => tab.classList.contains('active')),
	id: ''
};

export const TOKEN = {
	value: ''
};

export const STATE = {
	briefcases: {
		itemsPerView: 2,
		currentIndex: 0
	}
};
