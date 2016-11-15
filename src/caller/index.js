/**
 * Created by steve on 15/11/2016.
 */
const currentGame = [];

function getNumber() {
  return Math.floor(Math.random() * 99) + 1;
}

document.addEventListener('DOMContentLoaded', () => {
  const channel = new BroadcastChannel('bingo-bus');

  const elBtnCall = document.querySelector('#btnCall');
  const elLastCalled = document.querySelector('#lastCalled');

  elBtnCall.addEventListener('click', () => {
    // check the game isn't over
    if (currentGame.length >= 99) {
      return alert('all numbers between 1 - 99 have been called, start a new game');
    }

    // get the next number which hasn't already been called
    let number = getNumber();
    while (currentGame.includes(number)) {
      number = getNumber();
    }

    // add the number to our current list
    currentGame.push(number);
    const elListItem = document.createElement('li');
    elListItem.textContent = number;
    elLastCalled.appendChild(elListItem);

    // send the number to the next tab
    channel.postMessage({
      number: number
    });
  });
});
