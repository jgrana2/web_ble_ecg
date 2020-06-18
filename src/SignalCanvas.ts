import { Container } from "./Container";

export class SignalCanvas {
  public id: string;
  public height: number;
  public big: boolean;
  public background_gradient_color: string;
  public line_color: string;
  public x_cursor: number;
  public y_cursor: number;
  public x_scale: number;
  public canvas: HTMLCanvasElement;
  public data: number[]; //21 Samples per packet

  constructor(
    container: Container,
    id: string,
    big: boolean,
    background_gradient_color: string,
    line_color: string,
    x_cursor: number,
    y_cursor: number,
    x_scale: number,
  ) {
    this.id = id;
    this.height = 100; //Default canvas height
    this.big = big;
    this.background_gradient_color = background_gradient_color;
    this.line_color = line_color;
    this.x_cursor = x_cursor;
    this.y_cursor = y_cursor;
    this.x_scale = x_scale;

    //Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.id = id;
    this.canvas.height = this.height;

    //Set colors
    this.canvas.setAttribute("style", `background-image:linear-gradient(180deg, ${background_gradient_color} 0%, rgba(0,0,0,0) 100%)`);
    this.canvas.style.borderRadius = "30px";
    console.log("Canvas", this.canvas.id, "created");
  }

  draw_line(data: number[]) {
    let context = this.canvas.getContext('2d');
    context.strokeStyle = this.line_color;
    context.beginPath();
    context.moveTo(this.x_cursor, this.y_cursor);

    let step = (element: number) => {
      this.y_cursor = element / (Math.pow(2, 24) - 1) * this.height + this.height / 2;
      this.x_cursor += this.x_scale;
      if (this.x_cursor > this.canvas.width) {
        this.x_cursor = 0;
        context.moveTo(this.x_cursor, this.y_cursor);
      }
      context.lineTo(this.x_cursor, this.y_cursor);
    }

    data.forEach(element => {
      step(element);
    });
    context.clearRect(this.x_cursor, 0, 20, this.height);
    context.stroke();
  }
}