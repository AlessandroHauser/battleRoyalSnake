import WebSocket, {WebSocketServer} from "ws";

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

    private handleClientMessage(data: WebSocket.RawData, isBinary: boolean): void {
        if(!isBinary) {
            const message: string = data.toString();
        }
    }

    public close(): void {
        if(this.serverSocket) {
            this.serverSocket.close();
        }
    }
}