import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Snake Battleroyale!';

  constructor(private router: Router) {
  }

  ngOnInit() {
    var canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var squareSize = 10;

    var squaresHorizontal = 100;
    var squaresVertical = 70;

    for (var x = 0; x < squaresHorizontal; x++) {
      for (var y = 0; y < squaresVertical; y++) {
        var squareX = x * squareSize;
        var squareY = y * squareSize;

        var isLightGreen = (x + y) % 2 === 0;

        ctx!.fillStyle = isLightGreen ? "#a2d149" : "#aad751";
        ctx!.fillRect(squareX, squareY, squareSize, squareSize);
      }
    }

  }
}
