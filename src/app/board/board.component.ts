import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  BoardCell,
  Cell,
  Direction,
  KeyboardCode,
  Position,
} from './app.model';
import { BoardService } from './board.service';
import { TouchEventHandlerService } from './touchEventHandler.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  providers: [BoardService],
})
export class BoardComponent implements OnInit, OnDestroy {
  constructor(
    private renderer: Renderer2,
    public boardService: BoardService,
    private touchServcie: TouchEventHandlerService
  ) {
    this.renderer.listen('document', 'keydown', (e) =>
      this.handleKeyboardEvent(e.code)
    );
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('touchend', ['$event'])
  @HostListener('touchcancel', ['$event'])
  handleTouch(event: TouchEvent) {
    const swipeDirection = this.touchServcie.getSwipeDirection(event);
    if (!!swipeDirection) this.handleKeyboardEvent(swipeDirection);
  }

  private readonly intialSnakeLength = 5;
  private readonly intialDirection = Direction.RIGHT;
  private interval: any;

  public get headPosition(): Position {
    return this.cells[0].position;
  }
  public get headDirection(): Direction {
    return this.cells[0].direction;
  }
  public get tailCell(): Cell {
    return this.cells[this.cells.length - 1];
  }
  public boardCells: BoardCell[] = [];
  public cells: Cell[] = [];
  public game: 'ON' | 'OFF' = 'OFF';

  ngOnInit() {
    this.createBoard();
  }

  private createBoard(): void {
    for (let i = 1; i <= this.boardService.dim.height; i++) {
      for (let j = 1; j <= this.boardService.dim.width; j++) {
        this.boardCells.push({
          id: Number(`${i}${j}`),
          position: { x: i, y: j },
          hasSnake: false,
        });
      }
    }
  }

  private createSnake(): void {
    this.cells = new Array(this.intialSnakeLength).fill(0).map((m, i) => {
      return {
        id: 11 + i,
        direction: this.intialDirection,
        position: { x: 0, y: 0 },
      };
    });
    this.cells.reverse();
    this.boardCells.forEach((c, i) => {
      if (!!this.cells[i]) {
        this.cells[i].position = c.position;
        c.hasSnake = !!this.cells.find((f) => f.id === c.id);
      }
    });
    this.cells.reverse();
  }

  private handleKeyboardEvent(keyCode: KeyboardCode): void {
    switch (keyCode) {
      case KeyboardCode.LEFT:
      case KeyboardCode.RIGHT:
      case KeyboardCode.UP:
      case KeyboardCode.DOWN:
        if (
          this.boardService.allowDirectionChange(keyCode, this.headDirection)
        ) {
          this.boardCells.forEach((b) => {
            if (
              b.position.x === this.headPosition.x &&
              b.position.y === this.headPosition.y
            ) {
              b.breakpoint = {
                direction: this.boardService.getDirectionFromKeyCode(keyCode),
                hitCount: 0,
              };
            }
          });
        }
    }
  }

  private isSelfHit(pos: Position): boolean {
    return !!this.cells.find(
      (f) => f.position.x === pos.x && f.position.y === pos.y
    );
  }

  private mealEaten(pos: Position): boolean {
    const mealPos = this.boardCells.find((f) => f.hasMeal)?.position;
    return mealPos ? mealPos.x === pos.x && mealPos.y === pos.y : false;
  }

  private progressGame(): void {
    this.checkForDirectionChange();
    const nextCellPos = this.boardService.getNextCellPosition(this.cells[0]);
    if (this.isSelfHit(nextCellPos)) {
      alert('Game Over!');
      this.game = 'OFF';
      clearInterval(this.interval);
      return;
    }
    if (this.mealEaten(nextCellPos)) {
      this.boardCells.forEach((f) => (f.hasMeal = false));
      this.addCell();
      this.getMeal();
      this.boardService.increaseScore();
    }
    this.cells.forEach((cell) => {
      cell.position = this.boardService.getNextCellPosition(cell);
    });
    this.boardCells.forEach((c, i) => {
      c.hasSnake = !!this.cells.find(
        (f) => f.position.x === c.position.x && f.position.y === c.position.y
      );
    });
  }

  private checkForDirectionChange(): void {
    this.boardCells.forEach((bc) => {
      if (!!bc.breakpoint) {
        this.cells.forEach((c) => {
          if (
            bc.position.x === c.position.x &&
            bc.position.y === c.position.y
          ) {
            if (!!bc.breakpoint?.direction) {
              c.direction = bc.breakpoint?.direction;
              bc.breakpoint.hitCount++;
            }
          }
        });
      }
      if (bc.breakpoint?.hitCount === this.cells.length)
        bc.breakpoint = undefined;
    });
  }

  public startGame(): void {
    this.resetGame();
    this.createBoard();
    this.createSnake();
    this.interval = setInterval(() => {
      this.progressGame();
    }, 200);
    this.getMeal();
    this.game = 'ON';
  }

  public resetGame(): void {
    this.boardCells = [];
    this.cells = [];
    this.game = 'OFF';
    this.boardService.clearScore();
  }

  public addCell(): void {
    this.cells.push({
      id: Number((Math.random() * 10).toFixed(3)),
      direction: this.tailCell.direction,
      position: this.boardService.getNewCellPosition(this.tailCell),
    });
  }

  public getMeal(): void {
    const cell = this.boardService.getNewMealPosition(this.boardCells);
    this.boardCells.forEach((b) => {
      if (b.position.x === cell.x && b.position.y === cell.y) {
        b.hasMeal = true;
      }
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.game = 'OFF';
  }
}
