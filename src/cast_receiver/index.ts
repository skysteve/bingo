/**
 * Created by steve on 20/11/2016.
 */
declare var window;
declare var console;
declare var document;
declare var cast;

const elMessageList = document.querySelector('#messageList');

window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

var customMessageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:skysteve.bingo');

const elLatest = document.querySelector('#latest_number');
const elTable = document.querySelector('#tableLastCalled');
const elToast = document.querySelector('#toastMsg');

// listen for messages from the caller and update the display
customMessageBus.onMessage = (e) => {
  let toastData;
  switch (e.data.messageType) {
    case 'caller_connected':
      toastData = {
        message: 'Bingo Caller is connected',
        timeout: 3000
      };
      elToast.MaterialSnackbar.showSnackbar(toastData);
      // tell the caller we're alive
      customMessageBus.broadcast({
        messageType: 'display_connected'
      });
      break;
    case 'caller_disconnected':
      toastData = {
        message: 'Bingo Caller has disconnected',
        timeout: 10000
      };
      elToast.MaterialSnackbar.showSnackbar(toastData);
      break;
    case 'called':
      elLatest.textContent = e.data.number;
      elTable.setCalled(e.data.number);
      break;
    case 'reset':
      elTable.reset();
      elLatest.textContent = '-';
      break;
    case 'active_game':
      // if our display re-connects we get an update of the current state of the game, so replicate it
      elTable.reset();
      e.data.calledNumbers.forEach(number => elTable.setCalled(number));
      elLatest.textContent = e.data.latestNumber || '-';
      break;
    default:
      console.warn('Unknown message type', e.data);
  }
};

window.addEventListener('beforeunload', () => {
  customMessageBus.broadcast({
    messageType: 'display_disconnected'
  });
});

customMessageBus.broadcast({
  messageType: 'display_connected'
});

window.castReceiverManager.start();
