declare var cast; // TODO find types
declare var chrome;// TODO find types

function sessionListener() {
  console.log('session listener', arguments);
}

function receiverListener(e) {
  if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
    console.log('available');
  } else {
    console.log('not available');
  }
}

function onInitSuccess() {
  console.log('init success', arguments);
}

function onError() {
  console.log('on error', arguments);
}

function onRequestSessionSuccess() {
  console.log('session susccess', arguments);
}

function onLaunchError() {
  console.log('Launch error', arguments);
}

export function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest('2B0E5446');
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

export function onCastClick() {
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}
