import {Session} from "./session";

export class Apple {
    private _session: Session;
    private _position: [number, number];

    constructor(session: Session) {
        this._session = session;
        this._position = this.findPosition();
    }

    public get position(): [number, number] {
        return this._position;
    }

    private findPosition(): [number, number] {
        // TODO: Implement
        return [0, 0];
    }
}