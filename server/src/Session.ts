import {Direction, Snake} from "./Snake";

export class Session {

    public WIDTHHEIGHT = 50;

    private name: string;
    private snakes: Snake[];
    private currentApples: number;
    private maxApples: number;
    private appleRange: number[];
    private snakeCount: number;
    private newApples: number;

    // private apples: Apple[];


    constructor(name: string) {
        this.name = name;
        this.snakes = [];
        this.runGameLoop();
    }

    private runGameLoop() {
        if (this.snakes != undefined) {
            for (let i = 0; i < this.snakes.length; i++) {
                this.snakes[i].move();
            }
        }
        setTimeout(() => this.runGameLoop(), 200);
    }

    public removePlayer(snake: Snake): void {
        this.snakes.splice(this.snakes.indexOf(snake), 1);
    }

    public addPlayer(snake: Snake): void {
        this.snakes.push(snake);
    }

    public calculateApples(snakeCount, currentApples):number {
        this.currentApples = currentApples;
        this.snakeCount = snakeCount;
        this.maxApples = Math.round(snakeCount * 0.75);
        this.appleRange = Array.from(Array(this.maxApples - currentApples + 1).keys()).map(x => x + 1);
        this.newApples = Math.floor(Math.random() * this.appleRange.length);

        return this.newApples;
    }

    public spawnApples(): void {

        this.currentApples = this.currentApples + this.newApples;
    }
}