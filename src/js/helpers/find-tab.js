import { DOM } from '../constants';

export function findTabByName(name) {
	return DOM.formTabs.find((tab) => tab.getAttribute('data-tab') === name);
}
