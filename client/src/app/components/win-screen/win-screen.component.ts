import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AppComponent} from "../../app.component";
import {ClientService} from "../../services/client.service";

@Component({
	selector: 'app-win-screen',
	templateUrl: './win-screen.component.html',
	styleUrls: ['./win-screen.component.scss']
})
export class WinScreenComponent implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { comp: AppComponent, clientService: ClientService }) {
	}

	restart() {
		this.data.clientService.sendJoinSession();
		let comp: AppComponent = this.data.comp;
		comp.deathDialog.closeAll()
		comp.resetGame();
	}

	ngOnInit(): void {
		this.data.clientService.connect("ws://localhost:42069")
	}

}
