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

    }

    public changeDirection(): void {

    }

    public spawnSnake(): void {

    }

    public checkCollision(): void {

    }
}