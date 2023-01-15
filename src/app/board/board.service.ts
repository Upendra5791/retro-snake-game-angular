import { Injectable } from '@angular/core';
import { Direction, KeyboardCode, Cell, Position, BoardCell } from './app.model';

@Injectable()
export class BoardService {

  private _score = 0;
  public get score(): number {
    return this._score;
  }
  public set score(val: number) {
    if (val >= 0) {
      this._score = val;
    }
  }
  public increaseScore(): void {
    this.score += 5;
  }
  public clearScore(): void {
    this.score = 0;
  }

  public readonly dim = {
    width: 30,
    height: 30,
  };

  public allowDirectionChange(keyCode: KeyboardCode, headDirection: Direction): boolean {
    const key = this.getDirectionFromKeyCode(keyCode)
    switch (headDirection) {
      case Direction.UP:
        return key !== headDirection && key !== Direction.DOWN;
      case Direction.DOWN:
        return key !== headDirection && key !== Direction.UP;
      case Direction.LEFT:
        return key !== headDirection && key !== Direction.RIGHT;
      case Direction.RIGHT:
        return key !== headDirection && key !== Direction.LEFT;
    }
  }

  public getDirectionFromKeyCode(code: KeyboardCode): Direction {
    switch (code) {
      case KeyboardCode.LEFT:
        return Direction.LEFT;
      case KeyboardCode.RIGHT:
        return Direction.RIGHT;
      case KeyboardCode.UP:
        return Direction.UP;
      case KeyboardCode.DOWN:
        return Direction.DOWN;
      default:
        return Direction.LEFT;
    }
  }

  public getNextCellPosition(cell: Cell): Position {
    let newPos = {
      x: cell.position.x,
      y: cell.position.y,
    };
    switch (cell.direction) {
      case Direction.RIGHT:
        newPos.y = newPos.y === this.dim.width ? 1 : newPos.y + 1;
        break;
      case Direction.DOWN:
        newPos.x = newPos.x === this.dim.height ? 1 : newPos.x+ 1;
        break;
      case Direction.UP:
        newPos.x = newPos.x === 1 ? this.dim.height : newPos.x - 1;
        break;
      case Direction.LEFT:
        newPos.y = newPos.y === 1 ? this.dim.width : newPos.y - 1;
        break;
    }
    return newPos;
  }

  public getNewCellPosition(cell: Cell): Position {
    let newPos = {
      x: cell.position.x,
      y: cell.position.y,
    };
    switch (cell.direction) {
      case Direction.RIGHT:
        newPos.y = newPos.y - 1;
        break;
      case Direction.DOWN:
        newPos.x = newPos.x - 1;
        break;
      case Direction.UP:
        newPos.x = newPos.x + 1;
        break;
      case Direction.LEFT:
        newPos.y = newPos.y + 1;
        break;
    }
    return newPos;
  }

  public getNewMealPosition(board: BoardCell[]): Position {
    const availableCells = board.filter(f => !f.hasSnake);
    const cellIdx = Math.floor(Math.random() * availableCells.length);
    return availableCells[cellIdx].position;
  }
}
