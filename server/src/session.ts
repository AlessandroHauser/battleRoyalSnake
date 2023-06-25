import {Snake} from "./snake";
import {Apple} from "./apple";
import {Message} from "./interfaces/message.interface";
import {GameState} from "./interfaces/game-state.interface";
import {SessionState} from "./enums/session-state.enum";
import {animals, colors, uniqueNamesGenerator} from "unique-names-generator";
import {clearInterval} from "timers";

export class Session {
	public readonly FIELD_WIDTH: number = 10;
	public readonly FIELD_HEIGHT: number = 10;
	public readonly MAX_PLAYERS: number = 8;

	public readonly COUNTDOWN_TIME: number = 20000;

	private readonly _name: string;
	private _state: SessionState;
	private readonly _snakes: Snake[];
	private readonly _apples: Apple[];

	private sessionInterval: NodeJS.Timer | undefined;
	private sessionCountdownStart: number | undefined;

	constructor() {
		this._name = uniqueNamesGenerator({
			dictionaries: [colors, animals],
			separator: " ",
			style: "capital"
		});
		this._state = SessionState.WAITING;
		this._snakes = [];
		this._apples = [];

		// Start the session
		this.spawnApples();
		this.sessionInterval = setInterval(() => this.runGameLoop(), 200);
	}

	public get name(): string {
		return this._name;
	}

	public get state(): SessionState {
		return this._state;
	}

	set state(value: SessionState) {
		this._state = value;
	}

	public get snakes(): Snake[] {
		return this._snakes;
	}

	public getSnake(id: string): Snake | null {
		for (let snake of this._snakes) {
			if (snake.id === id) {
				return snake;
			}
		}

		return null;
	}

	public addSnake(snake: Snake): void {
		this._snakes.push(snake);
		snake.setPosition(this.getSnakePosition());
		snake.alive = true;
	}

	public removeSnake(snake: Snake | null): void {
		if (snake) {
			snake.alive = false;
			this._snakes.splice(this._snakes.indexOf(snake), 1);
		}
	}

