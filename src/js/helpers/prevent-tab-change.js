import { DOM, CURRENT_TAB, PREV_TAB } from '../constants';

export function preventTabChange() {
  DOM.form.classList.remove('loading');
  CURRENT_TAB.element = PREV_TAB.element;
  CURRENT_TAB.id = PREV_TAB.id;
}
