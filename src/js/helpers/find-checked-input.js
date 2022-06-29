export function findCheckedInput(container) {
  let checkedInput;

  container.querySelectorAll('input').forEach((input) => {
    if (input.checked) {
      checkedInput = input;
    }
  });

  return checkedInput;
}
