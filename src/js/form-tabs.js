import { CLASSES } from './constants';

export function toggleFormTabs() {
  const form = document.querySelector('#form-inspection');

  if (!form) return;

  const formTabs = [...form.querySelectorAll('[data-tab]')];
  const formTabsToggles = form.querySelectorAll('[data-tab-target]');
  let currentTab = formTabs.find((tab) =>
    tab.classList.contains(CLASSES.active)
  );

  if (!currentTab) {
    [currentTab] = formTabs;
    currentTab.classList.add(CLASSES.active);
  }

  formTabsToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const tabId = toggle.dataset.tabTarget;
      const tab = formTabs.find((el) => el.dataset.tab === tabId);

      if (tab) {
        currentTab.classList.remove(CLASSES.active);
        tab.classList.add(CLASSES.active);
        currentTab = tab;
      }
    });
  });
}
