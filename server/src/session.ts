import {Snake} from "./snake";
import {Apple} from "./apple";
import {Message} from "./interfaces/message.interface";
import {GameState} from "./interfaces/game-state.interface";
import {SessionState} from "./enums/session-state.enum";
import {animals, colors, uniqueNamesGenerator} from "unique-names-generator";

export class Session {
	public readonly FIELD_WIDTH: number = 100;
	public readonly FIELD_HEIGHT: number = 70;
	public readonly MAX_PLAYERS: number = 8;

	private readonly _name: string;
	private _state: SessionState;
	private readonly snakes: Snake[];
	private readonly _apples: Apple[];

	constructor() {
		this._name = uniqueNamesGenerator({
			dictionaries: [colors, animals],
			separator: " ",
			style: "capital"
		});
		this._state = SessionState.WAITING;
		this.snakes = [];
		this._apples = [];

		// Start the session
		this.spawnApples();
		setInterval(() => this.runGameLoop(), 200);
	}

	public get name(): string {
		return this._name;
	}

	public isJoinable(): boolean {
		return this.snakes.length < this.MAX_PLAYERS && this._state == SessionState.WAITING;
	}

	public get state(): SessionState {
		return this._state;
	}

	public set state(value: SessionState) {
		this._state = value;
	}

	public getPlayer(id: string): Snake | null {
		for (let snake of this.snakes) {
			if (snake.id === id) {
				return snake;
			}
		}

		return null;
	}

	public addPlayer(snake: Snake): void {
		this.snakes.push(snake);
		snake.setPosition(this.getSnakePosition());
		snake.alive = true;
	}

	public removePlayer(snake: Snake): void {
		snake.alive = false;
		this.snakes.splice(this.snakes.indexOf(snake), 1);
	}
  
  	public get apples(): Apple[] {
		return this._apples;
	}

	public spawnApples(): void {
		for (let i: number = this.calculateApples(); i >= 0; i--) {
			this._apples.push(new Apple(this.getApplePosition()));
		}
	}

	public calculateApples(): number {
		return Math.floor(
			Math.random() *
			Math.round(this.snakes.length * 0.75) - this._apples.length + 1
		);
	}

	private runGameLoop(): void {
		this.snakes.forEach((snake: Snake) => snake.move(this.FIELD_WIDTH, this.FIELD_HEIGHT));
		this.snakes.forEach((snake: Snake) => this.checkCollision(snake));

		this.broadcastGameState();
	}

	private checkCollision(snake: Snake): void {
		snake.checkSelfCollision();
		this.snakes.forEach((_snake: Snake) => {
			if (snake != _snake) {
				snake.checkSnakeCollision(_snake.segments);
			}
		})
		let eatenApple: number = snake.checkAppleCollision(this.apples.map((apple: Apple) => apple.position));
		if (eatenApple != -1) {
			this.apples.splice(eatenApple);
			this.spawnApples();
		}
	}

	private broadcastGameState(): void {
		const message: Message = {
			name: "GameState",
			sessionName: this.name,
			status: 200,
			data: this.getGameState()
		};

		for (let snake of this.snakes) {
			message.clientId = snake.id;
			message.data.player = {
				alive: snake.alive,
				position: snake.head,
				direction: snake.direction
			};

			snake.socket.send(JSON.stringify(message));
		}
	}

	private getGameState(): GameState {
		return {
			state: this.state,
			player: {},
			apples: this._apples.map((apple: Apple) => { return apple.position; }),
			snakes: this.snakes.map((snake: Snake): [number, number][] => { return snake.segments })
		} as GameState;
	}

	public getApplePosition(): [number, number] {
		let position: [number, number] = [-1, -1];
		let occupied = false

		do {
			position = [Math.floor(Math.random() * this.FIELD_WIDTH), Math.floor(Math.random() * this.FIELD_HEIGHT)];

			this.apples.forEach((apple: Apple) => {
				if (apple.position == position) {
					occupied = true;
					return;
				}
			});
			this.snakes.forEach((snake: Snake) => {
				snake.segments.forEach((segment: [number, number]) => {
					if (segment == position) {
						occupied = true;
						return;
					}
				})
			});
		} while(occupied);

		return position;
	}

	public getSnakePosition(): [number, number] {
		let position: [number, number] = [-1, -1];
		let occupied = false

		do {
			position = [Math.floor(Math.random() * this.FIELD_WIDTH), Math.floor(Math.random() * this.FIELD_HEIGHT)];

			this.apples.forEach((apple: Apple) => {
				if (apple.position == position) {
					occupied = true;
					return;
				}
			});
			this.snakes.forEach((snake: Snake) => {
				snake.segments.forEach((segment: [number, number]) => {
					if (segment == position) {
						occupied = true;
						return;
					}
				})
			});
		} while(occupied);

		return position;
	}
}