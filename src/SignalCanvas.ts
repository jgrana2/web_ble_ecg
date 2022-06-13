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
  public y: number[] = [];
  public y_lpf: number[] = [];
  public last_data_previous: number = 0;
  public last_y_previous: number = 0;
  public shift_array: number[];

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
    this.shift_array = new Array(27).fill(0); // 28 samples per BLE packet = n taps

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

    // Implement DC blocker
    // https://www.dsprelated.com/freebooks/filters/DC_Blocker.html
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        this.y[i] = data[i] - this.last_data_previous + 0.995 * this.last_y_previous;
        this.last_data_previous = data[i],
          this.last_y_previous = this.y[i];
      } else {
        this.y[i] = data[i] - data[i - 1] + 0.995 * this.y[i - 1];
        data[i - 1] = data[i];
        this.y[i - 1] = this.y[i];
      }
    }
    // Store the last element of x and y
    this.last_data_previous = data[data.length - 1];
    this.last_y_previous = this.y[data.length - 1];

    // Low-pass filter coefficients
    let filter_taps: number[] = [
      0.000000000000000000,
      0.000128815969157781,
      0.000636894704170939,
      0.001036573640496947,
      -0.000239017661304998,
      -0.004980792488131791,
      -0.012728256285370630,
      -0.018038289643240831,
      -0.010575397577670504,
      0.019798614568518398,
      0.074766185135383148,
      0.142018993109152086,
      0.198145503173270704,
      0.220060346711137778,
      0.198145503173270704,
      0.142018993109152142,
      0.074766185135383162,
      0.019798614568518405,
      -0.010575397577670509,
      -0.018038289643240845,
      -0.012728256285370628,
      -0.004980792488131791,
      -0.000239017661304999,
      0.001036573640496949,
      0.000636894704170938,
      0.000128815969157781,
      0.000000000000000000,
    ];

    // Convolution
    for (let i = 0; i < this.y.length; i++) {
      let tmp: number = 0;

      // Shift to the right and remove last item to keep the size
      this.shift_array.unshift(this.y[i]);
      this.shift_array.pop();

      // Calculate FIR filter output (y_lpf)
      for (let j = 0; j < filter_taps.length; j++) { // Assuming n taps = n samples per packet
        tmp += filter_taps[j] * this.shift_array[j];
      }
      this.y_lpf[i] = tmp;
    }

    // Draw line
    for (i = 0; i < data.length; i++) {
      this.y_cursor = ((this.y_lpf[i] / 16777215) * this.height) * 400 + 50;
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
