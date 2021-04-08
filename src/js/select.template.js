import { v4 as uuidv4 } from 'uuid';

function createOption(items) {
  return Array.from(items).map((item) => {
    const value = item.value;
    const text = item.text
    const selectedClass = item.selected ?
        'selected' :
        '';
    const isSelected = item.selected ?
        'true' :
        'false'

    return `
        <div id=${uuidv4()} class="select__option ${selectedClass}"
            role="option" data-select-item="single"
            data-value="${value}"
            aria-selected="${isSelected}"
            >${text}</div>
        `
  }).join('');
}

export function createSelect(items = [], placeholder='Выбрать...') {
  const id = uuidv4();

  return `
      <div class="select">
        <div class="select__window">
          <input type="text" class="select__input" data-select-input="true" role="combobox" readonly placeholder="${placeholder}" aria-haspopup="listbox" aria-expanded="false">
        </div>
        <div class="select__dropdown" data-select-dropdown >
          <div class="select__list" role="listbox" aria-multiselectable="true" data-select-list tabindex="-1" aria-expanded="false" aria-activedescendant="">
            <div id="${id}" class="select__option" role="option" data-select-item="all" aria-selected="false">Выбрать все</div>
            ${createOption(items)}
          </div>
        </div>
      </div>
  `
}