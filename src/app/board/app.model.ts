export enum Direction {
  UP = 1,
  RIGHT = 2,
  DOWN = 3,
  LEFT = 4,
}

export enum KeyboardCode {
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  SPACE = 'Space',
}

export interface BoardCell {
  id: number;
  position: Position;
  breakpoint?: Breakpoint;
  hasSnake: boolean;
  hasMeal?: boolean;
}

export interface Cell {
  id: number;
  direction: Direction;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface Breakpoint {
  direction: Direction;
  hitCount: number;
}
