/**
 * Created by steve on 15/11/2016.
 */

const ACTIVE_CLASS = 'mdl-color--green-200';

export class TblLastCalled extends HTMLElement {

  constructor(max = 99) {
    super();

    const elTable = document.createElement('table');
    const elBody = document.createElement('tbody');

    const width = document.documentElement.clientWidth < 800 ? 5 : 10;
    let num = 1;

    for (let i = 0; i < max; i += width) {
      const elRow = document.createElement('tr');

      for (let j = 0; j < width && num <= max; j++) {
        const elTd = document.createElement('td');
        elTd.setAttribute('id', `tbl-${num}`);
        elTd.textContent = num;
        num++;
        elRow.appendChild(elTd);
      }
      elBody.appendChild(elRow);
    }

    elTable.appendChild(elBody);
    elTable.setAttribute('class', 'mdl-data-table mdl-js-data-table mdl-shadow--2dp');
    elTable.style.width = '100%';
    this.appendChild(elTable);
  }

  reset() {
    for (let i = 1; i < 100; i++) {
      const elCalled = this.querySelector(`#tbl-${i}`);
      elCalled.classList.remove(ACTIVE_CLASS);
    }
  }

  setCalled(number) {
    const elCalled = this.querySelector(`#tbl-${number}`);
    elCalled.classList.add(ACTIVE_CLASS);
  }
}
