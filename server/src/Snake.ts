import {Session} from "./Session";



export enum Direction {
    UP = "up",
    DOWN = "down",
    RIGHT = "right",
    LEFT = "left"
}

export class Snake {

    private id: string;
    private head: [number, number] = [0,0];
    private tail: [number, number][] = [];
    private session: Session;
    private alive: boolean = true;
    private direction: Direction = Direction.RIGHT;
    private directionChanged: boolean = false;

    constructor(id: string, session: Session) {
        this.id = id;
        this.session = session;
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
        if (this.head[0] > this.session.WIDTHHEIGHT) {
            this.head[0] = 0;
        }
        if (this.head[1] > this.session.WIDTHHEIGHT) {
            this.head[1] = 0;
        }
        if (this.head[0] < 0) {
            this.head[0] = this.session.WIDTHHEIGHT;
        }
        if (this.head[1] < 0) {
            this.head[1] = this.session.WIDTHHEIGHT;
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