	public removeSnakeById(id: string): void {
		this.removeSnake(this.getSnake(id));
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
			Math.round(this._snakes.length * 0.75) - this._apples.length + 1
		) - 1;
	}

	public isJoinable(): boolean {
		return this._snakes.length < this.MAX_PLAYERS && (this._state == SessionState.WAITING || this.state == SessionState.STARTING);
	}

	/**
	 * Run the game loop.
	 * Update the positions of the snakes and check all collisions.
	 *
	 * @private
	 */
	private runGameLoop(): void {
		this.handleSessionState();

		this.snakes.forEach((snake: Snake) => snake.move(this.FIELD_WIDTH, this.FIELD_HEIGHT));
		this.snakes.forEach((snake: Snake) => this.checkCollision(snake));

		this.broadcastGameState();
	}

	/**
	 * Check the collisions for a given snake.
	 *
	 * @param snake - Snake to check collisions for.
	 * @private
	 */
	private checkCollision(snake: Snake): void {
		if (snake.alive) {
			snake.checkSelfCollision();
			this.snakes.forEach((_snake: Snake) => {
				if (snake != _snake) {
					snake.checkSnakeCollision(_snake.segments)
				}
			});
			let eatenApple: number = snake.checkAppleCollision(this.apples.map((apple: Apple) => apple.position));
			if (eatenApple != -1) {
				this.apples.splice(eatenApple, 1);
				this.spawnApples();
			}
		}
	}

	/**
	 * Inform all clients of the current GameState.
	 *
	 * @private
	 */
	private broadcastGameState(): void {
		const message: Message = {
			name: "GameState",
			sessionName: this.name,
			status: 200,
			data: this.getSessionGameState()
		};

		for (let snake of this._snakes) {
			message.clientId = snake.id;
			message.data.player = {
				alive: snake.alive,
				position: snake.head,
				direction: snake.direction
			};

			snake.socket.send(JSON.stringify(message));
		}
	}

	/**
	 * Create a GameState object representing the current state of the session to inform the clients.
	 *
	 * @private
	 * @return {GameState} Current GameState of the session.
	 */
	private getSessionGameState(): GameState {
		return {
			session: {
				name: this.name,
				state: this.state,
				fieldWidth: this.FIELD_WIDTH,
				fieldHeight: this.FIELD_HEIGHT,
				playerCount: this.snakes.length,
				countDown: this.sessionCountdownStart ? ((this.sessionCountdownStart + this.COUNTDOWN_TIME) - (new Date()).getTime()) : undefined
			},
			player: {},
			apples: this._apples.map((apple: Apple) => { return apple.position; }),
			snakes: this._snakes.map((snake: Snake): [number, number][] => { return snake.segments })
		} as GameState;
	}

	/**
	 * Determine a spawning position for an apple.
	 *
	 * @return {[number, number]} Starting position for the apple.
	 */
	public getApplePosition(): [number, number] {
		let position: [number, number] = [-1, -1];
		let occupied: boolean = false;

		do {
			position = [Math.floor(Math.random() * this.FIELD_WIDTH), Math.floor(Math.random() * this.FIELD_HEIGHT)];

			this.apples.forEach((apple: Apple) => {
				if (apple.position == position) {
					occupied = true;
					return;
				}
			});
			this._snakes.forEach((snake: Snake) => {
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

	/**
	 * Determine a spawning position for a snake.
	 *
	 * @return {[number, number]} Starting position for the snake.
	 */
	public getSnakePosition(): [number, number] {
		let position: [number, number] = [-1, -1];
		let occupied: boolean = false;

		do {
			position = [Math.floor(Math.random() * this.FIELD_WIDTH), Math.floor(Math.random() * this.FIELD_HEIGHT)];

			this.apples.forEach((apple: Apple) => {
				if (apple.position == position) {
					occupied = true;
					return;
				}
			});
			this._snakes.forEach((snake: Snake) => {
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

	/**
	 * Manage the state the session is in.
	 *  - Automatically start the game once four players joined.
	 *
	 * @private
	 */
	private handleSessionState(): void {
		// Handle the waiting state of the session
		if (this.state == SessionState.WAITING) {
			if (this.snakes.length >= 4 && this.sessionCountdownStart == undefined) {
				this.state = SessionState.STARTING;
				this.sessionCountdownStart = (new Date()).getTime();
			}
		}

		// Handle the starting state of the session
		if (this.state == SessionState.STARTING) {
			if (this.snakes.length >= 4) {
				if (this.sessionCountdownStart) {
					if((new Date).getTime() >= this.sessionCountdownStart + this.COUNTDOWN_TIME) {
						clearInterval(this.sessionInterval);

						this.spawnApples()
						for (let snake of this.snakes) {
							snake.setPosition(this.getSnakePosition());
							snake.alive = true;
						}
						this.broadcastGameState();


						this.sessionCountdownStart = undefined;
						this.state = SessionState.RUNNING;
						setTimeout(() => this.sessionInterval = setInterval(() => this.runGameLoop(), 200), 2000);
					}
				}
			} else {
				this.state = SessionState.WAITING;
				this.sessionCountdownStart = undefined;
			}
		}

		// Handle the running state of the session
		if (this.state == SessionState.RUNNING) {
			if (this.snakes.filter((snake: Snake) => snake.alive).length == 1) {
				clearInterval(this.sessionInterval);
				this.state = SessionState.ENDING;
			}
		}

		// Handle the ending state of the session
		if (this.state == SessionState.ENDING) {
			setTimeout((): void => {
				this.spawnApples()
				for (let snake of this.snakes) {
					snake.setPosition(this.getSnakePosition());
					snake.alive = true;
				}
				this.broadcastGameState();

				this.sessionInterval = setInterval(() => this.runGameLoop(), 200);
				this.state = SessionState.WAITING;
			}, 5000);
		}
	}
}
