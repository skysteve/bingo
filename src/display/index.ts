/**
 * Created by steve on 15/11/2016.
 */
declare var window;
declare var document;

document.addEventListener('DOMContentLoaded', () => {
  const channel = new window.BroadcastChannel('__BUS_NAME__');
  const elLatest = document.querySelector('#latest_number');
  const elTable = document.querySelector('#tableLastCalled');

  // listen for messages from the caller and update the display
  channel.onmessage = (e) => {
    elLatest.textContent = e.data.number;
    elTable.setCalled(e.data.number);
  };
});
