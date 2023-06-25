import {Component, HostListener, OnInit} from '@angular/core';
import {ClientService} from './services/client.service';
import {Message} from "./interfaces/message";
import {GameState} from "./interfaces/game-state";
import {MatDialog} from "@angular/material/dialog";
import {StartComponent} from "./components/start/start.component";
import {Direction} from "./enums/direction";
import {SessionState} from "./enums/session-state";
import {DeathScreenComponent} from "./components/death-screen/death-screen.component";
import {WinScreenComponent} from "./components/win-screen/win-screen.component";
import {MessageNames} from "./enums/message-names";

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
	private deathDialogOpen = false;
	private winDialogOpen = false;

	constructor(
		public clientService: ClientService,
		public startDialog: MatDialog,
		public winDialog: MatDialog,
		public deathDialog: MatDialog
	) {
		this.title = "Snake Battleroyale!";
		this.id = null;
		this.session = null;
		this.gameState = null;
	}

	private openDialog(clazz: any) {
		this.startDialog.open(clazz, {
			disableClose: true,
			data: {
				comp: this,
				clientService: this.clientService,
			}
		});
	}

	openStartDialog() {
		this.openDialog(StartComponent)
	}

	openDeathDialog(): void {
		this.openDialog(DeathScreenComponent)
	}

	openWinDialog(): void {
		this.openDialog(WinScreenComponent)
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
		if (gameState.session.state == SessionState.ENDING && gameState.player.alive && !this.winDialogOpen) {
			this.winDialogOpen = true;
			this.openWinDialog()
		}
	}

	@HostListener('document:keydown', ['$event'])
	public sendInput(event: KeyboardEvent): void {
		if (this.id && this.session) {
			let direction: Direction | undefined;
			let action: string | undefined;

			switch (event.key) {
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
				case "r":
				case " ":
					action = "respawn";
					break;
				default:
					break;
			}

			if (direction) {
				event.preventDefault();
				this.clientService.sendUserInput(event.key, this.id, this.session, "direction", direction);
			} else {
				this.clientService.sendUserInput(event.key, this.id, this.session, "action", action);
			}
		}
	}

	resetGame() {
		this.gameState = null;
		this.deathDialogOpen = false;
		this.id = null;
		this.session = null;
		this.title = '';
	}
}
