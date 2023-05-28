import {Session} from "./Session";

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
	private directionChanged: boolean | null;
	private _session: Session | null;
	private alive: boolean | null;

	constructor(id: string) {
		this._id = id;
		this.head = null;
		this.tail = null;
		this.direction = null;
		this.directionChanged = null;
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

    public move(): void {
        for (let i = this.tail.length -1; i > 0; i--) {
            this.tail[i] = JSON.parse(JSON.stringify(this.tail[i-1]));
        }
        this.tail[0] = JSON.parse(JSON.stringify(this.head));

        switch(this.direction) {
            case Direction.UP:
                this.head[1] -= 1;
                break;
            case Direction.LEFT:
                this.head[0] -= 1;
                break;
            case Direction.DOWN:
                this.head[1] += 1;
                break;
            case Direction.RIGHT:
                this.head[0] += 1;
                break;
            default:
                break;
        }
        this.directionChanged = false;
        this.checkCollision();
    }

    public changeDirection(newDirection: Direction): void {
        if (!(this.direction == Direction.UP && newDirection == Direction.DOWN) &&
            !(this.direction == Direction.DOWN && newDirection == Direction.UP) &&
            !(this.direction == Direction.LEFT && newDirection == Direction.RIGHT) &&
            !(this.direction == Direction.RIGHT && newDirection == Direction.LEFT) && !this.directionChanged) {
            this.direction = newDirection;
            this.directionChanged = true;
        }

    }

    public spawnSnake(): void {

    }

    public checkCollision(): void {
        if (this.head[0] > this.session?.FIELD_SIZE) {
            this.head[0] = 0;
        }
        if (this.head[1] > this.session?.FIELD_SIZE) {
            this.head[1] = 0;
        }
        if (this.head[0] < 0) {
            this.head[0] = this.session?.FIELD_SIZE;
        }
        if (this.head[1] < 0) {
            this.head[1] = this.session?.FIELD_SIZE;
        }

    }

    public addTailSegment() {
        this.tail.push([-1, -1]);
    }

    public getId(): string {
        return this.id;
    }

    public getHead(): [number, number] {
        return this.head;
    }

    public getTail(): [number, number][] {
        return this.tail;
    }

    public getAlive(): boolean {
        return this.alive;
    }

    public getDirection(): Direction {
        return this.direction;
    }
}