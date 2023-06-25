import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
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
    this.canvas.width = document.getElementById("field")!.clientWidth;
    this.canvas.height = document.getElementById("field")!.clientHeight;
    this.context = this.canvas.getContext("2d");

    this.drawField(0, 0);
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
    if (this.canvas && this.context) {
      let xOffset: number = (this.canvas?.width - (this.squareSize * this.fieldWidth)) / 2;
      let yOffset: number = (this.canvas?.height - (this.squareSize * this.fieldHeight)) / 2;

      this.drawField(xOffset, yOffset);
      if (gameState) {
        this.drawApples(gameState.apples, xOffset, yOffset);
        gameState.snakes.forEach((snake: [number, number][]): void => {
          this.drawSnake(snake, gameState.player.position, xOffset, yOffset);
        });
      }
    }
  }

  private drawField(xOffset: number, yOffset: number): void {
    if (this.canvas && this.context) {
      this.context.fillStyle = "#FFFFFF";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      for (let x = 0; x < this.fieldWidth; x++) {
        for (let y = 0; y < this.fieldHeight; y++) {
          this.context.fillStyle = (x + y) % 2 == 0 ? "#A2D149" : "#AAD751";
          this.context.fillRect(x * this.squareSize + xOffset, y * this.squareSize + yOffset, this.squareSize, this.squareSize);
        }
      }
    }
  }

  private drawApples(apples: [number, number][], xOffset: number, yOffset: number): void {
    apples.forEach((apple: [number, number]): void => {
      this.context!.fillStyle = "red";
      this.context!.fillRect(apple[0] * this.squareSize + xOffset, apple[1] * this.squareSize + yOffset, this.squareSize, this.squareSize);
    });
  }

  private drawSnake(snake: [number, number][], playerHeadPos: [number, number], xOffset: number, yOffset: number): void {
    snake.forEach((segment: [number, number]): void => {
      this.context!.fillStyle = "darkgreen";

      if (snake.indexOf(segment) === 0) {
        this.context!.fillStyle = "lightgreen";
        if (playerHeadPos && segment[0] === playerHeadPos[0] && segment[1] === playerHeadPos[1]) {
          this.context!.fillStyle = "yellow";
        }
      }

      this.context!.fillRect(segment[0] * this.squareSize + xOffset, segment[1] * this.squareSize + yOffset, this.squareSize, this.squareSize);
    });
  }

  protected readonly SessionState = SessionState;
}
