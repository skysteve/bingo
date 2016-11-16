/**
 * Created by steve on 15/11/2016.
 */
import {Game} from './Game';
declare var window;
declare var console;
declare var document;

document.addEventListener('DOMContentLoaded', () => {
  const channel = new window.BroadcastChannel('__BUS_NAME__');
  const game = new Game();
  let displayConnected = false;

  const elements = {
    buttons: {
      callNumber: document.querySelector('#btn-call'),
      resetGame: document.querySelector('#btn-reset')
    },
    connection: {
      connected: document.querySelector('#display-connected'),
      disconnected: document.querySelector('#display-disconnected')
    },
    display: {
      lastCalled: document.querySelector('#latest-number'),
      previousNumbers: document.querySelector('#table-last-called')
    }
  };

  elements.buttons.callNumber.addEventListener('click', () => {
    const number = game.nextNumber();
    // add the number to our current list
    elements.display.previousNumbers.setCalled(number);
    elements.display.lastCalled.textContent = number.toString();

    // send the number to the next tab
    channel.postMessage({
      messageType: 'called',
      number: number
    });
  });

  elements.buttons.resetGame.addEventListener('click', () => {
    game.reset();
    elements.display.previousNumbers.reset();
    elements.display.lastCalled.textContent = '-';
      channel.postMessage({
      messageType: 'reset'
    });
  });

  channel.onmessage = (e) => {
    switch (e.data.messageType) {
      case 'display_connected':
        displayConnected = true;
        elements.connection.connected.removeAttribute('style');
        elements.connection.disconnected.style.display = 'none';
        break;
      case 'display_disconnected':
        displayConnected = false;
        elements.connection.connected.style.display = 'none';
        elements.connection.disconnected.removeAttribute('style');
        break;
      default:
        console.warn('Unknown message type', e.data);
    }
  };

  window.addEventListener('beforeunload', () => {
    channel.postMessage({
      messageType: 'caller_disconnected'
    });
  });

  channel.postMessage({
    messageType: 'caller_connected'
  });
});
