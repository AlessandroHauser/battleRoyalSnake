import { Component, OnInit } from '@angular/core';

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
