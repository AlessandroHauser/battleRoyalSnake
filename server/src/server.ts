import {Session} from "./session";
import {Snake} from "./snake";
import {Message} from "./interfaces/message.interface";
import {v4 as uuidV4} from "uuid";
import {RawData, WebSocket, WebSocketServer} from "ws";
import {Direction} from "./enums/direction.enum";

export class Server {
	private static instance: Server;

	private serverSocket: WebSocketServer | null;
	private readonly sessions: Session[];

	constructor() {
		this.serverSocket = null;
		this.sessions = [];
	}

	public static get Instance() {
		return this.instance || (this.instance = new this());
	}

	public start(port: number): void {
		this.serverSocket = new WebSocketServer({port: port});
		this.serverSocket.on("listening", () => console.log("Listening"))
		this.serverSocket.on("connection", (socket: WebSocket): void => {
			socket.on("message", (data: RawData, isBinary: boolean): void => this.handleClientMessage(socket, data, isBinary));
			socket.on("close", (data: RawData, isBinary: boolean): void => console.log("someone disconnected"));
		});

		console.log(`Server listening on port: ${port}`);
	}

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
		joinedSession.addPlayer(snake);

		const message: Message = {
			name: "JoinedSession",
			clientId: snake.id,
			sessionName: joinedSession.name,
			status: 200,
			data: {
				session: {
					name: joinedSession.name,
					state: joinedSession.state
				}
			}
		};
		socket.send(JSON.stringify(message));
	}

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
				this.getSessionWithName(message.sessionName)?.getPlayer(message.clientId)?.changeDirection(direction);
			}
		}
	}

	private getSessionWithName(name: string): Session | null {
		for (let session of this.sessions) {
			if (session.name === name) {
				return session;
			}
		}

		return null;
	}

	public close(): void {
		if (this.serverSocket) {
			this.serverSocket.close();
		}
	}
}
