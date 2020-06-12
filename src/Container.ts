import { SignalCanvas } from "./SignalCanvas";

export class Container{
  public background_color: string;
  public container: HTMLElement;
  public grid_gap: string;
  public canvases: Array<HTMLCanvasElement>;

  constructor(background_color: string, grid_gap: string){
    this.background_color = background_color;
    this.grid_gap = grid_gap;
    this.canvases = [];
    document.body.style.backgroundColor = this.background_color;
    this.container = document.getElementById("grid_container");
    this.container.style.position = "relative";
    this.container.style.top = "0px";
    this.container.style.left = "0px"
    this.container.style.display = "grid";
    this.container.style.justifyContent = "left";
    this.container.style.gridTemplateColumns = "1fr 1fr";
    this.container.style.gridGap = grid_gap;
    this.on_resize();
  }

  on_resize(){
    window.onresize = () =>{
      this.canvases.forEach(canvas => {
        canvas.width = this.container.offsetWidth/2-parseInt(this.grid_gap, 10)/2;
      });
    }
  }
}