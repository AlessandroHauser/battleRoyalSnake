import {Component, Inject} from '@angular/core';
import {ClientService} from "../../services/client.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent {
  started = false;
  public showCountdown: number = 20;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { comp: AppComponent, clientService: ClientService }) {
  }

  public start(): void {
    let i = 20;
    let min = 0;
    let second: number;
    const self = this;
    (function repeat(){
      if (--i < min) {
        self.data.comp.startDialog.closeAll()
        self.data.clientService.sendJoinSession();
        return;
      }
      setTimeout(() => {
        second = i;
        self.showCountdown = second

        repeat();
      }, 1000);
    })();
  }
}
