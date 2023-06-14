import {Session} from "./session";
import {Direction} from "./enums/direction.enum";
import {WebSocket} from "ws";

export class Snake {
	private readonly _id: string;
	private readonly _socket: WebSocket;
	private _head: [number, number] | null;
	private _tail: [number, number][] | null;
	private _direction: Direction | null;
	private directionChanged: boolean | null;
	private _session: Session | null;
	private _alive: boolean | null;

	constructor(id: string, socket: WebSocket) {
		this._id = id;
		this._socket = socket;
		this._head = null;
		this._tail = null;
		this._direction = null;
		this.directionChanged = null;
		this._alive = null;
		this._session = null;
	}

	public get id(): string {
		return this._id;
	}

	public get socket(): WebSocket {
		return this._socket;
	}

	public get session(): Session | null {
		return this._session;
	}

	public set session(value: Session | null) {
		this._session = value;

		this._alive = true;
		this.findPosition();
	}

	public get head(): [number, number] | null {
		return this._head;
	}

	public get tail(): [number, number][] | null {
		return this._tail;
	}

	public get segments(): [number, number][] {
		if (this._alive) {
			if (this.head) {
				if (this.tail) {
					return [this.head, ...this.tail];
				}
				return [this.head];
			}
		}
		return [];
	}

	public addTailSegment() {
		if(this._tail) {
			this._tail.push([-1, -1]);
		}
	}

	public get direction(): Direction | null {
		return this._direction;
	}

	public get alive(): boolean | null {
		return this._alive;
	}

	private findPosition(): void {
		if (this._session instanceof Session) {
			this._head = this._session.getRandomPosition();
			let x = this._head[0] + 1;
			let y = this._head[1];
			this._tail = [[x, y], [x + 1, y]]
		}
		this._direction = Direction.LEFT;
	}

	public move(fieldWidth: number, fieldHeight: number): void {
		if(this._head && this._tail) {
			for (let i = this._tail.length -1; i > 0; i--) {
				this._tail[i] = this._tail[i-1].slice() as [number, number];
			}
			this._tail[0] = this._head.slice() as [number, number];

			switch(this._direction) {
				case Direction.UP:
					this._head[1] -= 1;
					if (this._head[0] < 0) {
						this._head[0] = fieldWidth - 1;
					}
					break;
				case Direction.LEFT:
					this._head[0] -= 1;
					if (this._head[1] < 0) {
						this._head[1] = fieldHeight - 1;
					}
					break;
				case Direction.DOWN:
					this._head[1] += 1;
					if (this._head[1] >= fieldHeight) {
						this._head[1] = 0;
					}
					break;
				case Direction.RIGHT:
					this._head[0] += 1;
					if (this._head[0] >= fieldWidth) {
						this._head[0] = 0;
					}
					break;
				default:
					break;
			}
			this.directionChanged = false;
		}
    }

    public changeDirection(newDirection: Direction): void {
        if (!(this._direction == Direction.UP && newDirection == Direction.DOWN) &&
            !(this._direction == Direction.DOWN && newDirection == Direction.UP) &&
            !(this._direction == Direction.LEFT && newDirection == Direction.RIGHT) &&
            !(this._direction == Direction.RIGHT && newDirection == Direction.LEFT) && !this.directionChanged) {
            this._direction = newDirection;
            this.directionChanged = true;
        }

    }

	public checkSelfCollision(): boolean {
		if (this.head && this.tail) {
			for (let segment of this.tail) {
				if (segment == this.head) {
					this._alive = false;
					return true;
				}
			}
		}
		return false;
	}

	public checkSnakeCollision(snake: [number, number][]): boolean {
		if (this.head) {
			for (let segment of snake) {
				if (segment == this.head) {
					this._alive = false;
					return true;
				}
			}
		}
		return false;
	}

	public checkAppleCollision(apples: [number, number][]): number {
		if (this.head) {
			for (let i: number = apples.length; i >= 0; i--) {
				if (apples[i] == this.head) {
					this.addTailSegment();
					return i;
				}
			}
		}
		return -1;
	}
}