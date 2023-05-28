import {WebSocket, RawData, WebSocketServer} from "ws";
import {v4 as uuidV4} from "uuid";
import {Message} from "./interfaces/message.interface";
import {Session} from "./session";
import {Snake} from "./snake";

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
		this.serverSocket.on("connection", (socket: WebSocket): void => {
			socket.on("message", (data: RawData, isBinary: boolean): void => this.handleClientMessage(socket, data, isBinary));
		});
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
						console.log(`Client sent input: ${message.data}`)
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

		let snake: Snake = new Snake(uuidV4());
		joinedSession.addPlayer(snake);

		const message: Message = {
			name: "JoinedSession",
			clientId: snake.id,
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

	public close(): void {
		if (this.serverSocket) {
			this.serverSocket.close();
		}
	}
}