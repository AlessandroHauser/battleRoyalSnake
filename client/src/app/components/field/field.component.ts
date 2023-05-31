import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var squareSize = 20;

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

    var data = [
      { x: 2, y: 3 },
      { x: 5, y: 8 },
      { x: 10, y: 10}
    ];

    data.forEach(function(item) {
      var squareX = item.x * squareSize;
      var squareY = item.y * squareSize;

      ctx!.fillStyle = "red";
      ctx!.fillRect(squareX, squareY, squareSize, squareSize);
    });
  }

}
