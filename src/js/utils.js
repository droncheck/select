export function capitalize(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const setSelection = ($target, isSelected = true) => {
  switch (isSelected) {
    case true:
      $target.classList.add('selected');
      $target.setAttribute('aria-selected', true);
      break;
    case false:
      $target.classList.remove('selected');
      $target.setAttribute('aria-selected', false);
      break;
  }
};