import {Session} from "./session";
import {Snake} from "./snake";
import {Message} from "./interfaces/message.interface";
import {Direction} from "./enums/direction.enum";
import {v4 as uuidV4} from "uuid";
import {RawData, WebSocket, WebSocketServer} from "ws";

export class Server {
	private static instance: Server;

	private serverSocket: WebSocketServer | null;
	private readonly sessions: Session[];
	private connections: Map<WebSocket, string>;

	constructor() {
		this.serverSocket = null;
		this.sessions = [];
		this.connections = new Map<WebSocket, string>();
	}

	public static get Instance() {
		return this.instance || (this.instance = new this());
	}

	/**
	 * Start the server on the given port.
	 *
	 * @param {number} port - Port for the server to listen on.
	 */
	public start(port: number): void {
		this.serverSocket = new WebSocketServer({port: port});
		this.serverSocket.on("connection", (socket: WebSocket): void => {
			socket.on("message", (data: RawData, isBinary: boolean): void => this.handleClientMessage(socket, data, isBinary));
			socket.on("close", (): void => this.handleClientDisconnect(socket));
		});

		console.log(`Server listening on port: ${port}`);
	}

	/**
	 * Handle the messages from the player.
	 *
	 * @private
	 * @param {WebSocket} socket - Socket connected to the player.
	 * @param {RawData} data - Data sent by the player.
	 * @param {boolean} isBinary - Flag if the data is binary.
	 */
	private handleClientMessage(socket: WebSocket, data: RawData, isBinary: boolean): void {
		if (!isBinary) {
			try {
				const message: Message = JSON.parse(data.toString());

				switch (message.name) {
					case "JoinSession":
						this.joinSession(socket);
						break;
					case "UserInput":
						this.receiveInput(message);
						break;
				}
			} catch (ignored) {}
		}
	}

	/**
	 * Handle the disconnection of a player removing them from the connections and the session.
	 *
	 * @private
	 * @param {WebSocket} socket - Socket connected to the player.
	 */
	private handleClientDisconnect(socket: WebSocket): void {
		const snakeId: string | undefined = this.connections.get(socket);

		if (snakeId) {
			this.getPlayerSession(snakeId)?.removeSnakeById(snakeId);
			this.connections.delete(socket);
		}
	}

	/**
	 * Handle the assignment of a new player to a session.
	 *
	 * @private
	 * @param {WebSocket} socket - Socket connected to the player.
	 */
	private joinSession(socket: WebSocket): void {
		let joinedSession: Session | null = null;
		for (let session of this.sessions) {
			if (session.isJoinable()) {
				joinedSession = session;
				break;
			}
		}


		if (joinedSession == null) {
			joinedSession = new Session();
			this.sessions.push(joinedSession);
		}

		let snake: Snake = new Snake(uuidV4(), socket);
		joinedSession.addSnake(snake);

		const message: Message = {
			name: "JoinedSession",
			clientId: snake.id,
			sessionName: joinedSession.name,
			status: 200,
			data: {
				session: {
					name: joinedSession.name,
					state: joinedSession.state,
					fieldWidth: joinedSession.FIELD_WIDTH,
					fieldHeight: joinedSession.FIELD_HEIGHT
				}
			}
		};
		socket.send(JSON.stringify(message));
		this.connections.set(socket, snake.id);
	}

	/**
	 * Handle the input of a player.
	 *
	 * @private
	 * @param {Message} message - Message containing the input of the player.
	 */
	private receiveInput(message: Message): void {
		if(message.data.type === "ChangeDirection") {
			let direction: Direction | undefined = undefined;

			switch (message.data.key) {
				case "w":
				case "ArrowUp":
					direction = Direction.UP;
					break;
				case "a":
				case "ArrowLeft":
					direction = Direction.LEFT;
					break;
				case "s":
				case "ArrowDown":
					direction = Direction.DOWN;
					break;
				case "d":
				case "ArrowRight":
					direction = Direction.RIGHT;
					break;
				default:
					break;
			}

			if (direction != undefined && message.sessionName && message.clientId) {
				this.getSessionWithName(message.sessionName)?.getSnake(message.clientId)?.changeDirection(direction);
			}
		}
	}

	/**
	 * Get a session by its generated name.
	 *
	 * @private
	 * @param {string} name - Name of the session.
	 * @return {Session | null} Session with the given name, null if not found.
	 */
	private getSessionWithName(name: string): Session | null {
		for (let session of this.sessions) {
			if (session.name === name) {
				return session;
			}
		}

		return null;
	}

	/**
	 * Get the session a player is in by its id.
	 *
	 * @private
	 * @param {string} playerId - ID of the player.
	 * @return {Session | null} Session of the player, null if not found.
	 */
	private getPlayerSession(playerId: string): Session | null {
		for (let session of this.sessions) {
			if (session.snakes.map((snake: Snake) => snake.id).includes(playerId)) {
				return session;
			}
		}

		return null;
	}

	/**
	 * Close the server.
	 */
	public close(): void {
		if (this.serverSocket) {
			this.serverSocket.close();
		}
	}
}
