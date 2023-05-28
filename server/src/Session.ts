import {animals, colors, uniqueNamesGenerator} from "unique-names-generator";
import {Snake} from "./Snake";

export enum SessionState {
	WAITING,
	STARTING,
	RUNNING,
	ENDING
}

export class Session {
	public readonly FIELD_SIZE: number = 50;
	public readonly MAX_PLAYERS: number = 8;

	private readonly _name: string;
	private _state: SessionState;
	private snakes: Snake[];

	constructor() {
		this._name = uniqueNamesGenerator({
			dictionaries: [colors, animals],
			separator: " ",
			style: "capital"
		});
		this._state = SessionState.WAITING;
		this.snakes = [];
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

	public addPlayer(snake: Snake): void {
		snake.session = this;
		this.snakes.push(snake);
	}

	public removePlayer(snake: Snake): void {
		snake.session = null;
		this.snakes.splice(this.snakes.indexOf(snake), 1);
	}

	private runGameLoop() {
		if (this.snakes != undefined) {
			for (let i = 0; i < this.snakes.length; i++) {
				this.snakes[i].move();
			}
		}
		setTimeout(() => this.runGameLoop(), 200);
	}
}