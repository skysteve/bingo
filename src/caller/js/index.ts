/**
 * Created by steve on 15/11/2016.
 */
import {ChannelManager} from './ChannelManager';
import {Game} from './Game';
declare var window;
declare var console;
declare var document;

document.addEventListener('DOMContentLoaded', () => {
  const channelManager = new ChannelManager();
  const game = new Game();
  let displayConnected = false;

  const elements = {
    buttons: {
      callNumber: document.querySelector('#btn-call'),
      resetGame: document.querySelector('#btn-reset')
    },
    display: {
      lastCalled: document.querySelector('#latest-number'),
      previousNumbers: document.querySelector('#table-last-called')
    }
  };

  // recover game in case of refresh
  game.calledNumbers.forEach(number => elements.display.previousNumbers.setCalled(number));
  elements.display.lastCalled.textContent = game.latestNumber || '-';

  elements.buttons.callNumber.addEventListener('click', () => {
    const number = game.nextNumber();
    // add the number to our current list
    elements.display.previousNumbers.setCalled(number);
    elements.display.lastCalled.textContent = number.toString();

    // send the number to the next tab
    channelManager.sendMessage({
      messageType: 'called',
      number: number
    });
  });

  elements.buttons.resetGame.addEventListener('click', () => {
    game.reset();
    elements.display.previousNumbers.reset();
    elements.display.lastCalled.textContent = '-';
    channelManager.sendMessage({
      messageType: 'reset'
    });
  });

  channelManager.onmessage = (e) => {
    switch (e.data.messageType) {
      case 'display_connected':
        displayConnected = true;
        channelManager.sendMessage({
          messageType: 'active_game',
          calledNumbers: game.calledNumbers,
          latestNumber: game.latestNumber
        });

        break;
      case 'display_disconnected':
        displayConnected = false;
        break;
      default:
        console.warn('Unknown message type', e.data);
    }
  };

  window.addEventListener('beforeunload', () => {
    channelManager.sendMessage({
      messageType: 'caller_disconnected'
    });
  });

  channelManager.sendMessage({
    messageType: 'caller_connected'
  });
});
