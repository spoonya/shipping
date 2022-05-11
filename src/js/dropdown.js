export function toggleDropdown() {
	const selectedList = document.querySelectorAll(
		'[data-form-dropdown-selected]'
	);

	selectedList.forEach((selected) => {
		const dropdown = selected.closest('[data-form-dropdown]');
		const optionsContainer = dropdown.querySelector(
			'[data-form-dropdown-container]'
		);
		const selectedLabel = selected.querySelector('span');

		if (!dropdown.hasAttribute('data-form-dropdown-spoiler')) {
			optionsContainer.addEventListener('click', (e) => {
				const option = e.target.closest('[data-form-dropdown-option]');

				if (e.target.tagName === 'DIV') {
					option.querySelector('input').checked = true;
				}

				selectedLabel.textContent = option.querySelector('label').innerText;
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
