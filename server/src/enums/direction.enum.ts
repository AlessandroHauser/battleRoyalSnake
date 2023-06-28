export enum Direction {
	UP,
	DOWN,
	RIGHT,
	LEFT
}

export namespace Direction {
	export function isOpposite(thisDirection: Direction | null, thatDirection: Direction | null): boolean {
		return (thisDirection == Direction.UP && thatDirection == Direction.DOWN) ||
			(thisDirection == Direction.DOWN && thatDirection == Direction.UP) ||
			(thisDirection == Direction.LEFT && thatDirection == Direction.RIGHT) ||
			(thisDirection == Direction.RIGHT && thatDirection == Direction.LEFT);
	}
}