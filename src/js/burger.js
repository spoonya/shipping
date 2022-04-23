import { CLASSES, DOM } from './constants';

const burgerBtn = document.querySelector('#burger-button');
const header = document.querySelector('#header');

function toggleBurger() {
  burgerBtn.addEventListener('click', function () {
    DOM.body.classList.toggle(CLASSES.scrollHidden);
    header.classList.toggle(CLASSES.open);
    DOM.overlay.classList.toggle(CLASSES.active);
    this.classList.toggle(CLASSES.active);
  });

  DOM.overlay.addEventListener('click', function () {
    DOM.body.classList.toggle(CLASSES.scrollHidden);
    header.classList.toggle(CLASSES.open);
    burgerBtn.classList.toggle(CLASSES.active);
    this.classList.toggle(CLASSES.active);
  });
}

export function controlHeaderBurger() {
  toggleBurger();
}
