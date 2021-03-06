/**
 * Created by steve on 15/11/2016.
 */
declare var window;
declare var console;
declare var document;

function speakNumber(num: number): void {
  const numString = num.toString();
  let text = numString;

  // break the numbers out to the digits (e.g. 24. 2. 4. 24)
  // the . ensures a pause between numbers
  if (numString.length > 1) {
    for (let i = 0; i < numString.length; i++) {
      text += `. ${numString.charAt(i)}`;
    }

    text += `.. ${numString}`;
  }

  const msg = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}

document.addEventListener('DOMContentLoaded', () => {
  const channel = new window.BroadcastChannel('__BUS_NAME__');
  const elLatest = document.querySelector('#latest_number');
  const elTable = document.querySelector('#tableLastCalled');
  const elToast = document.querySelector('#toastMsg');

  // listen for messages from the caller and update the display
  channel.onmessage = (e) => {
    let toastData;
    switch (e.data.messageType) {
      case 'caller_connected':
        toastData = {
          message: 'Bingo Caller is connected',
          timeout: 3000
        };
        elToast.MaterialSnackbar.showSnackbar(toastData);
        // tell the caller we're alive
        channel.postMessage({
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
        // speakNumber(e.data.number);
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
    channel.postMessage({
      messageType: 'display_disconnected'
    });
  });

  channel.postMessage({
    messageType: 'display_connected'
  });
});
