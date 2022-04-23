import { CLASSES } from '../constants';

export function isOpen(element) {
  if (!element.classList.contains(CLASSES.open)) {
    return false;
  }

  return true;
}
