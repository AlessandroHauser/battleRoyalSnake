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
  private currentApples: number;
  private maxApples: number;
  private appleRange: number[];
  private snakeCount: number;
  private newApples: number;

  // private apples: Apple[];

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
  
  public calculateApples(snakeCount, currentApples):number {
    this.currentApples = currentApples;
    this.snakeCount = snakeCount;
    this.maxApples = Math.round(snakeCount * 0.75);
    this.appleRange = Array.from(Array(this.maxApples - currentApples + 1).keys()).map(x => x + 1);
    this.newApples = Math.floor(Math.random() * this.appleRange.length);

    return this.newApples;
  }

  public spawnApples(): void {
    this.currentApples = this.currentApples + this.newApples;
  }
}