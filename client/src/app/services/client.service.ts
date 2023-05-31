import {Injectable} from '@angular/core';
import {Message} from "../interfaces/message";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private socket: WebSocket | null;

  constructor() {
    this.socket = null;
  }

  public connect(address: string, callbackFunction: ((event: MessageEvent) => void)): void {
    this.socket = new WebSocket(address);
    this.socket.onmessage = callbackFunction;
  }

  public joinSession(): void {
    if (this.socket) {
      const message: Message = {
        name: "JoinSession"
      };

      this.socket.send(JSON.stringify(message));
    }
  }

  public userInput(input: string): void {
    if (this.socket) {
      const message: Message = {
        name: "UserInput",
        data: input
      }
      this.socket.send(JSON.stringify(message))
    }
  }
}
