import {Injectable} from '@angular/core';
import {Message} from "../interfaces/message";
import {Subject} from "rxjs";

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
  }

  private onMessage(event: MessageEvent): void {
    const message: Message = JSON.parse(event.data);
    this.messageSubject.next(message);
  }

  public sendJoinSession(): void {
    if (this.socket) {
      const message: Message = {
        name: "JoinSession"
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  public sendUserInput(input: string, id: string, session: string): void {
    if (this.socket) {
      const message: Message = {
        name: "UserInput",
        clientId: id,
        sessionName: session,
        status: 200,
        data: {
          type: "ChangeDirection",
          key: input
        }
      }
      this.socket.send(JSON.stringify(message))
    }
  }
}
