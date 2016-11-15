/**
 * Created by steve on 15/11/2016.
 */
document.addEventListener('DOMContentLoaded', () => {
  const channel = new BroadcastChannel('bingo-bus');

  // listen for messages from the caller and update the display
  channel.onmessage = function (e) {
    const elLatest = document.querySelector('#latest_number');
    elLatest.textContent = e.data.number;
    const elCalled = document.querySelector(`#tbl-${e.data.number}`);
    elCalled.classList.add('mdl-color--green-200');
  };
});
