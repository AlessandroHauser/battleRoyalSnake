import {SessionState} from "../enums/session-state.enum";
import {Direction} from "../enums/direction.enum";

export interface GameState {
	state: SessionState,
	player: {
		alive: boolean,
		position: [number, number],
		direction: Direction
	},
	snakes: [number, number][][],
	apples: [number, number][]
}