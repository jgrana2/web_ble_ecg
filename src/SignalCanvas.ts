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
    let i: number = 0;

    for (i = 0; i < data.length; i++) {
      this.y_cursor = data[i] / (65535) * this.height + this.height / 2;
      this.x_cursor += this.x_scale;
      if (this.x_cursor > this.canvas.width) {
        this.x_cursor = 0;
        context.moveTo(this.x_cursor, this.y_cursor);
      }
      context.lineTo(this.x_cursor, this.y_cursor);
      context.clearRect(this.x_cursor, 0, 20, this.height);
    }
    context.stroke();
    }

    attach_labels() {
      let context = this.canvas.getContext('2d');
      context.font = "16px Verdana";
      context.fillStyle = "white";
      context.fillText(this.id, 15, 20);
    }
  }
