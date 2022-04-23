const form = document.querySelector('#form-inspection');
const formTabs = [...form.querySelectorAll('[data-tab]')];
const formTabsToggles = form.querySelectorAll('[data-tab-target]');
let currentTab = formTabs.find((tab) => tab.classList.contains('active'));

if (!currentTab) {
  [currentTab] = formTabs;
  currentTab.classList.add('active');
}

formTabsToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const tabId = toggle.dataset.tabTarget;
    const tab = formTabs.find((el) => el.dataset.tab === tabId);

    if (tab) {
      currentTab.classList.remove('active');
      tab.classList.add('active');
      currentTab = tab;
    }
  });
});

formTabs.forEach((tab) => {
  tab.addEventListener('animationend', (e) => {
    currentTab.classList.remove('hidden');
    e.target.classList.toggle('hidden', !e.target.classList.contains('active'));
  });
});
