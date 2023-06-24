import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {GameState} from "../../interfaces/game-state";
import {SessionState} from "../../enums/session-state";
import {round} from "@popperjs/core/lib/utils/math";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit, OnChanges {
  public fieldWidth = 100;
  public fieldHeight = 70;
  public squareSize = 10;
  public sessionState!: SessionState;
  public showCountdown: number = 20;
  public lobbyName: string = '';

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
      let gameState: GameState = changes["gameState"].currentValue
      if (gameState)
      {
        this.lobbyName = gameState.session.name
        this.sessionState = gameState.session.state;
        this.draw(gameState)
        if (gameState.session.countDown) {
          this.showCountdown = round(gameState.session.countDown / 1000);
        }

        if (gameState.session) {
          this.fieldWidth = gameState.session.fieldWidth;
          this.fieldHeight = gameState.session.fieldHeight;

          if (this.canvas.width / this.fieldWidth < this.canvas.height / this.fieldHeight) {
            this.squareSize = this.canvas.width / this.fieldWidth;
          } else {
            this.squareSize = this.canvas.height / this.fieldHeight;
          }
        }
      }
    }
  }

  public draw(gameState: GameState): void {
    this.drawField();
    if (gameState) {
      gameState.snakes.forEach((snake: [number, number][]): void => {
        this.drawSnake(snake, gameState.player.position);
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

  private drawSnake(snake: [number, number][], playerHeadPos: [number, number]): void {
    snake.forEach((segment: [number, number]): void => {
      this.context!.fillStyle = "darkgreen";

      if (snake.indexOf(segment) === 0) {
        this.context!.fillStyle = "lightgreen";
        if (playerHeadPos && segment[0] === playerHeadPos[0] && segment[1] === playerHeadPos[1]) {
          this.context!.fillStyle = "yellow";
        }
      }

      this.context!.fillRect(segment[0] * this.SQUARE_SIZE, segment[1] * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
    });
  }

  protected readonly SessionState = SessionState;
}
