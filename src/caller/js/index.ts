/**
 * Created by steve on 15/11/2016.
 */
declare var window;
declare var document;

const currentGame = [];

function getNumber(): number {
  return Math.floor(Math.random() * 99) + 1;
}

document.addEventListener('DOMContentLoaded', () => {
  const channel = new window.BroadcastChannel('__BUS_NAME__');

  const elBtnCall = document.querySelector('#btnCall');
  const elTable = document.querySelector('#tableLastCalled');

  elBtnCall.addEventListener('click', () => {
    // check the game isn't over
    if (currentGame.length >= 99) {
      return window.alert('all numbers between 1 - 99 have been called, start a new game');
    }

    // get the next number which hasn't already been called
    let number = getNumber();
    while (currentGame.includes(number)) {
      number = getNumber();
    }

    // add the number to our current list
    currentGame.push(number);
    elTable.setCalled(number);

    // send the number to the next tab
    channel.postMessage({
      number: number
    });
  });
});
