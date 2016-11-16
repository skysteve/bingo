/**
 * Created by steve on 15/11/2016.
 */
export class Game {
  private currentGame: Array<number>;
  private lastNumber: number;

  constructor() {
    const recoveredValues = window.sessionStorage.getItem('currentGame');
    const recoveredLastNumber = window.sessionStorage.getItem('lastNumber');
    this.currentGame = recoveredValues ? JSON.parse(recoveredValues) : [];
    this.lastNumber = recoveredLastNumber ? parseInt(recoveredLastNumber, 10) : null;
  }

  public get calledNumbers(): Array<number> {
    return this.currentGame;
  }

  public get latestNumber(): number {
    return this.lastNumber;
  }

  public nextNumber(): number {
    // check the game isn't over
    if (this.currentGame.length >= 99) {
      return -1;
    }

    // get the next number which hasn't already been called
    let number = Game.getNumber();
    while (this.currentGame.includes(number)) {
      number = Game.getNumber();
    }

    this.currentGame.push(number);
    this.lastNumber = number;
    window.sessionStorage.setItem('lastNumber', number.toString());
    window.sessionStorage.setItem('currentGame', JSON.stringify(this.currentGame));
    return number;
  }

  public reset(): void {
    this.currentGame = [];
    window.sessionStorage.removeItem('lastNumber');
    window.sessionStorage.removeItem('currentGame');
  }

  private static getNumber(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
