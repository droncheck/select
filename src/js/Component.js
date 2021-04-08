import {capitalize} from "./util";

export class Component {
  constructor($root) {
    this.$root = $root;

    if (document.contains(this.$root)) {
      this.init();
    }
  }

  init() {
  }

  addListeners(listeners) {
    listeners.forEach(listener => {
      this['on' + capitalize(listener)] = this['on' + capitalize(listener)].bind(this);
      this.$root.addEventListener(listener, this['on' + capitalize(listener)]);
    });
  }
}