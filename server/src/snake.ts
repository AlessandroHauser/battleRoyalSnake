import {Session} from "./session";



export enum Direction {
    UP = "up",
    DOWN = "down",
    RIGHT = "right",
    LEFT = "left"
}

export class Snake {

    private _id: string;
    private _head: [number, number] = [0,0];
    private _tail: [number, number][] = [];
    private session: Session;
    private _alive: boolean = true;
    private _direction: Direction = Direction.RIGHT
    private directionChanged: boolean = false;

    constructor(id: string, session: Session) {
        this._id = id;
        this.session = session;
    }

    public move(): void {
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
        this.directionChanged = false
        this.checkCollision();
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

    public spawnSnake(): void {

    }

    public checkCollision(): void {
        if (this._head[0] > this.session.WIDTHHEIGHT) {
            this._head[0] = 0;
        }
        if (this._head[1] > this.session.WIDTHHEIGHT) {
            this._head[1] = 0;
        }
        if (this._head[0] < 0) {
            this._head[0] = this.session.WIDTHHEIGHT;
        }
        if (this._head[1] < 0) {
            this._head[1] = this.session.WIDTHHEIGHT;
        }

    }

    get id(): string {
        return this._id;
    }

    get head(): [number, number] {
        return this._head;
    }

    get tail(): [number, number][] {
        return this._tail;
    }

    get alive(): boolean {
        return this._alive;
    }

    get direction(): Direction {
        return this._direction;
    }
}