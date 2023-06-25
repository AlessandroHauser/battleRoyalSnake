import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AppComponent} from "../../app.component";
import {ClientService} from "../../services/client.service";

@Component({
	selector: 'app-death-screen',
	templateUrl: './death-screen.component.html',
	styleUrls: ['./death-screen.component.scss']
})
export class DeathScreenComponent implements OnInit {

	constructor(@Inject(MAT_DIALOG_DATA) public data: { comp: AppComponent, clientService: ClientService }) {
	}

	backClick() {
		this.data.clientService.sendJoinSession();
		let comp: AppComponent = this.data.comp;
		comp.deathDialog.closeAll()
		comp.resetGame();
	}

	ngOnInit(): void {
		this.data.clientService.connect("ws://localhost:42069")
	}
}
