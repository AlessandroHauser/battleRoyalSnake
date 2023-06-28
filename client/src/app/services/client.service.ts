import {Injectable} from '@angular/core';
import {Message} from "../interfaces/message";
import {Subject} from "rxjs";
import {Direction} from "../enums/direction";
import {MessageNames} from "../enums/message-names";

@Injectable({
	providedIn: 'root'
})
export class ClientService {
	public messageSubject: Subject<Message> = new Subject<Message>();
	private socket: WebSocket | null;

	constructor() {
		this.socket = null;
	}

	public connect(address: string): void {
		this.socket = new WebSocket(address);
		this.socket.onmessage = this.onMessage.bind(this);
		this.socket.onclose = this.reconnect.bind(this);
	}

	public reconnect(event: CloseEvent): void {
		this.connect((event.target as WebSocket).url);
	}

	private onMessage(event: MessageEvent): void {
		const message: Message = JSON.parse(event.data);
		this.messageSubject.next(message);
	}

	public sendJoinSession(): void {
		if (this.socket) {
			const message: Message = {
				name: MessageNames.JOIN_SESSION
			};
			this.socket.send(JSON.stringify(message));
		}
	}

	public sendUserInput(keyInput: string, id: string, session: string, inputType: "direction" | "action", action: Direction | string | undefined): void {
		if (this.socket) {
			const message: Message = {
				name: MessageNames.USER_INPUT,
				clientId: id,
				sessionName: session,
				status: 200,
				data: {
					type: inputType === "action" ? "PerformAction" : "ChangeDirection",
					direction: inputType === "direction" ? action : undefined,
					action: inputType === "action" ? action : undefined,
					key: keyInput
				}
			}
			this.socket.send(JSON.stringify(message))
		}
	}
}
