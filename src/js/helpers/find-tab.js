import { DOM } from '../constants';

export function findTab(name) {
	return DOM.formTabs.find((tab) => tab.getAttribute('data-tab') === name);
}
