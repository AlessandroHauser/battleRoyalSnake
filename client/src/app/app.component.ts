import {Component, HostListener} from '@angular/core';
import {OnInit} from '@angular/core';
import {ClientService} from './services/client.service';
import {Message} from "./interfaces/message";
import {GameState} from "./interfaces/game-state";
import {MatDialog} from "@angular/material/dialog";
import {StartComponent} from "./components/start/start.component";
import {DeathScreenComponent} from "./components/death-screen/death-screen.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title: string;
  public id: string | null;
  public session: string | null;
  public gameState: GameState | null;

  constructor(public clientService: ClientService, public startDialog: MatDialog, public deathDialog: MatDialog) {
    this.title = "Snake Battleroyale!";
    this.id = null;
    this.session = null;
    this.gameState = null;
  }

  openStartDialog() {
    this.startDialog.open(StartComponent, {
      disableClose: true,
      data: {
        comp: this,
        clientService: this.clientService,
      }
    });
  }

  openDeathDialog(): void {
    this.deathDialog.open(DeathScreenComponent, {
      disableClose: true
    });
  }

  ngOnInit() {
    this.clientService.connect("ws://localhost:42069");
    this.clientService.messageSubject.subscribe((message: Message) => this.handleMessage(message));
    this.openStartDialog()
  }

  private handleMessage(message: Message): void {
    switch (message.name) {
      case "JoinedSession":
        this.id = message.clientId!;
        this.session = message.sessionName!;
        break;
      case "GameState":
        if(!message.data.player.alive)
          this.openDeathDialog();
        this.gameState = message.data;
        break;
      default:
        break;
    }
  }

  @HostListener('document:keydown', ['$event'])
  public sendInput(event: KeyboardEvent): void {
    if (this.id && this.session) {
      this.clientService.sendUserInput(event.key, this.id, this.session);
    }
  }
}
