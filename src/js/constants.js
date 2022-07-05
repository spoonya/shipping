export const DOM = {
  form: document.querySelector('#form-inspection'),
  formTabs: [...document.querySelectorAll('[data-tab]')],
  formTabsToggles: [...document.querySelectorAll('[data-tab-target]')]
};

export const CURRENT_TAB = {
  element: DOM.formTabs.find((tab) => tab.classList.contains('active')),
  id: null
};

export const PREV_TAB = {
  element: null,
  id: null
};

export const ANSWERS_INFO_ACTIONS = {
  add: 'add',
  edit: 'edit'
};

export const STATE = {
  activeQuestions: {
    idArray: []
  },
  dropdowns: {
    isLoaded: false
  },
  token: '',
  currentBriefcaseId: null
};

export const BASE_URL = 'https://dev.eraapp.ru';
