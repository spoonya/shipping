import { CLASSES } from './constants';

export function toggleDropdown() {
  const selectedList = document.querySelectorAll(
    '[data-form-dropdown-selected]'
  );

  selectedList.forEach((selected) => {
    const dropdown = selected.closest('[data-form-dropdown]');
    const optionsContainer = dropdown.querySelector(
      '[data-form-dropdown-container]'
    );
    const optionsList = dropdown.querySelectorAll(
      '[data-form-dropdown-option]'
    );
    const selectedLabel = selected.querySelector('span');

    let selectedIndex = -1;

    optionsList.forEach((option, index) => {
      option.addEventListener('click', () => {
        selectedIndex = index;
        selectedLabel.textContent = option.querySelector('label').innerText;
        optionsContainer.classList.remove(CLASSES.active);
        selected.classList.add(CLASSES.active);
      });
    });

    selected.addEventListener('click', () => {
      optionsContainer.classList.toggle(CLASSES.active);
      selected.classList.remove(CLASSES.active);
    });

    window.addEventListener('click', (e) => {
      const path = e.path || (e.composedPath && e.composedPath());

      if (path.includes(selected)) return;

      if (optionsContainer.classList.contains(CLASSES.active)) {
        optionsContainer.classList.remove(CLASSES.active);
      }

      if (selectedIndex !== -1) {
        selected.classList.add(CLASSES.active);
      }
    });
  });
}
