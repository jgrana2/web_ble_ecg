import * as io from 'socket.io-client';
import { Container } from './Container';

export class Socket {
  public client: any;
  public static sink_mode: boolean;

  constructor(sink_mode:boolean) {
    Socket.sink_mode = sink_mode;
    
    this.client = io.connect("http://144.202.5.9:9990");

    this.client.on("connect", () => {
      console.log("Connected to Socket server");
    });

    if (sink_mode) {
      // The "s" means sink, the data comes from the socket server
      this.client.on("sI", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "I"
        })
        canvas.draw_line(data);
      });

      this.client.on("sII", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "II"
        })
        canvas.draw_line(data);
      });

      this.client.on("sIII", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "III"
        })
        canvas.draw_line(data);
      });

      this.client.on("saVR", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "aVR"
        })
        canvas.draw_line(data);
      });

      this.client.on("saVL", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "aVL"
        })
        canvas.draw_line(data);
      });

      this.client.on("saVF", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "aVF"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV1", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V1"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV2", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V2"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV3", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V3"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV4", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V4"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV5", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V5"
        })
        canvas.draw_line(data);
      });

      this.client.on("sV6", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "V6"
        })
        canvas.draw_line(data);
      });

      this.client.on("sIILarge", (data: any) => {
        let canvas = Container.canvases.find(canvas => {
          return canvas.id === "II Large"
        })
        canvas.draw_line(data);
      });
    }
  }
}
