import {Session} from "./session";



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
    private direction: Direction = Direction.RIGHT

    constructor(id: string, session: Session) {
        this.id = id;
        this.session = session;
    }

    public move(): void {
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
        this.checkCollision();
    }

    public changeDirection(): void {

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
}