import {Session} from "./Session";

export enum Direction {
	UP = "up",
	DOWN = "down",
	RIGHT = "right",
	LEFT = "left"
}

export class Snake {
	private readonly _id: string;
	private _head: [number, number] | null;
	private _tail: [number, number][] | null;
	private _direction: Direction | null;
	private directionChanged: boolean | null;
	private _session: Session | null;
	private _alive: boolean | null;

	constructor(id: string) {
		this._id = id;
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

	public get session(): Session | null {
		return this._session;
	}

	public set session(value: Session | null) {
		this._session = value;
	}

	public get head(): [number, number] | null {
		return this._head;
	}

	public get tail(): [number, number][] | null {
		return this._tail;
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

	public spawnSnake(): void {

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
		}
    }
}