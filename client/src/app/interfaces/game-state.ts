import { Direction } from "../enums/direction";
import { SessionState } from "../enums/session-state";

export interface GameState {
  session: {
    name: string,
    state: SessionState,
    fieldWidth: number,
    fieldHeight: number
    playerCount: number,
    countDown?: number
  }
  player: {
    alive: boolean,
    position: [number, number],
    direction: Direction
  },
  snakes: [number, number][][],
  apples: [number, number][]
}
