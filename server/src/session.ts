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
		setInterval(_ => this.runGameLoop(), 200);
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
		snake.session = this;
		this.snakes.push(snake);
	}

	public removePlayer(snake: Snake): void {
		snake.session = null;
		this.snakes.splice(this.snakes.indexOf(snake), 1);
	}
  
  	public get apples(): Apple[] {
		return this._apples;
	}

	public spawnApples(): void {
		for (let i: number = this.calculateApples(); i >= 0; i--) {
			this._apples.push(new Apple(this.getRandomPosition()));
		}
	}

	public calculateApples(): number {
		return Math.floor(
			Math.random() *
			Math.round(this.snakes.length * 0.75) - this._apples.length + 1
		);
	}

	public removeApple(appleToRemove: Apple) {
		this._apples.splice(this._apples.indexOf(appleToRemove), 1);
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

	public getRandomPosition(): [number, number] {
		let x = Math.floor(Math.random() * 50);
		let y = Math.floor(Math.random() * 50);
		let pos:[number, number] = [x, y];
		let posFree = false;
		let finished = false;

		while (!finished) {

			if (!posFree) {
				for (let i: number = 0; i < this.snakes.length; i++) {
					let snake = this.snakes[i];
					let snakePos = snake.head;
					let snakeTail = snake.tail;
					if (snakePos == pos) {
						x = Math.floor(Math.random() * 50);
						y = Math.floor(Math.random() * 50);
						i = 0;
					} else {
						posFree = true
					}
					if (snakeTail != null) {
						for (let o: number = 0; i < snakeTail.length; i++) {
							let snakeSeg = snakeTail[i];
							if (snakeSeg == pos) {
								x = Math.floor(Math.random() * 50);
								y = Math.floor(Math.random() * 50);
								o = 0;
								posFree = false;
							} else {
								posFree = true
							}
						}
					}
				}
			} else {
				for (let i: number = 0; i < this.apples.length; i++) {
					let apple = this.apples[i];
					let applePos = apple.position;
					if (applePos == pos) {
						x = Math.floor(Math.random() * 50);
						y = Math.floor(Math.random() * 50);
						i = 0;
						posFree = false;
					} else {
						finished = true;
					}
				}
			}
		}
		return pos;
	}
}