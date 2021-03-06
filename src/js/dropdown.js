export function toggleDropdown(elements = null) {
  let selectedList;

  if (!elements) {
    selectedList = document.querySelectorAll('[data-form-dropdown-selected]');
  } else {
    selectedList = elements;
  }

  selectedList.forEach((selected) => {
    const dropdown = selected.closest('[data-form-dropdown]');
    const optionsContainer = dropdown.querySelector(
      '[data-form-dropdown-container]'
    );
    const selectedLabel = selected.querySelector('span');

    if (dropdown.dataset.formDropdown !== 'spoiler') {
      optionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('[data-form-dropdown-option]');

        if (
          e.target.tagName === 'DIV' &&
          !e.target.classList.contains('form__options-container')
        ) {
          option.querySelector('input').checked = true;
        }

        if (option) {
          selectedLabel.textContent = option.querySelector('label').innerText;
        }
        optionsContainer.classList.remove('active');
        optionsContainer.setAttribute('data-dropdown-selected', true);
      });
    }

    selected.addEventListener('click', () => {
      optionsContainer.classList.toggle('active');
    });

    window.addEventListener('click', (e) => {
      const path = e.path || (e.composedPath && e.composedPath());

      if (path.includes(selected)) return;

      if (optionsContainer.classList.contains('active')) {
        optionsContainer.classList.remove('active');
      }
    });
  });
}
