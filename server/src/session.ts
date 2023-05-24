import {Snake} from "./snake";

export class Session {

    private name: string;
    private snakes: Snake[] = [];
    // private apples: Apple[];


    constructor(name: string) {
        this.name = name;
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