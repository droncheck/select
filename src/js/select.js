import {createSelect} from './select.template';
import {capitalize, setSelection} from './utils';

export class Select {
  constructor($root, options) {
    this.$root = $root;
    this.options = options;

    if (document.contains(this.$root)) {
      this.init();
    }
  }

  init() {
    this.render();

    this.$root = this.$root.querySelector('.select');
    this.$dropdown = this.$root.querySelector('[data-select-dropdown]');
    this.$list = this.$root.querySelector('[data-select-list]');
    this.$listItems = this.$root.querySelectorAll('[data-select-item]');
    this.$input = this.$root.querySelector('[data-select-input]');

    this.$selectedItems = Array.prototype.filter.call(this.$listItems, $listItem => {
      return $listItem.classList.contains('selected');
    });

    this.updateValue()
    if (this.$listItems.length - 1 === this.$selectedItems.length) {
      setSelection(this.$listItems[0], true)
    }

    this.addListeners(['click', 'keydown', 'mousemove', 'focusout', 'focusin']);
  }

  render() {
    this.$root.innerHTML = createSelect(this.options.items);
  }

  addListeners(listeners) {
    listeners.forEach(listener => {
      this['on' + capitalize(listener)] = this['on' + capitalize(listener)].bind(this);
      this.$root.addEventListener(listener, this['on' + capitalize(listener)]);
    });
  }

  onMousemove(e) {
    const $target = e.target;

    if ($target.dataset.selectItem) {
      this.highlight($target);
    }
  }

  onFocusout(e) {
    if (!this.$root.contains(e.relatedTarget)) {
      this.closeDropdown();
      this.$input.classList.remove('focus');
    }
  }

  onFocusin() {
    this.$input.classList.add('focus');
  }

  onClick(e) {
    const $target = e.target;

    if ($target.dataset.selectItem) {
      this.setSelection($target);
    } else if ($target.dataset.selectInput) {
      this.toggleDropdown();
    }
  }

  onKeydown(e) {
    const key = e.code;

    if (key === 'Enter') {
      e.preventDefault();
      this.$input.focus();
      this.toggleDropdown();
    } else if (key === 'Space') {
      e.preventDefault();
      if (this.isOpen) this.setSelection(this.$highlightedListItem);
    } else if (key === 'ArrowUp') {
      const $prevEl = this.$highlightedListItem.previousElementSibling
      if ($prevEl) {
        this.highlight($prevEl)
      }
    } else if (key === 'ArrowDown') {
      const $nextEl = this.$highlightedListItem.nextElementSibling
      if ($nextEl) {
        this.highlight($nextEl)
      }
    }
  }

  openDropdown() {
    this.isOpen = true;

    this.$root.classList.add('open');

    this.$dropdown.classList.add('open');

    this.$input.setAttribute('aria-expanded', true);
    this.$list.setAttribute('aria-expanded', true);

    this.highlight(this.$listItems[0]);

    if (this.isNeedToReverse) {
      this.$root.classList.add('reverse');
    }

    this.$list.focus();
    this.$list.scrollTo(0, 0);
  }

  closeDropdown() {
    this.isOpen = false;

    this.$root.classList.remove('open');
    this.$root.classList.remove('reverse');

    this.$dropdown.classList.remove('open');

    this.$input.setAttribute('aria-expanded', false);
    this.$list.setAttribute('aria-expanded', false);
    this.$list.removeAttribute('aria-activedescendant');
  }

  toggleDropdown() {
    this.isOpen ? this.closeDropdown() : this.openDropdown();
  }

  setSelection = ($target) => {
    const type = $target.dataset.selectItem;
    switch (type) {
      case 'single':
        this.toggle($target);
        break;
      case 'all':
        this.toggleAll($target.getAttribute('aria-selected'));
        break;
    }
  }

  select($target) {

    setSelection($target, true);
    this.$selectedItems.push($target);
    this.updateValue();

  }

  selectAll() {
    this.$selectedItems = [];
    this.$listItems.forEach($listItem => {
      setSelection($listItem, true);
      if ($listItem.dataset.selectItem === 'single') {
        this.$selectedItems.push($listItem);
      }
    });
    this.updateValue();
  }

  deselect($target) {

    setSelection($target, false);
    this.$selectedItems.splice(this.$selectedItems.indexOf($target), 1);
    this.updateValue();

  }

  deselectAll() {
    this.$selectedItems = [];
    this.$listItems.forEach($listItem => {
      setSelection($listItem, false);
    });
    this.updateValue();
  }

  toggle($target) {
    const isSelected = $target.getAttribute('aria-selected') === 'true';

    isSelected ? this.deselect($target) : this.select($target);
  }

  toggleAll(isSelected) {
    isSelected === 'true' ? this.deselectAll() : this.selectAll();
  }

  highlight($target) {
    this.$listItems.forEach($listItem => {
      if ($listItem === $target) {
        $listItem.classList.add('hover');
        this.$list.setAttribute('aria-activedescendant', $listItem.id);
        this.$highlightedListItem = $listItem;
      } else {
        $listItem.classList.remove('hover');
      }
    });
  }

  updateValue() {
    this.$input.value = this.selectedItemsValues.length ?
        this.selectedItemsValues.join(', ') :
        '';
  }

  get selectedItemsValues() {
    return this.$selectedItems.map(item => {
      return item.dataset.value;
    });
  }

  get isNeedToReverse() {
    if (this.$root.getBoundingClientRect().top > window.innerHeight / 2) {
      return true;
    }
    return false;
  }

}