/**
 * Created by steve on 15/11/2016.
 */
declare var window;
declare var document;

document.addEventListener('DOMContentLoaded', () => {
  const channel = new window.BroadcastChannel('__BUS_NAME__');

  // render previous holder template TODO this should be a custom element
  const elPreviousHolder = document.querySelector('#previousHolder');
  const elTemplate = document.querySelector('#template-numbers-table');
  const clone = document.importNode(elTemplate.content, true);
  elPreviousHolder.appendChild(clone);

  // listen for messages from the caller and update the display
  channel.onmessage = (e) => {
    const elLatest = document.querySelector('#latest_number');
    elLatest.textContent = e.data.number;
    const elCalled = document.querySelector(`#tbl-${e.data.number}`);
    elCalled.classList.add('mdl-color--green-200');
  };
});
