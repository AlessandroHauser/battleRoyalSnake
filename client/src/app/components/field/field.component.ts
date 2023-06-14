import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {GameState} from "../../interfaces/game-state";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  public readonly FIELD_WIDTH = 100;
  public readonly FIELD_HEIGHT = 70;
  public readonly SQUARE_SIZE = 10;

  private canvas: HTMLCanvasElement | undefined;
  private context: CanvasRenderingContext2D | null | undefined;

  @Input()
  gameState: GameState | null = null;

  constructor() {
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById("field");
    this.canvas.width = this.FIELD_WIDTH * this.SQUARE_SIZE;
    this.canvas.height = this.FIELD_HEIGHT * this.SQUARE_SIZE;
    this.context = this.canvas.getContext("2d");

    this.drawField();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.canvas && this.context) {
      this.draw(changes["gameState"].currentValue)
    }
  }

  public draw(gameState: GameState): void {
    this.drawField();
    if (gameState) {
      gameState.snakes.forEach((snake: [number, number][]): void => {
        this.drawSnake(snake);
      });
      this.drawApples(gameState.apples);
    }
  }

  private drawField(): void {
    for (let x = 0; x < this.FIELD_WIDTH; x++) {
      for (let y = 0; y < this.FIELD_HEIGHT; y++) {
        this.context!.fillStyle = (x + y) % 2 == 0 ? "#A2D149" : "#AAD751";
        this.context!.fillRect(x * this.SQUARE_SIZE, y * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
      }
    }
  }

  private drawApples(apples: [number, number][]): void {
    apples.forEach((apple: [number, number]): void => {
      this.context!.fillStyle = "red";
      this.context!.fillRect(apple[0] * this.SQUARE_SIZE, apple[1] * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
    });
  }

  private drawSnake(snake: [number, number][]): void {
    snake.forEach((segment: [number, number]): void => {
      this.context!.fillStyle = "darkgreen";
      this.context!.fillRect(segment[0] * this.SQUARE_SIZE, segment[1] * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
    });
  }
}
