import {Component, HostListener} from '@angular/core';
import {OnInit} from '@angular/core';
import {ClientService} from './services/client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SNAKE BATTLEROYALE!';

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.clientService.connect("ws://localhost:42069", this.receiveMessage);
  }

  receiveMessage(event: MessageEvent): void {
      const message: string = event.data;
  }

  @HostListener('document:keypress', ['$event'])
  sendInput(event: KeyboardEvent) {
    this.clientService.userInput(event.key);
  }
}
