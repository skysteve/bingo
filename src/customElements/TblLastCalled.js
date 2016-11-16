/**
 * Created by steve on 15/11/2016.
 */

const ACTIVE_CLASS = 'mdl-color--green-200';

export class TblLastCalled extends HTMLElement {

  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    const t = document.querySelector('#template-numbers-table');
    const instance = t.content.cloneNode(true);
    shadowRoot.appendChild(instance);
  }

  reset() {
    for (let i=0; i < 100; i++) {
      const elCalled = this.shadowRoot.querySelector(`#tbl-${i}`);
      elCalled.classList.remove(ACTIVE_CLASS);
    }
  }

  setCalled(number) {
    const elCalled = this.shadowRoot.querySelector(`#tbl-${number}`);
    elCalled.classList.add(ACTIVE_CLASS);
  }
}
