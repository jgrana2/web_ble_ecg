import { SignalCanvas } from "./SignalCanvas";

export class Container {
  public background_color: string;
  public container: HTMLElement;
  public grid_gap: string;
  public canvases: SignalCanvas[];

  constructor(background_color: string, grid_gap: string) {
    this.background_color = background_color;
    this.grid_gap = grid_gap;
    this.canvases = [];
    document.body.style.backgroundColor = this.background_color;
    this.container = document.getElementById("grid_container");
    this.container.style.left = "0px";
    this.container.style.top = "0px";
    this.container.style.width = "100%";
    this.container.style.display = "grid";
    this.container.style.justifyContent = "center";
    this.container.style.alignContent = "center";
    this.container.style.gridTemplateColumns = "1fr 1fr";
    this.container.style.gridGap = grid_gap;
    this.on_resize();
  }

  //Update canvas size
  update_canvas_size(canvas: SignalCanvas) {
    if (canvas.big === true) {
      //Take all columns
      canvas.canvas.style.gridColumn = "1 / -1";
      canvas.canvas.width = this.container.clientWidth;
    } else {
      //Default canvas width equal to half the screen width less half grid gap
      canvas.canvas.width = this.container.clientWidth / 2 - parseInt(this.grid_gap) / 2;
    }
    //Default canvas height
    canvas.canvas.height = 100;
  }

  //Append canvas to container
  append_canvas(canvas: SignalCanvas) {
    this.canvases.push(canvas);
    this.update_canvas_size(canvas);
    this.container.append(canvas.canvas);
    console.log("Canvas", canvas.id, "appended to container")
  }

  //Adjust canvas size to fit screen when resizing
  on_resize() {
    window.onresize = () => {
      this.canvases.forEach(canvas => {
        this.update_canvas_size(canvas);
      });
    }
  }
}
