class Signal_canvas {
  public height: number;
  public width: number;
  public background_gradient_color: string;
  public line_color: string;
  public x_cursor: number;
  public y_cursor: number;
  public x_scale: number;
  private data = new Int32Array(21); //21 Samples per packet

  constructor(
    height: number,
    width: number,
    background_gradient_color: string,
    line_color: string,
    x_cursor: number,
    y_cursor: number,
    x_scale: number
  ){
    this.height = height;
    this.width = width;
    this.background_gradient_color = background_gradient_color;
    this.line_color = line_color;
    this.x_cursor = x_cursor;
    this.y_cursor = y_cursor;
    this.x_scale = x_scale;
  }

  convert_to_24_bits(data: Int32Array) {

  }

  resize_to_fit(){

  }

  play(){}
  pause(){}
}
