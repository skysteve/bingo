/**
 * Created by steve on 15/11/2016.
 */
export class Game {
  private currentGame: Array<number>;
  private lastNumber: number;

  constructor() {
    this.currentGame = [];
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
    return number;
  }

  public reset(): void {
    this.currentGame = [];
  }

  private static getNumber(): number {
    return Math.floor(Math.random() * 99) + 1;
  }
}
