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
  private data = new Int32Array(21); //21 Samples per packet

  constructor(
    container: Container,
    id: string,
    height: number,
    big: boolean,
    background_gradient_color: string,
    line_color: string,
    x_cursor: number,
    y_cursor: number,
    x_scale: number,
  ){
    this.id = id;
    this.height = height;
    this.big = big;
    this.background_gradient_color = background_gradient_color;
    this.line_color = line_color;
    this.x_cursor = x_cursor;
    this.y_cursor = y_cursor;
    this.x_scale = x_scale;

    //Create canvas element
    this.canvas = document.createElement("canvas");
    this.canvas.id = id;
    this.canvas.height = height;

    //Set colors
    this.canvas.setAttribute("style", `background-image:linear-gradient(180deg, ${background_gradient_color} 0%, rgba(0,0,0,0) 100%)`);
    this.canvas.style.borderRadius = "30px";
    console.log("Canvas", this.canvas.id, "created");
  }

  convert_to_24_bits(data: Int32Array) {}
  play(){}
  pause(){}
}
