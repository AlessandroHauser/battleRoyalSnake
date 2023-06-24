import {Component, HostListener, OnInit} from '@angular/core';
import {ClientService} from './services/client.service';
import {Message} from "./interfaces/message";
import {GameState} from "./interfaces/game-state";
import {MatDialog} from "@angular/material/dialog";
import {StartComponent} from "./components/start/start.component";
import {DeathScreenComponent} from "./components/death-screen/death-screen.component";
import {Direction} from "./enums/direction";
import {MessageNames} from "./enums/message-names";
import {SessionState} from "./enums/session-state";

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
  private direction: Direction | undefined;
  private deathDialogOpen = false;

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
      disableClose: true,
      data: {
        comp: this,
        clientService: this.clientService,
      }
    });
  }

  ngOnInit() {
    this.clientService.connect("ws://localhost:42069");
    this.clientService.messageSubject.subscribe((message: Message) => this.handleMessage(message));
    this.openStartDialog()
  }

  private handleMessage(message: Message): void {
    switch (message.name) {
      case MessageNames.JOINED_SESSION:
        this.id = message.clientId!;
        this.session = message.sessionName!;
        break;
      case MessageNames.GAME_STATE:
        let gameState: GameState = message.data!;
        if (gameState) {
          this.gameStateHandler(gameState)
          this.gameState = gameState;
        }
        break;
      default:
        break;
    }
  }

  gameStateHandler(gameState: GameState) {
    if (!gameState.player.alive && !this.deathDialogOpen && gameState.session.state != SessionState.STARTING && gameState.session.state != SessionState.WAITING) {
      this.deathDialogOpen = true;
      this.openDeathDialog();
    }
    // if (gameState.snakes.length == 1 && gameState.session.state == SessionState.ENDING)
  }

  @HostListener('document:keydown', ['$event'])
  public sendInput(event: KeyboardEvent): void {
    if (this.id && this.session) {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          this.direction = Direction.UP;
          break;
        case "a":
        case "ArrowLeft":
          this.direction = Direction.LEFT;
          break;
        case "s":
        case "ArrowDown":
          this.direction = Direction.DOWN;
          break;
        case "d":
        case "ArrowRight":
          this.direction = Direction.RIGHT;
          break;
        default:
          break;
      }

      this.clientService.sendUserInput(this.direction!, event.key, this.id, this.session);
    }
  }

  resetGame() {
    this.gameState = null;
    this.direction = undefined;
    this.deathDialogOpen = false;
    this.id = null;
    this.session = null;
    this.title = '';

  }
}
