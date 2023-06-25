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
	@Input()
	gameState: GameState | null = null;

	public sessionState: SessionState | null;
	public lobbyName: string | null;
	public countdown: number | null;

	private canvas: HTMLCanvasElement | null;
	private context: CanvasRenderingContext2D | null;

	public fieldWidth: number | undefined;
	public fieldHeight: number | undefined;
	public squareSize: number | undefined;

	protected readonly SessionState = SessionState;

	constructor() {
		this.sessionState = null;
		this.lobbyName = null;
		this.countdown = null;

		this.canvas = null;
		this.context = null;
	}

	ngOnInit(): void {
		const padding: number = parseInt(window.getComputedStyle(document.getElementById("field")!).padding.split("px")[0]);

		this.canvas = <HTMLCanvasElement>document.getElementById("field");
		this.canvas.width = this.canvas.clientWidth - (padding * 2);
		this.canvas.height = this.canvas.clientHeight - (padding * 2);
		this.context = this.canvas.getContext("2d");

		this.squareSize = 20;
		this.fieldWidth = this.canvas.width / this.squareSize;
		this.fieldHeight = this.canvas.height / this.squareSize;

		this.drawField();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (this.canvas && this.context) {
			const gameState: GameState = changes["gameState"].currentValue
			if (gameState) {
				this.lobbyName = gameState.session.name
				this.sessionState = gameState.session.state;
				this.draw(gameState)
				if (gameState.session.countDown) {
					this.countdown = round(gameState.session.countDown / 1000);
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
		if (this.canvas && this.context && this.fieldWidth && this.fieldHeight && this.squareSize) {
			const xOffset: number = (this.canvas.width - (this.fieldWidth * this.squareSize)) / 2;
			const yOffset: number = (this.canvas.height - (this.fieldHeight * this.squareSize)) / 2;

			this.drawField(xOffset, yOffset);
			if (gameState) {
				this.drawApples(gameState.apples, xOffset, yOffset);
				gameState.snakes.forEach((snake: [number, number][]): void => {
					this.drawSnake(snake, gameState.player.position, xOffset, yOffset);
				});
			}
		}
	}

	private drawField(xOffset: number = 0, yOffset: number = 0): void {
		if (this.canvas && this.context && this.fieldWidth && this.fieldHeight && this.squareSize) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

			for (let x = 0; x < this.fieldWidth; x++) {
				for (let y = 0; y < this.fieldHeight; y++) {
					this.context!.fillStyle = (x + y) % 2 == 0 ? "#A2D149" : "#AAD751";
					this.context!.fillRect(x * this.squareSize + xOffset, y * this.squareSize + yOffset, this.squareSize, this.squareSize);
				}
			}
		}
	}

	private drawApples(apples: [number, number][], xOffset: number = 0, yOffset: number = 0): void {
		apples.forEach((apple: [number, number]): void => {
			if (this.context && this.squareSize) {
				this.context!.fillStyle = "red";
				this.context!.fillRect(apple[0] * this.squareSize + xOffset, apple[1] * this.squareSize + yOffset, this.squareSize, this.squareSize);
			}
		});
	}

	private drawSnake(snake: [number, number][], playerHeadPos: [number, number], xOffset: number = 0, yOffset: number = 0): void {
		snake.forEach((segment: [number, number]): void => {
			if (this.context && this.squareSize) {
				this.context.fillStyle = "darkgreen";

				if (snake.indexOf(segment) === 0) {
					this.context.fillStyle = "lightgreen";
					if (playerHeadPos && segment[0] === playerHeadPos[0] && segment[1] === playerHeadPos[1]) {
						this.context.fillStyle = "yellow";
					}
				}

				this.context.fillRect(segment[0] * this.squareSize + xOffset, segment[1] * this.squareSize + yOffset, this.squareSize, this.squareSize);
			}
		});
	}
}
