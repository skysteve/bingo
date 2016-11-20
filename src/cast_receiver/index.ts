/**
 * Created by steve on 20/11/2016.
 */
declare var window;
declare var cast;

const elMessageList = document.querySelector('#messageList');

window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

var customMessageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:skysteve.bingo');
customMessageBus.onMessage = function(event) {
  // Handle message
  console.log('event', event);
  const elLi = document.createElement('li');
  elLi.innerText = JSON.stringify(event, null, 4);
  elMessageList.appendChild(elLi);
};

window.castReceiverManager.start();
