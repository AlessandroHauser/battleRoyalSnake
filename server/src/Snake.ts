import {Session} from "./session";

export enum Direction {
	UP = "up",
	DOWN = "down",
	RIGHT = "right",
	LEFT = "left"
}

export class Snake {
	private readonly _id: string;
	private head: [number, number] | null;
	private tail: [number, number][] | null;
	private direction: Direction | null;
	private _session: Session | null;
	private alive: boolean | null;

	constructor(id: string) {
		this._id = id;
		this.head = null;
		this.tail = null;
		this.direction = null;
		this.alive = null;
		this._session = null;
	}

	public get id(): string {
		return this._id;
	}

	public get session(): Session | null {
		return this._session;
	}

	public set session(value: Session | null) {
		this._session = value;
	}
}