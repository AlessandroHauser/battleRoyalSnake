import WebSocket, {WebSocketServer} from "ws";
import {Message} from "./message.interface";

export class Server {
    private static instance: Server;

    private serverSocket: WebSocketServer | null;
    private sessions: any[];

    constructor() {
        this.serverSocket = null;
        this.sessions = [];
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public start(port: number): void {
        this.serverSocket = new WebSocketServer({ port: port});
        this.serverSocket.on("connection", (socket: WebSocket) => {
            socket.on("message", this.handleClientMessage);
        });
    }

    private handleClientMessage(socket: WebSocket, data: WebSocket.RawData, isBinary: boolean): void {
        if(!isBinary) {
            const message: Message = JSON.parse(data.toString());

            switch (message.name) {
                case "JoinSession":
                    this.joinSession(socket);
                    break;
                case "UserInput":
                    console.log(`Client sent input: ${message.data}`)
                    break;
            }
        }
    }

    private joinSession(socket: WebSocket): void {

        const message: Message = {
            name: "JoinedSession",
            clientId: "",
            status: 200,
            data: ""
        };
        socket.send(JSON.stringify(message));
    }

    public close(): void {
        if(this.serverSocket) {
            this.serverSocket.close();
        }
    }
}