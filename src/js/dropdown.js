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
        optionsContainer.classList.remove('active');
        selected.classList.add('active');
      });
    });

    selected.addEventListener('click', () => {
      optionsContainer.classList.toggle('active');
      selected.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
      const path = e.path || (e.composedPath && e.composedPath());

      if (path.includes(selected)) return;

      if (optionsContainer.classList.contains('active')) {
        optionsContainer.classList.remove('active');
      }

      if (selectedIndex !== -1) {
        selected.classList.add('active');
      }
    });
  });
}
