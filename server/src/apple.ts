export class Apple {
	private readonly _position: [number, number];

	constructor(position: [number, number]) {
		this._position = position;
	}

	public get position(): [number, number] {
		return this._position;
	}
}