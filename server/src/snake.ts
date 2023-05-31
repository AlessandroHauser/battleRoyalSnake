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

		this.alive = true;
		this.findPosition();
	}

	public get head(): [number, number] | null {
		return this._head;
	}

	private set head(value: [number, number] | null) {
		this._head = value;
	}

	public get tail(): [number, number][] | null {
		return this._tail;
	}

	private set tail(value: [number, number][] | null) {
		this._tail = value;
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

	private set direction(value: Direction | null) {
		this._direction = value;
	}

	public get alive(): boolean | null {
		return this._alive;
	}

	private set alive(value: boolean | null) {
		this._alive = value;
	}

	public spawnSnake(): void {

	}

	private findPosition(): void {
		if (this._session instanceof Session) {
			this.head = this._session.randomPositionining();
			let x = this.head[0] + 1;
			let y = this.head[1];
			this.tail = [[x, y], [x + 1, y]]
		}
		this.direction = Direction.LEFT;
	}

	public move(): void {
		if(this._head && this._tail) {
			for (let i = this._tail.length -1; i > 0; i--) {
				this._tail[i] = JSON.parse(JSON.stringify(this._tail[i-1]));
			}
			this._tail[0] = JSON.parse(JSON.stringify(this._head));

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
			this.directionChanged = false;
			this.checkCollision();
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

    public checkCollision(): void {
		if(this._head && this.session) {
			if (this._head[0] > this.session.FIELD_SIZE) {
				this._head[0] = 0;
			}
			if (this._head[1] > this.session.FIELD_SIZE) {
				this._head[1] = 0;
			}
			if (this._head[0] < 0) {
				this._head[0] = this.session.FIELD_SIZE;
			}
			if (this._head[1] < 0) {
				this._head[1] = this.session.FIELD_SIZE;
			}

			// check if snake should eat apple
			if (this._session && this._session.apples) {
				for (let i = 0; i < this._session.apples.length; i++) {
					let apple = this._session.apples[i];
					if (this._head == apple.position) {
						this._session.removeApple(apple);
						this._session.spawnApples();
						this.addTailSegment();
					}
				}
			}


			// check if snake collides with itself
			let collided = false;
			if (this._tail != null) {
				for (let i = 0; i < this._tail.length; i++) {
					if (this._head == this._tail[i]) {
						collided = true;
					}
				}
			}

			// implement collision with other snakes here

			if (collided) {
				this._alive = false;
			}
		}
    }
}