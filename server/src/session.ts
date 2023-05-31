import {Snake} from "./snake";
import {Apple} from "./apple";
import {Message} from "./interfaces/message.interface";
import {GameState} from "./interfaces/game-state.interface";
import {SessionState} from "./enums/session-state.enum";
import {animals, colors, uniqueNamesGenerator} from "unique-names-generator";

export class Session {
	public readonly FIELD_SIZE: number = 50;
	public readonly MAX_PLAYERS: number = 8;

	private readonly _name: string;
	private _state: SessionState;
	private snakes: Snake[];
	private apples: Apple[];

	constructor() {
		this._name = uniqueNamesGenerator({
			dictionaries: [colors, animals],
			separator: " ",
			style: "capital"
		});
		this._state = SessionState.WAITING;
		this.snakes = [];
		this.apples = [];

		// Start the session
		this.spawnApples();
		this.runGameLoop();
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

	private runGameLoop(): void {
		for (let i: number = 0; i < this.snakes.length; i++) {
			this.snakes[i].move();
		}

		this.broadcastGameState();
		setTimeout(() => this.runGameLoop(), 200);
	}

	private getGameState(): GameState {
		return {
			state: this.state,
			player: {},
			apples: this.apples.map((apple: Apple) => { return apple.position; }),
			snakes: this.snakes.map((snake: Snake): [number, number][] => { return snake.segments })
		} as GameState;
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

	public spawnApples(): void {
		let amount: number = this.calculateApples();

		for (let i: number = 0; i < amount; i++) {
			this.apples.push(new Apple(this));
		}
	}
  
	public calculateApples(): number {
		let max: number = Math.round(this.snakes.length * 0.75);
		let range: number[] = Array.from(Array(max - this.apples.length + 1).keys()).map(x => x + 1);

		return Math.floor(Math.random() * range.length + 1);
	}
}