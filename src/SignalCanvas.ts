import { Container } from "./Container";

export class SignalCanvas {
  public id: string;
  public height: number;
  public width: number;
  public background_gradient_color: string;
  public line_color: string;
  public x_cursor: number;
  public y_cursor: number;
  public x_scale: number;
  private data = new Int32Array(21); //21 Samples per packet

  constructor(
    container: Container,
    id: string,
    height: number,
    width: number,
    background_gradient_color: string,
    line_color: string,
    x_cursor: number,
    y_cursor: number,
    x_scale: number
  ){
    this.id = id;
    this.height = height;
    this.width = width;
    this.background_gradient_color = background_gradient_color;
    this.line_color = line_color;
    this.x_cursor = x_cursor;
    this.y_cursor = y_cursor;
    this.x_scale = x_scale;
    
    let canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.height = height;

    //Set height and width
    if (height === -1) {
      //Default canvas height
      canvas.height = 100;
    } else {
      canvas.height = height;
    }
    if (width === -1) {
      //Default canvas width equal to half the screen width less half grid gap
      canvas.width = container.container.offsetWidth/2-parseInt(container.grid_gap, 10)/2; 
    } else {
      canvas.width = width;
    }
    
    //Set colors
    canvas.setAttribute("style", 
    `background-image:linear-gradient(180deg, ${background_gradient_color} 0%, rgba(0,0,0,0) 100%)`);
    canvas.style.borderRadius = "30px";

    //Append to container
    // container.add_canvas_to_container(canvas);
    container.canvases.push(canvas);
    container.container.append(canvas);
    
    console.log("Canvas", canvas.id, "created");
  }

  convert_to_24_bits(data: Int32Array) {}
  play(){}
  pause(){}
}
