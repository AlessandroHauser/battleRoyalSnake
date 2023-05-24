import {Session} from "./Session";

export class Apple {

    private _id: string;
    private session: Session;
    private currentApples: number;
    private maxApples: number;
    private appleRange: number[];
    private snakeCount: number;
    private newApples: number;

    public calculateApples(snakeCount, currentApples):number {
        this.currentApples = currentApples;
        this.snakeCount = snakeCount;
        this.maxApples = Math.round(snakeCount * 0.75);
        this.appleRange = Array.from(Array(this.maxApples - currentApples + 1).keys()).map(x => x + 1);;
        this.newApples = Math.floor(Math.random() * this.appleRange.length);
        currentApples = currentApples + this.newApples;
        this.currentApples = currentApples;

        return this.newApples;
    }
}