import {Direction, Snake} from "./Snake";

export class Session {

    public WIDTHHEIGHT = 50;

    private name: string;
    private snakes: Snake[];
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

    public spawnApples(): void {

    }
}