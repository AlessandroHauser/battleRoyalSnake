import {Direction} from "./enums/direction.enum";
import {WebSocket} from "ws";

export class Snake {
	private readonly _id: string;
	private readonly _socket: WebSocket;
	private _head: [number, number] | null;
	private _tail: [number, number][] | null;
	private _direction: Direction | null;
	private directionChanged: boolean | null;
	private _alive: boolean | null;

	constructor(id: string, socket: WebSocket) {
		this._id = id;
		this._socket = socket;
		this._head = null;
		this._tail = null;
		this._direction = null;
		this.directionChanged = null;
		this._alive = false;
	}

	public get id(): string {
		return this._id;
	}

	public get socket(): WebSocket {
		return this._socket;
	}

	public get head(): [number, number] | null {
		return this._head;
	}

	public get tail(): [number, number][] | null {
		return this._tail;
	}

	public get segments(): [number, number][] {
		if (this.head) {
			if (this.tail) {
				return [this.head, ...this.tail];
			}
			return [this.head];
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

	public set alive(alive: boolean | null) {
		this._alive = alive;
	}

	/**
	 * Set the position for the snake and create the tail.
	 *
	 * @param {[number, number]} position - Position for the snake to spawn.
	 */
	public setPosition(position: [number, number]): void {
		this._head = position;
		let x: number = this._head[0] + 1;
		let y: number = this._head[1];
		this._tail = [[x, y], [x + 1, y]]
		this._direction = Direction.LEFT;
	}

	/**
	 * Move the snake.
	 *
	 * @param {number} fieldWidth - Width of the field, needed for the board wrapping
	 * @param {number} fieldHeight - Height of the field, needed for the board wrapping
	 */
	public move(fieldWidth: number, fieldHeight: number): void {
		if (this.alive) {
			if(this._head && this._tail) {
				for (let i = this._tail.length -1; i > 0; i--) {
					this._tail[i] = this._tail[i-1].slice() as [number, number];
				}
				this._tail[0] = this._head.slice() as [number, number];

				switch(this._direction) {
					case Direction.UP:
						this._head[1] -= 1;
						break;
					case Direction.LEFT:
						this._head[0] -= 1;
						break;
					case Direction.DOWN:
						this._head[1] += 1;
						break;
					case Direction.RIGHT:
						this._head[0] += 1;
						break;
					default:
						break;
				}


				if (this._head[0] < 0) {
					this._head[0] = fieldWidth - 1;
				} else if (this._head[1] < 0) {
					this._head[1] = fieldHeight - 1;
				} else if (this._head[1] >= fieldHeight) {
					this._head[1] = 0;
				} else if (this._head[0] >= fieldWidth) {
					this._head[0] = 0;
				}
				this.directionChanged = false;
			}
		} else {
			this._head = null;
			this._tail = null;
		}
    }

	/**
	 * Change direction of the snake.
	 *
	 * @param {Direction} newDirection - New direction to move to.
	 */
    public changeDirection(newDirection: Direction): void {
        if (!Direction.isOpposite(this._direction, newDirection) && !this.directionChanged) {
            this._direction = newDirection;
            this.directionChanged = true;
        }

    }

	/**
	 * Check collision with own tail by its position.
	 */
	public checkSelfCollision(): boolean {
		if (this.alive) {
			if (this.head && this.tail) {
				for (let segment of this.tail) {
					if (JSON.stringify(segment) == JSON.stringify(this.head)) {
						this.alive = false;
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Check collision with snakes by their positions.
	 *
	 * @param {[number, number][]} snake - Array of Arrays of x, y positions of the other snakes segments.
	 */
	public checkSnakeCollision(snake: [number, number][]): boolean {
		if (this.alive) {
			if (this.head) {
				for (let segment of snake) {
					if (JSON.stringify(segment) == JSON.stringify(this.head)) {
						this.alive = false;
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Check collision with apples by their position.
	 *
	 * @param {[number, number]} apples - Array of x, y positions of the apples.
	 */
	public checkAppleCollision(apples: [number, number][]): number {
		if (this.alive) {
			if (this.head) {
				for (let i: number = apples.length - 1; i >= 0; i--) {
					if (JSON.stringify(apples[i]) === JSON.stringify(this.head)) {
						this.addTailSegment();
						return i;
					}
				}
			}
		}
		return -1;
	}
}