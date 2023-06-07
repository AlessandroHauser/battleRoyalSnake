import {Component, Inject} from '@angular/core';
import {ClientService} from "../../services/client.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { clientService: ClientService }) {}

  public start(): void {
    this.data.clientService.sendJoinSession();
  }
}
